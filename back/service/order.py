from server import app, DBSession
from flask import Blueprint, request, session, send_file, make_response, jsonify
from utils import captcha, cmparePswd, invalid, invalidate
from flask_jwt_extended import jwt_required, jwt_optional, create_access_token, get_jwt_identity, get_raw_jwt
import io
from model import *
import datetime

bp = Blueprint('order',__name__)

@bp.route("/all", methods=['GET'])
@jwt_required
def allOrder():
    sess = DBSession()
    current_user = get_jwt_identity()
    if current_user:
        user = sess.query(User).filter_by(id=current_user).first()
        if user.isOperator:
            storehouse = sess.query(Storehouse).filter_by(operator_id=current_user).first()
            virtual_orders = sess.query(Order).filter_by(virtual=True).all()
        else:
            virtual_orders = sess.query(Order).filter_by(creator_id=current_user,virtual=True).all()
        orders=[]
        for virorder in virtual_orders:
            if virorder.virtual:
                if user.isOperator:
                    _orders = sess.query(Order).filter_by(belonging_id=virorder.id,virtual=False).all()
                else:
                    _orders = sess.query(Order).filter_by(belonging_id=virorder.id,virtual=False).all()
                suborders = []
                for order in _orders:
                    suborders.append({
                        'id': order.product_id,
                        'count': order.count,
                        'cost': str(order.product_id * order.count),
                    })
                # addr=sess.query(Address).filter_by(id=virorder.address_id).first()
                # orders.append((virorder.id, virorder.createTime, suborders, addr.receiver, addr.phonenumber, addr.address, status))

                #addr = sess.query(Address).filter_by(owner_id=virorder.creator_id).first()
                
                orders.append({
                    'orderid': virorder.id,
                    'create_time': virorder.createTime,
                    'products': suborders,
                    'status': virorder.status(),
                    'receiver': virorder.receiver,
                    'phonenumber': virorder.phonenumber,
                    'address': virorder.address,
                    'total_cost': str(virorder.cost()),
                })
        orders.sort(key=lambda x:x['create_time'],reverse=True)
        return jsonify(orders), 200
    
    else:
        return jsonify({"msg": "Please login"}), 401


@bp.route("/cancel", methods=['POST'])
@jwt_required
def cancelOrder():
    sess = DBSession()
    current_user = get_jwt_identity()

    if not request.is_json:
        return jsonify(result=False,msg="Missing JSON in request"), 400

    order_id = request.json.get('orderid')
    if not order_id:
        return jsonify(result=False,msg="Missing orderid parameter"), 400

    user = sess.query(User).filter_by(id=current_user).first()
    order = sess.query(Order).filter_by(id=order_id,cancelled=False,virtual=True).first()
    if not order:
        return jsonify(result=False,msg="Bad orderid"), 401
    order.cancelled = True
    sess.commit()
    return jsonify(result=True), 200

@bp.route("/pay", methods=['POST'])
@jwt_required
def payOrder():
    sess = DBSession()
    current_user = get_jwt_identity()

    if not request.is_json:
        return jsonify({"msg": "Missing JSON in request"}), 400

    order_id = request.json.get('orderid')
    if not order_id:
        return jsonify({"msg": "Missing orderid parameter"}), 400

    user = sess.query(User).filter_by(id=current_user).first()
    order = sess.query(Order).filter_by(id=order_id,paid=False,virtual=True).first()
    if not order:
        return jsonify(result=False,msg="Bad order_id"), 401
    order.paid = True
    sess.commit()
    return jsonify(result=True), 200

@bp.route("/accept", methods=['POST'])
@jwt_required
def acceptOrder():
    sess = DBSession()
    current_user = get_jwt_identity()

    if not request.is_json:
        return jsonify({"msg": "Missing JSON in request"}), 400

    order_id = request.json.get('orderid')
    if not order_id:
        return jsonify({"msg": "Missing orderid parameter"}), 400

    user = sess.query(User).filter_by(id=current_user).first()
    order = sess.query(Order).filter_by(id=order_id,accepted=False,virtual=True).first()
    if not order:
        return jsonify(result=False,msg="Bad orderid"), 401
    order.accepted = True
    sess.commit()
    return jsonify(result=True), 200


