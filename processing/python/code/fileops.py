from os import makedirs, path, rename;
from shutil import rmtree;

# trys to makedir, doesnt fail when exist
def tryMakeDir(path):
	try:
		makedirs(path)
	except WindowsError as e:
		if "Cannot create a file when that file" in e.args[1]:
			return
		print(e)

# trys to deletedirs, doesnt fail when it does not exist
def tryRemoveDir(path):
	try:
		rmtree(path)
	except WindowsError as e:
		if "The system cannot find the path specified" in e.args[1]:
			return
		print(e)

# trys to read tile, if cant returns nothing
def tryReadFile(path, mode = "r"):
	try:
		with open(path, mode) as file:
			return file.read()
	except Exception as e:
		if "No such file or directory" in e.args[1]:
			return
		print(e)

# trys to read tile, if cant returns nothing
def rename(old, new):
   if path.isdir(old):
      rename(old, new)

