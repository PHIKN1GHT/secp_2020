from testing.fixture import client, check   
from config import OPERATORNAME, OPERATORPSWD
from flask import jsonify
from functools import partial

manager_token = ''
operator_token = ''
wrong_token = ''
supplierOrderId = 0

# Test allSupplierOrder()
def test_allSupplierOrder_failed_no_permission(client):
    global wrong_token
    response = client.post('/api/account/loginAs', json={
        "username": "User0"
    })
    wrong_token = response.json['access_token']
    response = client.post('/api/supplierOrder/all',headers={
        'Authorization': 'Bearer '+ wrong_token})
    assert b'No Permission' in response.data

def test_allSupplierOrder_success(client):
    global manager_token
    response = client.post('/api/account/loginAs', json={
        "username": 10109062
    })
    manager_token = response.json['access_token']
    response = client.post('/api/supplierOrder/all',headers={
        'Authorization': 'Bearer '+ manager_token})
    supplierOrders = response.json.get('supplierOrders')
    assert supplierOrders

# Test createSupplierOrder()
def test_createSupplierOrder_failed_no_json(client):
    response = client.post('/api/supplierOrder/create',headers={
        'Authorization': 'Bearer '+ manager_token})
    assert b'Missing JSON in request' in response.data

def test_createSupplierOrder_failed_no_permission(client):
    response = client.post('/api/supplierOrder/create',headers={
        'Authorization': 'Bearer '+ wrong_token},
    json={
        "product_id":1
    })
    assert b'No Permission' in response.data

def test_createSupplierOrder_failed_no_product_id(client):
    response = client.post('/api/supplierOrder/create',headers={
        'Authorization': 'Bearer '+ manager_token},
    json={
        "product":1
    })
    assert b'Missing product_id parameter' in response.data

def test_createSupplierOrder_failed_no_count(client):
    response = client.post('/api/supplierOrder/create',headers={
        'Authorization': 'Bearer '+ manager_token},
    json={
        "product_id":1
    })
    assert b'Missing count parameter' in response.data

def test_createSupplierOrder_failed_no_storehouse_id(client):
    response = client.post('/api/supplierOrder/create',headers={
        'Authorization': 'Bearer '+ manager_token},
    json={
        "product_id":1,
        "count":500
    })
    assert b'Missing storehouse_id parameter' in response.data

def test_createSupplierOrder_failed_bad_productId(client):
    response = client.post('/api/supplierOrder/create',headers={
        'Authorization': 'Bearer '+ manager_token},
    json={
        "product_id":10000,
        "count":500,
        "storehouse_id":3
    })
    assert b'Bad productId' in response.data

def test_createSupplierOrder_success(client):
    global supplierOrderId
    response = client.post('/api/supplierOrder/create',headers={
        'Authorization': 'Bearer '+ manager_token},
    json={
        "product_id":1,
        "count":500,
        "storehouse_id":3
    })
    
    supplierOrderId = response.json.get('supplierOrderId')
    assert supplierOrderId

# Test confirmSupplierOrder()
def test_confirmSupplierOrder_failed_no_json(client):
    response = client.post('/api/supplierOrder/confirm',headers={
        'Authorization': 'Bearer '+ wrong_token})
    assert b'Missing JSON in request' in response.data

def test_confirmSupplierOrder_failed_no_permission(client):
    response = client.post('/api/supplierOrder/confirm',headers={
        'Authorization': 'Bearer '+ wrong_token},
    json={
        "supplierOrder_id":supplierOrderId
    })
    assert b'No Permission' in response.data

def test_confirmSupplierOrder_no_supplierOrder_id(client):
    global operator_token
    response = client.post('/api/account/loginAs',
    json={
        "username":10130497
    })
    operator_token = response.json['access_token']
    response = client.post('/api/supplierOrder/confirm',headers={
        'Authorization': 'Bearer '+ operator_token},
    json={
        "supplierOrder":supplierOrderId
    })
    assert b'Missing supplierOrder_id parameter' in response.data

def test_confirmSupplierOrder_bad_supplierOrder_id(client):
    response = client.post('/api/supplierOrder/confirm',headers={
        'Authorization': 'Bearer '+ operator_token},
    json={
        "supplierOrder_id":-1
    })
    assert b'Bad supplierOrder_id' in response.data

def test_confirmSupplierOrder_success(client):
    response = client.post('/api/supplierOrder/confirm',headers={
        'Authorization': 'Bearer '+ operator_token},
    json={
        "supplierOrder_id":supplierOrderId
    })
    isConfirmed = response.json.get('isConfirmed')
    assert isConfirmed

# Test rejectSupplierOrder()
def test_rejectSupplierOrder_failed_no_json(client):
    response = client.post('/api/supplierOrder/reject',headers={
        'Authorization': 'Bearer '+ operator_token})
    assert b'Missing JSON in request' in response.data

def test_rejectSupplierOrder_failed_no_permission(client):
    response = client.post('/api/supplierOrder/reject',headers={
        'Authorization': 'Bearer '+ wrong_token},
    json={
        "supplierOrder_id":supplierOrderId
    })
    assert b'No Permission' in response.data

def test_rejectSupplierOrder_no_supplierOrder_id(client):
    response = client.post('/api/supplierOrder/reject',headers={
        'Authorization': 'Bearer '+ operator_token},
    json={
        "supplierOrder":supplierOrderId
    })
    assert b'Missing supplierOrder_id parameter' in response.data

def test_rejectSupplierOrder_no_reason(client):
    response = client.post('/api/supplierOrder/reject',headers={
        'Authorization': 'Bearer '+ operator_token},
    json={
        "supplierOrder_id":supplierOrderId
    })
    assert b'Missing reason parameter' in response.data

def test_rejectSupplierOrder_bad_supplierOrder_id(client):
    response = client.post('/api/supplierOrder/reject',headers={
        'Authorization': 'Bearer '+ operator_token},
    json={
        "supplierOrder_id":-1,
        "reason":"爷不想要了"
    })
    assert b'Bad supplierOrder_id' in response.data

def test_rejectSupplierOrder_success(client):
    response = client.post('/api/supplierOrder/reject',headers={
        'Authorization': 'Bearer '+ operator_token},
    json={
        "supplierOrder_id":supplierOrderId,
        "reason":"爷不想要了"
    })
    isRejected = response.json.get('isRejected')
    assert isRejected