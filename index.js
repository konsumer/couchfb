var db = require('./db'),
  readline = require('readline'),
  path = require('path'),
  fs = require('fs');

var types = {
  'first':'facebook-firstnames-withcount',
  'last':'facebook-lastnames-withcount',
  'full':'facebook-names-unique'
};

// process a text file, insert in couch
function processFile(type){
  var fname = path.join('data', types[type] + '.txt');
  
  var rd = readline.createInterface({
    input: fs.createReadStream(fname),
    output: process.stdout,
    terminal: false
  });
  
  rd.on('line', function(line) {
    rd.pause();

    var record = { type: type };
    
    if (type == 'full'){
      record.name = line.trim().split(' ');
    }else{
      var i = line.trim().split(' ');
      record.name = i[1].trim();
      record.count = Number(i[0]);
    }

    db.save(record, function(er, res){
      if (er) console.log('Error: ', er);
      console.log(res);
      rd.resume();
    });
  });
}

for (type in types){
  processFile(type);
}

// views for looking things up
db.save('_design/views', require('./views'));