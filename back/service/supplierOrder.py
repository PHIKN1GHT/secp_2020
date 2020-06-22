from server import app, DBSession
from flask import Blueprint, request, session, send_file, make_response, jsonify
from utils import captcha, cmparePswd, invalid, invalidate
from flask_jwt_extended import jwt_required, jwt_optional, create_access_token, get_jwt_identity, get_raw_jwt
import io
from model import Storehouse, User, Product, SupplierOrder
import datetime

bp = Blueprint('supplierOrder',__name__)
                                                 
@bp.route("/all", methods=['GET'])
@jwt_required
def allSupplierOrder():
    sess = DBSession()
    current_user = get_jwt_identity()

    user = sess.query(User).filter_by(id=current_user).first()
    if user.isManager or user.isOperator:
        #supplierOrders = sess.query(SupplierOrder).filter_by(creator_id=current_user).all()
        _supplierOrders = sess.query(SupplierOrder).all()
        supplierOrders = []
        for sorder in _supplierOrders:
            supplierOrders.append({
                'sorderid': sorder.id,
                'create_time': sorder.createTime,
                'product_id': sorder.product_id,
                'count': sorder.count,
                'storehouse_id': sorder.storehouse_id,
                'status': sorder.status(),
            })
        supplierOrders.sort(key=lambda x:x['create_time'],reverse=True)
        return jsonify(supplierOrders), 200
    else:
        return jsonify({"msg": "No Permission"}), 403

@bp.route("/confirm", methods=['POST'])
@jwt_required
def confirmSupplierOrder():
    sess = DBSession()
    current_user = get_jwt_identity()
    
    if not request.is_json:
        return jsonify(result=False,msg="Missing JSON in request"), 400

    user = sess.query(User).filter_by(id=current_user).first()
    if user.isOperator:    
        supplierOrder_id = request.json.get('sorderid')
        if not supplierOrder_id:
            return jsonify(result=False,msg="Missing sorderid parameter"), 400

        supplierOrder = sess.query(SupplierOrder).filter_by(id=supplierOrder_id,confirmed=False,rejected=False).first()
        if not supplierOrder:
            return jsonify(result=False,msg="Bad sorderid"), 401

        supplierOrder.confirmed = True
        sess.commit()
        return jsonify(result=True), 200

    else:
        return jsonify(result=False,msg="No Permission"), 403

@bp.route("/reject", methods=['POST'])
@jwt_required
def rejectSupplierOrder():
    sess = DBSession()
    current_user = get_jwt_identity()

    if not request.is_json:
        return jsonify(result=False,msg="Missing JSON in request"), 400
                
    user = sess.query(User).filter_by(id=current_user).first()
    if user.isOperator:
        supplierOrder_id = request.json.get('sorderid')
        if not supplierOrder_id:
            return jsonify(result=False,msg="Missing sorderid parameter"), 400

        reason = request.json.get('reason')
        if not reason:
            return jsonify(result=False,msg="Missing reason parameter"), 400

        supplierOrder = sess.query(SupplierOrder).filter_by(id=supplierOrder_id,confirmed=False,rejected=False).first()
        if not supplierOrder:
            return jsonify(result=False,msg="Bad sorderid"), 401

        supplierOrder.rejected = True
        supplierOrder.rejectReason = reason
        sess.commit()
        return jsonify(result=True), 200

    else:
        return jsonify(result=False,msg="No Permission"), 403

@bp.route("/create", methods=['POST'])
@jwt_required
def createSupplierOrder():
    sess = DBSession()
    current_user = get_jwt_identity()
    
    if not request.is_json:
        return jsonify(result=False,msg="Missing JSON in request"), 400
    
    if current_user:
        user = sess.query(User).filter_by(id=current_user).first()
        if user.isManager or user.isOperator:
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
            return jsonify(sorderid=supplierOrder.id), 200

        else:
            return jsonify({"msg": "No Permission"}), 403
    else:
        return jsonify({"msg": "Please login"}), 401