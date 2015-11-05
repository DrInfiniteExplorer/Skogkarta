
call node.bat
REM for /D %%a in (sksAvverkAnm0* sksAvverkAnm1* sksAvverkAnm2*) do call :Process %%a

goto Main

:: %1 Path of zipfile
:Process
   set DirPath=%~f1
   set ItemName=%~n1
   set ItemPath=json\%ItemName%
   mkdir json 2>NUL
   mkdir %ItemPath% 2>NUL
   
   set Filter=-filter "new Date(Inkomdatum) > (new Date() - 1000*60*60*24*7*260)" -o format=geojson "%ItemPath%\260.json" force bbox precision=0.01
   set Filter=%Filter% -filter "new Date(Inkomdatum) > (new Date() - 1000*60*60*24*7*52)" -o format=geojson "%ItemPath%\52.json" force bbox precision=0.01
   set Filter=%Filter% -filter "new Date(Inkomdatum) > (new Date() - 1000*60*60*24*7*6)" -o format=geojson "%ItemPath%\6.json" force bbox precision=0.01
   set Filter=%Filter% -filter "new Date(Inkomdatum) > (new Date() - 1000*60*60*24*7*3)" -o format=geojson "%ItemPath%\3.json" force bbox precision=0.01
   set Filter=%Filter% -filter "new Date(Inkomdatum) > (new Date() - 1000*60*60*24*7*2)" -o format=geojson "%ItemPath%\2.json" force bbox precision=0.01
   call mapshaper "%DirPath%\*.shp" no-topology %Filter%

   call mapshaper "%ItemPath%\260.json" no-topology -each '$.properties={OBJECTID:$.properties.OBJECTID};' -o format=geojson "%ItemPath%\260.json" force bbox precision=0.01
   call mapshaper "%ItemPath%\52.json" no-topology -each '$.properties={OBJECTID:$.properties.OBJECTID};' -o format=geojson "%ItemPath%\52.json" force bbox precision=0.01
   call mapshaper "%ItemPath%\6.json" no-topology -each '$.properties={OBJECTID:$.properties.OBJECTID};' -o format=geojson "%ItemPath%\6.json" force bbox precision=0.01
   call mapshaper "%ItemPath%\3.json" no-topology -each '$.properties={OBJECTID:$.properties.OBJECTID};' -o format=geojson "%ItemPath%\3.json" force bbox precision=0.01
   call mapshaper "%ItemPath%\2.json" no-topology -each '$.properties={OBJECTID:$.properties.OBJECTID};' -o format=geojson "%ItemPath%\2.json" force bbox precision=0.01

   call mapshaper "%ItemPath%\260.json" -simplify 0.1 -o format=geojson "%ItemPath%\260_simple.json" force bbox precision=0.01
   call mapshaper "%ItemPath%\52.json"  -simplify 0.1 -o format=geojson "%ItemPath%\52_simple.json" force bbox precision=0.01
   call mapshaper "%ItemPath%\6.json"   -simplify 0.1 -o format=geojson "%ItemPath%\6_simple.json" force bbox precision=0.01
   call mapshaper "%ItemPath%\3.json"   -simplify 0.1 -o format=geojson "%ItemPath%\3_simple.json" force bbox precision=0.01
   call mapshaper "%ItemPath%\2.json"   -simplify 0.1 -o format=geojson "%ItemPath%\2_simple.json" force bbox precision=0.01
   
   goto :EOF


:Main

   
   
   for /D %%a in (Unzipped\Nyckelbiotoper\*) do (
      mkdir "json\%%~na" 2>NUL
      call mapshaper "%%a\*.shp" no-topology -each '$.properties={OBJECTID:$.properties.OBJECTID};' -o format=geojson "json\%%~na\0.json" force bbox precision=0.01
      call mapshaper "%%a\*.shp" -simplify 0.1 -each '$.properties={OBJECTID:$.properties.OBJECTID};' -o format=geojson "json\%%~na\0_simple.json" force bbox precision=0.01
   )
   
   for /D %%a in (Unzipped\Naturvarden\*) do (
      mkdir "json\%%~na" 2>NUL
      call mapshaper "%%a\*.shp" no-topology -each '$.properties={OBJECTID:$.properties.OBJECTID};' -o format=geojson "json\%%~na\0.json" force bbox precision=0.01
      call mapshaper "%%a\*.shp" -simplify 0.1 -each '$.properties={OBJECTID:$.properties.OBJECTID};' -o format=geojson "json\%%~na\0_simple.json" force bbox precision=0.01
   )

   for /D %%a in (Unzipped\AvverkAnm\*) do call :Process %%a
   
   goto :EOF