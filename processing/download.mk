
DownloadList:=
define CreateDownloadRecipe
download-$(TargetFolder):
	echo Downloading $(TargetFolder)
	mkdir -p $(TargetFolder)
	rm -f $(TargetFolder)/$(XmlFile)
	cd $(TargetFolder) && wget $(Url)
	cd $(TargetFolder) && wget -i $(XmlFile) --force-html --base=$(BaseUrl) --timestamping --ignore-length || true

.PHONY::download-$(TargetFolder)
DownloadList:=$(DownloadList) download-$(TargetFolder)
endef


TargetFolder:=ZipFiles/AvverkAnm
XmlFile:=AvverkAnm.xml
Url:=http://geodpags.skogsstyrelsen.se/geodataport/feeds/AvverkAnm.xml
BaseUrl:=http://geodpags.skogsstyrelsen.se/geodataport/data/
$(eval $(CreateDownloadRecipe))

touchUnwantedFile:
	mkdir -p ZipFiles/AvverkAnm
	touch ZipFiles/AvverkAnm/sksAvverkAnm.zip 
.PHONY::touchUnwantedFile

	
$(DownloadList) : touchUnwantedFile


TargetFolder:=ZipFiles/Nyckelbiotoper
XmlFile:=Nyckelbiotoper.xml
Url:=http://geodpags.skogsstyrelsen.se/geodataport/feeds/Nyckelbiotoper.xml
BaseUrl:=http://geodpags.skogsstyrelsen.se/geodataport/data/
$(eval $(CreateDownloadRecipe))

TargetFolder:=ZipFiles/Naturvarden
XmlFile:=Naturvarden.xml
Url:=http://geodpags.skogsstyrelsen.se/geodataport/feeds/Naturvarden.xml
BaseUrl:=http://geodpags.skogsstyrelsen.se/geodataport/data/
$(eval $(CreateDownloadRecipe))

removeUnwantedFile: $(DownloadList)
	rm ZipFiles/AvverkAnm/sksAvverkAnm.zip
.PHONY::removeUnwantedFile

Download: $(DownloadList) removeUnwantedFile
	echo Should have downloaded stuff now. $@
.PHONY::Download
