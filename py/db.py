from couchdb import Server, http
import json
from os import path

fname = "%s/../config.json" % path.dirname( path.abspath(__file__))
config = json.loads(open(fname).read())
couch = Server("%s:%d" % (config['host'], config['port']))
couch.resource.credentials = (config['auth']['username'], config['auth']['password'])

try:
	db = couch.create(config['database'])
except http.PreconditionFailed:
	db = couch[config['database']]
