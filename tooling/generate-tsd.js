/* global echo */
require('shelljs/global');
var replace = require('replace');



var args = process.argv.slice(2);
var moduleName = args[0];
var internalModuleName = args[1];
var entryPoint = args[2];


var sfxTsdFile = "./build/"+moduleName+".sfx.d.ts"
var nodeTsdFile = "./build/"+moduleName+".node.d.ts"



echo("Generating TSD files")
echo("Using module name: " + moduleName)
echo("Using internal module name: " + internalModuleName)
echo("Generating Node.js TSD as master copy")
exec("./node_modules/dts-generator/bin/dts-generator --types es6-promise --name "+moduleName+" --baseDir ./lib/ --out ./build/"+moduleName+".node.d.ts ./lib/*.ts")
echo("Copying SFX TSD")
cp("-f",nodeTsdFile,sfxTsdFile)

echo("Replacing modules with namespace")
replace({
  regex: /declare module .*/g,
  replacement: "declare module "+internalModuleName+" {",
  paths: [sfxTsdFile],
  silent: true
});
echo("Deleting imports/exports")
replace({
  regex: /import .*;/g,
  replacement: "",
  paths: [sfxTsdFile],
  silent: true,
})
replace({
  regex: /export .* from .*;/g,
  replacement: "",
  paths: [sfxTsdFile],
  silent: true,
})
echo("DONE")
echo("Writing additional umbrella module to node file")
echo("declare module '"+moduleName+"'{ export * from '"+moduleName+"/"+entryPoint+"'}").toEnd(nodeTsdFile)
echo("DONE")
