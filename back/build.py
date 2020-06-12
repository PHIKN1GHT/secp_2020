import os, shutil
os.system("cd "+ os.path.join("..", "front") +" && yarn build")
try:
    shutil.rmtree("dist")
except:
    pass
shutil.copytree(os.path.join("..", "front", "build"), "dist")
