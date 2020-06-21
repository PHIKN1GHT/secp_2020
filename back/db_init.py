# -*- coding: utf-8 -*-  
from server import db
from config import OPERATORNAME, OPERATORPSWD, SECRETKEY
import model, random
from model import *
import random

def add_initial_accounts():
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

def add_storehouse():
    words = ['黄浦区','徐汇区','长宁区','静安区','普陀区','虹口区','杨浦区','浦东新区','闵行区','奉贤区']
    for word in words:
        name = word+' 仓库'
        address = 'address_'+word
        phone = 'phone_'+word
        db.session.add(Storehouse(name,address,phone,3,4))
        db.session.commit()

def add_catagories():
    catagories = {
        '时令水果': ['瓜类', '柑橘柚橙', '浆果莓类', '热带水果'],
        '蔬菜菌菇': ['特色鲜蔬', '豆类', '叶菜', '南北干货'],
        '肉蛋水产': ['猪肉', '牛肉', '禽肉', '蛋类'], 
        '乳品烘焙': ['西式面包', '冰激凌', '乳酸饮料', '冷藏鲜奶'],
    }
    for k, v in catagories.items():
        cate = Category(k)
        db.session.add(cate)
        db.session.commit()
        for subitem in v:
            db.session.add(Category(subitem, cate.id))
            db.session.commit()

import random
words = 'ABCDEFGHIJKLMNOPQRSTUVWXYZαβγδεζνξοπρσηθικλμτυφχψω'
def add_products():
    cates = Category.all()
    stors = Storehouse.all()
    for stor in stors:
        stor_id = Storehouse.query.filter_by(name=stor).first().id
        for k, v in cates.items():
            for subc in v:
                for i in range(5):
                    cate_id = Category.query.filter_by(name=subc).first().id
                    title = '商品 ' + random.sample(words, 1)[0]
                    prod = Product(title, cate_id, stor_id)
                    datadict = {
                        'thumbnail': 'https://cdn.cnbj1.fds.api.mi-img.com/mi-mall/afa28e7477639537f556eb46e3ca5f43.jpeg',
                        'htmlDescription': '面体优化升级：使用全新三层夹心面体，真空和面，全进口设备工艺，8道压延，使面体口感更加Q弹润滑，外软内硬，口感更好吃！',
                        'remain': random.randint(2, 233),
                        'price': random.uniform(0.01, 100.00),
                        'unit': '个',
                        'shelved': True,
                        'archived': False,
                    }
                    prod.update(datadict)
                    db.session.add(prod)
                    db.session.commit()

def init_database():
    add_initial_accounts()
    add_storehouse()
    add_catagories()
    add_products()
    add_order()
    add_supplierOrder()

