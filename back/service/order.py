from server import app, DBSession
from flask import Blueprint, request, session, send_file, make_response, jsonify
from utils import captcha, cmparePswd, invalid, invalidate
from flask_jwt_extended import jwt_required, jwt_optional, create_access_token, get_jwt_identity, get_raw_jwt
import io
from model import Storehouse, User, Order, Address
import datetime

bp = Blueprint('order',__name__)

# 查看所有订单
# Tested by Postman
@bp.route("/all", methods=['POST'])
@jwt_required
def allOrder():
    sess = DBSession()
    current_user = get_jwt_identity()

    if not request.is_json:
        return jsonify({"msg": "Missing JSON in request"}), 400

    if current_user:
        user = sess.query(User).filter_by(id=current_user).first()
        if user.isOperator:
            storehouse_id = request.json.get('storehouse_id')
            if not storehouse_id:
                return jsonify({"msg": "Missing storehouse_id parameter"}), 400

            storehouse = sess.query(Storehouse).filter_by(id=storehouse_id).first()
            if not storehouse:
                return jsonify({"msg": "Bad storehouse_id"}), 401

            if storehouse.operator_id != current_user:
                return jsonify({"msg": "No Permission"}), 403
            
            virtual_orders = sess.query(Order).filter_by(storehouse_id=storehouse_id,virtual=True).all()
        else:    
            virtual_orders = sess.query(Order).filter_by(creator_id=current_user,virtual=True).all()
        orders=[]
        for virorder in virtual_orders:
            if virorder.virtual:
                if user.isOperator:
                    _orders = sess.query(Order).filter_by(storehouse_id=storehouse_id,belonging_id=virorder.id,virtual=False).all()
                else:
                    _orders = sess.query(Order).filter_by(creator_id=current_user,belonging_id=virorder.id,virtual=False).all()
                suborders = []
                for order in _orders:
                    suborders.append([order.product_id, order.count])
                if virorder.cancelled:
                    status="已取消"
                elif virorder.archived:
                    status="已收货"
                elif virorder.delivered:
                    status="已发货"
                elif virorder.accepted:
                    status="已接单"
                elif virorder.paid:
                    status="已支付"
                else:
                    status="未支付"
                #Address测试数据尚未创建
                # addr=sess.query(Address).filter_by(id=virorder.address_id).first()
                # orders.append((virorder.id, virorder.createTime, suborders, addr.receiver, addr.phonenumber, addr.address, status))
                orders.append((virorder.id, virorder.createTime, suborders, status))
                orders.sort(key=lambda x:x[1],reverse=True)
        return jsonify(orders), 200
    
    else:
        return jsonify({"msg": "Please login"}), 401

# 管理员接受订单
# Tested by Postman
@bp.route("/accept", methods=['POST'])
@jwt_required
def acceptOrder():
    sess = DBSession()
    current_user = get_jwt_identity()

    if not request.is_json:
        return jsonify({"msg": "Missing JSON in request"}), 400

    if current_user:
        user = sess.query(User).filter_by(id=current_user).first()
        if user.isOperator:
            order_id = request.json.get('order_id')
            if not order_id:
                return jsonify({"msg": "Missing order_id parameter"}), 400

            order = sess.query(Order).filter_by(id=order_id,paid=True,accepted=False,virtual=True).first()
            if not order:
                return jsonify({"msg": "Bad order_id"}), 401
            
            order.accepted = True
            sess.commit()
            return jsonify(isAccepted=True), 200

        else:
            return jsonify({"msg": "No Permission"}), 403
    else:
        return jsonify({"msg": "Please login"}), 401

# 管理员为订单配货
@bp.route("/deliver", methods=['POST'])
@jwt_required
def deliverOrder():
    sess = DBSession()
    current_user = get_jwt_identity()

    if not request.is_json:
        return jsonify({"msg": "Missing JSON in request"}), 400

    if current_user:
        user = sess.query(User).filter_by(id=current_user).first()
        if user.isOperator:
            order_id = request.json.get('order_id')
            if not order_id:
                return jsonify({"msg": "Missing order_id parameter"}), 400

            order = sess.query(Order).filter_by(id=order_id,accepted=True,delivered=False,virtual=True).first()
            if not order:
                return jsonify({"msg": "Bad order_id"}), 401
            
            order.delivered = True
            sess.commit()
            return jsonify(isDelivered=True), 200

        else:
            return jsonify({"msg": "No Permission"}), 403
    else:
        return jsonify({"msg": "Please login"}), 401