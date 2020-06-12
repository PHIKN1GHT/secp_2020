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
