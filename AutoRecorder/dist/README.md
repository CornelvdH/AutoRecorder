Creating a distributed EXE for this project
============

Prequisites
==========
* A local installation of Bat To Exe Converter.
* AutoIt v3

How to
==========

1. If you changed the .au3 files in the src folder, first compile those to executables. Then copy them into your dist folder.
2. Copy lib/node_local.exe (actually just a stand-alone version of Node.js v0.10.26) or your own copy to the dist folder.
3. Copy main.js and runApp.bat from the src folder to the dist directory.
4. Run the Bat To Exe Converter from the dist folder, so it uses the provided settings file. Add all files from the dist folder to the compiler.

Done! Off you go.