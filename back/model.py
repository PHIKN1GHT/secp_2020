from server import db
from utils import encodePswd, tryLookUp
import datetime

class User(db.Model):
    id = db.Column(db.BigInteger, primary_key=True)
    stuId = db.Column(db.String(16), unique=True, index=True, nullable=False)
    name = db.Column(db.String(16), unique=False, index=True, nullable=False)
    password = db.Column(db.String(32), unique=False, index=False, nullable=False)
    email = db.Column(db.String(32), unique=True, nullable=False)
    citizenId = db.Column(db.String(32), unique=True, index=True, nullable=False)
    balance = db.Column(db.BigInteger, unique=False, nullable=False, default=0)
    visible = db.Column(db.Boolean, unique=False, nullable=False, default=True)
    createTime = db.Column(db.DateTime, nullable=False)

    def __init__(self, stuId, name, email, citizenId, balance):
        self.stuId = stuId
        self.name = name
        self.email = email
        self.citizenId = citizenId
        self.balance = balance
        self.createTime = datetime.datetime.now()
        self.setPassword("")
        self.setVisible(True)

    def setPassword(self, pswd):
        self.password = encodePswd(pswd)
        return self

    def setVisible(self, visible):
        self.visible = visible
        return self

    def __repr__(self):
        return '<User [%r] (%r)>' % (self.name, self.stuId)

class Storehouse(db.Model):
    id = db.Column(db.BigInteger, primary_key=True)
    name = db.Column(db.String(16), unique=True, index=True, nullable=False)
    address = db.Column(db.String(64), unique=True, index=True, nullable=False)
    phoneNumber = db.Column(db.String(16), unique=True, index=True, nullable=False)

    def __init__(self, name, address, phoneNumber):
        self.name = name
        self.address = address
        self.phoneNumber = phoneNumber

    def __repr__(self):
        return '<Storehouse [%r] (%r)>' % (self.name)

class Manager(db.Model):
    id = db.Column(db.BigInteger, primary_key=True)
    managerId = db.Column(db.String(16), unique=True, index=True, nullable=False)
    name = db.Column(db.String(16), unique=False, index=True, nullable=False)
    password = db.Column(db.String(32), unique=False, index=False, nullable=False)
    email = db.Column(db.String(32), unique=True, nullable=False)
    phoneNumber = db.Column(db.String(16), unique=True, index=True, nullable=False)
    # balance = db.Column(db.BigInteger, unique=False, nullable=False, default=0)
    storehouse_id = db.Column(db.BigInteger, db.ForeignKey(Storehouse.id), nullable=False)
    storehouse = db.relationship('Storehouse', foreign_keys = 'Manager.storehouse_id')
    
    def __init__(self, managerId, name, email, phoneNumber, storehouse_id):
        self.managerId = managerId
        self.name = name
        self.email = email
        self.phoneNumber = phoneNumber
        # self.balance = balance
        self.storehouse_id = storehouse_id

    def setPassword(self, pswd):
        self.password = encodePswd(pswd)
        return self

    def __repr__(self):
        return '<User [%r] (%r)>' % (self.name, self.managerId)

class Permission(db.Model):
    id = db.Column(db.BigInteger, primary_key=True)
    name = db.Column(db.String(64), unique=True, index=True, nullable=False)

    def __init__(self, name):
        self.name = name

    def __repr__(self):
        return '<Permission [%r]>' % (self.name)

class Product(db.Model):
    id = db.Column(db.BigInteger, primary_key=True)
    name = db.Column(db.String(64), unique=False)
    category = db.Column(db.BigInteger, nullable=False, default=0)
    # 是否上架
    shelved = db.Column(db.Boolean, unique=False, nullable=False, default=False)
    # 是否归档（无效化）
    archived = db.Column(db.Boolean, unique=False, nullable=False, default=False)
    removed = db.Column(db.Boolean, unique=False, nullable=False, default=False)
    storehouse_id = db.Column(db.BigInteger, db.ForeignKey(Storehouse.id), nullable=False)
    storehouse = db.relationship('Storehouse', foreign_keys = 'Product.storehouse_id')

    def __init__(self, name, category, storehouse_id):
        self.name = name
        self.storehouse_id = storehouse_id
        self.category = category
    
    def __repr__(self):
        return '<Product %r>' % (self.name)

