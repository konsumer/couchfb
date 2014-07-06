#!/usr/bin/env python
from couchdb import Server, http
import json
import urllib

config = json.loads(open('./config.json').read())
couch = Server("%s:%d" % (config['host'], config['port']))
couch.resource.credentials = (config['auth']['username'], config['auth']['password'])

try:
	db = couch.create(config['database'])
except http.PreconditionFailed:
	db = couch[config['database']]

# create views
db.save({
  "_id": "_design/views",
  "language": "javascript",
  "views": {
    "first": {
      "map": "function (doc) { if (doc.type == 'first') emit(doc.count, doc.name); }"
    },
    "last": {
      "map": "function (doc) { if (doc.type == 'last') emit(doc.count, doc.name); }"
    },
    "name": {
      "map": "function (doc) { if (doc.type == 'full') emit(doc.name); }"
    }
  }
})

# import records
types = {
	'first': 'facebook-firstnames-withcount',
	'last': 'facebook-lastnames-withcount',
	'full': 'facebook-names-unique'
}
for t in types:
	f = open('./data/%s.txt' % types[t], 'r')
	for line in f:
		doc = {'type': t}
		if t == 'full':
			doc['name'] = line.strip().split(' ')
		else:
			doc['count'] = int(r[0])
		print(doc)
		db.save(doc)
