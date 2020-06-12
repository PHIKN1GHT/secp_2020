from server import app
from flask import Blueprint, render_template, jsonify
from utils import getAllFilenamesWithPath
import os

bp = Blueprint('fake',__name__)

img_files = [a.split('\\')[-1] for a in getAllFilenamesWithPath(os.path.join('resource','image'))]
print(img_files)

@bp.route("/static/products")
def staticProducts():
    products = []
    for i in range(0,50):
        products.append(
            {
                'title': '商品'+str(0),
                'thumbnail': '/resource/temp/images/'+img_files[i % len(img_files)],
                'price': i
            }
        )
    return jsonify(products)

'''
id = db.Column(db.Integer, primary_key=True)
    title = db.Column(db.UnicodeText, unique=False, nullable=False, default="")
    thumbnail = db.Column(db.String(256))
    remain = db.Column(db.BigInteger, unique=False, nullable=False, default=0)
    price = db.Column(db.BigInteger, unique=False, nullable=False, default=0)
    limit = db.Column(db.BigInteger, unique=False, nullable=False, default=0)
    description = db.Column(db.UnicodeText, unique=False, nullable=False, default="")
    visible = db.Column(db.Boolean, unique=False, nullable=False, default=True)
    createTime = db.Column(db.Time)
    creator_id = db.Column(db.Integer, db.ForeignKey(User.id), nullable=False)
    creator = db.relationship('User', foreign_keys='Description.creator_id')
'''
