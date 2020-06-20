from testing.fixture import client, check   
from config import OPERATORNAME, OPERATORPSWD
from flask import jsonify
from functools import partial

token = ''
wrong_token = ''
# Test allProduct()
def test_allProduct_failed_wrong_manager_id(client):
    global wrong_token
    response = client.post('/api/account/loginAs', json={
        "username": 10130497
    }, headers={'Origin': 'SALT'})
    wrong_token = response.json['access_token']
    response = client.post('/api/product/all',headers={
        'Authorization': 'Bearer '+ wrong_token,
        'Origin': 'SALT'})
    assert b'Bad manager_id' in response.data

def test_allProduct_failed_no_json(client):
    global token
    response = client.post('/api/account/loginAs', json={
        "username": 10109062
    }, headers={'Origin': 'SALT'})
    token = response.json['access_token']
    response = client.post('/api/product/all',headers={
        'Authorization': 'Bearer '+ token,
        'Origin': 'SALT'})
    assert b'Missing JSON in request' in response.data

def test_allProduct_failed_no_storehouse_id(client):
    response = client.post('/api/product/all',headers={
        'Authorization': 'Bearer '+ token,
        'Origin': 'SALT'},
    json={
        "storehouse":1
    })
    assert b'Missing storehouse_id parameter' in response.data

def test_allProduct_failed_wrong_storehouse_id(client):
    response = client.post('/api/product/all',headers={
        'Authorization': 'Bearer '+ token
        },
    json={
        "storehouse_id":99
    })
    assert b'Bad storehouseId' in response.data

def test_allProduct_success(client):
    response = client.post('/api/product/all',headers={
        'Authorization': 'Bearer '+ token,
        'Origin': 'SALT'},
    json={
        "storehouse_id":1
    })
    products = response.json.get('products')
    assert products

# Test productDatail()
def test_productDatail_failed_wrong_manager_id(client):
    response = client.post('/api/product/detail',headers={
        'Authorization': 'Bearer '+ wrong_token,
        'Origin': 'SALT'})
    assert b'Bad manager_id' in response.data

def test_productDatail_failed_no_json(client):
    response = client.post('/api/product/detail',headers={
        'Authorization': 'Bearer '+ token,
        'Origin': 'SALT'})
    assert b'Missing JSON in request' in response.data

def test_productDatail_failed_no_product_id(client):
    response = client.post('/api/product/detail',headers={
        'Authorization': 'Bearer '+ token,
        'Origin': 'SALT'},
    json={
        "product":3
    })
    assert b'Missing product_id parameter' in response.data

def test_productDatail_failed_wrong_product_id(client):
    response = client.post('/api/product/detail',headers={
        'Authorization': 'Bearer '+ token,
        'Origin': 'SALT'},
    json={
        "product_id":999
    })
    assert b'Bad productId' in response.data

def test_productDatail_failed_bad_description(client):
    response = client.post('/api/product/detail',headers={
        'Authorization': 'Bearer '+ token,
        'Origin': 'SALT'},
    json={
        "product_id":11
    })
    assert b'Bad description' in response.data

def test_productDatail_success(client):
    response = client.post('/api/product/detail',headers={
        'Authorization': 'Bearer '+ token,
        'Origin': 'SALT'},
    json={
        "product_id":15
    })
    name = response.json.get('name')
    assert name

# Test createProduct()
def test_createProduct_failed_wrong_manager_id(client):
    response = client.post('/api/product/create',headers={
        'Authorization': 'Bearer '+ wrong_token,
        'Origin': 'SALT'})
    assert b'Bad manager_id' in response.data

def test_createProduct_failed_no_json(client):
    response = client.post('/api/product/create',headers={
        'Authorization': 'Bearer '+ token,
        'Origin': 'SALT'})
    assert b'Missing JSON in request' in response.data

def test_createProduct_failed_no_name(client):
    response = client.post('/api/product/create',headers={
        'Authorization': 'Bearer '+ token,
        'Origin': 'SALT'},
    json={
        "notName":"wow"
    })
    assert b'Missing name parameter' in response.data

def test_createProduct_failed_no_category(client):
    response = client.post('/api/product/create',headers={
        'Authorization': 'Bearer '+ token,
        'Origin': 'SALT'},
    json={
        "name":"test create a product"
    })
    assert b'Missing category parameter' in response.data

def test_createProduct_failed_no_description(client):
    response = client.post('/api/product/create',headers={
        'Authorization': 'Bearer '+ token,
        'Origin': 'SALT'},
    json={
        "name":"test create a product",
        "category":1
    })
    assert b'Missing description parameter' in response.data

