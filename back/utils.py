from config import SALT
import xlutils, xlwt, xlrd
import hashlib, json, os, importlib
import random
import string
from flask import jsonify
from config import SECRETKEY
from flask_jwt_extended import JWTManager
from PIL import Image, ImageDraw, ImageFont, ImageFilter

tryLookUp = lambda _dict, _key, _default = "" : _dict[_key] if _key in _dict.keys() else _default

class Pipeline():
    def __init__(self, request):
        self.request = request
        self.finished = False
        self.pipes = []
        self.retv = None

    def add(self, func):
        self.pipes.append([func])

    def add(self, func, *args):
        self.pipes.append([func, *args])

    def run(self):
        retvs = [] 
        for pipe in self.pipes:
            if len(pipe) > 1:
                print(*pipe[1])
                cont, retv = pipe[0](*pipe[1])
            else:
                cont, retv = pipe[0](self.request)
            retvs.append(retv)
            if not cont:
                return True, retv[0]
        return False, retvs

def ensureJson(request):
    if not request.is_json:
        return False, [jsonify({"msg": "Missing JSON in request"}), 400]
    return True, []
'''
def ensureParam(request, paramName):
    param = request.json.get(paramName, None)
    if not param:
        return False, [jsonify({"msg": "Missing parameter %s" % paramName}), 400]
    return True, []
'''

def ensureParam(request, paramName, trigger=None):
    param = request.json.get(paramName, None)
    if not param:
        if trigger:
            trigger()
        return False, [jsonify(result=False,reason="Missing parameter %s" % paramName), 400]
    return True, param

def encodePswd(str):
    m = hashlib.md5()
    m.update((str + SALT).encode(encoding='utf-8'))
    return m.hexdigest().upper()

def cmparePswd(str, pswd):
    return encodePswd(str) == pswd

def getAllFilenamesWithPath(dirpath):
    filenames = []
    fs = os.listdir(dirpath)
    for f in fs:
        s = os.path.join(dirpath, f)
        if (os.path.isdir(s)):
            filenames.extend(getAllFilenamesWithPath(s))
        else:
            filenames.append(s)
    return filenames

def loadBlueprint(app, service, prefix=""):
    service_module = importlib.import_module(service)
    app.register_blueprint(service_module.bp, url_prefix='/api/'+prefix)

FONT = ImageFont.truetype(os.path.join('resource', 'Courier.ttf'), 28)
SOURCE = list(string.ascii_letters)
SOURCE.extend([str(i) for i in range(0, 10)])

def captcha(length=6, size=(148, 40), linesOption=(3,5,1), pointsChance=0.05):
    code = ''.join(random.sample(SOURCE, length))
    font_width, font_height = FONT.getsize(code)
    randColor = lambda minv=0, maxv=255 : (random.randint(minv, maxv), random.randint(minv, maxv), random.randint(minv, maxv))

    image = Image.new('RGBA', (size[0], size[1]), randColor(128,255))
    draw = ImageDraw.Draw(image)
    draw.text(
        ((size[0] - font_width) / length, (size[1] - font_height) / length), code,
        font=FONT,
        fill=randColor(0,128))

    lineNum = random.randint(linesOption[0], linesOption[1])
    for i in range(0, lineNum):
        begin = (random.randint(0, size[0]), random.randint(0, size[1]))
        end = (random.randint(0, size[0]), random.randint(0, size[1]))
        draw.line([begin, end], width=linesOption[2], fill=randColor(128,255))

    for w in range(size[0]):
        for h in range(size[1]):
            if random.randint(0, 100) / 100.0 < pointsChance:
                draw.point((w, h), randColor(128,255))
    params = [1 - float(random.randint(1, 2)) / 100, 0, 0, 0, 1 - float(random.randint(1, 10)) / 100, float(random.randint(1, 2)) / 500,0.001, float(random.randint(1, 2)) / 500]
    image = image.transform((size[0], size[1]), Image.PERSPECTIVE, params)  # 创建扭曲
    image = image.filter(ImageFilter.EDGE_ENHANCE_MORE)  # 滤镜，边界加强
    return image, code

jwt = JWTManager()
blacklist = set()

@jwt.token_in_blacklist_loader
def invalid(token):
    jti = token['jti']
    return jti in blacklist

def invalidate(token):
    blacklist.add(token['jti'])
