>NUL 2>&1 call wget
>NUL 2>&1 call msys
>NUL 2>&1 call gnumake

REM gnumake -f download.mk UpdateFiles

call download.bat
call unzip.bat
call makejson.bat
call copyjson.bat
