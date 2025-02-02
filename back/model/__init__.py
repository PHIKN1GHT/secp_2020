from model.account import *
from model.product import *
from model.cart import *

from server import db, DBSession
from utils import encodePswd, tryLookUp
import datetime

class Order(db.Model):
    id = db.Column(db.BigInteger, primary_key=True)

    creator_id = db.Column(db.BigInteger, db.ForeignKey(User.id), nullable=True)
    creator = db.relationship('User', foreign_keys='Order.creator_id')
    product_id = db.Column(db.BigInteger, db.ForeignKey(Product.id), nullable=True)
    product = db.relationship('Product', foreign_keys='Order.product_id')
    #storehouse_id = db.Column(db.BigInteger, db.ForeignKey(Storehouse.id), nullable=False)
    #storehouse = db.relationship('Storehouse', foreign_keys='Order.storehouse_id')
    count = db.Column(db.BigInteger, unique=False, nullable=False, default=0)
    monoprice = db.Column(db.Numeric(10,2), unique=False, nullable=False, default=0)
    virtual = db.Column(db.Boolean, unique=False, nullable=False, default=False)
    createTime = db.Column(db.DateTime)
    paid = db.Column(db.Boolean, unique=False, nullable=False, default=False)
    accepted = db.Column(db.Boolean, unique=False, nullable=False, default=False)
    delivered = db.Column(db.Boolean, unique=False, nullable=False, default=False)
    #archived = db.Column(db.Boolean, unique=False, nullable=False, default=False)
    cancelled = db.Column(db.Boolean, unique=False, nullable=False, default=False)
    belonging_id = db.Column(db.BigInteger, db.ForeignKey("order.id"), nullable=True)
    belonging = db.relationship('Order', foreign_keys='Order.belonging_id')
    receiver = db.Column(db.String(32), unique=False, nullable=True, default="")
    phonenumber = db.Column(db.String(32), unique=False, nullable=True, default="")
    address = db.Column(db.String(64), unique=False, nullable=True, default="")

    # address_id = db.Column(db.BigInteger, db.ForeignKey("address.id"), nullable=True)
    # address = db.relationship('Order', foreign_keys='Order.address_id')

    def __init__(self, creator_id, virtual=True):
        self.creator_id = creator_id
        self.virtual = virtual
        self.createTime = datetime.datetime.now()
        self.setAddress('','','')
    
    def fill(self, product_id, count, monoprice, belonging_id=None):
        self.virtual = False
        self.product_id = product_id
        self.count = count
        self.monoprice = monoprice
        self.belonging_id = belonging_id

    def setAddress(self, address, receiver, phonenumber):
        self.address = address
        self.receiver = receiver
        self.phonenumber = phonenumber

    def cost(self):
        if not self.virtual:
            return self.count * self.monoprice
        sess = DBSession()
        suborders = sess.query(Order).filter_by(belonging_id=self.id).all()
        return sum([order.cost() for order in suborders])

    def status(self):
        if self.cancelled:
            return "已撤销"
        elif self.accepted:
            return "已收货"
        elif self.delivered:
            return "待收货"
        elif self.paid:
            return "待发货"
        else:
            return "已创建"

    def __repr__(self):
        return '<Order %r>' % (self.id)

class SupplierOrder(db.Model):
    id = db.Column(db.BigInteger, primary_key=True)
    creator_id = db.Column(db.BigInteger, db.ForeignKey(User.id), nullable=False)
    creator = db.relationship('User', foreign_keys='SupplierOrder.creator_id')
    product_id = db.Column(db.BigInteger, db.ForeignKey(Product.id), nullable=False)
    product = db.relationship('Product', foreign_keys='SupplierOrder.product_id')
    storehouse_id = db.Column(db.BigInteger, db.ForeignKey(Storehouse.id), nullable=False)
    storehouse = db.relationship('Storehouse', foreign_keys='SupplierOrder.storehouse_id')
    count = db.Column(db.BigInteger, unique=False, nullable=False, default=0)
    createTime = db.Column(db.DateTime)
    #paid = db.Column(db.Boolean, unique=False, nullable=False, default=False)
    accepted = db.Column(db.Boolean, unique=False, nullable=False, default=False)
    delivered = db.Column(db.Boolean, unique=False, nullable=False, default=False)
    confirmed = db.Column(db.Boolean, unique=False, nullable=False, default=False)
    rejected = db.Column(db.Boolean, unique=False, nullable=False, default=False)
    #cancelled = db.Column(db.Boolean, unique=False, nullable=False, default=False)
    rejectReason = db.Column(db.String(64), unique=False, nullable=True)

    def __init__(self, creator_id):
        self.creator_id = creator_id
        self.createTime = datetime.datetime.now()
    
    def fill(self, product_id, storehouse_id, count):
        self.product_id = product_id
        self.storehouse_id = storehouse_id
        self.count = count

    def status(self):
        if self.rejected:
            return '已拒绝'
        elif self.confirmed:
            return '已收货'
        elif self.delivered:
            return '已发货'
        elif self.accepted:
            return '已接受'
        else:
            return '已创建'

'''
这样的话 原来讨论的只有三个状态 现在要5个了
已创建 已接受 已发货 已拒绝 已收货
第一个是仓库经理操作后的可达状态
中间三个是供货商操作后的可达状态
后面一个是仓库管理员操作后的可达状态
'''
'''

'''


'''

class Permission(db.Model):
    id = db.Column(db.BigInteger, primary_key=True)
    name = db.Column(db.String(64), unique=True, index=True, nullable=False)

    def __init__(self, name):
        self.name = name

    def __repr__(self):
        return '<Permission [%r]>' % (self.name)

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


class Manager(db.Model):
    id = db.Column(db.BigInteger, primary_key=True)
    managerId = db.Column(db.String(16), unique=True, index=True, nullable=False)
    name = db.Column(db.String(16), unique=False, index=True, nullable=False)
    password = db.Column(db.String(32), unique=False, index=False, nullable=False)
    # email = db.Column(db.String(32), unique=True, nullable=False)
    # phoneNumber = db.Column(db.String(16), unique=True, index=True, nullable=False)
    # balance = db.Column(db.BigInteger, unique=False, nullable=False, default=0)
    storehouse_id = db.Column(db.BigInteger, db.ForeignKey(Storehouse.id), nullable=False)
    storehouse = db.relationship('Storehouse', foreign_keys = 'Manager.storehouse_id')
    
    def __init__(self, managerId, name, storehouse_id):
        self.managerId = managerId
        self.name = name
        # self.email = email
        # self.phoneNumber = phoneNumber
        # self.balance = balance
        self.storehouse_id = storehouse_id

    def setPassword(self, pswd):
        self.password = encodePswd(pswd)
        return self

    def __repr__(self):
        return '<User [%r] (%r)>' % (self.name, self.managerId)

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

