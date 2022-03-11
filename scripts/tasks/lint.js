const { sh, help } = require('tasksfile');

function ts(options, ...args) {
  sh(`eslint --cache --ext .ts ${args && args.length ? args.join(' ') : '.'}`, {
    nopipe: true,
  });
}
help(ts, 'Runs Typescript linter', {
  params: ['ESLINT ARGS'],
  examples: `
  lint:ts                        - runs eslint on all typescript files
  lint:ts /path/to/file          - if args are specified, they are all passed to eslint
  lint:ts --flag /file1 /file2   - can accept unlimited args`,
});

function all() {
  console.log('-- [1/1] Typescript Linting --');
  ts();
}
help(all, 'Runs all linters');

module.exports = {
  all,
  ts,
};
