# -*- coding: utf-8 -*-  
from server import db
from config import OPERATORNAME, OPERATORPSWD, SECRETKEY
import model, random
from model import User, Product, Description
import random

def create_initial_accounts():
    db.session.add(User('SYSTEM').setPassword(SECRETKEY).setVisible(False))
    db.session.add(User(OPERATORNAME).setPassword(OPERATORPSWD).setVisible(False))
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

if __name__ == '__main__':
    create_initial_accounts()
    #add_test_product()






