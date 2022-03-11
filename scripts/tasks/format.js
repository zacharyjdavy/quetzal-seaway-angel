const { sh, help } = require('tasksfile');
const FOLDERS = './app ./src';

function file(options, ...args) {
  sh(`prettier --write ${args.join(' ')}`, {
    nopipe: true,
  });
}
help(file, 'Runs Prettier on specific files', {
  params: ['PRETTIER ARGS'],

  examples: `
  format:file /path/to/file          - if args are specified, they are all passed to prettier`,
});

function check() {
  sh('prettier --check ' + FOLDERS, {
    nopipe: true,
  });
}
help(check, 'Check if any file need to be reformatted');

function all() {
  sh('prettier --write ' + FOLDERS, {
    nopipe: true,
  });
}
help(all, 'Reformat every file');

module.exports = {
  file,
  check,
  all,
};
