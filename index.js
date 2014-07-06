var db = require('./db'),
  readline = require('readline'),
  path = require('path'),
  fs = require('fs'),
  RateLimiter = require('limiter').RateLimiter,
  limiter = new RateLimiter(20, 'second'); // no more than 20 requests per second


var types = {
  'first':'facebook-firstnames-withcount',
  'last':'facebook-lastnames-withcount',
  'full':'facebook-names-unique'
};

// simple save callback
function save(er, doc){
  console.log(doc);
}

// process a text file, insert in couch
function processFile(type){
  var fname = path.join('data', types[type] + '.txt');
  
  var rd = readline.createInterface({
    input: fs.createReadStream(fname),
    terminal: false
  });
  
  rd.on('line', function(line) {
    limiter.removeTokens(1, function(er, remainingRequests) {
      if (type == 'full'){
        db.save({type: 'full', name:line.trim().split(' ')}, save);
      }else{
        var i = line.trim().split(' ');
        db.save({type: type, name: i[1].trim(), count: Number(i[0]) }, save);
      }
    });
  });
}

for (type in types){
  processFile(type);
}

// views for looking things up
db.save('_design/views', require('./views'));