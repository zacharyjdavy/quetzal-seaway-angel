window.jQuery = require('jquery');
window.$ = window.jQuery;

require('angular');
require('lodash');
require('@uirouter/angular-hybrid');

require('./load/images_loader.ts');

require('angular-ui-bootstrap');

require('./fieldwire.config');
require('./fieldwire.run.ts');
