from server import app, db, inDebugging
from flask import Blueprint, request, session, send_file, make_response, jsonify
from utils import captcha, cmparePswd, invalid, invalidate, Pipeline, ensureJson, ensureParam
from flask_jwt_extended import jwt_required, jwt_optional, create_access_token, get_jwt_identity, get_raw_jwt
import io
from model import *

bp = Blueprint('address',__name__)

@jwt_required
@bp.route("/add")
def add():
    current_user = get_jwt_identity()
    user = User.query.filter_by(id=current_user).first()
    if user.default_address_id is None:
        print("no address")
    return jsonify(result=False), 200

@jwt_required
@bp.route("/all")
def all():
    current_user = get_jwt_identity()
    #user = User.query.filter_by(id=current_user).first()
    addresses = Address.query.filter_by(owner_id=current_user).all()
    pass

@jwt_required
@bp.route("/update")
def update():
    pass

@jwt_required
@bp.route("/del")
def delete():
    pass



