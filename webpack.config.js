var webpack = require('webpack');
var path = require('path');
var fs = require('fs');
var UnminifiedWebpackPlugin = require('unminified-webpack-plugin');

var args = process.argv.slice(2);
var nodeModules = null;
var target;
var libraryTarget;
var outputFilename;
var plugins = [
  new webpack.optimize.UglifyJsPlugin({ compress: { warnings: false } }),
  new UnminifiedWebpackPlugin(),
  new webpack.optimize.DedupePlugin()
];

if (args.indexOf('--target-browser') != -1) {
  console.log('Targeting browser');
  outputFilename = 'morfina-js.sfx.min.js';
  target = 'web';
  libraryTarget = 'var'
} else {
  console.log('Targeting node.js');
  nodeModules = {};
  target = 'node';
  libraryTarget = 'commonjs2'
  outputFilename = 'morfina-js.node.min.js'
  fs.readdirSync('node_modules')
    .filter(function (x) {
      return ['.bin'].indexOf(x) === -1;
    })
    .forEach(function (mod) {
      nodeModules[mod] = 'commonjs ' + mod;
    });
  plugins.push(new webpack.BannerPlugin('require("source-map-support").install();',
    { raw: true, entryOnly: false }));

  //new webpack.IgnorePlugin(/webpack.\.js$/),
}


module.exports = {
  node: {
    fs: "empty"
  },
  entry: './lib/index.ts',
  output: {
    path: path.join(__dirname, 'build'),
    filename: outputFilename,
    library: "MorfinaJS",
    libraryTarget: libraryTarget
  },
  target: target,
  resolve: {
    extensions: ['', '.webpack.js', '.web.js', '.ts', '.js']
  },
  externals: nodeModules,
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