from server import app, DBSession
from flask import Blueprint, request, session, send_file, make_response, jsonify
from utils import captcha, cmparePswd, invalid, invalidate
from flask_jwt_extended import jwt_required, jwt_optional, create_access_token, get_jwt_identity, get_raw_jwt
import io
from model import Storehouse, User, Product, SupplierOrder
import datetime

bp = Blueprint('supplierOrder',__name__)

# 经理端进货订单列表
# Tested by Pytest                                                           
@bp.route("/all", methods=['POST'])
@jwt_required
def allSupplierOrder():
    sess = DBSession()
    current_user = get_jwt_identity()
    
    if current_user:
        user = sess.query(User).filter_by(id=current_user).first()
        if user.isManager:
            supplierOrders = sess.query(SupplierOrder).filter_by(creator_id=current_user).all()
            all_supplierOrders = []
            for supplierOrder in supplierOrders:
                product = [supplierOrder.product_id, supplierOrder.count]
                storehouse = sess.query(Storehouse).filter_by(id=supplierOrder.storehouse_id).first()
                if supplierOrder.cancelled:
                    status="已取消"
                elif supplierOrder.rejected:
                    status="已拒收"
                elif supplierOrder.confirmed:
                    status="已收货"
                elif supplierOrder.delivered:
                    status="已发货"
                elif supplierOrder.accepted:
                    status="已被接单"
                else:
                    status="待处理"
                if supplierOrder.paid:
                    status=status+",已付款"
                else:
                    status=status+",未付款"       
                all_supplierOrders.append([supplierOrder.id, product, storehouse.name, storehouse.phoneNumber,
                storehouse.address, supplierOrder.createTime, status])
            all_supplierOrders.sort(key=lambda x:x[5],reverse=True)
            return jsonify(supplierOrders=all_supplierOrders), 200

        else:
            return jsonify({"msg": "No Permission"}), 403
    else:
        return jsonify({"msg": "Please login"}), 401

# 经理端创建新的进货订单
# Tested by Pytest
@bp.route("/create", methods=['POST'])
@jwt_required
def createSupplierOrder():
    sess = DBSession()
    current_user = get_jwt_identity()
    
    if not request.is_json:
        return jsonify({"msg": "Missing JSON in request"}), 400
    
    if current_user:
        user = sess.query(User).filter_by(id=current_user).first()
        if user.isManager:
            product_id = request.json.get('product_id')
            if not product_id:
                return jsonify({"msg": "Missing product_id parameter"}), 400

            count = request.json.get('count')
            if not count:
                return jsonify({"msg": "Missing count parameter"}), 400

            storehouse_id = request.json.get('storehouse_id')
            if not storehouse_id:
                return jsonify({"msg": "Missing storehouse_id parameter"}), 400

            product = sess.query(Product).filter_by(id=product_id).first()
            if not product:
                return jsonify({"msg": "Bad productId"}), 401
            
            supplierOrder = SupplierOrder(current_user)
            supplierOrder.fill(product_id,storehouse_id,count)
            sess.add(supplierOrder)
            sess.commit()
            return jsonify(supplierOrderId=supplierOrder.id), 200

        else:
            return jsonify({"msg": "No Permission"}), 403
    else:
        return jsonify({"msg": "Please login"}), 401

# 管理员端确认进货订单
@bp.route("/confirm", methods=['POST'])
@jwt_required
def confirmSupplierOrder():
    sess = DBSession()
    current_user = get_jwt_identity()
    
    if not request.is_json:
        return jsonify({"msg": "Missing JSON in request"}), 400

    if current_user:
        user = sess.query(User).filter_by(id=current_user).first()
        if user.isOperator:    
            supplierOrder_id = request.json.get('supplierOrder_id')
            if not supplierOrder_id:
                return jsonify({"msg": "Missing supplierOrder_id parameter"}), 400

            supplierOrder = sess.query(SupplierOrder).filter_by(id=supplierOrder_id,delivered=True,confirmed=False,rejected=False,cancelled=False).first()
            #下一行测试用，正常使用请注释掉
            supplierOrder = sess.query(SupplierOrder).filter_by(id=supplierOrder_id,confirmed=False).first()
            if not supplierOrder:
                return jsonify({"msg": "Bad supplierOrder_id"}), 401

            supplierOrder.confirmed = True
            sess.commit()
            return jsonify(isConfirmed=True), 200

        else:
            return jsonify({"msg": "No Permission"}), 403
    else:
        return jsonify({"msg": "Please login"}), 401

# 管理员端拒接进货订单
@bp.route("/reject", methods=['POST'])
@jwt_required
def rejectSupplierOrder():
    sess = DBSession()
    current_user = get_jwt_identity()

    if not request.is_json:
        return jsonify({"msg": "Missing JSON in request"}), 400
                
    if current_user:
        user = sess.query(User).filter_by(id=current_user).first()
        if user.isOperator:
            supplierOrder_id = request.json.get('supplierOrder_id')
            if not supplierOrder_id:
                return jsonify({"msg": "Missing supplierOrder_id parameter"}), 400

            reason = request.json.get('reason')
            if not reason:
                return jsonify({"msg": "Missing reason parameter"}), 400

            supplierOrder = sess.query(SupplierOrder).filter_by(id=supplierOrder_id,delivered=True,confirmed=False,rejected=False,cancelled=False).first()
            #下一行测试用，正常使用请注释掉
            supplierOrder = sess.query(SupplierOrder).filter_by(id=supplierOrder_id,rejected=False).first()
            if not supplierOrder:
                return jsonify({"msg": "Bad supplierOrder_id"}), 401

            supplierOrder.rejected = True
            supplierOrder.rejectReason = reason
            sess.commit()
            return jsonify(isRejected=True), 200

        else:
            return jsonify({"msg": "No Permission"}), 403
    else:
        return jsonify({"msg": "Please login"}), 401