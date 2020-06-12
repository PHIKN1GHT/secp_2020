from server import app
from flask import Blueprint, request, session, send_file, make_response, jsonify
from utils import captcha, cmparePswd, invalid, invalidate
from flask_jwt_extended import jwt_required, jwt_optional, create_access_token, get_jwt_identity, get_raw_jwt
import io
#from model import User, Product, Order

bp = Blueprint('indexing',__name__)

@bp.route("/allUser")
def allUser():
    users = User.query.all()
    users = [[user.stuId, user.name, user.email, user.citizenId, user.balance, user.visible] for user in users]
    return jsonify(users)

@bp.route("/allProduct")
def allProduct():
    products = Product.query.all()
    products = [(product.id, product.name, product.shelved, product.archived, product.category) for product in products]
    return jsonify(products)

@bp.route("/allOrder")
def allOrder():
    orders = Order.query.filter_by(virtual=False,archived=False).all()
    orders = [(order.creator_id, order.product_id, order.count, order.monoprice, order.createTime, order.paid, order.processed, order.cancelled) for order in orders]
    return jsonify(orders)

# 获取目录
@bp.route("/category")
def category():
    ret = [{
        0: [1,2,3,4],
        5: [6,7,8,9]
    },["日常用品","美容护肤","个人洗护","学习办公","生活日用","全新服饰","帽子","围巾","衬衫","手套"]]
    return jsonify(category=ret),200


# 获取主页
@bp.route("/product/mainpage")
def productMainpage():
    return 'Undefined'

@bp.route("/product/category")
def productCategory():
    return 'Undefined'
