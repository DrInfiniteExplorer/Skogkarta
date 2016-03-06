
call msys 2>NUL
call Regions.bat

set DIR=../npm-host/public/data

goto Main

:Main
   d:\Program\mingw\msys\1.0\bin\mkdir.exe -p %DIR% 2>NUL
   cp ./json/* %DIR% --force --recursive --verbose
   goto :EOF
