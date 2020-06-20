from testing.fixture import client, check   
from config import OPERATORNAME, OPERATORPSWD
from flask import jsonify
from functools import partial

token = ''
wrong_token = ''

# Test allSupplierOrder()
def test_allSupplierOrder_failed_wrong_manager_id(client):
    global wrong_token
    response = client.post('/api/account/loginAs', json={
        "username": 10130497
    })
    wrong_token = response.json['access_token']
    response = client.post('/api/supplierOrder/all',headers={
        'Authorization': 'Bearer '+ wrong_token,
        'Origin': 'SALT'})
    assert b'Bad manager_id' in response.data

def test_allSupplierOrder_success(client):
    global token
    response = client.post('/api/account/loginAs', json={
        "username": 10109062
    })
    token = response.json['access_token']
    response = client.post('/api/supplierOrder/all',headers={
        'Authorization': 'Bearer '+ token,
        'Origin': 'SALT'})
    supplierOrders = response.json.get('supplierOrders')
    assert supplierOrders

# Test createSupplierOrder()
def test_createSupplierOrder_failed_wrong_manager_id(client):
    response = client.post('/api/supplierOrder/create',headers={
        'Authorization': 'Bearer '+ wrong_token})
    assert b'Bad manager_id' in response.data

def test_createSupplierOrder_failed_no_json(client):
    response = client.post('/api/supplierOrder/create',headers={
        'Authorization': 'Bearer '+ token})
    assert b'Missing JSON in request' in response.data

def test_createSupplierOrder_failed_no_product_id(client):
    response = client.post('/api/supplierOrder/create',headers={
        'Authorization': 'Bearer '+ token},
    json={
        "product":3
    })
    assert b'Missing product_id parameter' in response.data

def test_createSupplierOrder_failed_no_count(client):
    response = client.post('/api/supplierOrder/create',headers={
        'Authorization': 'Bearer '+ token},
    json={
        "product_id":3
    })
    assert b'Missing count parameter' in response.data

def test_createSupplierOrder_failed_no_storehouse_id(client):
    response = client.post('/api/supplierOrder/create',headers={
        'Authorization': 'Bearer '+ token},
    json={
        "product_id":3,
        "count":100
    })
    assert b'Missing storehouse_id parameter' in response.data

def test_createSupplierOrder_failed_bad_productId(client):
    response = client.post('/api/supplierOrder/create',headers={
        'Authorization': 'Bearer '+ token},
    json={
        "product_id":14,
        "count":100,
        "storehouse_id":3
    })
    assert b'Bad productId' in response.data

def test_createSupplierOrder_success(client):
    response = client.post('/api/supplierOrder/create',headers={
        'Authorization': 'Bearer '+ token},
    json={
        "product_id":5,
        "count":100,
        "storehouse_id":3
    })
    supplierOrderId = response.json.get('supplierOrderId')
    assert supplierOrderId