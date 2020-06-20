# -*- coding: utf-8 -*-  
from server import db
from config import OPERATORNAME, OPERATORPSWD, SECRETKEY
import model, random
from model import *
import random

def create_initial_accounts():
    db.session.add(User('SYSTEM').setPassword(SECRETKEY).setVisible(False))
    db.session.add(User(OPERATORNAME).setPassword(OPERATORPSWD).setVisible(False))
    db.session.add(User('10109062').setPassword('12345678').setIsManager(True))
    db.session.add(User('10130497').setPassword('12345678').setIsOperator(True))
    db.session.commit()
    words = '0123456789'
    for word in words:
        name = 'User'+word
        db.session.add(User(name).setPassword('12345678'))
        db.session.commit()

def add_test_product():
    words = 'ABCDEFGHIJKLMNOPQRSTUVWXYZαβγδεζνξοπρσηθικλμτυφχψω'
    for word in words:
        title = '便当套餐组合' + word
        pro = Product(title)
        pro.shelved = True
        db.session.add(pro)
        db.session.commit()
        des_json = {'title':title, 'thumbnail': "http://127.0.0.1:2333/resource/image/e5697883db88400788cf5e9272291ccf",'htmlDescription': "面体优化升级：使用全新三层夹心面体，真空和面，全进口设备工艺，8道压延，使面体口感更加Q弹润滑，外软内硬，口感更好吃！",'remain': random.randint(0,3), 'price': random.randint(20,2000), 'limit': random.randint(1,5)}
        des = Description(des_json,pro.id)
        des.active = True
        db.session.add(des)
        db.session.commit()

def add_test_storehouse():
    words = '0123456789'
    for word in words:
        name = 'storehouse'+word
        address = 'address'+word
        phone = 'phone'+word
        db.session.add(Storehouse(name,address,phone,3))
        db.session.commit()

def add_test_order():
    creator_id=random.randint(5,14)
    order=Order(creator_id,1)
    db.session.add(order)
    db.session.commit()
    for num in range(0,5):
        subord=Order(creator_id,1)
        subord.fill(random.randint(1,20),random.randint(1,10),random.randint(1,100),order.id)
        db.session.add(subord)
        db.session.commit()

def add_test_supplierOrder():
    for num in range(0,5):
        sup=SupplierOrder(3)
        sup.fill(random.randint(1,20),1,random.randint(100,1000))
        db.session.add(sup)
        db.session.commit()


if __name__ == '__main__':
    # create_initial_accounts()
    #add_test_product()
    # add_test_storehouse()
    add_test_order()
    # add_test_supplierOrder()







