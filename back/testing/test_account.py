from testing.fixture import client, check
from config import OPERATORNAME, OPERATORPSWD
from flask import jsonify
from functools import partial

class TestServiceAccountLogin:
    def test_captcha(self, client):
        content_type, captcha = loadCaptcha(client)
        assert content_type == 'image/png' and len(captcha) == 6

    def test_logout_before_login(self, client):
        response = client.post('/api/account/logout')
        assert b'Missing Authorization Header' in response.data

    def test_before_login(self, client):
        response = client.get('/api/account/identity')
        assert b'Missing Authorization Header' in response.data

    def test_optional_anonymous(self, client):
        response = client.get('/api/account/state')
        assert b'logged_in_as_anonymous' in response.data

    def test_login_failed_without_captcha(self, client):
        response = client.post('/api/account/login')
        assert b'Please reload captcha first' in response.data

    def test_login_failed_no_json(self, client):
        _, code = loadCaptcha(client)
        response = client.post('/api/account/login')
        print(response.data)
        assert b'Missing JSON in request' in response.data

    def test_login_failed_wrong_captcha(self, client):
        _, code = loadCaptcha(client)
        response = client.post('/api/account/login', json={
            'captcha': 'BAD CAPTCHA'
        })
        print(response.json)
        assert response.json['result'] == False
        assert b'Wrong captcha' in response.data

    def test_login_failed_wrong_username_or_password(self, client):
        _, code = loadCaptcha(client)
        response = client.post('/api/account/login', json={
            'captcha': code,
            "username": "BAD username",
            "password": "BAD PASSWORD"
        })
        print(code)
        assert response.json['result'] == False
        assert b'Bad username or password' in response.data

    def test_login_succeed(self, client):
        _, code = loadCaptcha(client)
        response = client.post('/api/account/login', json={
            'captcha': code,
            "username": OPERATORNAME,
            "password": OPERATORPSWD
        })
        assert response.json['result'] == True

class TestServiceAccount(WithToken):
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

    def test_after_login_succeed(self, client):
        response = client.get('/api/account/identity', headers={
            'Authorization': 'Bearer '+ self.token
        })
        assert b'logged_in_as_user' in response.data

    def test_optional_user(self, client):
        response = client.get('/api/account/state', headers={
            'Authorization': 'Bearer '+ self.token
        })
        assert b'logged_in_as_user' in response.data

    def test_logout(self, client):
        response = client.post('/api/account/logout', headers={
            'Authorization': 'Bearer '+ self.token
        })
        assert b'Successfully logged out' in response.data

    def test_reuse_token(self, client):
        self.test_logout(client)
        response = client.get('/api/account/identity', headers={
            'Authorization': 'Bearer '+ self.token
        })
        print(response.data)
        assert b'Token has been revoked' in response.data

    def test_after_logout(self, client):
        response = client.get('/api/account/identity')
        assert b'Missing Authorization Header' in response.data

    def test_chgpswd_before_login(self, client):
        response = client.post('/api/account/changepswd')
        assert b'Missing Authorization Header' in response.data


def test_chgpswd_after_login(client):
    temppswd = "temppswd"
    token = login_as_op(client)

    response = with_token(client.post, token)('/api/account/changepswd',json={
        "username": OPERATORNAME,
        "oripswd": temppswd,
        "newpswd": temppswd,
    })
    assert b'Bad username or password' in response.data

    response = with_token(client.post, token)('/api/account/changepswd',json={
        "username": OPERATORNAME,
        "oripswd": OPERATORPSWD,
        "newpswd": temppswd,
    })
    assert b'Change password successfully, please relogin' in response.data

    response = login_as_op(client)
    assert b'Bad username or password' in response.data

    token = login(client, OPERATORNAME, temppswd)
    assert isinstance(token, str)

    response = with_token(client.post, token)('/api/account/changepswd',json={
        "username": OPERATORNAME,
        "oripswd": temppswd,
        "newpswd": OPERATORPSWD,
    })
    assert b'Change password successfully, please relogin' in response.data
