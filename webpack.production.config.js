var path = require('path');
var webpack = require('webpack');
var CopyWebpackPlugin = require('copy-webpack-plugin');
var JavaScriptObfuscator = require('webpack-obfuscator');
var HtmlWebpackPlugin = require('html-webpack-plugin');
var WebpackChunkHash = require("webpack-chunk-hash");

// Phaser webpack config
var phaserModule = path.join(__dirname, '/node_modules/phaser/');
var phaser = path.join(phaserModule, 'build/custom/phaser-split.js');
var pixi = path.join(phaserModule, 'build/custom/pixi.js');
var p2 = path.join(phaserModule, 'build/custom/p2.js');
var phaserCapture = path.join(__dirname, '/node_modules/phaser-capture/phaser-capture.js');

var definePlugin = new webpack.DefinePlugin({
  __DEV__: JSON.stringify(JSON.parse(process.env.BUILD_DEV || 'false'))
});

module.exports = {
  entry: {
    app: [
      'babel-polyfill',
      path.resolve(__dirname, 'src/main.js')
    ],
    vendor: ['pixi', 'p2', 'phaser', 'webfontloader']

  },
  output: {
    path: path.resolve(__dirname, 'dist'),
    publicPath: '',
    filename: 'scripts/[name].[chunkhash].js'
  },
  plugins: [
    definePlugin,
    new webpack.IgnorePlugin(/^\.\/locale$/, /moment$/),
    new webpack.optimize.UglifyJsPlugin({
      drop_console: true,
      minimize: true,
      output: {
        comments: false
      }
    }),
    new webpack.optimize.CommonsChunkPlugin({
      name: 'vendor',
      filename: 'scripts/vendor.[chunkhash].js'
    }),
    new JavaScriptObfuscator({ rotateUnicodeArray: true }, ['bundle.js']),
    new CopyWebpackPlugin([
      {
        from: {
          glob: './index.html',
        },
      },
      {
        from: './assets',
        to: './assets'
      },
    ]),
    new HtmlWebpackPlugin({
      filename: '../index.html',
      template: 'template.html',
      inject: true,
      chunksSortMode: 'dependency'
    }),
    new WebpackChunkHash(),
  ],
  module: {
    rules: [
      { test: /\.js$/, use: ['babel-loader'], include: path.join(__dirname, 'src') },
      { test: /pixi\.js/, use: ['expose-loader?PIXI'] },
      { test: /phaser-split\.js$/, use: ['expose-loader?Phaser'] },
      { test: /p2\.js/, use: ['expose-loader?p2'] }
    ]
  },
  node: {
    fs: 'empty',
    net: 'empty',
    tls: 'empty'
  },
  resolve: {
    alias: {
      'phaser': phaser,
      'pixi': pixi,
      'p2': p2,
      'phaser-capture': phaserCapture,
    }
  }
}