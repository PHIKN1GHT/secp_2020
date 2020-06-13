from testing.fixture import client
from testing.test_account import loadCaptcha
from config import OPERATORNAME, OPERATORPSWD
from flask import jsonify
from functools import partial

token = ''
'''
def test1_login(client):
    global token
    _, code = loadCaptcha(client)
    response = client.post('/api/account/login', json={
        'captcha': code,
        "username": OPERATORNAME,
        "password": OPERATORPSWD
    })
    assert response.json['result'] == True
    token = response.json['access_token']

def test1_after_login_succeed(client):
    response = client.get('/api/address', headers={
        'Authorization': 'Bearer '+ token
    }, json={
        'receiver': 'asd', 
        'phonenumber': 'asd',
        'address': 'asd',
    })
    print(response.data)
    assert b'logged_in_as_user' in response.data
'''