/**
 * Create a endpoint to serve our environment variables, both for production and dev
 */

const path = require('path');
require('dotenv').config({ path: path.resolve(__dirname, '../../.env') });
const AppJson = require('../../app.json');

// Why are we not dumping process.env into the api response?
// Because it can contain sensitive informations about our server and so we want to whitelist
// what gets exposed
const PUBLIC_ENV_VARIABLES = {};
Object.keys(AppJson.env).forEach((key) => {
  const keyConfig = AppJson.env[key];
  // Required EnvVar must be defined in the `.env` (in dev) or the Heroku config variable
  if (keyConfig.required && process.env[key] === undefined) {
    console.error('Missing Env Var', key);
  } else {
    // Required variable use the `.env` file first and if not found fallback to the default values
    PUBLIC_ENV_VARIABLES[key] = process.env[key]
      ? process.env[key]
      : keyConfig.value;
  }
});

// Expose Heroku variables, using a different name
PUBLIC_ENV_VARIABLES['FIELDWIRE_RELEASE_ID_KEY'] = (
  process.env.HEROKU_SLUG_COMMIT || ''
).substring(0, 8);

PUBLIC_ENV_VARIABLES['FIELDWIRE_RELEASED_AT_KEY'] =
  process.env.HEROKU_RELEASE_CREATED_AT;

module.exports = function registerEnvVariableFileHandler(app) {
  app.get('/env.js', function (req, res) {
    res.setHeader('Content-Type', 'application/javascript');
    res.setHeader(
      'Cache-Control',
      'no-store' // Force loading this from our server
    );
    res.send('window._ENV = ' + JSON.stringify(PUBLIC_ENV_VARIABLES));
  });
};
