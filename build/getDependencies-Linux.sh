#!/bin/bash
# server=build.palaso.org
# project=Bloom
# build=Bloom-Default-precise64-Auto (master)
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
copy_curl $1 $2
elif [ "$where_wget" != "" ]
then
copy_wget $1 $2
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
curl -# -L -z $2 -o $2 $1
else
curl -# -L -o $2 $1
fi
}

copy_wget() {
echo "wget: $2 <= $1"
f1=$(basename $1)
f2=$(basename $2)
cd $(dirname $2)
wget -q -L -N $1
# wget has no true equivalent of curl's -o option.
# Different versions of wget handle (or not) % escaping differently.
# A URL query is the only reason why $f1 and $f2 should differ.
if [ "$f1" != "$f2" ]; then mv $f2\?* $f2; fi
cd -
}

# *** Results ***
# build: Bloom-Default-precise64-Auto (master) (bt403)
# project: Bloom
# URL: http://build.palaso.org/viewType.html?buildTypeId=bt403
# VCS: git://github.com/BloomBooks/BloomDesktop.git [master]
# dependencies:
# [0] build: bloom-win32-static-dependencies (bt396)
#     project: Bloom
#     URL: http://build.palaso.org/viewType.html?buildTypeId=bt396
#     clean: false
#     revision: latest.lastSuccessful
#     paths: {"connections.dll"=>"DistFiles", "*.chm"=>"DistFiles", "MSBuild.Community.Tasks.dll"=>"build/", "MSBuild.Community.Tasks.Targets"=>"build/"}
# [2] build: Squirrel (Bloom_Squirrel)
#     project: Bloom
#     URL: http://build.palaso.org/viewType.html?buildTypeId=Bloom_Squirrel
#     clean: false
#     revision: latest.lastSuccessful
#     paths: {"Squirrel.dll"=>"lib/dotnet", "ICSharpCode.SharpZipLib.*"=>"lib/dotnet"}
#     VCS: https://github.com/BloomBooks/Squirrel.Windows.git [refs/heads/master]
# [3] build: YouTrackSharp (Bloom_YouTrackSharp)
#     project: Bloom
#     URL: http://build.palaso.org/viewType.html?buildTypeId=Bloom_YouTrackSharp
#     clean: false
#     revision: latest.lastSuccessful
#     paths: {"bin/YouTrackSharp.dll"=>"lib/dotnet", "bin/YouTrackSharp.pdb"=>"lib/dotnet"}
#     VCS: https://github.com/phillip-hopper/YouTrackSharp.git [LinuxCompatible]
# [4] build: pdf.js (bt401)
#     project: BuildTasks
#     URL: http://build.palaso.org/viewType.html?buildTypeId=bt401
#     clean: false
#     revision: latest.lastSuccessful
#     paths: {"pdfjs-viewer.zip!**"=>"DistFiles/pdf"}
#     VCS: https://github.com/mozilla/pdf.js.git [gh-pages]
# [5] build: chorus-precise64-master Continuous (bt323)
#     project: Chorus
#     URL: http://build.palaso.org/viewType.html?buildTypeId=bt323
#     clean: false
#     revision: latest.lastSuccessful
#     paths: {"*.exe*"=>"lib/dotnet", "*.dll*"=>"lib/dotnet", "Mercurial-x86_64.zip!**"=>"Mercurial-x86_64", "Mercurial-i686.zip!**"=>"Mercurial-i686", "MercurialExtensions/**"=>"MercurialExtensions"}
#     VCS: https://github.com/sillsdev/chorus.git [master]
# [6] build: GeckofxHtmlToPdf-precise64-continuous (bt464)
#     project: GeckofxHtmlToPdf
#     URL: http://build.palaso.org/viewType.html?buildTypeId=bt464
#     clean: false
#     revision: latest.lastSuccessful
#     paths: {"Args.dll"=>"lib/dotnet", "GeckofxHtmlToPdf.exe"=>"lib/dotnet", "GeckofxHtmlToPdf.exe.config"=>"lib/dotnet"}
#     VCS: https://github.com/hatton/geckofxHtmlToPdf [refs/heads/master]
# [7] build: icucil-precise64-Continuous (bt281)
#     project: Libraries
#     URL: http://build.palaso.org/viewType.html?buildTypeId=bt281
#     clean: false
#     revision: latest.lastSuccessful
#     paths: {"icu.net.*"=>"lib/dotnet/icu48"}
#     VCS: https://github.com/sillsdev/icu-dotnet [master]
# [8] build: icucil-precise64-icu52 Continuous (bt413)
#     project: Libraries
#     URL: http://build.palaso.org/viewType.html?buildTypeId=bt413
#     clean: false
#     revision: latest.lastSuccessful
#     paths: {"icu.net.*"=>"lib/dotnet/icu52"}
#     VCS: https://github.com/sillsdev/icu-dotnet [master]
# [9] build: PdfDroplet-Win-Dev-Continuous (bt54)
#     project: PdfDroplet
#     URL: http://build.palaso.org/viewType.html?buildTypeId=bt54
#     clean: false
#     revision: latest.lastSuccessful
#     paths: {"PdfDroplet.exe"=>"lib/dotnet", "PdfSharp.dll*"=>"lib/dotnet"}
#     VCS: http://bitbucket.org/hatton/pdfdroplet [default]
# [10] build: TidyManaged-master-precise64-continuous (bt351)
#     project: TidyManaged
#     URL: http://build.palaso.org/viewType.html?buildTypeId=bt351
#     clean: false
#     revision: latest.lastSuccessful
#     paths: {"TidyManaged.dll*"=>"lib/dotnet"}
#     VCS: https://github.com/BloomBooks/TidyManaged.git [master]
# [11] build: palaso-precise64-master Continuous (bt322)
#     project: libpalaso
#     URL: http://build.palaso.org/viewType.html?buildTypeId=bt322
#     clean: false
#     revision: latest.lastSuccessful
#     paths: {"Palaso.BuildTasks.dll"=>"build/", "*.dll*"=>"lib/dotnet"}
#     VCS: https://github.com/sillsdev/libpalaso.git [master]

