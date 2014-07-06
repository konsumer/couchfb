var fs = require('fs'),
	es = require('event-stream'),
	db = require('./db'),
	poolr  = require('poolr').createPool,
  	couchPool = poolr(2, db);

// turn a line into correct record format
function processLine(type){
	return es.map(function (line, cb) {
		var record = {
	      type: type
	    };
	    
	    if (type == 'full'){
	      record.name = line.trim().split(' ');
	    }else{
	      var i = line.trim().split(' ');
	      record.name = i[1].trim();
	      record.count = Number(i[0]);
	    }
		cb(null, record);
		console.log(record.name);
	});
}

// save record in couchdb
var saveRecord = es.map(function (record, cb) {
	couchPool.addTask(db.save, record, cb);
});

fs.createReadStream('./data/facebook-firstnames-withcount.txt')
	.pipe(es.split())
	.pipe(processLine('first'))
	.pipe(saveRecord);

fs.createReadStream('./data/facebook-lastnames-withcount.txt')
	.pipe(es.split())
	.pipe(processLine('last'))
	.pipe(saveRecord);

fs.createReadStream('./data/facebook-names-unique.txt')
	.pipe(es.split())
	.pipe(processLine('full'))
	.pipe(saveRecord);

