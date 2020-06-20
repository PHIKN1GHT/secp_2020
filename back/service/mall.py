from server import app
from flask import Blueprint, request, session, send_file, make_response, jsonify
from utils import captcha, cmparePswd, invalid, invalidate

from flask_jwt_extended import jwt_required, jwt_optional, create_access_token, get_jwt_identity, get_raw_jwt
import io
from model import User, Product

bp = Blueprint('mall',__name__)

@bp.route("/homepage")
def homepage():
    pass

@bp.route("/catalog")
def catalog():
    pass

@bp.route("/search")
def search():
    pass