def add_order():
    for num in range(0,10):
        creator_id=random.randint(5,14)
        storehouse_id=random.randint(1,2)
        order=Order(creator_id,storehouse_id)
        db.session.add(order)
        db.session.commit()
        for num1 in range(0,5):
            subord=Order(creator_id,storehouse_id)
            product_id=random.randint(1,800)
            product = Product.query.filter_by(id=product_id).first()
            subord.fill(product_id,random.randint(1,10),product.price,order.id)
            db.session.add(subord)
            db.session.commit()

    for num in range(0,10):
        creator_id=random.randint(5,14)
        storehouse_id=random.randint(1,2)
        order=Order(creator_id,storehouse_id)
        order.paid=True
        db.session.add(order)
        db.session.commit()
        for num1 in range(0,5):
            subord=Order(creator_id,storehouse_id)
            product_id=random.randint(1,800)
            product = Product.query.filter_by(id=product_id).first()
            subord.fill(product_id,random.randint(1,10),product.price,order.id)
            db.session.add(subord)
            db.session.commit()

    for num in range(0,10):
        creator_id=random.randint(5,14)
        storehouse_id=random.randint(1,2)
        order=Order(creator_id,storehouse_id)
        order.paid=True
        order.accepted=True
        db.session.add(order)
        db.session.commit()
        for num1 in range(0,5):
            subord=Order(creator_id,storehouse_id)
            product_id=random.randint(1,800)
            product = Product.query.filter_by(id=product_id).first()
            subord.fill(product_id,random.randint(1,10),product.price,order.id)
            db.session.add(subord)
            db.session.commit()

    for num in range(0,10):
        creator_id=random.randint(5,14)
        storehouse_id=random.randint(1,2)
        order=Order(creator_id,storehouse_id)
        order.paid=True
        order.accepted=True
        order.delivered=True
        db.session.add(order)
        db.session.commit()
        for num1 in range(0,5):
            subord=Order(creator_id,storehouse_id)
            product_id=random.randint(1,800)
            product = Product.query.filter_by(id=product_id).first()
            subord.fill(product_id,random.randint(1,10),product.price,order.id)
            db.session.add(subord)
            db.session.commit()

    for num in range(0,10):
        creator_id=random.randint(5,14)
        storehouse_id=random.randint(1,2)
        order=Order(creator_id,storehouse_id)
        order.paid=True
        order.accepted=True
        order.delivered=True
        order.archived=True
        db.session.add(order)
        db.session.commit()
        for num1 in range(0,5):
            subord=Order(creator_id,storehouse_id)
            product_id=random.randint(1,800)
            product = Product.query.filter_by(id=product_id).first()
            subord.fill(product_id,random.randint(1,10),product.price,order.id)
            db.session.add(subord)
            db.session.commit()

    for num in range(0,10):
        creator_id=random.randint(5,14)
        storehouse_id=random.randint(1,2)
        order=Order(creator_id,storehouse_id)
        order.cancelled=True
        db.session.add(order)
        db.session.commit()
        for num1 in range(0,5):
            subord=Order(creator_id,storehouse_id)
            product_id=random.randint(1,800)
            product = Product.query.filter_by(id=product_id).first()
            subord.fill(product_id,random.randint(1,10),product.price,order.id)
            db.session.add(subord)
            db.session.commit()

def add_supplierOrder():
    for num in range(0,10):
        sup=SupplierOrder(3)
        storehouse_id=random.randint(1,2)
        sup.fill(random.randint(1,800),storehouse_id,random.randint(100,1000))
        db.session.add(sup)
        db.session.commit()

    for num in range(0,10):
        sup=SupplierOrder(3)
        storehouse_id=random.randint(1,2)
        sup.fill(random.randint(1,800),storehouse_id,random.randint(100,1000))
        sup.paid=True
        db.session.add(sup)
        db.session.commit()

    for num in range(0,10):
        sup=SupplierOrder(3)
        storehouse_id=random.randint(1,2)
        sup.fill(random.randint(1,800),storehouse_id,random.randint(100,1000))
        sup.paid=True
        sup.accept=True
        db.session.add(sup)
        db.session.commit()

    for num in range(0,10):
        sup=SupplierOrder(3)
        storehouse_id=random.randint(1,2)
        sup.fill(random.randint(1,800),storehouse_id,random.randint(100,1000))
        sup.paid=True
        sup.accepted=True
        sup.delivered=True
        db.session.add(sup)
        db.session.commit()

    for num in range(0,10):
        sup=SupplierOrder(3)
        storehouse_id=random.randint(1,2)
        sup.fill(random.randint(1,800),storehouse_id,random.randint(100,1000))
        sup.paid=True
        sup.accepted=True
        sup.delivered=True
        sup.confirmed=True
        db.session.add(sup)
        db.session.commit()    

    for num in range(0,10):
        sup=SupplierOrder(3)
        storehouse_id=random.randint(1,2)
        sup.fill(random.randint(1,800),storehouse_id,random.randint(100,1000))
        sup.paid=True
        sup.accepted=True
        sup.delivered=True
        sup.rejected=True
        db.session.add(sup)
        db.session.commit()    
    
    for num in range(0,10):
        sup=SupplierOrder(3)
        storehouse_id=random.randint(1,2)
        sup.fill(random.randint(1,800),storehouse_id,random.randint(100,1000))
        sup.cancelled=True
        db.session.add(sup)
        db.session.commit()    

if __name__ == '__main__':
    # init_database()
    # add_products()
    # create_catagories()
    # print(Category.all())
    # print(Category.query.filter_by(title="乳品烘焙").first().children())
    # create_initial_accounts()
    
    #add_test_storehouse()
    # add_test_product()
    
    add_order()
    # add_supplierOrder()