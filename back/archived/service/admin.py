import os, utils, xlwt, io, xlrd
from server import db, app, inDebugging
from flask import request, send_from_directory, make_response, Blueprint, jsonify, send_file
from model import User, Product, Description
from utils import Pipeline, ensureParam, ensureJson

bp = Blueprint('admin',__name__)

# Tested by Pytest
@bp.route("/createProductWithDescription", methods=['POST'])
def createProductWithDescription():
    pipeline = Pipeline(request)
    pipeline.add(ensureJson)
    pipeline.add(ensureParam, [request, 'description'])
    pipeline.add(ensureParam, [request, 'category'])
    pipeline.add(ensureParam, [request, 'name'])
    broken, retvs = pipeline.run()
    if broken:
        return retvs
    _, desc_json, category, name = retvs
    
    product = Product(name, category)
    db.session.add(product)
    db.session.commit()
    description = Description(desc_json, product.id)
    description.active = True
    db.session.add(description)
    db.session.commit()
    return jsonify(msg="Create Product With Description successfully", product_id=product.id), 200

# Tested by Postman
@bp.route("/archiveProduct", methods=['POST'])
def archiveProduct():
    if not request.is_json:
        return jsonify({"msg": "Missing JSON in request"}), 400

    product_id = request.json.get('product_id', None)
    if not product_id:
        return jsonify({"msg": "Missing product_id parameter"}), 400
    
    product = Product.query.filter_by(id=product_id).first()
    if not product:
        return jsonify({"msg": "Bad product_id"}), 401

    if product.archived:
        return jsonify({"msg": "Product is already archived"}), 401
    else:
        product.archived = True
        db.session.commit()
        return jsonify(msg="Archive product successfully"), 200

# Tested by Postman
@bp.route("/unarchiveProduct", methods=['POST'])
def unarchiveProduct():
    if not request.is_json:
        return jsonify({"msg": "Missing JSON in request"}), 400

    product_id = request.json.get('product_id', None)
    if not product_id:
        return jsonify({"msg": "Missing product_id parameter"}), 400
    
    product = Product.query.filter_by(id=product_id).first()
    if not product:
        return jsonify({"msg": "Bad product_id"}), 401

    if not product.archived:
        return jsonify({"msg": "Product is already unarchived"}), 401
    else:
        product.archived = False
        db.session.commit()
        return jsonify(msg="Unarchive product successfully"), 200

# Tested by Postman
@bp.route("/onShelves", methods=['POST'])
def onShelves():
    if not request.is_json:
        return jsonify({"msg": "Missing JSON in request"}), 400

    product_id = request.json.get('product_id', None)
    if not product_id:
        return jsonify({"msg": "Missing product_id parameter"}), 400
    
    product = Product.query.filter_by(id=product_id).first()
    if not product:
        return jsonify({"msg": "Bad product_id"}), 401

    product.shelved = True
    db.session.commit()
    return jsonify(msg="Put on shelves successfully", product_id=product.id), 200

# Tested by Postman
@bp.route("/offShelves", methods=['POST'])
def offShelves():
    if not request.is_json:
        return jsonify({"msg": "Missing JSON in request"}), 400

    product_id = request.json.get('product_id', None)
    if not product_id:
        return jsonify({"msg": "Missing product_id parameter"}), 400
    
    product = Product.query.filter_by(id=product_id).first()
    if not product:
        return jsonify({"msg": "Bad product_id"}), 401

    product.shelved = False
    db.session.commit()
    return jsonify(msg="Pull off shelves successfully", product_id=product.id), 200

# Tested by Postman
@bp.route("/addDescription", methods=['POST'])
def addDescription():
    if not request.is_json:
        return jsonify({"msg": "Missing JSON in request"}), 400

    desc_json = request.json.get('description', None)
    if not desc_json:
        return jsonify({"msg": "Missing description parameter"}), 400
    
    product_id = request.json.get('product_id', None)
    if not product_id:
        return jsonify({"msg": "Missing product_id parameter"}), 400
    
    product = Product.query.filter_by(id=product_id).first()
    if not product:
        return jsonify({"msg": "Bad product_id"}), 401
    
    description = Description(desc_json, product.id)
    
    db.session.add(description)
    db.session.commit()

    return jsonify(msg="Add Description "+ str(description.id) + " successfully"), 200

