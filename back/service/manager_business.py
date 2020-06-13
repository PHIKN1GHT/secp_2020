from server import db, app
from flask import Blueprint, request, session, send_file, make_response, jsonify
from utils import captcha, cmparePswd, invalid, invalidate
from flask_jwt_extended import jwt_required, jwt_optional, create_access_token, get_jwt_identity, get_raw_jwt
import io
from model import Storehouse, Manager, Product, Description, SupplierOrder, Order
import datetime

bp = Blueprint('manager_business',__name__)

# 经理端的商品列表
@bp.route("/product", methods=['POST'])
@jwt_required
def allProduct():
    current_user = get_jwt_identity()
    manager = Manager.query.filter_by(id=current_user).first()
    if not manager:
        return jsonify({"msg": "Bad manager_id"}), 401
    
    if not request.is_json:
        return jsonify({"msg": "Missing JSON in request"}), 400

    products = Product.query.filter_by(storehouse_id=manager.storehouse_id).all()
    all_products = [(product.id, product.name, product.shelved, product.category) for product in products]
    return jsonify(products=all_products), 200

# 经理端查看商品详情
@bp.route("/product/detail", methods=['POST'])
@jwt_required
def productDatail():  
    product_id = request.json.get('product_id')
    if not product_id:
        return jsonify({"msg": "Missing product_id parameter"}), 400

    product = Product.query.filter_by(id=product_id).first()
    if not product:
        return jsonify({"msg": "Bad productId"}), 401

    description = Description.query.filter_by(product_id=product_id,removed=False).first()
    if not description:
        return jsonify({"msg": "Bad description"}), 401

    description_json = [description.title, description.thumbnail, description.remain, description.price, description.htmlDescription, description.active]  
    return jsonify(name=product.name, shelved=product.shelved, category=product.category, description=description_json), 200

# 经理端创建新产品
@bp.route("/product/create", methods=['POST'])
@jwt_required
def createProduct():
    current_user = get_jwt_identity()
    manager = Manager.query.filter_by(id=current_user).first()
    if not manager:
        return jsonify({"msg": "Bad manager_id"}), 401

    if not request.is_json:
        return jsonify({"msg": "Missing JSON in request"}), 400

    name = request.json.get('name')
    if not name:
        return jsonify({"msg": "Missing name in request"}), 400
    
    category = request.json.get('category')
    if not category:
        return jsonify({"msg": "Missing category in request"}), 400

    all_description = request.json.get('description')
    if not all_description:
        return jsonify({"msg": "Missing description parameter"}), 400

    product = Product(name,category,manager.storehouse_id)
    db.session.add(product)
    db.session.commit()
    
    description = Description(all_description,product.id)
    db.session.add(description)
    db.session.commit()
    return jsonify(isCreated=True, productID=product.id)

# 经理端更改商品信息
@bp.route("/product/update", methods=['POST'])
@jwt_required
def updateProduct():
    if not request.is_json:
        return jsonify({"msg": "Missing JSON in request"}), 400
    
    product_id = request.json.get('product_id')
    if not product_id:
        return jsonify({"msg": "Missing product_id parameter"}), 400

    category = request.json.get('category')
    if not category:
        return jsonify({"msg": "Missing category parameter"}), 400

    shelved = request.json.get('shelved')
    if not shelved:
        return jsonify({"msg": "Missing shelved parameter"}), 400

    all_description = request.json.get('description')
    if not all_description:
        return jsonify({"msg": "Missing description parameter"}), 400

    product = Product.query.filter_by(id=product_id).first()
    if not product:
        return jsonify({"msg": "Bad productId"}), 401
    
    description = Description.query.filter_by(product_id=product_id,removed=False).first()
    if not description:
        return jsonify({"msg": "Bad description"}), 401

    product.category=category
    product.shelved=shelved
    db.session.commit()

    description.modify(all_description)
    db.session.commit()
    return jsonify(isUpdated=True), 200

# 经理删除商品
@bp.route("/product/remove", methods=['POST'])
@jwt_required
def removeProduct():
    if not request.is_json:
        return jsonify({"msg": "Missing JSON in request"}), 400
    
    product_id = request.json.get('product_id')
    if not product_id:
        return jsonify({"msg": "Missing product_id parameter"}), 400

    product = Product.query.filter_by(id=product_id).first()
    if not product:
        return jsonify({"msg": "Bad productId"}), 401
    
    description = Description.query.filter_by(product_id=product_id,removed=False).first()
    if not description:
        return jsonify({"msg": "Bad description"}), 401
    
    product.removed=True
    description.removed=True
    return jsonify(isRemoved=True), 200
    

# 经理端查看销售统计
@bp.route("/statistics", methods=['POST'])
@jwt_required
def statistics():
    current_user = get_jwt_identity()
    manager = Manager.query.filter_by(id=current_user).first()
    if not manager:
        return jsonify({"msg": "Bad manager_id"}), 401

    nowTime = datetime.datetime.now()
    orders = Order.query.filter_by(storehouse_id=manager.storehouse_id).all()
    product_count={}
    for order in orders:
        #product = Product.query.filter_by(id=order.product_id).first()
        if(order.createTime.__rsub__(nowTime).days<=10):
            if(order.product_id in product_count):
                product_count[order.product_id] = product_count[order.product_id] + order.count
            else:
                product_count[order.product_id] = order.count
    # 按字典集合中，每一个元组的第二个元素排列。
    product_count_order=sorted(product_count.items(),key=lambda x:x[1],reverse=True)
    return jsonify(product_count_order=product_count_order), 200

# 经理端进货订单列表                                                           
@bp.route("/supplierOrder/all", methods=['POST'])
@jwt_required
def allSupplierOrder():
    current_user = get_jwt_identity()
    
    supplierOrders = SupplierOrder.query.filter_by(creator_id=current_user).all()
    all_supplierOrders = []
    for supplierOrder in supplierOrders:
        # storehouse = Storehouse.query.filter_by(id=supplierOrder.storehouse_id).first()
        product = [supplierOrder.product_id, supplierOrder.count]        
        all_supplierOrders.append([supplierOrder.id, product, supplierOrder.createTime, supplierOrder.paid, supplierOrder.accepted, supplierOrder.delivered, supplierOrder.confirmed, supplierOrder.rejected, supplierOrder.cancelled])
    return jsonify(supplierOrders=all_supplierOrders), 200

# 经理端创建新的进货订单
@bp.route("/supplierOrder/create", methods=['POST'])
@jwt_required
def createSupplierOrder():
    current_user = get_jwt_identity()
    manager = Manager.query.filter_by(id=current_user).first()
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

    product = Product.query.filter_by(id=product_id).first()
    if not product:
        return jsonify({"msg": "Bad productId"}), 401

    storehouse = Storehouse.query.filter_by(id=manager.storehouse_id).first()
    supplierOrder = SupplierOrder(current_user)
    supplierOrder.fill(product_id,storehouse.id,count)
    db.session.add(supplierOrder)
    db.session.commit()
    return jsonify(supplierOrderId=supplierOrder.id), 200
 