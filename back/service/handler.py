from server import app
from flask import render_template
'''
@app.errorhandler(404)
def internal_error(error):
    #return render_template('404.html'), 404
    return render_template('404.html'), 404

@app.errorhandler(500)
def internal_error(error):
    db.session.rollback()
    return render_template('500.html'), 500'''