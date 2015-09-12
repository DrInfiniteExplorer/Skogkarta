@echo off

set QGIS_DEBUG=-1
call "..\QGIS\bin\o4w_env.bat"
path %PATH%;%OSGEO4W_ROOT%\apps\qgis\bin;%OSGEO4W_ROOT%\apps\grass\grass-6.4.3\lib
set PYTHONPATH=%OSGEO4W_ROOT%\apps\qgis\python
rem echo %path%
REM pushd "%OSGEO4W_ROOT%\bin"
pushd %~dp0
echo dir is %CD%
pushd code
python main.py
echo. & echo END!
popd
popd

