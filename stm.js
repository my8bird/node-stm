var _ = require('underscore');

/*
Constructs an STM data object with an optional default data set
*/
var STM =  module.exports = function(data) {
   this._data = data || {};

   this._version        = 0;
   this._activeVersions = [];
};

/*
Takes a path or paths and returns a cloned version of the current
state of the data for those paths.  If no paths are supplied then 
the entire object is returned.
*/
STM.prototype.clone = function(path) {
  if (path === undefined) {
    return deepCopy(this._data);
  }

  path = typeof(path) === 'Array' ? path : [path];
  return path.map(function(part) {
    return deepCopy(dataAtPath(this._data, part));
  }, this);
};

/**
Accessor that returns the raw data at a given path.
While this is much faster then `clone` it should not be used
because it breaks the contracts STM has setup for data usage.
*/
STM.prototype._read = function(path) {
  if (path === undefined) {
    return this._data;
  }

  path = typeof(path) === 'Array' ? path : [path];
  return path.map(function(part) {
    return dataAtPath(this._data, part);
  });
};


/** Takes an optional set of paths as well as a transform to be 
called which will update the data.
*/
STM.prototype.update = function() {
  var transform = arguments[arguments.length -1];
  var trans = this._addTransaction();

  // XXX Handle update failure
  transform(trans);
  

  // XXX Check if all updates will apply or not
 
  _.all(trans.updates, function(update) {
    setAtPath(this._data, update.path, function(obj, key) {
       obj[key] = update.value;
    });
  }, this);
};

STM.prototype._addTransaction = function() {
  // Ensure that this version of the data stays in memory
  if (this._activeVersions[this._version] === undefined) {
    // The `1` indicates on look on this version of memory
    this._activeVersions[this._version] = [1, this._data]; 
  }
  else {
    this._activeVersions[this._version][0]++;
  }

  // Send back a transcation which knows to use this STM instance backed by 
  // the current versions data.
  return new Transaction(this, this._version);
};

Transaction = function(stm, stmVersion) {
  this._stm    = stm;

  this.updates = [] // [action, path, value?]
  this.version = stmVersion;
};

Transaction.prototype.set = function(path, value) {
  this.updates.push({action: 'set', path: path, value: value});
};


/*
Pull subitem of of data for the given path.
If the path is empty return the entire object.

Ex:
    'mine' === dataAtPath({name: {last: 'mine'}}, 'name.last')

*/
function dataAtPath(data, path) {
  if (path === undefined || path === '') {
    return data;
  }
  var cur = data,
      root = null,
      parts = path.split('.'),
      i;

  for (i in parts) {
    root = cur;
    cur = cur[parts[i]];
  }

  return cur;
}

function setAtPath(data, path, transform) {
  if (path === undefined || path === '') {
    return data;
  }

  var cur = data,
      root = null,
      parts = path.split('.'),
      i, part;

  for (i in parts) {
    root = cur;
    part = parts[i];
    if (cur[part] === undefined) {
       cur[part] = {};
    }
    cur = cur[part];
  }

  transform(root, parts[parts.length -1]);
}


function deepCopy(data) {
  var key, value
      new_obj = {};

  if (typeof(data) === 'string') {
    return data;
  }
  else if (typeof(data) === 'number') {
    return data;
  }

  for (key in data) {
    value = data[key];

    switch (typeof(value)) {
      case 'Object' :
        new_obj[key] = deepCopy(value);
        break;
      case 'Array':
        new_obj[key] = value.map(function(item) {
          return deepCopy(item);
        });
        break;
      default:
        new_obj[key] = value;
    }
  }
  return new_obj;
};

/*
s = new STM();
a = s.clone();
console.log('1', a);

s = new STM({'nate': 'ladfs', 'a': 1});
a = s.clone('a');
console.log('2', a);

s = new STM({'nate': 'ladfs', 'a': 1, 'b': [{'a': 'b'}]});
a = s.clone();
console.log('4', a);
*/
