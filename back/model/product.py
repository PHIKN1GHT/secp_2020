from utils import tryLookUp
from model import *

class Storehouse(db.Model):
    id = db.Column(db.BigInteger, primary_key=True)
    name = db.Column(db.String(16), unique=True, index=True, nullable=False)
    address = db.Column(db.String(64), unique=True, index=True, nullable=False)
    phoneNumber = db.Column(db.String(16), unique=True, index=True, nullable=False)
    manager_id = db.Column(db.BigInteger, db.ForeignKey(User.id), nullable=False)
    manager = db.relationship('User', foreign_keys = 'Storehouse.manager_id')

    def __init__(self, name, address, phoneNumber):
        self.name = name
        self.address = address
        self.phoneNumber = phoneNumber

    def __repr__(self):
        return '<Storehouse [%r]>' % (self.name)

class Product(db.Model):
    id = db.Column(db.BigInteger, primary_key=True)
    title = db.Column(db.String(64), unique=False, nullable=False, default="")
    thumbnail = db.Column(db.String(256), unique=False, nullable=True, default="")
    htmlDescription = db.Column(db.UnicodeText, unique=False, nullable=False, default="")
    remain = db.Column(db.BigInteger, unique=False, nullable=False, default=0)
    price = db.Column(db.Numeric(10,2), unique=False, nullable=False, default=0)
    unit = db.Column(db.String(16), unique=False, nullable=False, default="")
    category = db.Column(db.BigInteger, nullable=False, default=0)

    shelved = db.Column(db.Boolean, unique=False, nullable=False, default=False)
    archived = db.Column(db.Boolean, unique=False, nullable=False, default=False)

    storehouse_id = db.Column(db.BigInteger, db.ForeignKey(Storehouse.id), nullable=False)
    storehouse = db.relationship('Storehouse', foreign_keys = 'Product.storehouse_id')

    def __init__(self, title, category, storehouse_id):
        self.title = title
        self.category = category
        self.storehouse_id = storehouse_id
        
    def update(self, dictdata):
        self.title = tryLookUp(dictdata, 'title', '')
        self.thumbnail = tryLookUp(dictdata, 'thumbnail', '')
        self.htmlDescription = tryLookUp(dictdata, 'htmlDescription', '')
        self.remain = tryLookUp(dictdata, 'remain', 0)
        self.price = tryLookUp(dictdata, 'price', 0)
        self.unit = tryLookUp(dictdata, 'unit', '')
        self.category = tryLookUp(dictdata, 'category', 0)
        self.shelved = tryLookUp(dictdata, 'shelved', False)
        self.archived = tryLookUp(dictdata, 'archived', False)

    def __repr__(self):
        return '<Product [%r]>' % (self.title)

    def brief():
        return {
            "id": self.id,
            "title": self.title,
            "price": self.price,
            "unit": self.unit,
            "thumbnail": self.thumbnail
        }

    def detailed():
        return {
            'title': self.title,
            'thumbnail': self.thumbnail,
            'htmlDescription': self.htmlDescription,
            'remain': self.remain,
            'price': self.price,
            'unit': self.unit,
            'category': self.category,
            'shelved': self.shelved,
            'archived': self.archived
        }