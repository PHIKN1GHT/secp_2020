from server import app
from flask import render_template, send_file, Blueprint, request, jsonify
from PIL import Image
import os, uuid
#from model import User, Product, Description

bp = Blueprint('resource',__name__)

@bp.route("/uploadImage", methods=['POST'])
def uploadImages():
    filename = ''.join(str(uuid.uuid4()).split('-'))
    fullname = os.path.join('resource', 'image', filename)
    with open(fullname, "wb+") as f:
        f.write(request.get_data())
    im = Image.open(fullname)
    im.save(fullname,format='PNG')
    return jsonify(msg="Upload successfully", path='/'+fullname.replace('\\', '/')), 200

@bp.route("/image/<filename>", methods=['GET'])
def image(filename):
    return send_file(os.path.join('resource', 'image', filename), mimetype='image/png')

# 给商品列表用
@bp.route("/productBrief", methods=['POST'])
def productBrief():
    if not request.is_json:
        return jsonify({"msg": "Missing JSON in request"}), 400

    product_id = request.json.get('product_id', None)
    if not product_id:
        return jsonify({"msg": "Missing product_id parameter"}), 400
    
    product = Product.query.filter_by(id=product_id).first()
    if not product:
        return jsonify({"msg": "Product not found"}), 401

    if product.archived:
        return jsonify({"msg": "Product has been archived"}), 401

    description = Description.query.filter_by(product_id=product.id, active=True, removed=False).first()
    if not description:
        return jsonify({"msg": "Description not found"}), 401
    
    return jsonify(name=product.name,shelved=product.shelved,title=description.title,thumbnail=description.thumbnail,remain=description.remain,price=description.price,limit=description.limit), 200

# 给商品页面用
@bp.route("/productDetail", methods=['POST'])
def productDetails():
    if not request.is_json:
        return jsonify({"msg": "Missing JSON in request"}), 400

    product_id = request.json.get('product_id', None)
    if not product_id:
        return jsonify({"msg": "Missing product_id parameter"}), 400
    
    product = Product.query.filter_by(id=product_id).first()
    if not product:
        return jsonify({"msg": "Bad product_id"}), 401

    if product.archived:
        return jsonify({"msg": "Product has been archived"}), 401

    description = Description.query.filter_by(product_id=product.id, active=True, removed=False).first()
    if not product:
        return jsonify({"msg": "Description not found"}), 401
    
    return jsonify(name=product.name,shelved=product.shelved,title=description.title,thumbnail=description.thumbnail,htmlDescription=description.htmlDescription,remain=description.remain,price=description.price,limit=description.limit), 200

@bp.route("/productState", methods=['POST'])
def productState():
    if not request.is_json:
        return jsonify({"msg": "Missing JSON in request"}), 400

    product_id = request.json.get('product_id', None)
    if not product_id:
        return jsonify({"msg": "Missing product_id parameter"}), 400
    
    product = Product.query.filter_by(id=product_id).first()
    if not product:
        return jsonify({"msg": "Bad product_id"}), 401

    if product.archived:
        return jsonify(msg="Archived"), 200
    elif product.shelved:
        return jsonify(msg="On shelves"), 200
    else:
        return jsonify(msg="Off shelves"), 200

@bp.route("/temp/images/<filename>")
def temp_image(filename):
    return send_file(os.path.join('temp','images',filename), mimetype='image/png')

@bp.route("/articles")
def articles():
    pass

@bp.route("/article/<name>")
def article(name):
    pass