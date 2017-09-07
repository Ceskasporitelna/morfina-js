/* global echo */
/* global cp */
require('shelljs/global');
echo("Cleaning dist folder")
rm('-rf', './dist/*');
echo("Done cleaning");
echo("Copying artifacts to ./dist folder");
cp('-Rf', './build/*', './dist');
echo("DIST DONE");