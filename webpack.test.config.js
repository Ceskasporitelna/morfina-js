var webpack = require('webpack');
var path = require('path');
var fs = require('fs');

var args = process.argv.slice(2);
var externals = {};
var target;
var libraryTarget;
var outputFilename;
var plugins = [
  new webpack.optimize.UglifyJsPlugin({ compress: { warnings: false } }),
  new webpack.optimize.DedupePlugin()
];

if (args.indexOf('--target-browser') != -1) {
  console.log('Targeting browser');
  outputFilename = 'tests.sfx.js';
  target = 'web';
  externals['../build/morfina-js.node.js'] = 'MorfinaJS'
  externals['nock'] = "''";

  libraryTarget = 'var'
} else {
  console.log('Targeting node.js');

  target = 'node';
  libraryTarget = 'commonjs2'
  outputFilename = 'tests.node.js'
  externals['../build/morfina-js.node.js'] = '../../build/morfina-js.node.js'

  fs.readdirSync('./node_modules')
    .filter(function (x) {
      return ['.bin'].indexOf(x) === -1;
    })
    .forEach(function (mod) {
      externals[mod] = 'commonjs ' + mod;
    });
  plugins.push(new webpack.BannerPlugin('require("source-map-support").install();',
    { raw: true, entryOnly: false }));
  externals['jasmine-ajax'] = "underscore"
}


module.exports = {
  node: {
    fs: "empty"
  },
  entry: './spec/tests.webpack.js',
  output: {
    path: path.join(__dirname, 'spec', 'build'),
    filename: outputFilename,
    library: "MorfinaJSTests",
    libraryTarget: libraryTarget
  },
  target: target,
  resolve: {
    extensions: ['', '.webpack.js', '.web.js', '.ts', '.js']
  },
  externals: externals,
  // Turn on sourcemaps
  devtool: 'source-map',
  // Add minification
  plugins: plugins,
  module: {
    loaders: [
      { test: /\.json$/, loader: "json-loader" },
      { test: /\.ts$/, loader: 'ts-loader' }
    ]
  }
};