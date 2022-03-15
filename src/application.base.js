window.jQuery = require('jquery');
window.$ = window.jQuery;

require('angular');
require('bootstrap');
require('lodash');
require('@uirouter/angular-hybrid');
require('angular-ui-bootstrap');

window.Promise = require('../vendor/assets/javascripts/promise/promise.js');

require('./load/images_loader.ts');

require('./fieldwire.config');
require('./fieldwire.run.ts');
