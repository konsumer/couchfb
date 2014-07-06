/**
 * Demo functions for getting random data
 */

// since the couch needs auth, I am using cradle, but you could use http lib on admin-party couch
var db = require('./db');

// title-case
function toTitleCase(str){
    return str.replace(/\w\S*/g, function(txt){return txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase();});
}

// get bounds of view, get random record from first/last
function getRandom(view, cb){
	db.view('views/' + view, {limit:1}, function (er, res) {
		if (er) return cb(er);
		var lo = res[0].key;
		db.view('views/' + view, {limit:1, descending:true}, function (er, res) {
			if (er) return cb(er);
			var hi = res[0].key;
			var rndint = Math.floor(Math.random() * (hi - lo) + lo);
			db.view('views/' + view, {startkey:rndint, limit:1, descending:true}, function (er, res) {
				if (er) return cb(er);
				return cb(null, res[0].value);
			});
		});
	});
}

getRandom('first', function(er, name){
	if (er) return console.log('Error: ' + er);
	console.log('first', toTitleCase(name));
});

getRandom('last', function(er, name){
	if (er) return console.log('Error: ' + er);
	console.log('last', toTitleCase(name));
});