@bp.route("/deliver", methods=['POST'])
@jwt_required
def deliverOrder():
    sess = DBSession()
    current_user = get_jwt_identity()

    if not request.is_json:
        return jsonify({"msg": "Missing JSON in request"}), 400

    user = sess.query(User).filter_by(id=current_user).first()
    order_id = request.json.get('orderid')
    if not order_id:
        return jsonify({"msg": "Missing orderid parameter"}), 400

    order = sess.query(Order).filter_by(id=order_id,delivered=False,virtual=True).first()
    if not order:
        return jsonify({"msg": "Bad orderid"}), 401
            
    order.delivered = True
    sess.commit()
    return jsonify(result=True), 200

@bp.route("/create", methods=['POST'])
@jwt_required
def createOrder():
    sess = DBSession()
    current_user = get_jwt_identity()
    
    if not request.is_json:
        return jsonify({"msg": "Missing JSON in request"}), 400

    user = sess.query(User).filter_by(id=current_user).first()
    ids = request.json.get('ids')

    if not ids:
        return jsonify({"msg": "Missing ids parameter"}), 400


    receiver = request.json.get('receiver', '')
    phonenumber = request.json.get('phonenumber', '')
    address = request.json.get('address', '')

    carts = sess.query(Cart).filter_by(creator_id=current_user,removed=False).all()

    vir = Order(current_user)
    vir.setAddress(address, receiver, phonenumber)
    sess.add(vir)
    sess.commit()

    #rders = []
    created = []
    for cart in carts:
        if cart.product_id in ids:
            product = sess.query(Product).filter_by(id=cart.product_id,shelved=True).first()
        # 限购暂未实现
        #print(product.remain, cart.count)
        #if (not product) or (product.remain < cart.count):
        #    orders.append([False,cart.id])
        #    continue
        #product.remain = product.remain - cart.count
            order = Order(current_user,False)
            order.fill(cart.product_id,cart.count,product.price,vir.id)
            sess.add(order)
            cart.removed = True
            sess.commit()
            created.append(cart.product_id)
        #orders.append([True,cart.id,cart.product_id,cart.count,product.price])
    #return jsonify(orders=orders,price=vir.cost()), 200
    return jsonify(result=True,created=created), 200

'''
@bp.route("/pay", methods=['POST'])
@jwt_required
def payOrder():
    sess = DBSession()
    current_user = get_jwt_identity()

    if not request.is_json:
        return jsonify({"msg": "Missing JSON in request"}), 400

    if current_user:
        user = sess.query(User).filter_by(id=current_user).first()
        
        order_id = request.json.get('order_id')
        if not order_id:
            return jsonify({"msg": "Missing order_id parameter"}), 400

        order = sess.query(Order).filter_by(id=order_id,paid=False,accepted=False,delivered=False,virtual=True).first()
        if not order:
            return jsonify({"msg": "Bad order_id"}), 401

        if user.isOperator:
            order.paid = True
            sess.commit()
            return jsonify(result=True), 200

        else:
            if order.creator_id == current_user:
                order.paid = True
                sess.commit()
                return jsonify(result=True), 200
            return jsonify({"msg": "No Permission"}), 403
    else:
        return jsonify({"msg": "Please login"}), 401


@bp.route("/cancel", methods=['POST']) #
@jwt_required
def cancelOrder():
    sess = DBSession()
    current_user = get_jwt_identity()

    if not request.is_json:
        return jsonify({"msg": "Missing JSON in request"}), 400

    if current_user:
        user = sess.query(User).filter_by(id=current_user).first()
        
        order_id = request.json.get('order_id')
        if not order_id:
            return jsonify({"msg": "Missing order_id parameter"}), 400

        order = sess.query(Order).filter_by(id=order_id,accepted=True,delivered=False,virtual=True).first()
        if not order:
            return jsonify({"msg": "Bad order_id"}), 401
            
        if user.isOperator:
            order.cancelled = True
            sess.commit()
            return jsonify(result=True), 200
        else:
            if order.creator_id == current_user:
                order.cancelled = True
                sess.commit()
                return jsonify(result=True), 200
            return jsonify({"msg": "No Permission"}), 403
    else:
        return jsonify({"msg": "Please login"}), 401
'''