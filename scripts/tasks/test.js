const { sh, help } = require('tasksfile');

function unit(options, testRegex) {
  const karmaTestRegex = testRegex || '';
  sh(
    `env KARMA_PARALLEL=false KARMA_TEST_REGEX=${karmaTestRegex} karma start config/karma.config.js`,
    {
      nopipe: true,
    }
  );
}
help(unit, 'Runs unit tests', {
  params: ['file path regular expression'],
  examples: `
test:unit bubble.component     - runs the bubble.component spec file tests
test:unit 'services/*'         - runs all tests that are in a services directory`,
});

function unitParallel() {
  sh(
    `env KARMA_PARALLEL=true KARMA_TEST_REGEX='' karma start config/karma.config.js`,
    {
      nopipe: true,
    }
  );
}
help(unitParallel, 'Runs all unit tests in parallel');

function cypress() {
  sh(`env CYPRESS_VIDEO=false yarn run cypress run`, {
    nopipe: true,
  });
}
help(cypress, 'Runs Cypress tests in a localhost-friendly way');

module.exports = {
  unit,
  unitParallel,
  cypress,
};
