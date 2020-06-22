from server import app, inDebugging, DBSession
from flask import Blueprint, request, session, send_file, make_response, jsonify
from utils import captcha, cmparePswd, invalid, invalidate, Pipeline, ensureJson, ensureParam
from flask_jwt_extended import jwt_required, jwt_optional, create_access_token, get_jwt_identity, get_raw_jwt
import io
from model import User
import datetime

bp = Blueprint('account',__name__)

def invalidateSession(session, key):
    session[key] = None

def ensureCaptcha(request, session):
    captcha = request.json.get('captcha', None)
    if not captcha or session['captcha'].upper() != captcha.upper():
        session['captcha'] = None
        return False, [jsonify(result=False,reason="Wrong captcha"), 400]
    return True, []

# GET: 请求验证码图片，并在 login 的 POST 请求里进行验证
@bp.route("/captcha")
def verify():
    imagedata = io.BytesIO()
    image, session['captcha'] = captcha()
    image.save(imagedata, 'PNG', quality=100)
    imagedata.seek(0)
    return send_file(imagedata, mimetype='image/png')

# 返回验证码的内容，仅在调试模式有效，用于自动化测试脚本
@bp.route("/cheat")
def cheat():
    if inDebugging():
        if 'captcha' in session.keys():
            return str(session['captcha'])
        else:
            return "UKNOWN"
    else:
        return "FORBIDDEN"


@bp.route("/registery", methods=['POST'])
def registery():
    if (not 'captcha' in session.keys()) or (session['captcha'] == None):
        return jsonify(result=False,reason="Please reload captcha first"), 400

    pipeline = Pipeline(request)
    pipeline.add(ensureJson)
    pipeline.add(ensureCaptcha, [request, session])
    pipeline.add(ensureParam, [request, 'username', lambda: invalidateSession(session, 'captcha')])
    pipeline.add(ensureParam, [request, 'password', lambda: invalidateSession(session, 'captcha')])

    broken, retvs = pipeline.run()
    if broken:
        return retvs
    
    _, _, username, password = retvs

    sess = DBSession()
    user = User(username)
    user.setPassword(password)
    sess.add(user)
    sess.commit()

    session['captcha'] = None
    return jsonify(result=True), 200

# POST: 登入，若成功返回Auth Token
@bp.route("/login", methods=['POST'])
def login():
    if ('captcha' not in session.keys()) or (session['captcha'] is None):
        return jsonify(result=False,reason="Please reload captcha first"), 400

    pipeline = Pipeline(request)
    pipeline.add(ensureJson)
    pipeline.add(ensureCaptcha, [request, session])
    pipeline.add(ensureParam, [request, 'username', lambda: invalidateSession(session, 'captcha')])
    pipeline.add(ensureParam, [request, 'password', lambda: invalidateSession(session, 'captcha')])

    broken, retvs = pipeline.run()
    if broken:
        return retvs
    
    _, _, username, password = retvs

    sess = DBSession()
    user = sess.query(User).filter_by(username=username).first()

    if not user or not cmparePswd(password, user.password):
        session['captcha'] = None
        return jsonify(result=False,reason="Bad username or password"), 401
    
    expires = datetime.timedelta(days=1)
    token = create_access_token(identity=user.id, expires_delta=expires)
    session['captcha'] = None
    return jsonify(result=True,access_token=token,user_type=user.getUserType()), 200


# Tested by Postman
@bp.route("/loginAs", methods=['POST'])
def loginAs():
    if not inDebugging():
        return 'FORBIDDEN'
    pipeline = Pipeline(request)
    pipeline.add(ensureJson)
    pipeline.add(ensureParam, [request, 'username', lambda: invalidateSession(session, 'captcha')])

    broken, retvs = pipeline.run()
    if broken:
        return retvs
    
    _, username = retvs
    sess = DBSession()
    user = sess.query(User).filter_by(username=username).first()
    token = create_access_token(identity=user.id)
    return jsonify(msg="Login successfully as "+user.username,access_token=token), 200

@bp.route("/logout")
@jwt_required
def logout():
    invalidate(get_raw_jwt())
    return jsonify(result=True, msg="Successfully logged out"), 200

@bp.route("/identity")
@jwt_required
def identity():
    current_user = get_jwt_identity()
    return jsonify(logged_in_as_user=current_user), 200

@bp.route('/state', methods=['GET'])
@jwt_optional
def state():
    current_user = get_jwt_identity()
    if current_user:
        return jsonify(logged_in_as=current_user), 200
    else:
        return jsonify(logged_in_as='anonymous user'), 200


@bp.route("/changepswd", methods=['POST'])
@jwt_required
def changepswd():
    current_user = get_jwt_identity()

    pipeline = Pipeline(request)
    pipeline.add(ensureJson)
    pipeline.add(ensureParam, [request, 'username'])
    pipeline.add(ensureParam, [request, 'oripswd'])
    pipeline.add(ensureParam, [request, 'newpswd'])

    broken, retvs = pipeline.run()
    if broken:
        return retvs
    
    _, username, oripswd, newpswd = retvs

    sess = DBSession()
    user = sess.query(User).filter_by(username=username).first()

    if not user or not cmparePswd(oripswd, user.password) or not user.id == current_user:
        return jsonify({"msg": "Bad username or password"}), 401
    
    user.setPassword(newpswd)
    sess.commit()

    invalidate(get_raw_jwt())
    return jsonify(msg="Change password successfully, please relogin"), 200
