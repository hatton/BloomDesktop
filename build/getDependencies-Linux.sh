#!/bin/bash
# server=build.palaso.org
# project=Bloom
# build=Bloom-Default-Linux64-Continuous
# root_dir=..
# Auto-generated by https://github.com/chrisvire/BuildUpdate.
# Do not edit this file by hand!

cd "$(dirname "$0")"

# *** Functions ***
force=0
clean=0

while getopts fc opt; do
case $opt in
f) force=1 ;;
c) clean=1 ;;
esac
done

shift $((OPTIND - 1))

copy_auto() {
if [ "$clean" == "1" ]
then
echo cleaning $2
rm -f ""$2""
else
where_curl=$(type -P curl)
where_wget=$(type -P wget)
if [ "$where_curl" != "" ]
then
copy_curl "$1" "$2"
elif [ "$where_wget" != "" ]
then
copy_wget "$1" "$2"
else
echo "Missing curl or wget"
exit 1
fi
fi
}

copy_curl() {
echo "curl: $2 <= $1"
if [ -e "$2" ] && [ "$force" != "1" ]
then
curl -# -L -z "$2" -o "$2" "$1"
else
curl -# -L -o "$2" "$1"
fi
}

copy_wget() {
echo "wget: $2 <= $1"
f1=$(basename $1)
f2=$(basename $2)
cd $(dirname $2)
echo "DEBUG wget: current directory = `pwd`; f1=$f1; f2=$f2"
echo "DEBUG wget -nv -L -N \"$1\""
wget -nv -L -N "$1"
# wget has no true equivalent of curl's -o option.
# Different versions of wget handle (or not) % escaping differently.
# A URL query is the only reason why $f1 and $f2 should differ.
if [ "$f1" != "$f2" ]; then mv $f2\?* $f2; fi
cd -
}


