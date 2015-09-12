# -*- coding: windows-1250 -*-
import fileops;
import dateops;
import get;
import zipops;
import os;

def downloadAll(outdir):
    def markDownloaded():
        with open(outdir + "/download_time.txt", "w") as file:
            file.write(dateops.getDate())
    
    #remove trailing space
    if(outdir[-1] == "/" or outdir[-1] == "\\"):
        outdir = outdir[:-1]
    
    # If already have dont download
    if fileops.tryReadFile(outdir + "/download_time.txt", "r") == dateops.getDate():
        print("Data already downloaded today, ignoring")
        return False
        
    fileops.tryRemoveDir(outdir)
    fileops.tryMakeDir(outdir)
    
    nameAndFilename = get.getAreaData()
    filenameAndUrl = get.getAreaFilenameAndUrls(nameAndFilename)
    
    for filename, url in filenameAndUrl.iteritems():
        localPath = outdir + "\\" + filename
        localDir = localPath[:-4]
        print("Downloading: " + localPath + " from " + url)
        get.download(url, localPath)
        print("Unzipping: " + localPath + " to " + localDir)
        zipops.properUnpack(localPath, localDir)
        print("Deleting " + localPath)
        os.remove(localPath)
    print("Download finished, marking as done")
    markDownloaded()
    return True
