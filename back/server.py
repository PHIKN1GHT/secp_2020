import argparse, sys, os
from flask_sqlalchemy import SQLAlchemy
#from flask_cors import CORS
from flask import Flask
from config import PRODUCTION_ENV, DEVELOPMENT_ENV, SECRETKEY
from utils import loadBlueprint

app = Flask(__name__, static_folder=os.path.join("dist","static"), template_folder=os.path.join("dist"))
app.config.from_object('config')

#app.secret_key = SECRETKEY
app.config['SECRET_KEY']=os.urandom(24)

app.config['JWT_BLACKLIST_ENABLED'] = True
app.config['JWT_BLACKLIST_TOKEN_CHECKS'] = ['access']
app.config['JWT_SECRET_KEY'] = SECRETKEY
    
@app.after_request
def cors(environ):
    environ.headers['Access-Control-Allow-Origin']='*'
    environ.headers['Access-Control-Allow-Method']='*'
    environ.headers['Access-Control-Allow-Headers']='x-requested-with,content-type'
    return environ

db = SQLAlchemy(app)

services = [
    "service.resource",
    "service.account",
    "service.admin",
    "service.indexing",
#    "service.fake",
#    "service.consumption"
    "service.manager_business"
]

from utils import jwt

inDebugging = lambda: app.debug or app.config['TESTING']

def loadBlueprints(app):
    for service in services:
        loadBlueprint(app, service, service.split('.')[-1])
    loadBlueprint(app, "service.system")

if __name__ == '__main__':
    parser = argparse.ArgumentParser()
    parser.add_argument("--mode", '-m', required=False)
    try:
        args = parser.parse_args()
        ENV = eval(args.mode)
    except:
        ENV = DEVELOPMENT_ENV

    loadBlueprints(app)
    
    jwt.init_app(app)
    #cors = CORS(app, resources={r"/.*": {"origins": "*"}})

    if ENV == PRODUCTION_ENV:
        from waitress import serve
        serve(app, host=ENV["host"], port=ENV["port"])
    else:
        # 这里必须三个FLAG都设，否则app.debug会被重置成False
        app.debug = True
        os.environ['FLASK_ENV']='development'
        os.environ['FLASK_DEBUG']='1'
        app.run(host=ENV["host"], port=ENV["port"])
