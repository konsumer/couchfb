var LineByLineReader = require('line-by-line'),
  path = require('path'),
  db = require('./db')

// line-by-line read file, turn into a couch record
function processFile(type){
  var fname = path.join('data', types[type] + '.txt');
  var lr = new LineByLineReader(fname, {skipEmptyLines: true});

  lr.on('error', function (err) {
    console.log('Error:');
    console.log(err);
  });

  lr.on('record', function (record) {
    console.log('Saved:');
    console.log(record);
  });

  lr.on('line', function (line) {
    lr.pause();
    var record = { type: type };

    if (type == 'full'){
      record.name = line.trim().split(' ');
    }else{
      var i = line.trim().split(' ');
      record.name = i[1].trim();
      record.count = Number(i[0]);
    }

    db.save(record, function(er, res){
      if (er) lr.emit('error', er, record);
      if (res) lr.emit('record', record);
      lr.resume();
    })
  });
}

var types = {
  'first':'facebook-firstnames-withcount',
  'last':'facebook-lastnames-withcount',
  'full':'facebook-names-unique'
};

for (type in types){
  processFile(type);
}

// views for looking things up
db.save('_design/views', require('./views'));