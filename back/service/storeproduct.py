from server import app, DBSession
from flask import Blueprint, request, session, send_file, make_response, jsonify
from utils import captcha, cmparePswd, invalid, invalidate
from flask_jwt_extended import jwt_required, jwt_optional, create_access_token, get_jwt_identity, get_raw_jwt
import io
from model import Storehouse, User, Product
import datetime

bp = Blueprint('storeproduct',__name__)


#仓库管理员查看商品库存
@bp.route("/storehouseproduct", methods=['POST'])
@jwt_required
def storeproduct():
    sess = DBSession()
    current_user = get_jwt_identity()

    if not request.is_json:
        return jsonify({"msg": "Missing JSON in request"}), 400

    storehouse_id = request.json.get('storehouse_id')
    if not storehouse_id:
        return jsonify({"msg": "Missing storehouse_id parameter"}), 400
    
    storehouse = sess.query(Storehouse).filter_by(id=storehouse_id).first()
    if not storehouse:
        return jsonify({"msg": "Bad storehouseId"}), 401

    if current_user:
        user = sess.query(User).filter_by(id=current_user).first()
        if user.isOperator:
            products = sess.query(Product).filter_by(storehouse_id=storehouse_id).all()
    else:
        return jsonify({"msg": "No Permission"}), 401
        
    if not products:
        products = None


    if products.remain != 0:
        all_products = [product.brief() for product in products]
    return jsonify(products=all_products), 200



# 仓库管理员查看库存商品详情
@bp.route("/productdetail", methods=['POST'])
@jwt_required
def productDetail():
    sess = DBSession()
    current_user = get_jwt_identity()

    if not request.is_json:
        return jsonify({"msg": "Missing JSON in request"}), 400
    
    storehouse_id = request.json.get('storehouse_id')
    if not storehouse_id:
        return jsonify({"msg": "Missing storehouse_id parameter"}), 400
    
    storehouse = sess.query(Storehouse).filter_by(id=storehouse_id).first()
    if not storehouse:
        return jsonify({"msg": "Bad storehouseId"}), 401

    if current_user:
        user = sess.query(User).filter_by(id=current_user).first()
        if user.isOperator:

            product_id = sess.query(Product).filter_by(storehouse_id=storehouse_id).first()
            if not product_id:
                return jsonify({"msg": "Missing id parameter"}), 400

            product = sess.query(Product).filter_by(id=product_id).first()
            if not product:
                return jsonify({"msg": "Bad productId"}), 401

            if product.archived:
                if product.remain != 0:
                    return jsonify(product.detailed()), 200
        else:
            return jsonify({"msg": "No Permission"}), 401


