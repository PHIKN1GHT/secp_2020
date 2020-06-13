from server import db, app
from flask import Blueprint, request, session, send_file, make_response, jsonify
from utils import captcha, cmparePswd, invalid, invalidate
from flask_jwt_extended import jwt_required, jwt_optional, create_access_token, get_jwt_identity, get_raw_jwt
import io
from model import Storehouse, User, Product, Description, SupplierOrder, Order
import datetime

bp = Blueprint('product',__name__)

# 目前只包含了经理端查看商品列表
# Tested by Postman
@bp.route("/all", methods=['POST'])
@jwt_required
def allProduct():
    current_user = get_jwt_identity()
    manager = User.query.filter_by(id=current_user,isManager=True).first()
    if not manager:
        return jsonify({"msg": "Bad manager_id"}), 401

    if not request.is_json:
        return jsonify({"msg": "Missing JSON in request"}), 400
    
    storehouse_id = request.json.get('storehouse_id')
    if not storehouse_id:
        return jsonify({"msg": "Missing storehouse_id parameter"}), 400
    
    storehouse = Storehouse.query.filter_by(id=storehouse_id).first()
    if not storehouse:
        return jsonify({"msg": "Bad storehouseId"}), 401

    products = Product.query.filter_by(storehouse_id=storehouse_id).all()
    all_products = [(product.id, product.name, product.shelved, product.category) for product in products]
    return jsonify(products=all_products), 200

# 经理端查看商品详情
# Tested by Postman
@bp.route("/detail", methods=['POST'])
@jwt_required
def productDatail():
    current_user = get_jwt_identity()
    manager = User.query.filter_by(id=current_user,isManager=True).first()
    if not manager:
        return jsonify({"msg": "Bad manager_id"}), 401
      
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

    description_json = [description.title, description.thumbnail, description.remain, description.price, description.htmlDescription, description.active]  
    return jsonify(name=product.name, shelved=product.shelved, category=product.category, description=description_json), 200

# 经理端创建新产品
# Tested by Postman
@bp.route("/create", methods=['POST'])
@jwt_required
def createProduct():
    current_user = get_jwt_identity()
    manager = User.query.filter_by(id=current_user,isManager=True).first()
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

    storehouse_id = request.json.get('storehouse_id')
    if not storehouse_id:
        return jsonify({"msg": "Missing storehouse_id parameter"}), 400

    product = Product(name,category,storehouse_id)
    db.session.add(product)
    db.session.commit()
    
    description = Description(all_description,product.id)
    db.session.add(description)
    db.session.commit()
    return jsonify(isCreated=True, productID=product.id)

# 经理端更改商品信息
@bp.route("/update", methods=['POST'])
@jwt_required
def updateProduct():
    current_user = get_jwt_identity()
    manager = User.query.filter_by(id=current_user,isManager=True).first()
    if not manager:
        return jsonify({"msg": "Bad manager_id"}), 401

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
    
    archived = request.json.get('archived')
    if not archived:
        return jsonify({"msg": "Missing archived parameter"}), 400

    removed = request.json.get('removed')
    if not removed:
        return jsonify({"msg": "Missing removed parameter"}), 400

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
    product.archived=archived
    product.removed=removed
    db.session.commit()

    description.modify(all_description)
    db.session.commit()
    return jsonify(isUpdated=True), 200

# 经理删除商品
@bp.route("/remove", methods=['POST'])
@jwt_required
def removeProduct():
    current_user = get_jwt_identity()
    manager = User.query.filter_by(id=current_user,isManager=True).first()
    if not manager:
        return jsonify({"msg": "Bad manager_id"}), 401

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

# 经理端查看销售统计，不知道放哪儿先放这儿了
@bp.route("/statistics", methods=['POST'])
@jwt_required
def statistics():
    current_user = get_jwt_identity()
    manager = User.query.filter_by(id=current_user,isManager=True).first()
    if not manager:
        return jsonify({"msg": "Bad manager_id"}), 401

    storehouse_id = request.json.get('storehouse_id')
    if not storehouse_id:
        return jsonify({"msg": "Missing storehouse_id parameter"}), 400

    nowTime = datetime.datetime.now()
    virtual_orders = Order.query.filter_by(storehouse_id=storehouse_id,virtual=True,cancelled=False).all()
    product_count={}
    for virorder in virtual_orders:
        orders = Order.query.filter_by(storehouse_id=storehouse_id,belonging_id=virorder.id,virtual=False).all()
        for order in orders:
            if(order.createTime.__rsub__(nowTime).days<=10):
                if(order.product_id in product_count):
                    product_count[order.product_id] = product_count[order.product_id] + order.count
                else:
                    product_count[order.product_id] = order.count
    # 按字典集合中，每一个元组的第二个元素排列。
    product_count_order=sorted(product_count.items(),key=lambda x:x[1],reverse=True)
    return jsonify(product_count_order=product_count_order), 200