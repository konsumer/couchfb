#!/usr/bin/env python
from db import db
from random import randint

def getRandom(view):
	try:
		lo = db.view('_design/views/_view/%s' % view, {'limit':1}).rows[0].key
		hi = db.view('_design/views/_view/%s' % view, {'limit':1, 'descending':True}).rows[0].key
		return db.view('_design/views/_view/%s' % view, {'limit':1, 'descending':True, 'startkey': randint(lo,hi) }).rows[0].key
	except IndexError:
		print('not enough %s records.' % view)

print(getRandom('first'))
print(getRandom('last'))
