from server import db, app
from flask import Blueprint, request, session, send_file, make_response, jsonify
from utils import captcha, cmparePswd, invalid, invalidate
from flask_jwt_extended import jwt_required, jwt_optional, create_access_token, get_jwt_identity, get_raw_jwt
import io
from model import Storehouse, User, Product, Description, SupplierOrder, Order
import datetime

bp = Blueprint('supplierOrder',__name__)

# 经理端进货订单列表                                                           
@bp.route("/all", methods=['POST'])
@jwt_required
def allSupplierOrder():
    current_user = get_jwt_identity()
    manager = User.query.filter_by(id=current_user,isManager=True).first()
    if not manager:
        return jsonify({"msg": "Bad manager_id"}), 401
    
    supplierOrders = SupplierOrder.query.filter_by(creator_id=current_user).all()
    all_supplierOrders = []
    for supplierOrder in supplierOrders:
        # storehouse = Storehouse.query.filter_by(id=supplierOrder.storehouse_id).first()
        product = [supplierOrder.product_id, supplierOrder.count]        
        all_supplierOrders.append([supplierOrder.id, product, supplierOrder.createTime, supplierOrder.paid, supplierOrder.accepted, supplierOrder.delivered, supplierOrder.confirmed, supplierOrder.rejected, supplierOrder.cancelled])
    return jsonify(supplierOrders=all_supplierOrders), 200

# 经理端创建新的进货订单
@bp.route("/create", methods=['POST'])
@jwt_required
def createSupplierOrder():
    current_user = get_jwt_identity()
    manager = User.query.filter_by(id=current_user,isManager=True).first()
    if not manager:
        return jsonify({"msg": "Bad manager_id"}), 401
    
    if not request.is_json:
        return jsonify({"msg": "Missing JSON in request"}), 400
    
    product_id = request.json.get('product_id')
    if not product_id:
        return jsonify({"msg": "Missing product_id parameter"}), 400

    count = request.json.get('count')
    if not count:
        return jsonify({"msg": "Missing count parameter"}), 400

    storehouse_id = request.json.get('storehouse_id')
    if not storehouse_id:
        return jsonify({"msg": "Missing storehouse_id parameter"}), 400

    product = Product.query.filter_by(id=product_id).first()
    if not product:
        return jsonify({"msg": "Bad productId"}), 401

    supplierOrder = SupplierOrder(current_user)
    supplierOrder.fill(product_id,storehouse_id,count)
    db.session.add(supplierOrder)
    db.session.commit()
    return jsonify(supplierOrderId=supplierOrder.id), 200