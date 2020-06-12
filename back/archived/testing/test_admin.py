from testing.fixture import client
from testing.test_account import login_as_op, with_token
from config import OPERATORNAME, OPERATORPSWD
from flask import jsonify
from functools import partial
import pytest

@pytest.mark.skip
def test_create_product_with_description(client):
    token = login_as_op(client)
    
    for i in range(0, 10):
        response = with_token(client.post, token)('/admin/createProductWithDescription',json={
            "name": "testing product "+str(i),
            "description": {
                'title' : "PRODUCT " + str(i),
                'thumbnail' : "",
                'htmlDescription': ''
            }
        })
    
        assert b"Create Product With Description successfully" in response.data
