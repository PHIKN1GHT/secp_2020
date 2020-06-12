from server import db, app
from flask import Blueprint, request, session, send_file, make_response, jsonify
from utils import captcha, cmparePswd, invalid, invalidate
from flask_jwt_extended import jwt_required, jwt_optional, create_access_token, get_jwt_identity, get_raw_jwt
import io
from model import User, Cart, Product, Order, Description, Payment
import datetime

bp = Blueprint('consumption',__name__)

@bp.route("/showCart", methods=['POST'])
@jwt_required
def showCart():
    current_user = get_jwt_identity()
    carts = Cart.query.filter_by(creator_id=current_user,removed=False).all()
    carts_json = [(cart.id, cart.product_id, cart.count) for cart in carts]
    print(len(carts))
    return jsonify(cart=carts_json), 200

@bp.route("/addToCart", methods=['POST'])
@jwt_required
def addToCart():
    current_user = get_jwt_identity()
    if not request.is_json:
        return jsonify({"msg": "Missing JSON in request"}), 400
    
    product_id = request.json.get('product_id')
    if not product_id:
        return jsonify({"msg": "Missing product_id parameter"}), 400

    count = request.json.get('count')
    if not count:
        return jsonify({"msg": "Missing count parameter"}), 400

    product = Product.query.filter_by(id=product_id).first()
    if not product:
        return jsonify({"msg": "Bad productId"}), 401
    
    user = User.query.filter_by(id=current_user).first()

    db.session.add(Cart(current_user, product_id, count))
    db.session.commit()
    return jsonify(msg="Add "+str(product_id)+" to "+str(user.name)+"'s cart successfully"), 200

@bp.route("/removeFromCart", methods=['POST'])
@jwt_required
def removeFromCart():
    current_user = get_jwt_identity()
    if not request.is_json:
        return jsonify({"msg": "Missing JSON in request"}), 400
    
    cart_id = request.json.get('cart_id')
    if not cart_id:
        return jsonify({"msg": "Missing cart_id parameter"}), 400

    cart = Cart.query.filter_by(id=cart_id,removed=False).first()
    if not cart:
        return jsonify({"msg": "Cart has already been removed"}), 403

    cart.removed = True
    db.session.commit()
    return jsonify(msg="Remove "+str(cart.count)+" "+str(cart.product_id)+" successfully"), 200

@bp.route("/changeCount", methods=['POST'])
@jwt_required
def changeCount():
    current_user = get_jwt_identity()
    if not request.is_json:
        return jsonify({"msg": "Missing JSON in request"}), 400
    
    cart_id = request.json.get('cart_id')
    if not cart_id:
        return jsonify({"msg": "Missing cart_id parameter"}), 400

    cart = Cart.query.filter_by(id=cart_id,removed=False).first()
    if not cart:
        return jsonify({"msg": "Cart has already been removed"}), 403

    count = request.json.get('count')
    if not count:
        return jsonify({"msg": "Missing count parameter"}), 400

    oricount = cart.count
    cart.count = int(count)
    db.session.commit()
    return jsonify(msg="Set "+str(cart.product_id)+" from "+str(oricount)+" to "+str(count)+" successfully"), 200

@bp.route("/createOrder", methods=['POST'])
@jwt_required
def createOrder():
    current_user = get_jwt_identity()

    vir = Order(current_user)
    db.session.add(vir)
    db.session.commit()
    
    carts = Cart.query.filter_by(creator_id=current_user,removed=False).all()
    orders = []
    for cart in carts:
        product = Product.query.filter_by(id=cart.product_id,shelved=True,archived=False).first()
        description = Description.query.filter_by(product_id=cart.product_id,active=True,removed=False).first()
        # 限购暂未实现
        print(description.remain, cart.count)
        if (not product) or (not description) or (description.remain < cart.count):
            orders.append([False,cart.id])
            continue
        description.remain = description.remain - cart.count
        order = Order(current_user)
        order.fill(cart.product_id,cart.count,description.price,vir.id)
        db.session.add(order)
        cart.removed = True
        db.session.commit()
        orders.append([True,cart.id,cart.product_id,cart.count,description.price])
    return jsonify(orders=orders,price=vir.cost()), 200

@bp.route("/showOrder", methods=['POST'])
@jwt_required
def showOrder():
    current_user = get_jwt_identity()
    virtual_orders = Order.query.filter_by(creator_id=current_user,archived=False,virtual=True).all()
    orders=[]
    for virorder in virtual_orders:
        if virorder.virtual:
            _orders = Order.query.filter_by(creator_id=current_user,belonging_id=virorder.id,archived=False,virtual=False).all()
            suborders = []
            for order in _orders:
                suborders.append([order.product_id, order.count, order.monoprice])
            orders.append((virorder.id, suborders, virorder.cost(), virorder.paid, virorder.processed, virorder.cancelled))
    return jsonify(orders), 200

@bp.route("/payOrder", methods=['POST'])
@jwt_required
def payOrder():
    current_user = get_jwt_identity()
    if not request.is_json:
        return jsonify({"msg": "Missing JSON in request"}), 400    

    order_id = request.json.get('order_id')
    if not order_id:
        return jsonify({"msg": "Missing order_id parameter"}), 400

    order = Order.query.filter_by(id=order_id,paid=False,archived=False,virtual=True).first()
    if not order:
        return jsonify({"msg": "Bad order_id"}), 401
    
    user = User.query.filter_by(id=current_user).first()
    total_cost = order.cost()
    if (user.balance < total_cost):
        return jsonify({"msg": "Not enough balance"}), 401

    payment = Payment(current_user, order_id, total_cost)
    user.balance = user.balance - total_cost
    db.session.add(payment)
    order.paid=True
    suborders = Order.query.filter_by(virtual=False,belonging_id=order_id).all()
    for suborder in suborders:
        suborder.paid=True
    db.session.commit()
    return jsonify(msg="Pay for order "+str(order_id)+" Successfully",payment_id=payment.id), 200

@bp.route("/processOrder", methods=['POST'])
@jwt_required
def processOrder():
    if not request.is_json:
        return jsonify({"msg": "Missing JSON in request"}), 400    

    order_id = request.json.get('order_id')
    if not order_id:
        return jsonify({"msg": "Missing order_id parameter"}), 400

    order = Order.query.filter_by(id=order_id,paid=True,archived=False,virtual=True,processed=False).first()
    if not order:
        return jsonify({"msg": "Bad order_id"}), 401
    
    order.processed=True
    db.session.commit()
    return jsonify(msg="Process order "+str(order_id)+" Successfully"), 200

@bp.route("/cancelOrder", methods=['POST'])
@jwt_required
def cancelOrder():
    if not request.is_json:
        return jsonify({"msg": "Missing JSON in request"}), 400    

    order_id = request.json.get('order_id')
    if not order_id:
        return jsonify({"msg": "Missing order_id parameter"}), 400

    order = Order.query.filter_by(id=order_id,paid=True,archived=False,virtual=True,cancelled=False).first()
    if not order:
        return jsonify({"msg": "Bad order_id"}), 401
    
    order.cancelled=True
    db.session.commit()
    return jsonify(msg="Cancel order "+str(order_id)+" Successfully"), 200