# make sure output directories exist
mkdir -p ../DistFiles
mkdir -p ../DistFiles/pdf
mkdir -p ../Downloads
mkdir -p ../Mercurial-i686
mkdir -p ../Mercurial-x86_64
mkdir -p ../MercurialExtensions
mkdir -p ../MercurialExtensions/fixutf8
mkdir -p ../build/
mkdir -p ../lib/dotnet
mkdir -p ../lib/dotnet/icu48
mkdir -p ../lib/dotnet/icu52

# download artifact dependencies
copy_auto http://build.palaso.org/guestAuth/repository/download/bt396/latest.lastSuccessful/connections.dll ../DistFiles/connections.dll
copy_auto http://build.palaso.org/guestAuth/repository/download/bt396/latest.lastSuccessful/Bloom.chm ../DistFiles/Bloom.chm
copy_auto http://build.palaso.org/guestAuth/repository/download/bt396/latest.lastSuccessful/MSBuild.Community.Tasks.dll ../build/MSBuild.Community.Tasks.dll
copy_auto http://build.palaso.org/guestAuth/repository/download/bt396/latest.lastSuccessful/MSBuild.Community.Tasks.Targets ../build/MSBuild.Community.Tasks.Targets
copy_auto http://build.palaso.org/guestAuth/repository/download/Bloom_Squirrel/latest.lastSuccessful/Squirrel.dll ../lib/dotnet/Squirrel.dll
copy_auto http://build.palaso.org/guestAuth/repository/download/Bloom_Squirrel/latest.lastSuccessful/ICSharpCode.SharpZipLib.dll ../lib/dotnet/ICSharpCode.SharpZipLib.dll
copy_auto http://build.palaso.org/guestAuth/repository/download/Bloom_Squirrel/latest.lastSuccessful/ICSharpCode.SharpZipLib.xml ../lib/dotnet/ICSharpCode.SharpZipLib.xml
copy_auto http://build.palaso.org/guestAuth/repository/download/Bloom_YouTrackSharp/latest.lastSuccessful/bin/YouTrackSharp.dll ../lib/dotnet/YouTrackSharp.dll
copy_auto http://build.palaso.org/guestAuth/repository/download/Bloom_YouTrackSharp/latest.lastSuccessful/bin/YouTrackSharp.pdb ../lib/dotnet/YouTrackSharp.pdb
copy_auto http://build.palaso.org/guestAuth/repository/download/bt401/latest.lastSuccessful/pdfjs-viewer.zip ../Downloads/pdfjs-viewer.zip
copy_auto http://build.palaso.org/guestAuth/repository/download/bt323/latest.lastSuccessful/Chorus.exe?branch=%3Cdefault%3E ../lib/dotnet/Chorus.exe
copy_auto http://build.palaso.org/guestAuth/repository/download/bt323/latest.lastSuccessful/Chorus.exe.mdb?branch=%3Cdefault%3E ../lib/dotnet/Chorus.exe.mdb
copy_auto http://build.palaso.org/guestAuth/repository/download/bt323/latest.lastSuccessful/ChorusHub.exe?branch=%3Cdefault%3E ../lib/dotnet/ChorusHub.exe
copy_auto http://build.palaso.org/guestAuth/repository/download/bt323/latest.lastSuccessful/ChorusHub.exe.mdb?branch=%3Cdefault%3E ../lib/dotnet/ChorusHub.exe.mdb
copy_auto http://build.palaso.org/guestAuth/repository/download/bt323/latest.lastSuccessful/ChorusHubApp.exe?branch=%3Cdefault%3E ../lib/dotnet/ChorusHubApp.exe
copy_auto http://build.palaso.org/guestAuth/repository/download/bt323/latest.lastSuccessful/ChorusHubApp.exe.mdb?branch=%3Cdefault%3E ../lib/dotnet/ChorusHubApp.exe.mdb
copy_auto http://build.palaso.org/guestAuth/repository/download/bt323/latest.lastSuccessful/ChorusMerge.exe?branch=%3Cdefault%3E ../lib/dotnet/ChorusMerge.exe
copy_auto http://build.palaso.org/guestAuth/repository/download/bt323/latest.lastSuccessful/ChorusMerge.exe.mdb?branch=%3Cdefault%3E ../lib/dotnet/ChorusMerge.exe.mdb
copy_auto http://build.palaso.org/guestAuth/repository/download/bt323/latest.lastSuccessful/debug/Chorus.exe?branch=%3Cdefault%3E ../lib/dotnet/Chorus.exe
copy_auto http://build.palaso.org/guestAuth/repository/download/bt323/latest.lastSuccessful/debug/Chorus.exe.mdb?branch=%3Cdefault%3E ../lib/dotnet/Chorus.exe.mdb
copy_auto http://build.palaso.org/guestAuth/repository/download/bt323/latest.lastSuccessful/debug/ChorusHub.exe?branch=%3Cdefault%3E ../lib/dotnet/ChorusHub.exe
copy_auto http://build.palaso.org/guestAuth/repository/download/bt323/latest.lastSuccessful/debug/ChorusHub.exe.mdb?branch=%3Cdefault%3E ../lib/dotnet/ChorusHub.exe.mdb
copy_auto http://build.palaso.org/guestAuth/repository/download/bt323/latest.lastSuccessful/debug/ChorusMerge.exe?branch=%3Cdefault%3E ../lib/dotnet/ChorusMerge.exe
copy_auto http://build.palaso.org/guestAuth/repository/download/bt323/latest.lastSuccessful/debug/ChorusMerge.exe.mdb?branch=%3Cdefault%3E ../lib/dotnet/ChorusMerge.exe.mdb
copy_auto http://build.palaso.org/guestAuth/repository/download/bt323/latest.lastSuccessful/Autofac.dll?branch=%3Cdefault%3E ../lib/dotnet/Autofac.dll
copy_auto http://build.palaso.org/guestAuth/repository/download/bt323/latest.lastSuccessful/LibChorus.TestUtilities.dll?branch=%3Cdefault%3E ../lib/dotnet/LibChorus.TestUtilities.dll
copy_auto http://build.palaso.org/guestAuth/repository/download/bt323/latest.lastSuccessful/LibChorus.TestUtilities.dll.mdb?branch=%3Cdefault%3E ../lib/dotnet/LibChorus.TestUtilities.dll.mdb
copy_auto http://build.palaso.org/guestAuth/repository/download/bt323/latest.lastSuccessful/LibChorus.dll?branch=%3Cdefault%3E ../lib/dotnet/LibChorus.dll
copy_auto http://build.palaso.org/guestAuth/repository/download/bt323/latest.lastSuccessful/LibChorus.dll.mdb?branch=%3Cdefault%3E ../lib/dotnet/LibChorus.dll.mdb
copy_auto http://build.palaso.org/guestAuth/repository/download/bt323/latest.lastSuccessful/NDesk.DBus.dll?branch=%3Cdefault%3E ../lib/dotnet/NDesk.DBus.dll
copy_auto http://build.palaso.org/guestAuth/repository/download/bt323/latest.lastSuccessful/NDesk.DBus.dll.config?branch=%3Cdefault%3E ../lib/dotnet/NDesk.DBus.dll.config
copy_auto http://build.palaso.org/guestAuth/repository/download/bt323/latest.lastSuccessful/Vulcan.Uczniowie.HelpProvider.dll?branch=%3Cdefault%3E ../lib/dotnet/Vulcan.Uczniowie.HelpProvider.dll
copy_auto http://build.palaso.org/guestAuth/repository/download/bt323/latest.lastSuccessful/debug/Autofac.dll?branch=%3Cdefault%3E ../lib/dotnet/Autofac.dll
copy_auto http://build.palaso.org/guestAuth/repository/download/bt323/latest.lastSuccessful/debug/LibChorus.TestUtilities.dll?branch=%3Cdefault%3E ../lib/dotnet/LibChorus.TestUtilities.dll
copy_auto http://build.palaso.org/guestAuth/repository/download/bt323/latest.lastSuccessful/debug/LibChorus.TestUtilities.dll.mdb?branch=%3Cdefault%3E ../lib/dotnet/LibChorus.TestUtilities.dll.mdb
copy_auto http://build.palaso.org/guestAuth/repository/download/bt323/latest.lastSuccessful/debug/LibChorus.dll?branch=%3Cdefault%3E ../lib/dotnet/LibChorus.dll
copy_auto http://build.palaso.org/guestAuth/repository/download/bt323/latest.lastSuccessful/debug/LibChorus.dll.mdb?branch=%3Cdefault%3E ../lib/dotnet/LibChorus.dll.mdb
copy_auto http://build.palaso.org/guestAuth/repository/download/bt323/latest.lastSuccessful/debug/NDesk.DBus.dll?branch=%3Cdefault%3E ../lib/dotnet/NDesk.DBus.dll
copy_auto http://build.palaso.org/guestAuth/repository/download/bt323/latest.lastSuccessful/debug/NDesk.DBus.dll.config?branch=%3Cdefault%3E ../lib/dotnet/NDesk.DBus.dll.config
copy_auto http://build.palaso.org/guestAuth/repository/download/bt323/latest.lastSuccessful/Mercurial-x86_64.zip?branch=%3Cdefault%3E ../Downloads/Mercurial-x86_64.zip
copy_auto http://build.palaso.org/guestAuth/repository/download/bt323/latest.lastSuccessful/Mercurial-i686.zip?branch=%3Cdefault%3E ../Downloads/Mercurial-i686.zip
copy_auto http://build.palaso.org/guestAuth/repository/download/bt323/latest.lastSuccessful/MercurialExtensions/.guidsForInstaller.xml?branch=%3Cdefault%3E ../MercurialExtensions/.guidsForInstaller.xml
copy_auto http://build.palaso.org/guestAuth/repository/download/bt323/latest.lastSuccessful/MercurialExtensions/Dummy.txt?branch=%3Cdefault%3E ../MercurialExtensions/Dummy.txt
copy_auto http://build.palaso.org/guestAuth/repository/download/bt323/latest.lastSuccessful/MercurialExtensions/fixutf8/.gitignore?branch=%3Cdefault%3E ../MercurialExtensions/fixutf8/.gitignore
copy_auto http://build.palaso.org/guestAuth/repository/download/bt323/latest.lastSuccessful/MercurialExtensions/fixutf8/.guidsForInstaller.xml?branch=%3Cdefault%3E ../MercurialExtensions/fixutf8/.guidsForInstaller.xml
copy_auto http://build.palaso.org/guestAuth/repository/download/bt323/latest.lastSuccessful/MercurialExtensions/fixutf8/.hg_archival.txt?branch=%3Cdefault%3E ../MercurialExtensions/fixutf8/.hg_archival.txt
copy_auto http://build.palaso.org/guestAuth/repository/download/bt323/latest.lastSuccessful/MercurialExtensions/fixutf8/.hgignore?branch=%3Cdefault%3E ../MercurialExtensions/fixutf8/.hgignore
copy_auto http://build.palaso.org/guestAuth/repository/download/bt323/latest.lastSuccessful/MercurialExtensions/fixutf8/README.?branch=%3Cdefault%3E ../MercurialExtensions/fixutf8/README.
copy_auto http://build.palaso.org/guestAuth/repository/download/bt323/latest.lastSuccessful/MercurialExtensions/fixutf8/buildcpmap.py?branch=%3Cdefault%3E ../MercurialExtensions/fixutf8/buildcpmap.py
copy_auto http://build.palaso.org/guestAuth/repository/download/bt323/latest.lastSuccessful/MercurialExtensions/fixutf8/cpmap.pyc?branch=%3Cdefault%3E ../MercurialExtensions/fixutf8/cpmap.pyc
copy_auto http://build.palaso.org/guestAuth/repository/download/bt323/latest.lastSuccessful/MercurialExtensions/fixutf8/fixutf8.py?branch=%3Cdefault%3E ../MercurialExtensions/fixutf8/fixutf8.py
copy_auto http://build.palaso.org/guestAuth/repository/download/bt323/latest.lastSuccessful/MercurialExtensions/fixutf8/fixutf8.pyc?branch=%3Cdefault%3E ../MercurialExtensions/fixutf8/fixutf8.pyc
copy_auto http://build.palaso.org/guestAuth/repository/download/bt323/latest.lastSuccessful/MercurialExtensions/fixutf8/fixutf8.pyo?branch=%3Cdefault%3E ../MercurialExtensions/fixutf8/fixutf8.pyo
copy_auto http://build.palaso.org/guestAuth/repository/download/bt323/latest.lastSuccessful/MercurialExtensions/fixutf8/osutil.py?branch=%3Cdefault%3E ../MercurialExtensions/fixutf8/osutil.py
copy_auto http://build.palaso.org/guestAuth/repository/download/bt323/latest.lastSuccessful/MercurialExtensions/fixutf8/osutil.pyc?branch=%3Cdefault%3E ../MercurialExtensions/fixutf8/osutil.pyc
copy_auto http://build.palaso.org/guestAuth/repository/download/bt323/latest.lastSuccessful/MercurialExtensions/fixutf8/osutil.pyo?branch=%3Cdefault%3E ../MercurialExtensions/fixutf8/osutil.pyo
copy_auto http://build.palaso.org/guestAuth/repository/download/bt323/latest.lastSuccessful/MercurialExtensions/fixutf8/win32helper.py?branch=%3Cdefault%3E ../MercurialExtensions/fixutf8/win32helper.py
copy_auto http://build.palaso.org/guestAuth/repository/download/bt323/latest.lastSuccessful/MercurialExtensions/fixutf8/win32helper.pyc?branch=%3Cdefault%3E ../MercurialExtensions/fixutf8/win32helper.pyc
copy_auto http://build.palaso.org/guestAuth/repository/download/bt323/latest.lastSuccessful/MercurialExtensions/fixutf8/win32helper.pyo?branch=%3Cdefault%3E ../MercurialExtensions/fixutf8/win32helper.pyo
copy_auto http://build.palaso.org/guestAuth/repository/download/bt464/latest.lastSuccessful/Args.dll ../lib/dotnet/Args.dll
copy_auto http://build.palaso.org/guestAuth/repository/download/bt464/latest.lastSuccessful/GeckofxHtmlToPdf.exe ../lib/dotnet/GeckofxHtmlToPdf.exe
copy_auto http://build.palaso.org/guestAuth/repository/download/bt464/latest.lastSuccessful/GeckofxHtmlToPdf.exe.config ../lib/dotnet/GeckofxHtmlToPdf.exe.config
copy_auto http://build.palaso.org/guestAuth/repository/download/bt281/latest.lastSuccessful/icu.net.dll ../lib/dotnet/icu48/icu.net.dll
copy_auto http://build.palaso.org/guestAuth/repository/download/bt281/latest.lastSuccessful/icu.net.dll.config ../lib/dotnet/icu48/icu.net.dll.config
copy_auto http://build.palaso.org/guestAuth/repository/download/bt281/latest.lastSuccessful/icu.net.dll.mdb ../lib/dotnet/icu48/icu.net.dll.mdb
copy_auto http://build.palaso.org/guestAuth/repository/download/bt413/latest.lastSuccessful/icu.net.dll ../lib/dotnet/icu52/icu.net.dll
copy_auto http://build.palaso.org/guestAuth/repository/download/bt413/latest.lastSuccessful/icu.net.dll.config ../lib/dotnet/icu52/icu.net.dll.config
copy_auto http://build.palaso.org/guestAuth/repository/download/bt413/latest.lastSuccessful/icu.net.dll.mdb ../lib/dotnet/icu52/icu.net.dll.mdb
copy_auto http://build.palaso.org/guestAuth/repository/download/bt54/latest.lastSuccessful/PdfDroplet.exe ../lib/dotnet/PdfDroplet.exe
copy_auto http://build.palaso.org/guestAuth/repository/download/bt54/latest.lastSuccessful/PdfSharp.dll ../lib/dotnet/PdfSharp.dll
copy_auto http://build.palaso.org/guestAuth/repository/download/bt351/latest.lastSuccessful/TidyManaged.dll ../lib/dotnet/TidyManaged.dll
copy_auto http://build.palaso.org/guestAuth/repository/download/bt351/latest.lastSuccessful/TidyManaged.dll.config ../lib/dotnet/TidyManaged.dll.config
copy_auto http://build.palaso.org/guestAuth/repository/download/bt322/latest.lastSuccessful/Palaso.BuildTasks.dll?branch=%3Cdefault%3E ../build/Palaso.BuildTasks.dll
copy_auto http://build.palaso.org/guestAuth/repository/download/bt322/latest.lastSuccessful/Commons.Xml.Relaxng.dll?branch=%3Cdefault%3E ../lib/dotnet/Commons.Xml.Relaxng.dll
copy_auto http://build.palaso.org/guestAuth/repository/download/bt322/latest.lastSuccessful/Enchant.Net.dll?branch=%3Cdefault%3E ../lib/dotnet/Enchant.Net.dll
copy_auto http://build.palaso.org/guestAuth/repository/download/bt322/latest.lastSuccessful/Enchant.Net.dll.config?branch=%3Cdefault%3E ../lib/dotnet/Enchant.Net.dll.config
copy_auto http://build.palaso.org/guestAuth/repository/download/bt322/latest.lastSuccessful/Ionic.Zip.dll?branch=%3Cdefault%3E ../lib/dotnet/Ionic.Zip.dll
copy_auto http://build.palaso.org/guestAuth/repository/download/bt322/latest.lastSuccessful/L10NSharp.dll?branch=%3Cdefault%3E ../lib/dotnet/L10NSharp.dll
copy_auto http://build.palaso.org/guestAuth/repository/download/bt322/latest.lastSuccessful/NDesk.DBus.dll?branch=%3Cdefault%3E ../lib/dotnet/NDesk.DBus.dll
copy_auto http://build.palaso.org/guestAuth/repository/download/bt322/latest.lastSuccessful/NDesk.DBus.dll.config?branch=%3Cdefault%3E ../lib/dotnet/NDesk.DBus.dll.config
copy_auto http://build.palaso.org/guestAuth/repository/download/bt322/latest.lastSuccessful/Newtonsoft.Json.dll?branch=%3Cdefault%3E ../lib/dotnet/Newtonsoft.Json.dll
copy_auto http://build.palaso.org/guestAuth/repository/download/bt322/latest.lastSuccessful/Palaso.BuildTasks.dll?branch=%3Cdefault%3E ../lib/dotnet/Palaso.BuildTasks.dll
copy_auto http://build.palaso.org/guestAuth/repository/download/bt322/latest.lastSuccessful/SIL.Archiving.dll?branch=%3Cdefault%3E ../lib/dotnet/SIL.Archiving.dll
copy_auto http://build.palaso.org/guestAuth/repository/download/bt322/latest.lastSuccessful/SIL.Archiving.dll.config?branch=%3Cdefault%3E ../lib/dotnet/SIL.Archiving.dll.config
copy_auto http://build.palaso.org/guestAuth/repository/download/bt322/latest.lastSuccessful/SIL.Archiving.dll.mdb?branch=%3Cdefault%3E ../lib/dotnet/SIL.Archiving.dll.mdb
copy_auto http://build.palaso.org/guestAuth/repository/download/bt322/latest.lastSuccessful/SIL.Core.Tests.dll?branch=%3Cdefault%3E ../lib/dotnet/SIL.Core.Tests.dll
copy_auto http://build.palaso.org/guestAuth/repository/download/bt322/latest.lastSuccessful/SIL.Core.Tests.dll.mdb?branch=%3Cdefault%3E ../lib/dotnet/SIL.Core.Tests.dll.mdb
copy_auto http://build.palaso.org/guestAuth/repository/download/bt322/latest.lastSuccessful/SIL.Core.dll?branch=%3Cdefault%3E ../lib/dotnet/SIL.Core.dll
copy_auto http://build.palaso.org/guestAuth/repository/download/bt322/latest.lastSuccessful/SIL.Core.dll.config?branch=%3Cdefault%3E ../lib/dotnet/SIL.Core.dll.config
copy_auto http://build.palaso.org/guestAuth/repository/download/bt322/latest.lastSuccessful/SIL.Core.dll.mdb?branch=%3Cdefault%3E ../lib/dotnet/SIL.Core.dll.mdb
copy_auto http://build.palaso.org/guestAuth/repository/download/bt322/latest.lastSuccessful/SIL.DictionaryServices.dll?branch=%3Cdefault%3E ../lib/dotnet/SIL.DictionaryServices.dll
copy_auto http://build.palaso.org/guestAuth/repository/download/bt322/latest.lastSuccessful/SIL.DictionaryServices.dll.mdb?branch=%3Cdefault%3E ../lib/dotnet/SIL.DictionaryServices.dll.mdb
copy_auto http://build.palaso.org/guestAuth/repository/download/bt322/latest.lastSuccessful/SIL.Lexicon.dll?branch=%3Cdefault%3E ../lib/dotnet/SIL.Lexicon.dll
copy_auto http://build.palaso.org/guestAuth/repository/download/bt322/latest.lastSuccessful/SIL.Lexicon.dll.mdb?branch=%3Cdefault%3E ../lib/dotnet/SIL.Lexicon.dll.mdb
copy_auto http://build.palaso.org/guestAuth/repository/download/bt322/latest.lastSuccessful/SIL.Lift.dll?branch=%3Cdefault%3E ../lib/dotnet/SIL.Lift.dll
copy_auto http://build.palaso.org/guestAuth/repository/download/bt322/latest.lastSuccessful/SIL.Lift.dll.mdb?branch=%3Cdefault%3E ../lib/dotnet/SIL.Lift.dll.mdb
copy_auto http://build.palaso.org/guestAuth/repository/download/bt322/latest.lastSuccessful/SIL.Media.dll?branch=%3Cdefault%3E ../lib/dotnet/SIL.Media.dll
copy_auto http://build.palaso.org/guestAuth/repository/download/bt322/latest.lastSuccessful/SIL.Media.dll.config?branch=%3Cdefault%3E ../lib/dotnet/SIL.Media.dll.config
copy_auto http://build.palaso.org/guestAuth/repository/download/bt322/latest.lastSuccessful/SIL.Media.dll.mdb?branch=%3Cdefault%3E ../lib/dotnet/SIL.Media.dll.mdb
copy_auto http://build.palaso.org/guestAuth/repository/download/bt322/latest.lastSuccessful/SIL.Scripture.dll?branch=%3Cdefault%3E ../lib/dotnet/SIL.Scripture.dll
copy_auto http://build.palaso.org/guestAuth/repository/download/bt322/latest.lastSuccessful/SIL.Scripture.dll.mdb?branch=%3Cdefault%3E ../lib/dotnet/SIL.Scripture.dll.mdb
copy_auto http://build.palaso.org/guestAuth/repository/download/bt322/latest.lastSuccessful/SIL.TestUtilities.dll?branch=%3Cdefault%3E ../lib/dotnet/SIL.TestUtilities.dll
copy_auto http://build.palaso.org/guestAuth/repository/download/bt322/latest.lastSuccessful/SIL.TestUtilities.dll.mdb?branch=%3Cdefault%3E ../lib/dotnet/SIL.TestUtilities.dll.mdb
copy_auto http://build.palaso.org/guestAuth/repository/download/bt322/latest.lastSuccessful/SIL.Windows.Forms.GeckoBrowserAdapter.dll?branch=%3Cdefault%3E ../lib/dotnet/SIL.Windows.Forms.GeckoBrowserAdapter.dll
copy_auto http://build.palaso.org/guestAuth/repository/download/bt322/latest.lastSuccessful/SIL.Windows.Forms.GeckoBrowserAdapter.dll.mdb?branch=%3Cdefault%3E ../lib/dotnet/SIL.Windows.Forms.GeckoBrowserAdapter.dll.mdb
copy_auto http://build.palaso.org/guestAuth/repository/download/bt322/latest.lastSuccessful/SIL.Windows.Forms.Keyboarding.dll?branch=%3Cdefault%3E ../lib/dotnet/SIL.Windows.Forms.Keyboarding.dll
copy_auto http://build.palaso.org/guestAuth/repository/download/bt322/latest.lastSuccessful/SIL.Windows.Forms.Keyboarding.dll.config?branch=%3Cdefault%3E ../lib/dotnet/SIL.Windows.Forms.Keyboarding.dll.config
copy_auto http://build.palaso.org/guestAuth/repository/download/bt322/latest.lastSuccessful/SIL.Windows.Forms.Keyboarding.dll.mdb?branch=%3Cdefault%3E ../lib/dotnet/SIL.Windows.Forms.Keyboarding.dll.mdb
copy_auto http://build.palaso.org/guestAuth/repository/download/bt322/latest.lastSuccessful/SIL.Windows.Forms.Scripture.dll?branch=%3Cdefault%3E ../lib/dotnet/SIL.Windows.Forms.Scripture.dll
copy_auto http://build.palaso.org/guestAuth/repository/download/bt322/latest.lastSuccessful/SIL.Windows.Forms.Scripture.dll.mdb?branch=%3Cdefault%3E ../lib/dotnet/SIL.Windows.Forms.Scripture.dll.mdb
copy_auto http://build.palaso.org/guestAuth/repository/download/bt322/latest.lastSuccessful/SIL.Windows.Forms.WritingSystems.dll?branch=%3Cdefault%3E ../lib/dotnet/SIL.Windows.Forms.WritingSystems.dll
copy_auto http://build.palaso.org/guestAuth/repository/download/bt322/latest.lastSuccessful/SIL.Windows.Forms.WritingSystems.dll.mdb?branch=%3Cdefault%3E ../lib/dotnet/SIL.Windows.Forms.WritingSystems.dll.mdb
copy_auto http://build.palaso.org/guestAuth/repository/download/bt322/latest.lastSuccessful/SIL.Windows.Forms.dll?branch=%3Cdefault%3E ../lib/dotnet/SIL.Windows.Forms.dll
copy_auto http://build.palaso.org/guestAuth/repository/download/bt322/latest.lastSuccessful/SIL.Windows.Forms.dll.config?branch=%3Cdefault%3E ../lib/dotnet/SIL.Windows.Forms.dll.config
copy_auto http://build.palaso.org/guestAuth/repository/download/bt322/latest.lastSuccessful/SIL.Windows.Forms.dll.mdb?branch=%3Cdefault%3E ../lib/dotnet/SIL.Windows.Forms.dll.mdb
copy_auto http://build.palaso.org/guestAuth/repository/download/bt322/latest.lastSuccessful/SIL.WritingSystems.Tests.dll?branch=%3Cdefault%3E ../lib/dotnet/SIL.WritingSystems.Tests.dll
copy_auto http://build.palaso.org/guestAuth/repository/download/bt322/latest.lastSuccessful/SIL.WritingSystems.Tests.dll.mdb?branch=%3Cdefault%3E ../lib/dotnet/SIL.WritingSystems.Tests.dll.mdb
copy_auto http://build.palaso.org/guestAuth/repository/download/bt322/latest.lastSuccessful/SIL.WritingSystems.dll?branch=%3Cdefault%3E ../lib/dotnet/SIL.WritingSystems.dll
copy_auto http://build.palaso.org/guestAuth/repository/download/bt322/latest.lastSuccessful/SIL.WritingSystems.dll.mdb?branch=%3Cdefault%3E ../lib/dotnet/SIL.WritingSystems.dll.mdb
copy_auto http://build.palaso.org/guestAuth/repository/download/bt322/latest.lastSuccessful/Spart.dll?branch=%3Cdefault%3E ../lib/dotnet/Spart.dll
copy_auto http://build.palaso.org/guestAuth/repository/download/bt322/latest.lastSuccessful/ibusdotnet.dll?branch=%3Cdefault%3E ../lib/dotnet/ibusdotnet.dll
copy_auto http://build.palaso.org/guestAuth/repository/download/bt322/latest.lastSuccessful/taglib-sharp.dll?branch=%3Cdefault%3E ../lib/dotnet/taglib-sharp.dll
# extract downloaded zip files
unzip -uqo ../Downloads/pdfjs-viewer.zip -d ../DistFiles/pdf
unzip -uqo ../Downloads/Mercurial-x86_64.zip -d ../Mercurial-x86_64
unzip -uqo ../Downloads/Mercurial-i686.zip -d ../Mercurial-i686
# End of script
