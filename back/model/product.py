from utils import tryLookUp
from model import *
from server import DBSession

class Storehouse(db.Model):
    id = db.Column(db.BigInteger, primary_key=True)
    name = db.Column(db.String(16), unique=True, index=True, nullable=False)
    address = db.Column(db.String(64), unique=True, index=True, nullable=False)
    phoneNumber = db.Column(db.String(16), unique=True, index=True, nullable=False)
    manager_id = db.Column(db.BigInteger, db.ForeignKey(User.id), nullable=False)
    manager = db.relationship('User', foreign_keys = 'Storehouse.manager_id')
    operator_id = db.Column(db.BigInteger, db.ForeignKey(User.id), nullable=True)
    operator = db.relationship('User', foreign_keys = 'Storehouse.operator_id') 

    def __init__(self, name, address, phoneNumber, manager_id, operator_id):
        self.name = name
        self.address = address
        self.phoneNumber = phoneNumber
        self.manager_id = manager_id
        self.operator_id = operator_id

    def __repr__(self):
        return '<Storehouse [%r]>' % (self.name)
    
    @classmethod 
    def all(cls):
        sess = DBSession()
        storehouses = sess.query(Storehouse).all()
        return [s.name for s in storehouses]

class Category(db.Model):
    id = db.Column(db.BigInteger, primary_key=True)
    name = db.Column(db.String(64), unique=True, nullable=False, default="")

    def __init__(self, name = "", parent_id=None):
        self.name = name
        self.parent_id = parent_id

    def __repr__(self):
        return '<Category [%r] >' % (self.name)
    
    def children(self):
        sess = DBSession()
        categories = sess.query(Category).filter_by(parent_id=self.id).all()
        return [category.name for category in categories]
        #return 

    @classmethod 
    def all(cls):
        sess = DBSession()
        categories = sess.query(Category).filter_by(parent_id=None).all()
        total = {}
        for category in categories:
            total[category.name] = category.children()
        return total

Category.parent_id = db.Column(db.BigInteger, db.ForeignKey(Category.id), nullable=True)
Category.parent = db.relationship('Category', foreign_keys = 'Category.parent_id')

class Product(db.Model):
    id = db.Column(db.BigInteger, primary_key=True)
    title = db.Column(db.String(64), unique=False, nullable=False, default="")
    thumbnail = db.Column(db.String(256), unique=False, nullable=True, default="")
    htmlDescription = db.Column(db.UnicodeText, unique=False, nullable=False, default="")
    remain = db.Column(db.BigInteger, unique=False, nullable=False, default=0)
    price = db.Column(db.Numeric(10,2), unique=False, nullable=False, default=0)
    unit = db.Column(db.String(16), unique=False, nullable=False, default="")

    shelved = db.Column(db.Boolean, unique=False, nullable=False, default=False)
    archived = db.Column(db.Boolean, unique=False, nullable=False, default=False)

    category_id = db.Column(db.BigInteger, db.ForeignKey(Category.id), nullable=False, unique=False)
    category = db.relationship('Category', foreign_keys = 'Product.category_id')
    storehouse_id = db.Column(db.BigInteger, db.ForeignKey(Storehouse.id), nullable=False, unique=False)
    storehouse = db.relationship('Storehouse', foreign_keys = 'Product.storehouse_id')

    def __init__(self, title, category_id, storehouse_id):
        self.title = title
        self.category_id = category_id
        self.storehouse_id = storehouse_id
        
    def update(self, dictdata):
        self.title = tryLookUp(dictdata, 'title', self.title)
        self.thumbnail = tryLookUp(dictdata, 'thumbnail', self.thumbnail)
        self.htmlDescription = tryLookUp(dictdata, 'htmlDescription', self.htmlDescription)
        self.remain = tryLookUp(dictdata, 'remain', self.remain)
        self.price = tryLookUp(dictdata, 'price', self.price)
        self.unit = tryLookUp(dictdata, 'unit', self.unit)
        self.shelved = tryLookUp(dictdata, 'shelved', self.shelved)
        self.archived = tryLookUp(dictdata, 'archived', self.archived)

    def __repr__(self):
        return '<Product [%r]>' % (self.title)

    def brief(self):
        return {
            "id": self.id,
            "title": self.title,
            "price": str(self.price),
            "unit": self.unit,
            "thumbnail": self.thumbnail
        }

    def detailed(self):
        return {
            'title': self.title,
            'thumbnail': self.thumbnail,
            'htmlDescription': self.htmlDescription,
            'remain': self.remain,
            'price': str(self.price),
            'unit': self.unit,
            'category': self.category.value.name if self.category else self.category_id,
            'storehouse': self.storehouse.value.name if self.storehouse else self.storehouse_id,
            'shelved': self.shelved,
            'archived': self.archived
        }
