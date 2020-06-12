from testing.fixture import client
from config import OPERATORNAME, OPERATORPSWD
from flask import jsonify
'''
token = ''
def test_addToCart_failed_no_json(client):
    global token
    _, code = loadCaptcha(client)
    response = client.post('/account/login', json={
        'captcha': code,
        "stuId": OPERATORNAME,
        "password": OPERATORPSWD
    })
    assert b'Login successfully' in response.data
    token = response.json['access_token']
    response = client.post('/consumption/addToCart', headers={
        'Authorization': 'Bearer '+ token
    })
   
    assert b'Missing JSON in request' in response.data
'''


    