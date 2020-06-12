from server import db, app, inDebugging
from flask import Blueprint, render_template
bp = Blueprint('system', __name__)

@bp.route("/saveall")
def saveall():
    db.session.commit()
    return "Finished!!!"

@bp.route("/ping")
def ping():
    return "pong"

@bp.route("/inDebugging")
def _inDebugging():
    return str(inDebugging())

@bp.route("/")
def index():
    return render_template('index.html')
