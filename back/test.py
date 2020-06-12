import os
os.system("pytest . -W ignore::DeprecationWarning --show-capture stdout")
