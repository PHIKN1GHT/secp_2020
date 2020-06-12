import random
import string
from PIL import Image, ImageDraw, ImageFont, ImageFilter

FONT = ImageFont.truetype('Courier.ttf', 28)
SOURCE = list(string.ascii_letters)
SOURCE.extend([str(i) for i in range(0, 10)])

def captcha(length, size, linesOption=(3,5,1), pointsChance=0.05):
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

if __name__ == "__main__":
    image, code = captcha(6, (148, 40))
    print(code)
    image.show()
    