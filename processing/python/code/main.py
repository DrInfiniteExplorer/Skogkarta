import traceback
import get
from dateops import getDate
import fileops
import download;

from pprint import pprint as pp
import sys
import operate;

from os import getcwd, chdir, rename, listdir
from site import addsitedir
from shutil import copyfile

def setupEnvironment():
    addsitedir("..\\..\\QGIS\\apps\\qgis\\python\\plugins")
    print("Current dir: " + getcwd())
    addsitedir(getcwd())
    fileops.tryMakeDir("../data")
    chdir("../data")
    print("Current dir: " + getcwd())

    print("sys.path:")
    pp(sys.path)


def clearTempFolder():
    fileops.tryRemoveDir("temp_crap_files")
    fileops.tryMakeDir("temp_crap_files")

def downloadData():
    if download.downloadAll("temp"):
        fileops.tryRemoveDir("old")
        fileops.rename("new", "old") # fileops.rename dont fail if source not exist
        rename("temp", "new")
        fileops.tryMakeDir("temp")
        copyfile("new\\download_time.txt", "temp\\download_time.txt")

def runFilters():

    nameAndFilename = get.getAreaData()
    for name, filename in nameAndFilename.iteritems():
        print("Working with " + name);
        filenameNoZip = filename[:-4]
        globals = {
            'new'  : operate.new,
            'old'  : operate.old,
            'load' : operate.load,
            'area' : name,
            'filename' : filename,
            'filenameNoZip' : filenameNoZip
        }
        fileops.tryMakeDir("../../json/"+filenameNoZip)
        
        
        for item in listdir("../filters"):
            if item[-3:] == ".py":
                print(" Running filter " + item)
                try:
                    execfile("../filters/" + item, globals)
                except Exception, e:
                    print("Exception caught! ")
                    print traceback.format_exc()                    
                    pass

setupEnvironment()
clearTempFolder()
downloadData()

runFilters()


