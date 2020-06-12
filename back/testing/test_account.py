from testing.fixture import client
from config import OPERATORNAME, OPERATORPSWD
from flask import jsonify
from functools import partial

def check(client):
    return client.get('/api/account/state')

def loadCaptcha(client):
    response = client.get('/api/account/verify')
    content_type = response.headers['Content-Type']
    response = client.get('/api/account/cheat')
    code = response.data.decode('utf-8')
    return content_type, code

def login(client, username, password):
    _, code = loadCaptcha(client)
    response = client.post('/api/account/login', json={
        'captcha': code,
        "stuId": username,
        "password": password
    })
    return response.json['access_token'] if 'access_token' in response.json.keys() else response

login_as_op = lambda client: login(client, OPERATORNAME, OPERATORPSWD)
with_token = lambda func, token: partial(func, headers={'Authorization': 'Bearer '+ token})

def test_captcha(client):
    content_type, captcha = loadCaptcha(client)
    assert content_type == 'image/png' and len(captcha) == 6

def test_logout_before_login(client):
    response = client.post('/api/account/logout')
    assert b'Missing Authorization Header' in response.data

def test_before_login(client):
    response = client.get('/api/account/identity')
    assert b'Missing Authorization Header' in response.data

def test_optional_anonymous(client):
    response = client.get('/api/account/state')
    assert b'logged_in_as_anonymous' in response.data

def test_login_failed_without_verify(client):
    response = client.post('/api/account/login')
    assert b'Please reload captcha first' in response.data

def test_login_failed_no_json(client):
    _, code = loadCaptcha(client)
    response = client.post('/api/account/login')
    print(response.data)
    assert b'Missing JSON in request' in response.data

def test_login_failed_wrong_captcha(client):
    _, code = loadCaptcha(client)
    response = client.post('/api/account/login', json={
        'captcha': 'BAD CAPTCHA'
    })
    print(response.json)
    assert response.json['result'] == False
    assert b'Wrong captcha' in response.data

def test_login_failed_wrong_username_or_password(client):
    _, code = loadCaptcha(client)
    response = client.post('/api/account/login', json={
        'captcha': code,
        "stuId": "BAD STUID",
        "password": "BAD PASSWORD"
    })
    print(code)
    assert response.json['result'] == False
    assert b'Bad username or password' in response.data

token = ''
def test_login_succeed(client):
    global token
    _, code = loadCaptcha(client)
    response = client.post('/api/account/login', json={
        'captcha': code,
        "stuId": OPERATORNAME,
        "password": OPERATORPSWD
    })
    assert response.json['result'] == True
    token = response.json['access_token']

def test_after_login_succeed(client):
    response = client.get('/api/account/identity', headers={
        'Authorization': 'Bearer '+ token
    })
    print(response.data)
    assert b'logged_in_as_user' in response.data

def test_optional_user(client):
    response = client.get('/api/account/state', headers={
        'Authorization': 'Bearer '+ token
    })
    assert b'logged_in_as_user' in response.data

def test_logout(client):
    response = client.post('/api/account/logout', headers={
        'Authorization': 'Bearer '+ token
    })
    assert b'Successfully logged out' in response.data

def test_reuse_token(client):
    response = client.get('/api/account/identity', headers={
        'Authorization': 'Bearer '+ token
    })
    print(response.data)
    assert b'Token has been revoked' in response.data

def test_after_logout(client):
    response = client.get('/api/account/identity')
    assert b'Missing Authorization Header' in response.data

def test_chgpswd_before_login(client):
    response = client.post('/api/account/changepswd')
    assert b'Missing Authorization Header' in response.data

temppswd = "temppswd"
def test_chgpswd_after_login(client):
    token = login_as_op(client)

    response = with_token(client.post, token)('/api/account/changepswd',json={
        "stuId": OPERATORNAME,
        "oripswd": temppswd,
        "newpswd": temppswd,
    })
    assert b'Bad username or password' in response.data

    response = with_token(client.post, token)('/api/account/changepswd',json={
        "stuId": OPERATORNAME,
        "oripswd": OPERATORPSWD,
        "newpswd": temppswd,
    })
    assert b'Change password successfully, please relogin' in response.data

    response = login_as_op(client)
    assert b'Bad username or password' in response.data

    token = login(client, OPERATORNAME, temppswd)
    assert isinstance(token, str)

    response = with_token(client.post, token)('/api/account/changepswd',json={
        "stuId": OPERATORNAME,
        "oripswd": temppswd,
        "newpswd": OPERATORPSWD,
    })
    assert b'Change password successfully, please relogin' in response.data
