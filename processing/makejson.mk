
AvverkPaths:=$(wildcard UnzippedFiles/AvverkAnm/*)

JsonPaths:=$(subst UnzippedFiles,Json,$(AvverkPaths))
JsonPaths260:=$(addsuffix /260.json, $(JsonPaths))
JsonPaths52:=$(addsuffix /52.json, $(JsonPaths))
JsonPaths6:=$(addsuffix /6.json, $(JsonPaths))
JsonPaths3:=$(addsuffix /3.json, $(JsonPaths))
JsonPaths2:=$(addsuffix /2.json, $(JsonPaths))

Precision:=1.0

$(JsonPaths260):Json/%/260.json:UnzippedFiles/%
	echo $@ $<
	mkdir -p $(dir $@)
	mapshaper $</*.shp no-topology -filter "new Date(Inkomdatum) > (new Date() - 1000*60*60*24*7*260)" -o format=geojson "$@_" force bbox precision=$(Precision)
	mapshaper $@_ no-topology -each '$$.properties={OBJECTID:$$.properties.OBJECTID};' -o format=geojson "$@" force bbox precision=$(Precision)

$(JsonPaths52):Json/%/52.json:Json/%/260.json
	mapshaper $<_ no-topology -filter "new Date(Inkomdatum) > (new Date() - 1000*60*60*24*7*52)" -o format=geojson "$@_" force bbox precision=$(Precision)
	mapshaper $@_ no-topology -each '$$.properties={OBJECTID:$$.properties.OBJECTID};' -o format=geojson "$@" force bbox precision=$(Precision)

$(JsonPaths6):Json/%/6.json:Json/%/52.json
	mapshaper $<_ no-topology -filter "new Date(Inkomdatum) > (new Date() - 1000*60*60*24*7*6)" -o format=geojson "$@_" force bbox precision=$(Precision)
	mapshaper $@_ no-topology -each '$$.properties={OBJECTID:$$.properties.OBJECTID};' -o format=geojson "$@" force bbox precision=$(Precision)

$(JsonPaths3):Json/%/3.json:Json/%/6.json
	mapshaper $<_ no-topology -filter "new Date(Inkomdatum) > (new Date() - 1000*60*60*24*7*3)" -o format=geojson "$@_" force bbox precision=$(Precision)
	mapshaper $@_ no-topology -each '$$.properties={OBJECTID:$$.properties.OBJECTID};' -o format=geojson "$@" force bbox precision=$(Precision)

$(JsonPaths2):Json/%/2.json:Json/%/3.json
	mapshaper $<_ no-topology -filter "new Date(Inkomdatum) > (new Date() - 1000*60*60*24*7*2)" -o format=geojson "$@_" force bbox precision=$(Precision)
	mapshaper $@_ no-topology -each '$$.properties={OBJECTID:$$.properties.OBJECTID};' -o format=geojson "$@" force bbox precision=$(Precision)
	
UnfilteredPaths:=$(wildcard UnzippedFiles/Nyckelbiotoper/*) $(wildcard UnzippedFiles/Naturvarden/*)
UnfilteredJsonPaths:=$(addsuffix /0.json, $(subst UnzippedFiles,Json,$(UnfilteredPaths)))
$(UnfilteredJsonPaths):Json/%/0.json:UnzippedFiles/%
	mkdir -p $(dir $@)
	mapshaper $</*.shp no-topology -each '$$.properties={OBJECTID:$$.properties.OBJECTID};' -o format=geojson "$@" force bbox precision=$(Precision)

	
MakeJson : $(JsonPaths2) $(UnfilteredJsonPaths)
	echo Json files created!

CopyJson : MakeJson
	mkdir -p ../npm-host/public/data
	cp ./Json/* ../npm-host/public/data --force --recursive --verbose 

#
#:Main
#
#   
#   
#   for /D %%a in (Unzipped\Nyckelbiotoper\*) do (
#      mkdir "json\%%~na" 2>NUL
#      call mapshaper "%%a\*.shp" no-topology -each '$.properties={OBJECTID:$.properties.OBJECTID};' -o format=geojson "json\%%~na\0.json" force bbox precision=0.01
#      call mapshaper "%%a\*.shp" -simplify 0.1 -each '$.properties={OBJECTID:$.properties.OBJECTID};' -o format=geojson "json\%%~na\0_simple.json" force bbox precision=0.01
#   )
#   
#   for /D %%a in (Unzipped\Naturvarden\*) do (
#      mkdir "json\%%~na" 2>NUL
#      call mapshaper "%%a\*.shp" no-topology -each '$.properties={OBJECTID:$.properties.OBJECTID};' -o format=geojson "json\%%~na\0.json" force bbox precision=0.01
#      call mapshaper "%%a\*.shp" -simplify 0.1 -each '$.properties={OBJECTID:$.properties.OBJECTID};' -o format=geojson "json\%%~na\0_simple.json" force bbox precision=0.01
#   )
#
#   for /D %%a in (Unzipped\AvverkAnm\*) do call :Process %%a
#   
#   goto :EOF