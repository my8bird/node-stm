/*
Constructs an STM data object with an optional default data set
*/
var STM = exports.STM = function(data) {
   this._data = data || {};
};

/*
Takes a path or paths and returns a cloned version of the current
state of the data for those paths.  If no paths are supplied then 
the entire object is returned.
*/
STM.prototype.clone = function(path) {
  if (path === undefined) {
console.log('adsf')
    return deepCopy(this._data);
  }

  path = typeof(path) === 'Array' ? path : [path];
  return path.map(function(part) {
    console.log(part)
    return deepCopy(dataAtPath(this._data, part));
  }, this);
};


STM.prototype.read = function() {
};


STM.prototype.update = function() {
};


/*
Pull subitem of of data for the given path.
If the path is empty return the entire object.

Ex:
    'mine' === dataAtPath({name: {last: 'mine'}}, 'name.last')

*/
function dataAtPath(data, path) {
  console.log(data)
  if (path === undefined || path === '') {
    return data;
  }
  var cur = data,
      parts = path.split('.'),
      i;

  for (i in parts) {
    console.log(cur)
    console.log(cur[parts[i]], cur);
    cur = cur[parts[i]];
  }
  console.log('3',cur)
  return cur;
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

s = new STM();
a = s.clone();
console.log('1', a);

s = new STM({'nate': 'ladfs', 'a': 1});
a = s.clone('a');
console.log('2', a);

s = new STM({'nate': 'ladfs', 'a': 1, 'b': [{'a': 'b'}]});
a = s.clone();
console.log('4', a);

