
call msys 2>NUL
call Regions.bat

goto Main


:Main
   d:\Program\mingw\msys\1.0\bin\mkdir.exe -p ../siteRoot/data/dynamic 2>NUL
   cp ./json/* ../siteRoot/data/dynamic --force --recursive --verbose
   goto :EOF