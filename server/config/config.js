if (process.env.NODE_ENV === 'development') {
  module.exports = require('./env/development.js');
}

if (process.env.NODE_ENV === 'production') {
  module.exports = require('./env/production.js');
}