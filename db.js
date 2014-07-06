try{
  config = require('./config.json')
}catch(e){
  console.log('You must create a config.json file. Please see README.md for more info.');
  process.exit(1);
}

// config.cache = false;
config.raw = true;

var cradle = require('cradle'),
  db = new(cradle.Connection)(config.host, config.port, config).database(config.database);

module.exports = db;