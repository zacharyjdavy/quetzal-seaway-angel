const { cli } = require('tasksfile');

cli({
  format: require('./tasks/format'),
  lint: require('./tasks/lint'),
  test: require('./tasks/test'),
  typescript: require('./tasks/typescript'),
  webpack: require('./tasks/webpack'),
});
