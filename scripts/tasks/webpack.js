const { sh, help } = require('tasksfile');

function build(options, configType) {
  if (!configType) {
    console.log('config type parameter is required. Terminating!');
    return;
  }

  if (!['dev', 'prod', 'env'].includes(configType)) {
    console.log('Unsupported config type parameter. Terminating!');
    return;
  }

  sh(`webpack --config config/webpack.${configType}.config.js`, {
    nopipe: true,
  });
}
help(build, 'build webpack bundles', {
  params: ['CONFIG_TYPE'],
  examples: `
    webpack:build dev       - build using dev config
    webpack:build prod      - build using prod config
    webpack:build env       - build using env config
  `,
});

function devServer(options, configType = 'dev') {
  if (!['dev', 'mock'].includes(configType)) {
    console.log('Unsupported config type parameter. Terminating!');
    return;
  }

  sh(`webpack-dev-server --config config/webpack.${configType}.config.js`, {
    nopipe: true,
  });
}
help(devServer, 'run a webpack dev server', {
  params: ['CONFIG_TYPE'],
  examples: `
    webpack:devServer           - run dev server using dev config
    webpack:devServer mock      - run dev server using mock config
  `,
});

function analyze(options, configType = 'dev') {
  if (!['dev', 'prod'].includes(configType)) {
    console.log('Unsupported config type for analysis. Terminating!');
    return;
  }

  sh(
    `env ANALYZE_WEBPACK=true webpack --config config/webpack.${configType}.config.js`,
    { nopipe: true }
  );
}
help(analyze, 'analyze our webpack bundles', {
  params: ['CONFIG_TYPE'],
  examples: `
    webpack:analyze           - build and analyze dev config
    webpack:analyze prod      - build and analyze prod config
  `,
});

module.exports = {
  build,
  devServer,
  analyze,
};
