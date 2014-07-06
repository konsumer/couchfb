from couchdb import Server, http
import json

config = json.loads(open('./config.json').read())
couch = Server("%s:%d" % (config['host'], config['port']))
couch.resource.credentials = (config['auth']['username'], config['auth']['password'])

try:
	db = couch.create(config['database'])
except http.PreconditionFailed:
	db = couch[config['database']]