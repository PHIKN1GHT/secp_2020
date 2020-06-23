from server import app, DBSession
from flask import Blueprint, request, session, send_file, make_response, jsonify
from utils import captcha, cmparePswd, invalid, invalidate
from flask_jwt_extended import jwt_required, jwt_optional, create_access_token, get_jwt_identity, get_raw_jwt
import io
from model import Storehouse, User, Product, Order
import datetime

bp = Blueprint('product',__name__)

# 仓库管理员可用看到自己所管理仓库的所有商品，其它角色不可用
@bp.route("/all", methods=['GET'])
@jwt_required
def allProduct():
    current_user = get_jwt_identity()
    sess = DBSession()
    user = sess.query(User).filter_by(id=current_user).first()
    if user.isOperator:
        storehouse = sess.query(Storehouse).filter_by(operator_id=current_user).first()
        if storehouse:
            products = sess.query(Product).filter_by(storehouse_id=storehouse.id).all()
            all_products = [product.brief() for product in products]
            return jsonify(products=all_products), 200
    return jsonify({"msg": "No Permission"}), 401

# 仓库管理员可用看到归档商品的信息，其它角色只能看到未归档商品的信息
@bp.route("/detail", methods=['POST'])
@jwt_optional
def productDetail():
    sess = DBSession()
    current_user = get_jwt_identity()

    if not request.is_json:
        return jsonify({"msg": "Missing JSON in request"}), 400
    
    product_id = request.json.get('id')
    if not product_id:
        return jsonify({"msg": "Missing id parameter"}), 400

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
    user = sess.query(User).filter_by(id=current_user).first()
    #manager = sess.query(User).filter_by(id=current_user,isManager=True).first()
    if not user.isManager:
        return jsonify({"msg": "No Permission"}), 401

    if not request.is_json:
        return jsonify({"msg": "Missing JSON in request"}), 400

    title = request.json.get('title')
    if not title:
        return jsonify({"msg": "Missing title parameter"}), 400
    
    category = request.json.get('category')
    if not category:
        return jsonify({"msg": "Missing category parameter"}), 400

    storehouse_id = request.json.get('storehouse_id')
    if not storehouse_id:
        return jsonify({"msg": "Missing storehouse_id parameter"}), 400
    
    dictdata = request.json.get('dictdata')
    if not dictdata:
        return jsonify({"msg": "Missing dictdata parameter"}), 400

    product = Product(title,category,storehouse_id)
    product.update(dictdata)
    sess.add(product)
    sess.commit()
    return jsonify(result=True, productId=product.id)

# 经理端更改商品信息
@bp.route("/update", methods=['POST'])
@jwt_required
def updateProduct():
    sess = DBSession()
    current_user = get_jwt_identity()
    user = sess.query(User).filter_by(id=current_user).first()
    if not user.isManager:
        return jsonify({"msg": "No Permission"}), 401

    if not request.is_json:
        return jsonify({"msg": "Missing JSON in request"}), 400
    
    product_id = request.json.get('product_id')
    if not product_id:
        return jsonify({"msg": "Missing product_id parameter"}), 400

    #name = request.json.get('name')
    #if not name:
    #    return jsonify({"msg": "Missing name parameter"}), 400
    
    #category = request.json.get('category')
    #if not category:
    #    return jsonify({"msg": "Missing category parameter"}), 400

    #status = request.json.get('status')
    #if not status:
    #    return jsonify({"msg": "Missing status parameter"}), 400

    #all_description = request.json.get('description')
    #if not all_description:
    #    return jsonify({"msg": "Missing description parameter"}), 400

    #product = sess.query(Product).filter_by(id=product_id,removed=False).first()
    #if not product:
    #    return jsonify({"msg": "Bad productId"}), 401
    
    #description = sess.query(Description).filter_by(product_id=product_id,removed=False).first()
    #if not description:
    #    return jsonify({"msg": "Bad description"}), 401

    #product.name=name
    # status = request.json.get('status')
    # if not status:
    #     return jsonify({"msg": "Missing status parameter"}), 400
    # product = sess.query(Product).filter_by(id=product_id).first()

    dictdata = request.json.get('dictdata')
    if not dictdata:
        return jsonify({"msg": "Missing dictdata parameter"}), 400
    
    product = sess.query(Product).filter_by(id=product_id).first()
    product.update(dictdata)
    sess.commit()
    #if product.removed:
    #    description.removed=True
    #description.modify(all_description)

    return jsonify(result=True), 200
'''
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
    title_count=[]
    for _id_count in productId_count:
        product = sess.query(Product).filter_by(id=_id_count[0]).first()
        name_count.append([product.name,_id_count[1]])
    return jsonify(name_count=name_count), 200
'''
