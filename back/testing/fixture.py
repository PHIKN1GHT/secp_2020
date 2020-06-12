import os, tempfile, pytest, sys
from server import app, loadBlueprints
from utils import loadBlueprint

@pytest.fixture
def client():
    app.config['TESTING'] = True
    from utils import jwt
    jwt.init_app(app)
    loadBlueprints(app)
    with app.test_client() as client:
        yield client
