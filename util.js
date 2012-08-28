var _ = require('underscore');

/***
Pull subitem of of data for the given path.
If the path is empty return the entire object.

Ex:
    'mine' === dataAtPath({name: {last: 'mine'}}, 'name.last')
*/
exports.dataAtPath = function(data, path) {
  if (empty(path)) { return data; }

  var cur   = data,
      parts = path.split('.'),
      i;

  for (i in parts) { cur = cur[parts[i]]; }

  return cur;
}

exports.setAtPath = function(data, path, transform) {
  if (empty(path)) { return data; }

  var cur = data,
      parts = path.split('.'),
      i, part, prev;

  for (i in parts) {
    prev = cur;
    part = parts[i];
    if (cur[part] === undefined) {
       cur[part] = {};
    }
    cur = cur[part];
  }

  transform(prev, parts[parts.length -1]);
}


exports.deepCopy = function(data) {
  var key, value
      new_obj = {};

  if      (typeof(data) === 'string') { return data; }
  else if (typeof(data) === 'number') { return data; }

  return _.map(data, function(value, key) {
    switch (typeof(value)) {
      case 'Object':
        return deepCopy(value);
      case 'Array':
        return value.map(function(item) { return deepCopy(item);});
      default:
        return value;
    }
  });
};


exports.klass = function(init, body) {
   _.extend(init.prototype, body);
   return init;
};


function empty(thing) {
  return thing === undefined || 
         thing.length === 0 || 
         (typeof(thing) === 'Object' && Object.keys(thing).length === 0);
}
