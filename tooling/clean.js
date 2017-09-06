/* global echo */
/* global rm */
require('shelljs/global');
echo("Cleaning build folder")
rm('-rf', './build/*');