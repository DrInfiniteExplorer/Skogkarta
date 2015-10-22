
set ASD=asd dsa
call :B ASD
goto :EOF



call :A asd dsa qwe
goto :EOF


:A
 echo %*
 call shift
 echo %*
 goto :EOF

:B
 set _=%%%1%%
 call echo %_%
 goto :EOF