#!/usr/bin/env python
import couchdb
import json
import urllib

config = json.loads(open('./config.json').read())
couch = couchdb.Server("%s:%d" % (config['host'], config['port']))
couch.resource.credentials = (config['auth']['username'], config['auth']['password'])

try:
	db = couch.create(config['database'])
except couchdb.http.PreconditionFailed:
	db = couch[config['database']]

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