# *** Results ***
# build: Bloom-Default-Linux64-Continuous (bt403)
# project: Bloom
# URL: http://build.palaso.org/viewType.html?buildTypeId=bt403
# VCS: git://github.com/BloomBooks/BloomDesktop.git [master]
# dependencies:
# [0] build: bloom-win32-static-dependencies (bt396)
#     project: Bloom
#     URL: http://build.palaso.org/viewType.html?buildTypeId=bt396
#     clean: false
#     revision: latest.lastSuccessful
#     paths: {"connections.dll"=>"DistFiles", "MSBuild.Community.Tasks.dll"=>"build/", "MSBuild.Community.Tasks.Targets"=>"build/"}
# [1] build: YouTrackSharp (Bloom_YouTrackSharp)
#     project: Bloom
#     URL: http://build.palaso.org/viewType.html?buildTypeId=Bloom_YouTrackSharp
#     clean: false
#     revision: latest.lastSuccessful
#     paths: {"bin/YouTrackSharp.dll*"=>"lib/dotnet", "bin/YouTrackSharp.pdb"=>"lib/dotnet"}
#     VCS: https://github.com/BloomBooks/YouTrackSharp.git [LinuxCompatible]
# [2] build: Bloom Help 4.6 (Bloom_Help_BloomHelp46)
#     project: Help
#     URL: http://build.palaso.org/viewType.html?buildTypeId=Bloom_Help_BloomHelp46
#     clean: false
#     revision: latest.lastSuccessful
#     paths: {"*.chm"=>"DistFiles"}
# [3] build: pdf.js (bt401)
#     project: BuildTasks
#     URL: http://build.palaso.org/viewType.html?buildTypeId=bt401
#     clean: false
#     revision: latest.lastSuccessful
#     paths: {"pdfjs-viewer.zip!**"=>"DistFiles/pdf"}
#     VCS: https://github.com/mozilla/pdf.js.git [gh-pages]
# [4] build: GeckofxHtmlToPdf-xenial64-continuous (GeckofxHtmlToPdf_GeckofxHtmlToPdfXenial64continuous)
#     project: GeckofxHtmlToPdf
#     URL: http://build.palaso.org/viewType.html?buildTypeId=GeckofxHtmlToPdf_GeckofxHtmlToPdfXenial64continuous
#     clean: false
#     revision: latest.lastSuccessful
#     paths: {"Args.dll"=>"lib/dotnet", "GeckofxHtmlToPdf.exe"=>"lib/dotnet", "GeckofxHtmlToPdf.exe.config"=>"lib/dotnet"}
#     VCS: https://github.com/BloomBooks/geckofxHtmlToPdf [refs/heads/master]
# [5] build: L10NSharp master Mono continuous (L10NSharp_L10NSharpMasterMonoContinuous)
#     project: L10NSharp
#     URL: http://build.palaso.org/viewType.html?buildTypeId=L10NSharp_L10NSharpMasterMonoContinuous
#     clean: false
#     revision: latest.lastSuccessful
#     paths: {"L10NSharp.dll*"=>"lib/dotnet/", "CheckOrFixXliff.exe*"=>"lib/dotnet/"}
#     VCS: https://github.com/sillsdev/l10nsharp [master]
# [6] build: PdfDroplet-Linux-Dev-Continuous (bt344)
#     project: PdfDroplet
#     URL: http://build.palaso.org/viewType.html?buildTypeId=bt344
#     clean: false
#     revision: latest.lastSuccessful
#     paths: {"PdfDroplet.exe"=>"lib/dotnet", "PdfSharp.dll*"=>"lib/dotnet"}
#     VCS: https://github.com/sillsdev/pdfDroplet [master]
# [7] build: TidyManaged-master-linux64-continuous (bt351)
#     project: TidyManaged
#     URL: http://build.palaso.org/viewType.html?buildTypeId=bt351
#     clean: false
#     revision: latest.lastSuccessful
#     paths: {"TidyManaged.dll*"=>"lib/dotnet"}
#     VCS: https://github.com/BloomBooks/TidyManaged.git [master]
# [8] build: Linux master continuous (XliffForHtml_LinuxMasterContinuous)
#     project: XliffForHtml
#     URL: http://build.palaso.org/viewType.html?buildTypeId=XliffForHtml_LinuxMasterContinuous
#     clean: false
#     revision: latest.lastSuccessful
#     paths: {"HtmlXliff.*"=>"lib/dotnet", "HtmlAgilityPack.*"=>"lib/dotnet"}
#     VCS: https://github.com/sillsdev/XliffForHtml [refs/heads/master]
# [9] build: palaso-linux64-master Continuous (Libpalaso_PalasoLinux64masterContinuous)
#     project: libpalaso
#     URL: http://build.palaso.org/viewType.html?buildTypeId=Libpalaso_PalasoLinux64masterContinuous
#     clean: false
#     revision: latest.lastSuccessful
#     paths: {"DialogAdapters.dll"=>"lib/dotnet/", "Newtonsoft.Json.dll"=>"lib/dotnet/", "SIL.Core.dll*"=>"lib/dotnet/", "SIL.Core.pdb"=>"lib/dotnet/", "SIL.Core.Desktop.dll*"=>"lib/dotnet/", "SIL.Core.Desktop.pdb"=>"lib/dotnet/", "SIL.Media.dll*"=>"lib/dotnet/", "SIL.Media.pdb"=>"lib/dotnet/", "SIL.TestUtilities.dll*"=>"lib/dotnet/", "SIL.TestUtilities.pdb"=>"lib/dotnet/", "SIL.Windows.Forms.dll*"=>"lib/dotnet/", "SIL.Windows.Forms.pdb"=>"lib/dotnet/", "SIL.Windows.Forms.GeckoBrowserAdapter.dll*"=>"lib/dotnet/", "SIL.Windows.Forms.GeckoBrowserAdapter.pdb"=>"lib/dotnet/", "SIL.Windows.Forms.Keyboarding.dll*"=>"lib/dotnet/", "SIL.Windows.Forms.Keyboarding.pdb"=>"lib/dotnet/", "SIL.Windows.Forms.WritingSystems.dll*"=>"lib/dotnet/", "SIL.Windows.Forms.WritingSystems.pdb"=>"lib/dotnet/", "SIL.WritingSystems.dll*"=>"lib/dotnet/", "SIL.WritingSystems.pdb"=>"lib/dotnet/", "taglib-sharp.dll*"=>"lib/dotnet/", "Enchant.Net.dll*"=>"lib/dotnet/", "NDesk.DBus.dll*"=>"lib/dotnet/"}
#     VCS: https://github.com/sillsdev/libpalaso.git [master]

