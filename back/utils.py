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

from flask_cors import CORS
def loadBlueprint(app, service, prefix=""):
    service_module = importlib.import_module(service)
    CORS(service_module.bp, supports_credentials=True)
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



'''
    def paginate(
        self, page=None, per_page=None, error_out=True, max_per_page=None, count=True
    ):
        """Returns ``per_page`` items from page ``page``.
        If ``page`` or ``per_page`` are ``None``, they will be retrieved from
        the request query. If ``max_per_page`` is specified, ``per_page`` will
        be limited to that value. If there is no request or they aren't in the
        query, they default to 1 and 20 respectively. If ``count`` is ``False``,
        no query to help determine total page count will be run.
        When ``error_out`` is ``True`` (default), the following rules will
        cause a 404 response:
        * No items are found and ``page`` is not 1.
        * ``page`` is less than 1, or ``per_page`` is negative.
        * ``page`` or ``per_page`` are not ints.
        When ``error_out`` is ``False``, ``page`` and ``per_page`` default to
        1 and 20 respectively.
        Returns a :class:`Pagination` object.
        """

        if request:
            if page is None:
                try:
                    page = int(request.args.get("page", 1))
                except (TypeError, ValueError):
                    if error_out:
                        abort(404)

                    page = 1

            if per_page is None:
                try:
                    per_page = int(request.args.get("per_page", 20))
                except (TypeError, ValueError):
                    if error_out:
                        abort(404)

                    per_page = 20
        else:
            if page is None:
                page = 1

            if per_page is None:
                per_page = 20

        if max_per_page is not None:
            per_page = min(per_page, max_per_page)

        if page < 1:
            if error_out:
                abort(404)
            else:
                page = 1

        if per_page < 0:
            if error_out:
                abort(404)
            else:
                per_page = 20

        items = self.limit(per_page).offset((page - 1) * per_page).all()

        if not items and page != 1 and error_out:
            abort(404)

        if not count:
            total = None
        else:
            total = self.order_by(None).count()

        return Pagination(self, page, per_page, total, items)

class Pagination:
    """Internal helper class returned by :meth:`BaseQuery.paginate`.  You
    can also construct it from any other SQLAlchemy query object if you are
    working with other libraries.  Additionally it is possible to pass `None`
    as query object in which case the :meth:`prev` and :meth:`next` will
    no longer work.
    """

    def __init__(self, query, page, per_page, total, items):
        #: the unlimited query object that was used to create this
        #: pagination object.
        self.query = query
        #: the current page number (1 indexed)
        self.page = page
        #: the number of items to be displayed on a page.
        self.per_page = per_page
        #: the total number of items matching the query
        self.total = total
        #: the items for the current page
        self.items = items

    @property
    def pages(self):
        """The total number of pages"""
        if self.per_page == 0 or self.total is None:
            pages = 0
        else:
            pages = int(ceil(self.total / float(self.per_page)))
        return pages

    def prev(self, error_out=False):
        """Returns a :class:`Pagination` object for the previous page."""
        assert (
            self.query is not None
        ), "a query object is required for this method to work"
        return self.query.paginate(self.page - 1, self.per_page, error_out)

    @property
    def prev_num(self):
        """Number of the previous page."""
        if not self.has_prev:
            return None
        return self.page - 1

    @property
    def has_prev(self):
        """True if a previous page exists"""
        return self.page > 1

    def next(self, error_out=False):
        """Returns a :class:`Pagination` object for the next page."""
        assert (
            self.query is not None
        ), "a query object is required for this method to work"
        return self.query.paginate(self.page + 1, self.per_page, error_out)

    @property
    def has_next(self):
        """True if a next page exists."""
        return self.page < self.pages

    @property
    def next_num(self):
        """Number of the next page"""
        if not self.has_next:
            return None
        return self.page + 1

    def iter_pages(self, left_edge=2, left_current=2, right_current=5, right_edge=2):
        """Iterates over the page numbers in the pagination.  The four
        parameters control the thresholds how many numbers should be produced
        from the sides.  Skipped page numbers are represented as `None`.
        This is how you could render such a pagination in the templates:
        .. sourcecode:: html+jinja
            {% macro render_pagination(pagination, endpoint) %}
              <div class=pagination>
              {%- for page in pagination.iter_pages() %}
                {% if page %}
                  {% if page != pagination.page %}
                    <a href="{{ url_for(endpoint, page=page) }}">{{ page }}</a>
                  {% else %}
                    <strong>{{ page }}</strong>
                  {% endif %}
                {% else %}
                  <span class=ellipsis>…</span>
                {% endif %}
              {%- endfor %}
              </div>
            {% endmacro %}
        """
        last = 0
        for num in range(1, self.pages + 1):
            if (
                num <= left_edge
                or (
                    num > self.page - left_current - 1
                    and num < self.page + right_current
                )
                or num > self.pages - right_edge
            ):
                if last + 1 != num:
                    yield None
                yield num
                last = num
'''