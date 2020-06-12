import os
basedir = os.path.abspath(os.path.dirname(__file__))

DIALECT = 'mysql'
DRIVER = 'pymysql'
USERNAME = 'root'
PASSWORD = '!P8ssw0rd_'
HOST = '127.0.0.1'
PORT = '2330'
DATABASE = 'ecust_axw'

SQLALCHEMY_DATABASE_URI = '{}+{}://{}:{}@{}:{}/{}?charset=utf8'.format(
    DIALECT,DRIVER,USERNAME,PASSWORD,HOST,PORT,DATABASE
)
SQLALCHEMY_COMMIT_ON_TEARDOWN = True
SQLALCHEMY_TRACK_MODIFICATIONS = True

SQLALCHEMY_ENGINE_OPTIONS =  {
    'pool_size': 1000,
    'pool_recycle': 120,
    'pool_pre_ping': True
}

#SQLALCHEMY_DATABASE_URI = 'sqlite:///' + os.path.join(basedir, 'app.db')
SQLALCHEMY_MIGRATE_REPO = os.path.join(basedir, 'db_repository')

SALT = 'This is a simple SALT'
SECRETKEY = SALT

PRODUCTION_ENV = {
    "host": "0.0.0.0",
    "port": 8080,
}

DEVELOPMENT_ENV = {
    "host": "0.0.0.0",
    "port": 2333,
}

OPERATORNAME = 'root'
OPERATORPSWD = '!P8ssw0rd_'