# make sure output directories exist
mkdir -p ../DistFiles
mkdir -p ../DistFiles/pdf
mkdir -p ../Downloads
mkdir -p ../build/
mkdir -p ../lib/dotnet
mkdir -p ../lib/dotnet/

# download artifact dependencies
copy_auto http://build.palaso.org/guestAuth/repository/download/bt396/latest.lastSuccessful/connections.dll ../DistFiles/connections.dll
copy_auto http://build.palaso.org/guestAuth/repository/download/bt396/latest.lastSuccessful/MSBuild.Community.Tasks.dll ../build/MSBuild.Community.Tasks.dll
copy_auto http://build.palaso.org/guestAuth/repository/download/bt396/latest.lastSuccessful/MSBuild.Community.Tasks.Targets ../build/MSBuild.Community.Tasks.Targets
copy_auto http://build.palaso.org/guestAuth/repository/download/Bloom_YouTrackSharp/latest.lastSuccessful/bin/YouTrackSharp.dll ../lib/dotnet/YouTrackSharp.dll
copy_auto http://build.palaso.org/guestAuth/repository/download/Bloom_YouTrackSharp/latest.lastSuccessful/bin/YouTrackSharp.pdb ../lib/dotnet/YouTrackSharp.pdb
copy_auto http://build.palaso.org/guestAuth/repository/download/Bloom_Help_BloomHelp46/latest.lastSuccessful/Bloom.chm ../DistFiles/Bloom.chm
copy_auto http://build.palaso.org/guestAuth/repository/download/bt401/latest.lastSuccessful/pdfjs-viewer.zip ../Downloads/pdfjs-viewer.zip
copy_auto http://build.palaso.org/guestAuth/repository/download/GeckofxHtmlToPdf_GeckofxHtmlToPdfXenial64continuous/latest.lastSuccessful/Args.dll ../lib/dotnet/Args.dll
copy_auto http://build.palaso.org/guestAuth/repository/download/GeckofxHtmlToPdf_GeckofxHtmlToPdfXenial64continuous/latest.lastSuccessful/GeckofxHtmlToPdf.exe ../lib/dotnet/GeckofxHtmlToPdf.exe
copy_auto http://build.palaso.org/guestAuth/repository/download/GeckofxHtmlToPdf_GeckofxHtmlToPdfXenial64continuous/latest.lastSuccessful/GeckofxHtmlToPdf.exe.config ../lib/dotnet/GeckofxHtmlToPdf.exe.config
copy_auto http://build.palaso.org/guestAuth/repository/download/L10NSharp_L10NSharpMasterMonoContinuous/latest.lastSuccessful/L10NSharp.dll ../lib/dotnet/L10NSharp.dll
copy_auto http://build.palaso.org/guestAuth/repository/download/L10NSharp_L10NSharpMasterMonoContinuous/latest.lastSuccessful/L10NSharp.dll.config ../lib/dotnet/L10NSharp.dll.config
copy_auto http://build.palaso.org/guestAuth/repository/download/L10NSharp_L10NSharpMasterMonoContinuous/latest.lastSuccessful/CheckOrFixXliff.exe ../lib/dotnet/CheckOrFixXliff.exe
copy_auto http://build.palaso.org/guestAuth/repository/download/L10NSharp_L10NSharpMasterMonoContinuous/latest.lastSuccessful/CheckOrFixXliff.exe.config ../lib/dotnet/CheckOrFixXliff.exe.config
copy_auto http://build.palaso.org/guestAuth/repository/download/bt344/latest.lastSuccessful/PdfDroplet.exe ../lib/dotnet/PdfDroplet.exe
copy_auto http://build.palaso.org/guestAuth/repository/download/bt344/latest.lastSuccessful/PdfSharp.dll ../lib/dotnet/PdfSharp.dll
copy_auto http://build.palaso.org/guestAuth/repository/download/bt351/latest.lastSuccessful/TidyManaged.dll ../lib/dotnet/TidyManaged.dll
copy_auto http://build.palaso.org/guestAuth/repository/download/bt351/latest.lastSuccessful/TidyManaged.dll.config ../lib/dotnet/TidyManaged.dll.config
copy_auto http://build.palaso.org/guestAuth/repository/download/XliffForHtml_LinuxMasterContinuous/latest.lastSuccessful/HtmlXliff.exe ../lib/dotnet/HtmlXliff.exe
copy_auto http://build.palaso.org/guestAuth/repository/download/XliffForHtml_LinuxMasterContinuous/latest.lastSuccessful/HtmlXliff.exe.mdb ../lib/dotnet/HtmlXliff.exe.mdb
copy_auto http://build.palaso.org/guestAuth/repository/download/XliffForHtml_LinuxMasterContinuous/latest.lastSuccessful/HtmlAgilityPack.dll ../lib/dotnet/HtmlAgilityPack.dll
copy_auto http://build.palaso.org/guestAuth/repository/download/Libpalaso_PalasoLinux64masterContinuous/latest.lastSuccessful/DialogAdapters.dll ../lib/dotnet/DialogAdapters.dll
copy_auto http://build.palaso.org/guestAuth/repository/download/Libpalaso_PalasoLinux64masterContinuous/latest.lastSuccessful/Newtonsoft.Json.dll ../lib/dotnet/Newtonsoft.Json.dll
copy_auto http://build.palaso.org/guestAuth/repository/download/Libpalaso_PalasoLinux64masterContinuous/latest.lastSuccessful/SIL.Core.dll ../lib/dotnet/SIL.Core.dll
copy_auto http://build.palaso.org/guestAuth/repository/download/Libpalaso_PalasoLinux64masterContinuous/latest.lastSuccessful/SIL.Core.pdb ../lib/dotnet/SIL.Core.pdb
copy_auto http://build.palaso.org/guestAuth/repository/download/Libpalaso_PalasoLinux64masterContinuous/latest.lastSuccessful/SIL.Core.Desktop.dll ../lib/dotnet/SIL.Core.Desktop.dll
copy_auto http://build.palaso.org/guestAuth/repository/download/Libpalaso_PalasoLinux64masterContinuous/latest.lastSuccessful/SIL.Core.Desktop.pdb ../lib/dotnet/SIL.Core.Desktop.pdb
copy_auto http://build.palaso.org/guestAuth/repository/download/Libpalaso_PalasoLinux64masterContinuous/latest.lastSuccessful/SIL.Media.dll ../lib/dotnet/SIL.Media.dll
copy_auto http://build.palaso.org/guestAuth/repository/download/Libpalaso_PalasoLinux64masterContinuous/latest.lastSuccessful/SIL.Media.dll.config ../lib/dotnet/SIL.Media.dll.config
copy_auto http://build.palaso.org/guestAuth/repository/download/Libpalaso_PalasoLinux64masterContinuous/latest.lastSuccessful/SIL.Media.pdb ../lib/dotnet/SIL.Media.pdb
copy_auto http://build.palaso.org/guestAuth/repository/download/Libpalaso_PalasoLinux64masterContinuous/latest.lastSuccessful/SIL.TestUtilities.dll ../lib/dotnet/SIL.TestUtilities.dll
copy_auto http://build.palaso.org/guestAuth/repository/download/Libpalaso_PalasoLinux64masterContinuous/latest.lastSuccessful/SIL.TestUtilities.pdb ../lib/dotnet/SIL.TestUtilities.pdb
copy_auto http://build.palaso.org/guestAuth/repository/download/Libpalaso_PalasoLinux64masterContinuous/latest.lastSuccessful/SIL.Windows.Forms.dll ../lib/dotnet/SIL.Windows.Forms.dll
copy_auto http://build.palaso.org/guestAuth/repository/download/Libpalaso_PalasoLinux64masterContinuous/latest.lastSuccessful/SIL.Windows.Forms.dll.config ../lib/dotnet/SIL.Windows.Forms.dll.config
copy_auto http://build.palaso.org/guestAuth/repository/download/Libpalaso_PalasoLinux64masterContinuous/latest.lastSuccessful/SIL.Windows.Forms.pdb ../lib/dotnet/SIL.Windows.Forms.pdb
copy_auto http://build.palaso.org/guestAuth/repository/download/Libpalaso_PalasoLinux64masterContinuous/latest.lastSuccessful/SIL.Windows.Forms.GeckoBrowserAdapter.dll ../lib/dotnet/SIL.Windows.Forms.GeckoBrowserAdapter.dll
copy_auto http://build.palaso.org/guestAuth/repository/download/Libpalaso_PalasoLinux64masterContinuous/latest.lastSuccessful/SIL.Windows.Forms.GeckoBrowserAdapter.pdb ../lib/dotnet/SIL.Windows.Forms.GeckoBrowserAdapter.pdb
copy_auto http://build.palaso.org/guestAuth/repository/download/Libpalaso_PalasoLinux64masterContinuous/latest.lastSuccessful/SIL.Windows.Forms.Keyboarding.dll ../lib/dotnet/SIL.Windows.Forms.Keyboarding.dll
copy_auto http://build.palaso.org/guestAuth/repository/download/Libpalaso_PalasoLinux64masterContinuous/latest.lastSuccessful/SIL.Windows.Forms.Keyboarding.dll.config ../lib/dotnet/SIL.Windows.Forms.Keyboarding.dll.config
copy_auto http://build.palaso.org/guestAuth/repository/download/Libpalaso_PalasoLinux64masterContinuous/latest.lastSuccessful/SIL.Windows.Forms.Keyboarding.pdb ../lib/dotnet/SIL.Windows.Forms.Keyboarding.pdb
copy_auto http://build.palaso.org/guestAuth/repository/download/Libpalaso_PalasoLinux64masterContinuous/latest.lastSuccessful/SIL.Windows.Forms.WritingSystems.dll ../lib/dotnet/SIL.Windows.Forms.WritingSystems.dll
copy_auto http://build.palaso.org/guestAuth/repository/download/Libpalaso_PalasoLinux64masterContinuous/latest.lastSuccessful/SIL.Windows.Forms.WritingSystems.pdb ../lib/dotnet/SIL.Windows.Forms.WritingSystems.pdb
copy_auto http://build.palaso.org/guestAuth/repository/download/Libpalaso_PalasoLinux64masterContinuous/latest.lastSuccessful/SIL.WritingSystems.dll ../lib/dotnet/SIL.WritingSystems.dll
copy_auto http://build.palaso.org/guestAuth/repository/download/Libpalaso_PalasoLinux64masterContinuous/latest.lastSuccessful/SIL.WritingSystems.pdb ../lib/dotnet/SIL.WritingSystems.pdb
copy_auto http://build.palaso.org/guestAuth/repository/download/Libpalaso_PalasoLinux64masterContinuous/latest.lastSuccessful/taglib-sharp.dll ../lib/dotnet/taglib-sharp.dll
copy_auto http://build.palaso.org/guestAuth/repository/download/Libpalaso_PalasoLinux64masterContinuous/latest.lastSuccessful/Enchant.Net.dll ../lib/dotnet/Enchant.Net.dll
copy_auto http://build.palaso.org/guestAuth/repository/download/Libpalaso_PalasoLinux64masterContinuous/latest.lastSuccessful/Enchant.Net.dll.config ../lib/dotnet/Enchant.Net.dll.config
copy_auto http://build.palaso.org/guestAuth/repository/download/Libpalaso_PalasoLinux64masterContinuous/latest.lastSuccessful/NDesk.DBus.dll ../lib/dotnet/NDesk.DBus.dll
copy_auto http://build.palaso.org/guestAuth/repository/download/Libpalaso_PalasoLinux64masterContinuous/latest.lastSuccessful/NDesk.DBus.dll.config ../lib/dotnet/NDesk.DBus.dll.config
# begin test code added to check what jenkins is doing...
echo Current directory = `pwd`
echo ls -l ..
ls -l ..
echo ls -l ../Downloads
ls -l ../Downloads
echo ls -l ../DistFiles
ls -l ../DistFiles
echo ls -l ../build
ls -l ../build
echo ls -l ../lib/dotnet
ls -l ../lib/dotnet
echo find .. -name "pdf*.zip" -print
find .. -name "pdf*.zip" -print
# end test code
# extract downloaded zip files
unzip -uqo ../Downloads/pdfjs-viewer.zip -d "../DistFiles/pdf"
# End of script
