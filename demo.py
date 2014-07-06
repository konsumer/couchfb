#!/usr/bin/env python
from db import db
import random

def getRandom(view):
	try:
		lo = db.view('_design/views/_view/%s' % view, {'limit':1}).rows[0].key
		hi = db.view('_design/views/_view/%s' % view, {'limit':1, 'descending':True}).rows[0].key
		randint = random.randint(lo, hi)
		return db.view('_design/views/_view/%s' % view, {'limit':1, 'descending':True, 'startkey':randint}).rows[0].key
	except IndexError:
		print('not enough %s records.' % view)

print(getRandom('first'))
print(getRandom('last'))