def test_createProduct_failed_no_storehouse_id(client):
    response = client.post('/api/product/create',headers={
        'Authorization': 'Bearer '+ token,
        'Origin': 'SALT'},
    json={
        "name":"test create a product",
        "category":1,
        "description":{
            "title":"test create a product description",
            "remain":1
        }
    })
    assert b'Missing storehouse_id parameter' in response.data

def test_createProduct_succeed(client):
    response = client.post('/api/product/create',headers={
        'Authorization': 'Bearer '+ token,
        'Origin': 'SALT'},
    json={
        "name":"test create a product",
        "category":1,
        "description":{
            "title":"test create a product description",
            "remain":1
        },
        "storehouse_id":1
    })
    isCreated = response.json.get('isCreated')
    assert isCreated == True

# Test updateProduct()
def test_updateProduct_failed_wrong_manager_id(client):
    response = client.post('/api/product/update',headers={
        'Authorization': 'Bearer '+ wrong_token,
        'Origin': 'SALT'})
    assert b'Bad manager_id' in response.data

def test_updateProduct_failed_no_json(client):
    response = client.post('/api/product/update',headers={
        'Authorization': 'Bearer '+ token,
        'Origin': 'SALT'})
    assert b'Missing JSON in request' in response.data

def test_updateProduct_failed_no_product_id(client):
    response = client.post('/api/product/update',headers={
        'Authorization': 'Bearer '+ token,
        'Origin': 'SALT'},
    json={
        "product":17
    })
    assert b'Missing product_id parameter' in response.data

def test_updateProduct_failed_no_name(client):
    response = client.post('/api/product/update',headers={
        'Authorization': 'Bearer '+ token,
        'Origin': 'SALT'},
    json={
        "product_id":17
    })
    assert b'Missing name parameter' in response.data

def test_updateProduct_failed_no_category(client):
    response = client.post('/api/product/update',headers={
        'Authorization': 'Bearer '+ token,
        'Origin': 'SALT'},
    json={
        "product_id":17,
        "name":"test update a product"
    })
    assert b'Missing category parameter' in response.data

def test_updateProduct_failed_no_status(client):
    response = client.post('/api/product/update',headers={
        'Authorization': 'Bearer '+ token,
        'Origin': 'SALT'},
    json={
        "product_id":17,
        "name":"test update a product",
        "category":1
    })
    assert b'Missing status parameter' in response.data

def test_updateProduct_failed_no_description(client):
    response = client.post('/api/product/update',headers={
        'Authorization': 'Bearer '+ token,
        'Origin': 'SALT'},
    json={
        "product_id":17,
        "name":"test update a product",
        "category":1,
        "status":{
            "shelved":True,
            "archived":True
        }
    })
    assert b'Missing description parameter' in response.data

def test_updateProduct_success(client):
    response = client.post('/api/product/update',headers={
        'Authorization': 'Bearer '+ token,
        'Origin': 'SALT'},
    json={
        "product_id":17,
        "name":"test update a product",
        "category":1,
        "status":{
            "shelved":True,
            "archived":True
        },
        "description":{
            "title":"test update a product description",
            "remain":99
        },
    })
    isUpdated = response.json.get('isUpdated')
    assert isUpdated == True

# Test statistics()
def test_statistics_failed_wrong_manager_id(client):
    response = client.post('/api/product/statistics',headers={
        'Authorization': 'Bearer '+ wrong_token,
        'Origin': 'SALT'})
    assert b'Bad manager_id' in response.data

def test_statistics_failed_no_json(client):
    response = client.post('/api/product/statistics',headers={
        'Authorization': 'Bearer '+ token,
        'Origin': 'SALT'})
    assert b'Missing JSON in request' in response.data

def test_statistics_failed_no_storehouse_id(client):
    response = client.post('/api/product/statistics',headers={
        'Authorization': 'Bearer '+ token,
        'Origin': 'SALT'},
    json={
        "storehouse":3
    })
    assert b'Missing storehouse_id parameter' in response.data

def test_statistics_failed_bad_storehouse_id(client):
    response = client.post('/api/product/statistics',headers={
        'Authorization': 'Bearer '+ token,
        'Origin': 'SALT'},
    json={
        "storehouse_id":4
    })
    assert b'Bad storehouseId' in response.data

def test_statistics_failed_no_order_record(client):
    response = client.post('/api/product/statistics',headers={
        'Authorization': 'Bearer '+ token,
        'Origin': 'SALT'},
    json={
        "storehouse_id":2
    })
    assert b'No order record' in response.data

def test_statistics_success(client):
    response = client.post('/api/product/statistics',headers={
        'Authorization': 'Bearer '+ token,
        'Origin': 'SALT'},
    json={
        "storehouse_id":1
    })
    name_count = response.json.get("name_count")
    assert name_count