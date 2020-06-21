from model import *
from server import DBSession

class Cart(db.Model):
    id = db.Column(db.BigInteger, primary_key=True)

    creator_id = db.Column(db.BigInteger, db.ForeignKey(User.id), nullable=False, unique=False)
    creator = db.relationship('User', foreign_keys = 'Cart.creator_id')

    product_id = db.Column(db.BigInteger, db.ForeignKey(Product.id), nullable=False, unique=False)
    product = db.relationship('Product', foreign_keys = 'Cart.product_id')
    
    count = db.Column(db.BigInteger, nullable=False)
    removed = db.Column(db.Boolean, nullable=False, default=False)

    def __init__(self, creator_id, product_id, count):
        self.creator_id = creator_id
        self.product_id = product_id
        self.count = count

    def __repr__(self):
        return '<Cart %r>' % (self.creater_id)


        