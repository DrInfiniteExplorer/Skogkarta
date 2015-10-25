
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
   
   set Filter=-filter "new Date(Inkomdatum) > (new Date() - 1000*60*60*24*7*260)" -o format=geojson "%ItemPath%\260.json" force bbox
   set Filter=%Filter% -filter "new Date(Inkomdatum) > (new Date() - 1000*60*60*24*7*52)" -o format=geojson "%ItemPath%\52.json" force bbox
   set Filter=%Filter% -filter "new Date(Inkomdatum) > (new Date() - 1000*60*60*24*7*6)" -o format=geojson "%ItemPath%\6.json" force bbox
   set Filter=%Filter% -filter "new Date(Inkomdatum) > (new Date() - 1000*60*60*24*7*3)" -o format=geojson "%ItemPath%\3.json" force bbox
   set Filter=%Filter% -filter "new Date(Inkomdatum) > (new Date() - 1000*60*60*24*7*2)" -o format=geojson "%ItemPath%\2.json" force bbox
   call mapshaper "%DirPath%\*.shp" %Filter%
   
   goto :EOF


:Main

   
   
   for /D %%a in (Unzipped\Nyckelbiotoper\*) do (
      mkdir "json\%%~na" 2>NUL
      call mapshaper "%%a\*.shp" -o format=geojson "json\%%~na\0.json" force bbox
   )

   for /D %%a in (Unzipped\Naturvarden\*) do (
      mkdir "json\%%~na" 2>NUL
      call mapshaper "%%a\*.shp" -o format=geojson "json\%%~na\0.json" force bbox
   )

   for /D %%a in (Unzipped\AvverkAnm\*) do call :Process %%a
   
   goto :EOF