const commonConfig = require('./webpack.common.config.js');
const path = require('path');
const registerEnvVariableFileHandler = require('../scripts/production-file-server/serve-env');
const webpackMerge = require('webpack-merge');
const ForkTsCheckerWebpackPlugin = require('fork-ts-checker-webpack-plugin');
const SpeedMeasurePlugin = require('speed-measure-webpack-plugin');
const webpack = require('webpack');

const smp = new SpeedMeasurePlugin({
  disable: true,
  granularLoaderData: false,
});

module.exports = smp.wrap(
  webpackMerge.smart(commonConfig, {
    mode: 'development',
    devtool: 'cheap-module-eval-source-map',
    devServer: {
      contentBase: path.resolve(__dirname, '..', 'dist'),
      host: '0.0.0.0',
      allowedHosts: [
        '.fieldwire.com', // so that we can do dev.fieldwire.com or similar variant by adding a record in etc/hosts file => 127.0.0.1 dev.fieldwire.com
      ],
      before: registerEnvVariableFileHandler,
      overlay: true,
      port: 8080,
      writeToDisk: true,
      headers: {
        // Content-Security-Policy-Report-Only can be used if we want to dry-run, we need a reporting endpoint for that
        // we can also enable a lot of other directives as can be seen @ https://developer.mozilla.org/en-US/docs/Web/HTTP/Headers/Content-Security-Policy
        'Content-Security-Policy': "frame-ancestors 'self'",
        'Strict-Transport-Security': 'max-age=31536000; includeSubDomains',
        'Referrer-Policy': 'same-origin',
        'X-Frame-Options': 'SAMEORIGIN',
        'X-Content-Type-Options': 'nosniff',
      },
      stats: {
        colors: true,
        assets: false,
        modules: false,
      },
    },
    module: {
      rules: [
        {
          test: /hoops_web_viewer.js$/,
          use: ['cache-loader', 'raw-loader'], // Load file w/o transpiling, equivalent to script tag
        },
        {
          test: /\.(less|css)$/,
          use: ['cache-loader', 'style-loader', 'css-loader', 'less-loader'],
        },
        {
          test: /\.ts$/,
          use: [
            { loader: 'cache-loader' },
            { loader: 'thread-loader', options: { poolTimeout: Infinity } },
            {
              loader: 'ts-loader',
              options: {
                configFile: path.resolve(__dirname, 'tsconfig.dev.json'),
                experimentalWatchApi: true,
                happyPackMode: true,
              },
            },
          ],
        },
        {
          test: /\.js$/,
          exclude: /hoops_web_viewer.js$/,
          use: { loader: 'thread-loader', options: { poolTimeout: Infinity } },
        },
        {
          // Mark files inside `@angular/core` as using SystemJS style dynamic imports.
          // Removing this will cause deprecation warnings to appear.
          test: /[\/\\]@angular[\/\\]core[\/\\].+\.js$/,
          parser: { system: true }, // enable SystemJS
        },
      ],
    },
    plugins: [
      new ForkTsCheckerWebpackPlugin({
        typescript: {
          configFile: path.resolve(__dirname, 'tsconfig.dev.json'),
        },
        eslint: {
          enabled: true,
          files: './src/**/*.ts',
        },
      }),
      // silence warning caused by angular/core/fesm2015. source: https://codecraft.tv/courses/angularjs-migration/step-6-dual-booting-to-angular/dual-boot-with-angular-and-angularjs/
      new webpack.ContextReplacementPlugin(
        // The (\\|\/) piece accounts for path separators for Windows and MacOS
        /(.+)?angular(\\|\/)core(.+)?/,
        path.join(__dirname, 'src'), // location of your src
        {} // a map of your routes
      ),
    ],
    output: {
      filename: '[name].dev.js',
      path: path.resolve(__dirname, '..', 'dist'),
      pathinfo: false,
    },
  })
);