class Description(db.Model):
    id = db.Column(db.BigInteger, primary_key=True)
    title = db.Column(db.UnicodeText, unique=False, nullable=False, default="")
    thumbnail = db.Column(db.String(256), unique=False, nullable=True, default="")
    remain = db.Column(db.BigInteger, unique=False, nullable=False, default=0)
    price = db.Column(db.BigInteger, unique=False, nullable=False, default=0)
    limit = db.Column(db.BigInteger, unique=False, nullable=False, default=0)
    htmlDescription = db.Column(db.UnicodeText, unique=False, nullable=False, default="")
    removed = db.Column(db.Boolean, unique=False, nullable=False, default=False)
    active = db.Column(db.Boolean, unique=False, nullable=False, default=False)
    product_id = db.Column(db.BigInteger, db.ForeignKey(Product.id), nullable=True)
    product = db.relationship('Product', foreign_keys = 'Description.product_id')

    def __init__(self, jsondata, product_id):
        self.product_id = product_id
        self.modify(jsondata)

    def modify(self, jsondata):
        self.title = tryLookUp(jsondata, 'title')
        self.thumbnail = tryLookUp(jsondata, 'thumbnail')
        self.remain = tryLookUp(jsondata, 'remain', 0)
        self.price = tryLookUp(jsondata, 'price', 0)
        self.limit = tryLookUp(jsondata, 'limit', 0)
        self.htmlDescription = tryLookUp(jsondata, 'htmlDescription')

    def __repr__(self):
        return '<Description of [%r]>' % (self.name)

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

class Order(db.Model):
    id = db.Column(db.BigInteger, primary_key=True)

    creator_id = db.Column(db.BigInteger, db.ForeignKey(User.id), nullable=True)
    creator = db.relationship('User', foreign_keys='Order.creator_id')
    product_id = db.Column(db.BigInteger, db.ForeignKey(Product.id), nullable=True)
    product = db.relationship('Product', foreign_keys='Order.product_id')
    count = db.Column(db.BigInteger, unique=False, nullable=False, default=0)
    monoprice = db.Column(db.BigInteger, unique=False, nullable=False, default=0)
    virtual = db.Column(db.Boolean, unique=False, nullable=False, default=False)
    createTime = db.Column(db.DateTime)
    paid = db.Column(db.Boolean, unique=False, nullable=False, default=False)
    processed = db.Column(db.Boolean, unique=False, nullable=False, default=False)
    archived = db.Column(db.Boolean, unique=False, nullable=False, default=False)
    cancelled = db.Column(db.Boolean, unique=False, nullable=False, default=False)
    belonging_id = db.Column(db.BigInteger, db.ForeignKey("order.id"), nullable=True)
    belonging = db.relationship('Order', foreign_keys='Order.belonging_id')

    def __init__(self, creator_id, virtual=True):
        self.creator_id = creator_id
        self.virtual = virtual
        self.createTime = datetime.datetime.now()
    
    def fill(self, product_id, count, monoprice, belonging_id=None):
        self.virtual = False
        self.product_id = product_id
        self.count = count
        self.monoprice = monoprice
        self.belonging_id = belonging_id

    def cost(self):
        if not self.virtual:
            return self.count * self.monoprice
        suborders = Order.query.filter_by(belonging_id=self.id).all()
        return sum([order.cost() for order in suborders])

    def __repr__(self):
        return '<Order %r>' % (self.id)

class Payment(db.Model):
    id = db.Column(db.BigInteger, primary_key=True)
    payer_id = db.Column(db.BigInteger, db.ForeignKey(User.id), nullable=False)
    payer = db.relationship('User', foreign_keys='Payment.payer_id')
    payee_id = db.Column(db.BigInteger, db.ForeignKey(User.id), nullable=True)
    payee = db.relationship('User', foreign_keys='Payment.payee_id')
    order_id = db.Column(db.BigInteger, db.ForeignKey(Order.id), nullable=True)
    order = db.relationship('Order', foreign_keys = 'Payment.order_id')
    amount = db.Column(db.BigInteger, unique=False, nullable=False, default=0)
    createTime = db.Column(db.DateTime)

    def __init__(self, payer_id, order_id, amount):
        self.payer_id = payer_id
        self.order_id = order_id
        self.amount = amount
        self.createTime = datetime.datetime.now()

    def __repr__(self):
        return '<Payment %r>' % (self.createTime)

