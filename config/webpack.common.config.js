const { CleanWebpackPlugin } = require('clean-webpack-plugin');
const CopyPlugin = require('copy-webpack-plugin');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const { BundleAnalyzerPlugin } = require('webpack-bundle-analyzer');
const path = require('path');
const webpack = require('webpack');

//NOTE: this file only contains the common config and can't be used as-is. Should be extended by webpack.[dev/prod/env].config.js
// Carries all the common configuration that will be used across
// all the different environments
module.exports = {
  entry: {
    app: './src/main.ts',
  },
  module: {
    rules: [
      { test: /\.html$/, use: 'html-loader' },
      { test: /hoops_web_viewer.js$/, use: 'raw-loader' }, // Load file w/o transpiling, equivalent to script tag
      {
        test: /\.(eot|gif|jpg|png|svg|ttf|woff|woff2)$/,
        use: {
          loader: 'file-loader',
          options: { name: '[name].[hash].[ext]' },
        },
      },
      // loads TS files in webpack.[dev/prod/mock].config.js so they can use the correct tsconfig files
    ],
  },
  plugins: [
    new CleanWebpackPlugin(),
    new CopyPlugin({
      patterns: [
        {
          from: './node_modules/@pdftron/webviewer/public',
          to: './webviewer',
        },
        { from: './public', to: path.resolve(__dirname, '..', 'dist') },
      ],
    }),
    new webpack.IgnorePlugin({
      resourceRegExp: /^\.\/locale$/,
      contextRegExp: /moment$/,
    }),
    new HtmlWebpackPlugin({
      template: './src/index.html',
      filename: 'index.html', // No use in adding a hash for the index file (since it probably wouldn't be explicitly addressed)
      inject: 'head',
    }),
    ...(process.env.ANALYZE_WEBPACK ? [new BundleAnalyzerPlugin()] : []),
  ],
  resolve: {
    extensions: ['.wasm', '.mjs', '.ts', '.js', '.json'],
    alias: {
      // These are required so as to make sure we don't have multiple copies of the same dep loaded.
      // The multiple copies are because of different moduleIds! (i thought webpack would be more aware
      // of this & prevent those duplicates automatically!). `DuplicatesPlugin` is super helpful for this
      angular$: path.resolve(__dirname, '..', 'node_modules', 'angular'),
      lodash$: path.resolve(__dirname, '..', 'node_modules', 'lodash'),
      moment$: path.resolve(__dirname, '..', 'node_modules', 'moment'),

      // These are required to make `angular-gantt` work (since `2.0.0-rc.1` doesn't do the right thing.. requires wrong stuff)
      ElementQueries$: path.resolve(
        __dirname,
        '..',
        'vendor',
        'assets',
        'javascripts',
        'angular-gantt',
        'ElementQueries.js'
      ),
      ResizeSensor$: path.resolve(
        __dirname,
        '..',
        'vendor',
        'assets',
        'javascripts',
        'angular-gantt',
        'ResizeSensor.js'
      ),
      jsPlumb$: 'jsplumb',
      'ui.tree$': 'angular-ui-tree',

      // We use 1.0.3+ed36a04 of leaflet which is not on NPM & to make leaflet.contextmenu.js
      // work with webpack, we have to alias `leaflet` like so --
      leaflet$: path.resolve(
        __dirname,
        '..',
        'vendor',
        'assets',
        'javascripts',
        'leaflet',
        'leaflet-src.js'
      ),

      // The next aliases are for making our .ts and .less relative import paths easier to read
      app: path.resolve(__dirname, '..', 'src', 'app'),
      bricks: path.resolve(__dirname, '..', 'src', 'bricks'),
      javascripts: path.resolve(
        __dirname,
        '..',
        'app',
        'assets',
        'javascripts'
      ),
      rfi: path.resolve(__dirname, '..', 'src', 'rfi'),
      modals: path.resolve(__dirname, '..', 'src', 'modals'),
      models: path.resolve(__dirname, '..', 'src', 'models'),
      services: path.resolve(__dirname, '..', 'src', 'services'),
      utils: path.resolve(__dirname, '..', 'src', 'utils'),
      controllers: path.resolve(
        __dirname,
        '..',
        'app',
        'assets',
        'javascripts',
        'controllers'
      ),
      'less-variables$': path.resolve(
        __dirname,
        '..',
        'app',
        'assets',
        'stylesheets',
        'custom_bootstrap',
        'variables.less'
      ),
      'fw-colors$': path.resolve(
        __dirname,
        '..',
        'src',
        'app',
        'shared',
        'design-system',
        'stylesheets',
        'fw-colors.less'
      ),
    },
  },
  output: {
    filename: '[name].[chunkhash].js',
    chunkFilename: '[name].bundle.[chunkhash].js',
    path: path.resolve(__dirname, '..', 'dist'),
  },
};
