from server import app, DBSession
from flask import Blueprint, request, session, send_file, make_response, jsonify
from utils import captcha, cmparePswd, invalid, invalidate

from flask_jwt_extended import jwt_required, jwt_optional, create_access_token, get_jwt_identity, get_raw_jwt
import io
from model import *
import math

bp = Blueprint('mall',__name__)

from flask_sqlalchemy import BaseQuery
@bp.route("/homepage", methods=['POST', 'GET'])
def homepage():
    sess = DBSession()
    current_page = request.json['page'] if request.is_json and ('page' in request.json.keys()) else 1
    per_page = request.json['per_page'] if request.is_json and ('per_page' in request.json.keys()) else 20
    idx = (current_page - 1) * per_page
    result = sess.query(Product).filter_by(shelved=True,archived=False).all()
    total = len(result)
    pages = math.ceil(total / per_page)
    idx_start = max(min(idx, len(result)), 0)
    idx_end = max(min(idx+per_page, len(result)), 0)
    result = result[idx_start : idx_end]
    roots = Category.all()
    cates = []
    for k, v in roots.items():
        cate = sess.query(Category).filter_by(name=k).first()
        for sk in v:
            subcates = sess.query(Category).filter_by(parent_id=cate.id).all()
        cates += [{"id":sc.id, "name":sc.name, 'image':sc.thumbnail} for sc in subcates]
        #cates.append({"id":cate.id, "name":cate.name, "subcate":[{"id":sc.id, "name":sc.name} for sc in subcates]})
    prods = [p.brief() for p in result] if result else []
    return jsonify(total=total,totalPages=pages,categories=cates,products=prods), 200

@bp.route("/category", methods=['POST', 'GET'])
def category():
    sess = DBSession()
    category_id = request.json['id'] if request.is_json and ('id' in request.json.keys()) else None
    current_page = request.json['page'] if request.is_json and ('page' in request.json.keys()) else 1
    per_page = request.json['per_page'] if request.is_json and ('per_page' in request.json.keys()) else 20
    category = []
    if category_id == None:
        roots = Category.all()
        for k, v in roots.items():
            category += v
    else:
        category += sess.query(Category).filter_by(id=category_id).first().children()
    category = [sess.query(Category).filter_by(name=c).first() for c in category]
    category = [c.id for c in category if c != None]
    category.append(category_id)
    result = []
    for cate in category:
        result += sess.query(Product).filter_by(shelved=True,archived=False,category_id=cate)
    result = sorted(result, key=lambda x: x.id)
    idx = (current_page - 1) * per_page
    total = len(result)
    pages = math.ceil(total / per_page)
    idx_start = max(min(idx, len(result)), 0)
    idx_end = max(min(idx+per_page, len(result)), 0)
    result = result[idx_start : idx_end]
    prods = [p.brief() for p in result] if result else []
    return jsonify(total=total,totalPages=pages,products=prods), 200

@bp.route("/catalogs")
def catalogs():
    sess = DBSession()
    roots = Category.all()
    cates = []
    for k, v in roots.items():
        cate = sess.query(Category).filter_by(name=k).first()
        for sk in v:
            subcates = sess.query(Category).filter_by(parent_id=cate.id).all()
        cates += [{"id":sc.id, "name":sc.name, 'image':sc.thumbnail} for sc in subcates]
    return jsonify(catalogs=cates), 200

@bp.route("/search", methods=['POST', 'GET'])
def search():
    sess = DBSession()
    filterstr = "%{}%".format(request.json['filter']) if request.is_json and ('filter' in request.json.keys()) else "%"
    current_page = request.json['page'] if request.is_json and ('page' in request.json.keys()) else 1
    per_page = request.json['per_page'] if request.is_json and ('per_page' in request.json.keys()) else 20
    result = sess.query(Product).filter_by(shelved=True,archived=False).filter(Product.title.like(filterstr)).all()
    result = sorted(result, key=lambda x: x.id)
    idx = (current_page - 1) * per_page
    total = len(result)
    pages = math.ceil(total / per_page)
    idx_start = max(min(idx, len(result)), 0)
    idx_end = max(min(idx+per_page, len(result)), 0)
    result = result[idx_start : idx_end]
    prods = [p.brief() for p in result] if result else []
    return jsonify(total=total,totalPages=pages,products=prods), 200
