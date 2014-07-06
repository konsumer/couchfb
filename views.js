// views for looking things up

module.exports = {
  // count, firstname
  'first': {
    'map': function (doc) {
      if (doc.type == 'first')
        emit(doc.count, doc.name);
    }
  },
  
  // count, lastname
  'last': {
    'map': function (doc) {
      if (doc.type == 'last')
        emit(doc.count, doc.name);
    }
  },

  // [first second third etc], null
  'name': {
    'map': function (doc) {
      if (doc.type == 'full')
        emit(doc.name);
    }
  },
};