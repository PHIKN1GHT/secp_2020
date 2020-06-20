from server import app, DBSession
from flask import Blueprint, request, session, send_file, make_response, jsonify
from utils import captcha, cmparePswd, invalid, invalidate
from flask_jwt_extended import jwt_required, jwt_optional, create_access_token, get_jwt_identity, get_raw_jwt
import io
from model import Storehouse, User, Product, Order, Address
import datetime

bp = Blueprint('order',__name__)

# 管理员端查看所有订单
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
                return jsonify({"msg": "Bad storehouseId"}), 401

            if storehouse.operator_id != current_user:
                return jsonify({"msg": "No Permission"}), 403
            
            virtual_orders = sess.query(Order).filter_by(storehouse_id=storehouse_id,virtual=True).all()
            
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
                elif virorder.processed:
                    status="已发货"
                elif virorder.paid:
                    status="已支付"
                else:
                    status="未支付"
                addr=sess.query(Address).filter_by(id=virorder.address_id).first()
                orders.append((virorder.id, suborders, addr.receiver, addr.phonenumber, addr.address, status))
        return jsonify(orders), 200
    
    else:
        return jsonify({"msg": "Please login"}), 401

