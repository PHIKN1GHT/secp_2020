from testing.fixture import client, check   
from config import OPERATORNAME, OPERATORPSWD
from flask import jsonify
from functools import partial

token = ''
wrong_token = ''
# Test allProduct()

'''
def test_allProduct_failed_wrong_manager_id(client):
    global wrong_token
    response = client.post('/api/account/loginAs', json={
        "username": 10130497
    })
    wrong_token = response.json['access_token']
    response = client.post('/api/product/all',headers={
        'Authorization': 'Bearer '+ wrong_token})
    assert b'Bad manager_id' in response.data
'''

def test_allProduct_failed_no_json(client):
    global token
    response = client.post('/api/account/loginAs', json={
        "username": 10109062
    })
    token = response.json['access_token']
    response = client.post('/api/product/all',headers={
        'Authorization': 'Bearer '+ token})
    assert b'Missing JSON in request' in response.data

def test_allProduct_failed_no_storehouse_id(client):
    response = client.post('/api/product/all',headers={
        'Authorization': 'Bearer '+ token},
    json={
        "storehouse": 1
    })
    assert b'Missing storehouse_id parameter' in response.data

def test_allProduct_failed_wrong_storehouse_id(client):
    response = client.post('/api/product/all',headers={
        'Authorization': 'Bearer '+ token},
    json={
        "storehouse_id":99
    })
    assert b'Bad storehouseId' in response.data

def test_allProduct_success(client):
    response = client.post('/api/product/all',headers={
        'Authorization': 'Bearer '+ token},
    json={
        "storehouse_id": 1
    })
    products = response.json.get('products')
    assert isinstance(products, list)

# Test productDetail()

def test_productDetail_failed_no_json(client):
    response = client.post('/api/product/detail',headers={
        'Authorization': 'Bearer '+ token})
    assert b'Missing JSON in request' in response.data

def test_productDetail_failed_no_product_id(client):
    response = client.post('/api/product/detail',headers={
        'Authorization': 'Bearer '+ token},
    json={
        "product": 3
    })
    assert b'Missing id parameter' in response.data

def test_productDetail_failed_wrong_product_id(client):
    response = client.post('/api/product/detail',headers={
        'Authorization': 'Bearer '+ token},
    json={
        "id":999
    })
    assert b'Bad productId' in response.data

'''
def test_productDetail_failed_wrong_manager_id(client):
    response = client.post('/api/product/detail',headers={
        'Authorization': 'Bearer '+ wrong_token})
    assert b'Bad manager_id' in response.data
'''



def test_productDetail_success(client):
    response = client.post('/api/product/detail',headers={
        'Authorization': 'Bearer '+ token},
    json={
        "id":15
    })
    product = response.json.get('product')
    assert product

# Test createProduct()
def test_createProduct_failed_wrong_manager_id(client):
    global wrong_token
    response = client.post('/api/account/loginAs', json={
        "username": 10130497
    })
    wrong_token = response.json['access_token']
    response = client.post('/api/product/create',headers={
        'Authorization': 'Bearer '+ wrong_token})
    assert b'Bad manager_id' in response.data

def test_createProduct_failed_no_json(client):
    response = client.post('/api/product/create',headers={
        'Authorization': 'Bearer '+ token})
    assert b'Missing JSON in request' in response.data

def test_createProduct_failed_no_title(client):
    response = client.post('/api/product/create',headers={
        'Authorization': 'Bearer '+ token},
    json={
        "noTitle":"wow"
    })
    assert b'Missing title parameter' in response.data

def test_createProduct_failed_no_category_id(client):
    response = client.post('/api/product/create',headers={
        'Authorization': 'Bearer '+ token},
    json={
        "title":"test create a product"
    })
    assert b'Missing category_id parameter' in response.data

def test_createProduct_failed_no_storehouse_id(client):
    response = client.post('/api/product/create',headers={
        'Authorization': 'Bearer '+ token},
    json={
        "title":"test create a product",
        "category_id":1
    })
    assert b'Missing storehouse_id parameter' in response.data

def test_createProduct_failed_no_dictdata(client):
    response = client.post('/api/product/create',headers={
        'Authorization': 'Bearer '+ token},
    json={
        "title":"test create a product",
        "category_id":1,
        "storehouse_id":1,
    })
    assert b'Missing dictdata parameter' in response.data

def test_createProduct_succeed(client):
    response = client.post('/api/product/create',headers={
        'Authorization': 'Bearer '+ token},
    json={
        "title":"test create a product",
        "category_id":1,
        "storehouse_id":1,
        "dictdata":{
            "title":"test create a product",
            "thumbnail":"test",
            "htmlDescription":"test",
            "remain":1,
            "price":1.01,
            "unit":"test",
            "shelved":False,
            "archived":False
        }
    })
    isCreated = response.json.get('isCreated')
    assert isCreated == True

# Test updateProduct()
def test_updateProduct_failed_wrong_manager_id(client):
    response = client.post('/api/product/update',headers={
        'Authorization': 'Bearer '+ wrong_token})
    assert b'Bad manager_id' in response.data

def test_updateProduct_failed_no_json(client):
    response = client.post('/api/product/update',headers={
        'Authorization': 'Bearer '+ token})
    assert b'Missing JSON in request' in response.data

def test_updateProduct_failed_no_product_id(client):
    response = client.post('/api/product/update',headers={
        'Authorization': 'Bearer '+ token},
    json={
        "product":1
    })
    assert b'Missing product_id parameter' in response.data

def test_updateProduct_failed_no_dictdata(client):
    response = client.post('/api/product/update',headers={
        'Authorization': 'Bearer '+ token},
    json={
        "product_id":1
    })
    assert b'Missing dictdata parameter' in response.data

def test_updateProduct_success(client):
    response = client.post('/api/product/update',headers={
        'Authorization': 'Bearer '+ token},
    json={
        "product_id":1,
        "dictdata":{
            "title":"test update a product",
            "thumbnail":"test2",
            "htmlDescription":"test2",
            "remain":1,
            "price":1.01,
            "unit":"test2",
            "shelved":False,
            "archived":False
        }
    })
    isUpdated = response.json.get('isUpdated')
    assert isUpdated == True

# Test statistics()
def test_statistics_failed_wrong_manager_id(client):
    response = client.post('/api/product/statistics',headers={
        'Authorization': 'Bearer '+ wrong_token})
    assert b'Bad manager_id' in response.data

def test_statistics_failed_no_json(client):
    response = client.post('/api/product/statistics',headers={
        'Authorization': 'Bearer '+ token})
    assert b'Missing JSON in request' in response.data

def test_statistics_failed_no_storehouse_id(client):
    response = client.post('/api/product/statistics',headers={
        'Authorization': 'Bearer '+ token},
    json={
        "storehouse":3
    })
    assert b'Missing storehouse_id parameter' in response.data

def test_statistics_failed_bad_storehouse_id(client):
    response = client.post('/api/product/statistics',headers={
        'Authorization': 'Bearer '+ token},
    json={
        "storehouse_id":11
    })
    assert b'Bad storehouseId' in response.data

def test_statistics_failed_no_order_record(client):
    response = client.post('/api/product/statistics',headers={
        'Authorization': 'Bearer '+ token},
    json={
        "storehouse_id":3
    })
    assert b'No order record' in response.data

def test_statistics_success(client):
    response = client.post('/api/product/statistics',headers={
        'Authorization': 'Bearer '+ token},
    json={
        "storehouse_id":1
    })
    title_count = response.json.get("title_count")
    assert title_count