from testing.fixture import client, check
from config import OPERATORNAME, OPERATORPSWD
from flask import jsonify
from functools import partial

def loadCaptcha(client):
    response = client.get('/api/account/captcha')
    content_type = response.headers['Content-Type']
    response = client.get('/api/account/cheat')
    code = response.data.decode('utf-8')
    return content_type, code

def login(client, username, password):
    _, code = loadCaptcha(client)
    response = client.post('/api/account/login', json={
        'captcha': code,
        "username": username,
        "password": password
    })
    return response.json['access_token'] if 'access_token' in response.json.keys() else response

login_as_op = lambda client: login(client, OPERATORNAME, OPERATORPSWD)
with_token = lambda func, token: partial(func, headers={'Authorization': 'Bearer '+ token})

import pytest
class WithToken:
    token = ''

    @pytest.fixture(autouse=True)
    def _require_token(self, client):
        _, code = loadCaptcha(client)
        response = client.post('/api/account/login', json={
            'captcha': code,
            "username": OPERATORNAME,
            "password": OPERATORPSWD
        })
        self.token = response.json['access_token']
