from server import db
from utils import encodePswd, tryLookUp
import datetime


class User(db.Model):
    id = db.Column(db.BigInteger, primary_key=True)
    username = db.Column(db.String(16), unique=True, index=True, nullable=False)
    password = db.Column(db.String(32), unique=False, index=False, nullable=False)
    createTime = db.Column(db.DateTime, nullable=False)
    isManager = db.Column(db.Boolean, unique=False, nullable=False, default=False)
    isOperator = db.Column(db.Boolean, unique=False, nullable=False, default=False)

    def __init__(self, username):
        self.username = username
        self.createTime = datetime.datetime.now()
        self.setPassword("")
        self.setVisible(True)

    def setPassword(self, pswd):
        self.password = encodePswd(pswd)
        return self

    def setVisible(self, visible):
        self.visible = visible
        return self

    def getUserType(self):
        if self.isManager:
            return 'manager'
        if self.isOperator:
            return 'operator'
        return 'customer'

    def __repr__(self):
        return '<User [%r] as [%r]>' % (self.username, self.getUserType())

class Address(db.Model):
    id = db.Column(db.BigInteger, primary_key=True)

    owner_id = db.Column(db.BigInteger, db.ForeignKey(User.id), nullable=False, unique=False)
    owner = db.relationship('User', foreign_keys = 'Address.owner_id')

    receiver = db.Column(db.String(32), unique=False, index=True, nullable=False)
    phonenumber = db.Column(db.String(32), unique=False, index=True, nullable=False)
    address = db.Column(db.String(64), unique=False, index=True, nullable=False)

    def __init__(self, owner_id, receiver, phonenumber, address):
        self.owner_id = owner_id
        self.receiver = receiver
        self.phonenumber = phonenumber
        self.address = address

    def __repr__(self):
        return '<Address %r>' % (self.creater_id)

# User.default_address_id = db.Column(db.BigInteger, db.ForeignKey(Address.id), nullable=True, unique=False)
# User.default_address = db.relationship('Address', foreign_keys = 'User.default_address_id')