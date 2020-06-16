from testing.fixture import client
from config import OPERATORNAME, OPERATORPSWD
from flask import jsonify
from functools import partial
from testing import *

class TestServiceAddress(WithToken):

    #def test_all_address(self, client):
    #    response = client.get('/api/address/all', headers={
    #        'Authorization': 'Bearer '+ self.token
    #    })
    #    print(response.data)
    #    assert response.json == []

    def test_add_address(self, client):

        response = client.get('/api/address/all', headers={
            'Authorization': 'Bearer '+ self.token
        })
        init_len = len(response.json)

        response = client.get('/api/address/add', headers={
            'Authorization': 'Bearer '+ self.token
        }, json={
            'receiver': 'asd', 
        })
        assert response.json['result'] == False

        response = client.get('/api/address/add', headers={
            'Authorization': 'Bearer '+ self.token
        }, json={
            'receiver': 'asd',
            'phonenumber': 'asd',
            'address': 'asd',
        })
        assert response.json['result'] == True
        temp_id = response.json['id']

        response = client.get('/api/address/all', headers={
            'Authorization': 'Bearer '+ self.token
        })
        new_len = len(response.json)
        assert new_len == init_len + 1
        new_pram = [i for i in response.json if i['id'] == temp_id]
        assert new_pram[0]['phonenumber'] == 'asd'

        response = client.get('/api/address/update', headers={
            'Authorization': 'Bearer '+ self.token
        }, json={
            'receiver': 'asd',
            'phonenumber': 'dsa',
            'address': 'asd',
            'id': temp_id,
        })
        assert response.json['result'] == True

        response = client.get('/api/address/all', headers={
            'Authorization': 'Bearer '+ self.token
        })
        assert len(response.json) == new_len
        new_pram = [i for i in response.json if i['id'] == temp_id]
        assert new_pram[0]['phonenumber'] == 'dsa'

        response = client.get('/api/address/del', headers={
            'Authorization': 'Bearer '+ self.token
        }, json={
            'id': temp_id,
        })
        assert response.json['result'] == True

        response = client.get('/api/address/all', headers={
            'Authorization': 'Bearer '+ self.token
        })
        new_len = len(response.json)
        assert new_len == init_len

'''
    def test_all_address_after_add(self, client):
        response = client.get('/api/address/all', headers={
            'Authorization': 'Bearer '+ self.token
        })
        print(response.data)
        assert len(response.json) > 0
    
'''

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


'''