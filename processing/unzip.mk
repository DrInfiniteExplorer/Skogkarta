#
#:: %1 Path with folders to unzip
#:: %2 Path where unzipped folders should exist
#:UnzipDirs
#   for %%a in (%1\*.zip) do call :UnzipDir %%a %2
#   goto :EOF
#
#:: %1 Path of zip file
#:: %2 Path where to unzip file
#:UnzipDir 
#   
#   mkdir %2\%~n1 2>NUL
#   7z.exe x %1 -o%2\%~n1 -aoa
#   goto :EOF
#   
#   
#   
#:Main
#   mkdir Unzipped 2>NUL
#   call :UnzipDirs ZipFiles\AvverkAnm Unzipped\AvverkAnm
#   call :UnzipDirs ZipFiles\Naturvarden Unzipped\Naturvarden
#   call :UnzipDirs ZipFiles\Nyckelbiotoper Unzipped\Nyckelbiotoper
#   
#   
#

ZipFiles:=$(wildcard ZipFiles/*/*.zip)
UnzippedPaths:=$(subst .zip,,$(subst ZipFiles,UnzippedFiles,$(ZipFiles)))

$(UnzippedPaths): UnzippedFiles/%: ZipFiles/%.zip
	@mkdir -p $@
	unzip -o $< -d $@
	touch $@

Unzip: $(UnzippedPaths)
	echo Files are unzipped



