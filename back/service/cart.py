from server import app, inDebugging, DBSession
from flask import Blueprint, request, session, send_file, make_response, jsonify
from utils import captcha, cmparePswd, invalid, invalidate, Pipeline, ensureJson, ensureParam
from flask_jwt_extended import jwt_required, jwt_optional, create_access_token, get_jwt_identity, get_raw_jwt
import io
from model import *

bp = Blueprint('cart',__name__)

@bp.route("/all")
@jwt_required
def all():
    current_user = get_jwt_identity()
    sess = DBSession()
    carts = sess.query(Cart).filter_by(creator_id=current_user,removed=False).all()
    carts = [{"id":c.product_id, 'count':c.count} for c in carts]
    for cart in carts:
        product = sess.query(Product).filter_by(id=cart['id']).first()
        cart['name'] = product.title,
        cart['price'] = str(product.price),
        cart['unit'] = product.unit,
        cart['image'] = product.thumbnail,
    return jsonify(carts), 200

@bp.route("/add", methods=['POST'])
@jwt_required
def add():
    current_user = get_jwt_identity()

    pid = request.json['id'] if request.is_json and ('id' in request.json.keys()) else None
    count = request.json['count'] if request.is_json and ('count' in request.json.keys()) else None

    sess = DBSession()
    cart = sess.query(Cart).filter_by(creator_id=current_user,product_id=pid,removed=False).first()
    if cart:
        cart.count += count
        if cart.count <= 0:
            cart.removed = True
    else:
        cart = Cart(current_user, pid, count)
        sess.add(cart)

    sess.commit()
    return jsonify(result=True), 200

@bp.route("/del", methods=['POST'])
@jwt_required
def delete():
    current_user = get_jwt_identity()
    pids = request.json['ids'] if request.is_json and ('ids' in request.json.keys()) else None

    sess = DBSession()
    for pid in pids:
        cart = sess.query(Cart).filter_by(creator_id=current_user,product_id=pid,removed=False).first()
        if cart:
            cart.removed = True
        sess.commit()

    return jsonify(result=True), 200
