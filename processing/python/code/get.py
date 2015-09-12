from json import load
from pprint import pprint
from urllib import urlretrieve

def getAreaData():
    jsonDataFile = open("areas.json")
    data = load(jsonDataFile)
    jsonDataFile.close()
    return data

def getBaseUrl():
    return "http://geodpags.skogsstyrelsen.se/geodataport/data/"

def getAreaFilenameAndUrls(nameAndFilename):
    fileUrlDict = dict()
    for name, filename in nameAndFilename.iteritems():
        fileUrlDict[filename] = getBaseUrl() + filename
    return fileUrlDict

def download(url, path):
    urlretrieve(url, path)
