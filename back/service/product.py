from server import app, DBSession
from flask import Blueprint, request, session, send_file, make_response, jsonify
from utils import captcha, cmparePswd, invalid, invalidate
from flask_jwt_extended import jwt_required, jwt_optional, create_access_token, get_jwt_identity, get_raw_jwt
import io
from model import Storehouse, User, Product, Order
import datetime

bp = Blueprint('product',__name__)

# 目前只包含了经理端查看商品列表
@bp.route("/all", methods=['POST'])
@jwt_optional
def allProduct():
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
        if user.isManager:
            products = sess.query(Product).filter_by(storehouse_id=storehouse_id).all()
        
    if not products:
        products = sess.query(Product).filter_by(storehouse_id=storehouse_id,shelved=True,archived=False).all()
        
    all_products = [product.brief() for product in products]
    return jsonify(products=all_products), 200

# 经理端查看商品详情
@bp.route("/detail", methods=['POST'])
@jwt_optional
def productDetail():
    sess = DBSession()
    current_user = get_jwt_identity()

    if not request.is_json:
        return jsonify({"msg": "Missing JSON in request"}), 400
    
    product_id = request.json.get('id')
    if not product_id:
        return jsonify({"msg": "Missing product_id parameter"}), 400

    product = sess.query(Product).filter_by(id=product_id).first()
    if not product:
        return jsonify({"msg": "Bad productId"}), 401
    
    if product.archived:
        if current_user:
            user = sess.query(User).filter_by(id=current_user).first()
            if user and user.isManager:
                return jsonify(product.detailed()), 200
        return jsonify({"msg": "No Permission"}), 401
    else:
        return jsonify(product.detailed()), 200

# 经理端创建新产品
@bp.route("/create", methods=['POST'])
@jwt_required
def createProduct():
    sess = DBSession()
    current_user = get_jwt_identity()
    manager = sess.query(User).filter_by(id=current_user,isManager=True).first()
    if not manager:
        return jsonify({"msg": "Bad manager_id"}), 401

    if not request.is_json:
        return jsonify({"msg": "Missing JSON in request"}), 400

    name = request.json.get('name')
    if not name:
        return jsonify({"msg": "Missing name parameter"}), 400
    
    category = request.json.get('category')
    if not category:
        return jsonify({"msg": "Missing category parameter"}), 400

    all_description = request.json.get('despycription')
    if not all_description:
        return jsonify({"msg": "Missing description parameter"}), 400

    storehouse_id = request.json.get('storehouse_id')
    if not storehouse_id:
        return jsonify({"msg": "Missing storehouse_id parameter"}), 400

    product = Product(name,category,storehouse_id)
    sess.add(product)
    sess.commit()
    
    description = Description(all_description,product.id)
    sess.add(description)
    sess.commit()
    return jsonify(isCreated=True, productID=product.id)

# 经理端更改商品信息
# Tested by Pytest
@bp.route("/update", methods=['POST'])
@jwt_required
def updateProduct():
    sess = DBSession()
    current_user = get_jwt_identity()
    manager = sess.query(User).filter_by(id=current_user,isManager=True).first()
    if not manager:
        return jsonify({"msg": "Bad manager_id"}), 401

    if not request.is_json:
        return jsonify({"msg": "Missing JSON in request"}), 400
    
    product_id = request.json.get('product_id')
    if not product_id:
        return jsonify({"msg": "Missing product_id parameter"}), 400

    name = request.json.get('name')
    if not name:
        return jsonify({"msg": "Missing name parameter"}), 400
    
    category = request.json.get('category')
    if not category:
        return jsonify({"msg": "Missing category parameter"}), 400

    status = request.json.get('status')
    if not status:
        return jsonify({"msg": "Missing status parameter"}), 400

    all_description = request.json.get('description')
    if not all_description:
        return jsonify({"msg": "Missing description parameter"}), 400

    product = sess.query(Product).filter_by(id=product_id,removed=False).first()
    if not product:
        return jsonify({"msg": "Bad productId"}), 401
    
    description = sess.query(Description).filter_by(product_id=product_id,removed=False).first()
    if not description:
        return jsonify({"msg": "Bad description"}), 401

    product.name=name
    product.modify(status)
    if product.removed:
        description.removed=True

    description.modify(all_description)
    sess.commit()
    return jsonify(isUpdated=True), 200

# 经理端查看销售统计，不知道放哪儿先放这儿了
# Tested by Pytest
@bp.route("/statistics", methods=['POST'])
@jwt_required
def statistics():
    sess = DBSession()
    current_user = get_jwt_identity()
    manager = sess.query(User).filter_by(id=current_user,isManager=True).first()
    if not manager:
        return jsonify({"msg": "Bad manager_id"}), 401

    if not request.is_json:
        return jsonify({"msg": "Missing JSON in request"}), 400

    storehouse_id = request.json.get('storehouse_id')
    if not storehouse_id:
        return jsonify({"msg": "Missing storehouse_id parameter"}), 400

    storehouse = sess.query(Storehouse).filter_by(id=storehouse_id).first()
    if not storehouse:
        return jsonify({"msg": "Bad storehouseId"}), 401

    nowTime = datetime.datetime.now()
    virtual_orders = sess.query(Order).filter_by(storehouse_id=storehouse_id,virtual=True,cancelled=False).all()
    if not virtual_orders:
        return jsonify({"msg": "No order record"}), 401
    product_count={}
    for virorder in virtual_orders:
        orders = sess.query(Order).filter_by(storehouse_id=storehouse_id,belonging_id=virorder.id,virtual=False).all()
        for order in orders:
            if(order.createTime.__rsub__(nowTime).days<=10):
                if(order.product_id in product_count):
                    product_count[order.product_id] = product_count[order.product_id] + order.count
                else:
                    product_count[order.product_id] = order.count
    # 按字典集合中，每一个元组的第二个元素排列。
    productId_count=sorted(product_count.items(),key=lambda x:x[1],reverse=True)
    name_count=[]
    for _id_count in productId_count:
        product = sess.query(Product).filter_by(id=_id_count[0]).first()
        name_count.append([product.name,_id_count[1]])
    return jsonify(name_count=name_count), 200