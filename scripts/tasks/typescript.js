const { sh, help } = require('tasksfile');

function check() {
  sh('tsc --noEmit', { nopipe: true });
}
help(check, 'check for typescript compiler errors');

module.exports = {
  check,
};
