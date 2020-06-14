from server import app, inDebugging, DBSession
from flask import Blueprint, request, session, send_file, make_response, jsonify
from utils import captcha, cmparePswd, invalid, invalidate, Pipeline, ensureJson, ensureParam
from flask_jwt_extended import jwt_required, jwt_optional, create_access_token, get_jwt_identity, get_raw_jwt
import io
from model import *

bp = Blueprint('address',__name__)

@bp.route("/all")
@jwt_required
def all():
    current_user = get_jwt_identity()
    addresses = Address.query.filter_by(owner_id=current_user).all()
    addresses = [{'receiver':addr.receiver, 'phonenumber': addr.phonenumber, 'address':addr.address, 'id':addr.id } for addr in addresses]
    return jsonify(addresses), 200

@bp.route("/add")
@jwt_required
def add():
    current_user = get_jwt_identity()

    pipeline = Pipeline(request)
    pipeline.add(ensureJson)
    pipeline.add(ensureParam, [request, 'receiver'])
    pipeline.add(ensureParam, [request, 'phonenumber'])
    pipeline.add(ensureParam, [request, 'address'])

    broken, retvs = pipeline.run()
    if broken:
        return retvs
    _, receiver, phonenumber, address = retvs
    addr = Address(current_user, receiver, phonenumber, address)
    sess = DBSession()
    sess.add(addr)
    sess.commit()

    user = sess.query(User).filter_by(id=current_user).first()
    if user.default_address_id is None:
        user.default_address_id = addr.id
        sess.commit()
    return jsonify(result=True,id=addr.id), 200

@bp.route("/del")
@jwt_required
def delete():
    current_user = get_jwt_identity()

    pipeline = Pipeline(request)
    pipeline.add(ensureJson)
    pipeline.add(ensureParam, [request, 'id'])

    broken, retvs = pipeline.run()
    if broken:
        return retvs
    _, _id = retvs

    sess = DBSession()
    addr = sess.query(Address).filter_by(id=_id).first()
    
    user = sess.query(User).filter_by(id=current_user).first()
    if (addr != None) and (addr.owner_id == current_user):
        if user.default_address_id == addr.id:
            user.default_address_id = None
            sess.commit()
        sess.delete(addr)
        sess.commit()
        return jsonify(result=True), 200
    return jsonify(result=False,reson="BAD ADDRESS ID"), 200

@bp.route("/update")
@jwt_required
def update():
    current_user = get_jwt_identity()

    pipeline = Pipeline(request)
    pipeline.add(ensureJson)
    pipeline.add(ensureParam, [request, 'id'])
    pipeline.add(ensureParam, [request, 'receiver'])
    pipeline.add(ensureParam, [request, 'phonenumber'])
    pipeline.add(ensureParam, [request, 'address'])

    broken, retvs = pipeline.run()
    if broken:
        return retvs
    _, _id, receiver, phonenumber, address = retvs

    sess = DBSession()
    addr = sess.query(Address).filter_by(id=_id).first()
    user = sess.query(User).filter_by(id=current_user).first()
    if (addr != None) and (addr.owner_id == current_user):
        addr.receiver = receiver
        addr.phonenumber = phonenumber
        addr.address = address
        sess.commit()
        return jsonify(result=True), 200
    return jsonify(result=False,reson="BAD ADDRESS ID"), 200