class SupplierOrder(db.Model):
    id = db.Column(db.BigInteger, primary_key=True)
    creator_id = db.Column(db.BigInteger, db.ForeignKey(Manager.id), nullable=False)
    creator = db.relationship('Manager', foreign_keys='SupplierOrder.creator_id')
    product_id = db.Column(db.BigInteger, db.ForeignKey(Product.id), nullable=False)
    product = db.relationship('Product', foreign_keys='SupplierOrder.product_id')
    storehouse_id = db.Column(db.BigInteger, db.ForeignKey(Storehouse.id), nullable=False)
    storehouse = db.relationship('Storehouse', foreign_keys='SupplierOrder.storehouse_id')
    count = db.Column(db.BigInteger, unique=False, nullable=False, default=0)
    # monoprice = db.Column(db.BigInteger, unique=False, nullable=False, default=0)
    # receiver = db.Column(db.String(16), unique=False, nullable=False)
    # phoneNumber = db.Column(db.String(16), unique=True, index=True, nullable=False)
    #是否是父订单
    # virtual = db.Column(db.Boolean, unique=False, nullable=False, default=False)
    createTime = db.Column(db.DateTime)
    paid = db.Column(db.Boolean, unique=False, nullable=False, default=False)
    accepted = db.Column(db.Boolean, unique=False, nullable=False, default=False)
    delivered = db.Column(db.Boolean, unique=False, nullable=False, default=False)
    confirmed = db.Column(db.Boolean, unique=False, nullable=False, default=False)
    rejected = db.Column(db.Boolean, unique=False, nullable=False, default=False)
    cancelled = db.Column(db.Boolean, unique=False, nullable=False, default=False)
    # belonging_id = db.Column(db.BigInteger, db.ForeignKey("SupplierOrder.id"), nullable=True)
    # belonging = db.relationship('SupplierOrder', foreign_keys='SupplierOrder.belonging_id')

    def __init__(self, creator_id):
        self.creator_id = creator_id
        # self.virtual = virtual
        self.createTime = datetime.datetime.now()
    
    def fill(self, product_id, storehouse_id, count):
        # self.virtual = False
        self.product_id = product_id
        self.storehouse_id = storehouse_id
        self.count = count
        # self.monoprice = monoprice
        # self.receiver = receiver
        # self.phoneNumber = phoneNumber
        # self.belonging_id = belonging_id

'''

'''
'''

'''


'''
class Volunteering(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    stuId = db.Column(db.String(512))
    name = db.Column(db.Integer)
    reason = db.Column(db.Integer)
    amount = db.Column(db.Integer)
    createTime = db.Column(db.Integer)

    def __init__(self, name):
        self.name = name

    def __repr__(self):
        return '<Order %r>' % (self.name)

class Tag(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.Integer)

    def __init__(self, name):
        self.name = name

    def __repr__(self):
        return '<Order %r>' % (self.name)

class Group(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.Integer)

    def __init__(self, name):
        self.name = name

    def __repr__(self):
        return '<Order %r>' % (self.name)

class PTag(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    product = db.Column(db.Integer)
    tag = db.Column(db.Integer)

    def __init__(self, name):
        self.name = name

    def __repr__(self):
        return '<Order %r>' % (self.name)

class PGroup(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    product = db.Column(db.Integer)
    group = db.Column(db.Integer)

    def __init__(self, name):
        self.name = name

    def __repr__(self):
        return '<Order %r>' % (self.name)

class UGroup(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    user = db.Column(db.Integer)
    group = db.Column(db.Integer)

    def __init__(self, name):
        self.name = name

    def __repr__(self):
        return '<Order %r>' % (self.name)


class UPermission(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    user = db.Column(db.Integer)
    permission = db.Column(db.Integer)

    def __init__(self, name):
        self.name = name

    def __repr__(self):
        return '<Order %r>' % (self.name)
'''

'''
15. 用户行为记录表(UBehavior)

用户行为主要指对商品的访问记录  

| 列名            | 数据类型 | 备注信息 |
| --------------- | -------- | -------- |
| id | 整数型 | 内部编号 |
| user | 整数型 | 用户编号（未登录则未空） |
| address | 字符串 | 访客的地址 |
| product | 整数型 | 查看的商品条目 |

'''