# Tested by Postman
@bp.route("/modifyDescription", methods=['POST'])
def modifyDescription():
    if not request.is_json:
        return jsonify({"msg": "Missing JSON in request"}), 400

    desc_json = request.json.get('description', None)
    if not desc_json:
        return jsonify({"msg": "Missing description parameter"}), 400
    
    description_id = request.json.get('description_id', None)
    if not description_id:
        return jsonify({"msg": "Missing description_id parameter"}), 400
    
    description = Description.query.filter_by(id=description_id, removed=False).first()
    if not description:
        return jsonify({"msg": "Bad description_id"}), 401
    
    description.modify(desc_json)
    db.session.commit()

    return jsonify(msg="Modify description "+ str(description_id) + " successfully"), 200

# Tested by Postman
@bp.route("/removeDescription", methods=['POST'])
def removeDescription():
    if not request.is_json:
        return jsonify({"msg": "Missing JSON in request"}), 400
    
    description_id = request.json.get('description_id', None)
    if not description_id:
        return jsonify({"msg": "Missing description_id parameter"}), 400
    
    description = Description.query.filter_by(id=description_id, removed=False).first()
    if not description:
        return jsonify({"msg": "Bad description_id"}), 401

    if description.active:
        return jsonify({"msg": "You cannot remove an active description"}), 401
    description.removed = True
    db.session.commit()
    return jsonify(msg="Remove description "+ str(description_id) + " successfully"), 200

# Tested by Postman
@bp.route("/descriptionList", methods=['POST'])
def descriptionList():
    if not request.is_json:
        return jsonify({"msg": "Missing JSON in request"}), 400

    product_id = request.json.get('product_id', None)
    if not product_id:
        return jsonify({"msg": "Missing product_id parameter"}), 400
    
    product = Product.query.filter_by(id=product_id).first()
    if not product:
        return jsonify({"msg": "Bad product_id"}), 401

    if product.archived:
        return jsonify({"msg": "Product has been archived"}), 401

    descriptions = Description.query.filter_by(product_id=product.id, removed=False).all()
    descri_json = [(d.id,d.active,d.title,d.thumbnail,d.htmlDescription,d.remain,d.price,d.limit) for d in descriptions]
    return jsonify(descri_json), 200

# Tested by Postman
@bp.route("/activeDescription", methods=['POST'])
def activeDescription():
    if not request.is_json:
        return jsonify({"msg": "Missing JSON in request"}), 400

    product_id = request.json.get('product_id', None)
    if not product_id:
        return jsonify({"msg": "Missing product_id parameter"}), 400
    
    product = Product.query.filter_by(id=product_id).first()
    if not product:
        return jsonify({"msg": "Bad product_id"}), 401

    if product.archived:
        return jsonify({"msg": "Product has been archived"}), 401

    description_id = request.json.get('description_id', None)
    if not description_id:
        return jsonify({"msg": "Missing description_id parameter"}), 400

    description = Description.query.filter_by(id=description_id, removed=False).first()
    if not description:
        return jsonify({"msg": "Bad description_id"}), 401

    descriptions = Description.query.filter_by(product_id=product.id, removed=False).all()

    for des in descriptions:
        des.active = False
    
    description.active = True
    db.session.commit()
    return jsonify(msg="Active description "+ str(description_id) + " successfully"), 200


# Tested by Postman
@bp.route("/xlsTemplate")
def xlsTemplate():
    data = io.BytesIO()
    excel = xlwt.Workbook()
    sheet = excel.add_sheet("Import")
    template = ['stuId: 学号','name: 姓名','citizenId: 身份证号','email: 邮箱','balance: 初始金额数量，整数','备注：请不要修改表头名称！']
    for idx, item in enumerate(template):
        sheet.write(0, idx, item)
    excel.save(data)
    data.seek(0)
    return send_file(data, attachment_filename="Template.xls")

# Tested by Postman
@bp.route("/addUsersInXls")
def uploadImages():
    excel = xlrd.open_workbook(file_contents=request.get_data())
    sheet = excel.sheet_by_name("Import")
    result = []
    for i in range(1, sheet.nrows):
        try:
            stuId = sheet.cell_value(i, 0)
            name = sheet.cell_value(i, 1)
            email = sheet.cell_value(i, 3)
            citizenId = sheet.cell_value(i, 2)
            balance = sheet.cell_value(i, 4)
            user = User(stuId, name, email, citizenId, balance)
            db.session.add(user)
            result.append([i, stuId, name, email, citizenId, balance, True])
        except:
            result.append([i, False])
    db.session.commit()
    return jsonify(result), 200
