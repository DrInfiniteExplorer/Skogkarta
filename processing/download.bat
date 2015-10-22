
>NUL 2>&1 call wget
>NUL 2>&1 call msys
>NUL 2>&1 call gnumake

goto Main

:: %1 Output dir
:: %2 local xml file name
:: %3 Full xml file URL
:: %4 'Base' url which files need to have to be downloaded
:Download
	mkdir %1 2>NUL
	pushd %1
	rm -f %2
	wget %3
	wget -i %2 --force-html --base=%4 --timestamping --ignore-length
	popd
   goto :EOF
   
:Main
   mkdir ZipFiles 2>NUL
   touch ZipFiles\AvverkAnm\sksAvverkAnm.zip 
   call :Download ZipFiles\AvverkAnm AvverkAnm.xml http://geodpags.skogsstyrelsen.se/geodataport/feeds/AvverkAnm.xml http://geodpags.skogsstyrelsen.se/geodataport/data/
   del ZipFiles\AvverkAnm\sksAvverkAnm.zip 

   :: Tv� alternativ?
   :: http://geodpags.skogsstyrelsen.se/arcgis/services/Geodataportal/GeodataportalVisaNyckelbiotop/MapServer/WmsServer?
   :: http://geodpags.skogsstyrelsen.se/arcgis/services/Geodataportal/GeodataportalVisaNyckelbiotoper/MapServer/WmsServer?
   call :Download ZipFiles\Nyckelbiotoper Nyckelbiotoper.xml http://geodpags.skogsstyrelsen.se/geodataport/feeds/Nyckelbiotoper.xml http://geodpags.skogsstyrelsen.se/geodataport/data/
   
   
   :: http://geodpags.skogsstyrelsen.se/arcgis/services/Geodataportal/GeodataportalVisaObjektnaturvarde/MapServer/WmsServer?
   call :Download ZipFiles\Naturvarden Naturvarden.xml http://geodpags.skogsstyrelsen.se/geodataport/feeds/Naturvarden.xml http://geodpags.skogsstyrelsen.se/geodataport/data/
      
      
   :: http://gis-services.metria.se/ArcGIS/services/InspireNV_NVR/MapServer/InspireViewService?Layers=PS.OBO
   :: http://gpt.vic-metria.nu/data/land/OBO.zip
   
