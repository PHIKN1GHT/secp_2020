from server import app, DBSession
from flask import Blueprint, request, session, send_file, make_response, jsonify
from utils import captcha, cmparePswd, invalid, invalidate

from flask_jwt_extended import jwt_required, jwt_optional, create_access_token, get_jwt_identity, get_raw_jwt
import io
from model import *
import math

bp = Blueprint('mall',__name__)

from flask_sqlalchemy import BaseQuery
@bp.route("/homepage")
def homepage():
    sess = DBSession()
    current_page = request.json['page'] if request.is_json and ('page' in request.json.keys()) else 1
    per_page = request.json['per_page'] if request.is_json and ('per_page' in request.json.keys()) else 20
    roots = sess.query(Category).filter_by(parent_id=None).all()
    
    idx = (current_page - 1) * per_page
    result = sess.query(Product).filter_by(shelved=True,archived=False).all()
    total = len(result)
    pages = math.ceil(total / per_page)
    idx_start = max(min(idx, len(result)), 0)
    idx_end = max(min(idx+per_page, len(result)), 0)
    result = result[idx_start : idx_end]

    cates = [{"id":r.id, "name":r.name} for r in roots]
    prods = [p.brief() for p in result] if result else []
    return jsonify(total=total,totalPages=pages,categories=cates,products=prods), 200

@bp.route("/category")
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

@bp.route("/search")
def search():
    pass









