
import zipfile;
from fileops import tryMakeDir

# zips up a file with folder structure kept.
def properUnpack(zipFileName, path):
    tryMakeDir(path)
    # Remove trailing slashes
    if(path[-1] == '\\' or path[-1] == '/'):
        path = path[:-1]
    with zipfile.ZipFile(zipFileName, "r") as z:
        for item in z.namelist():
            # filenames for skogsdata come in CP437, make latin1
            realName = item.decode("CP437").encode("latin1")
            # if in folder make folder
            if("\\" in realName or "/" in realName):
                tryMakeDir(path + "\\" + realName[ : max(realName.rfind("\\"), realName.rfind("/"))])
            data = z.read(item)
            with open(path + "\\" + realName, 'wb') as f:
                f.write(data)
