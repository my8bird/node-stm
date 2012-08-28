var _ = require('underscore');

var util = require('./util');

var Transaction = module.exports = util.klass(
  function(stm, stmVersion) {
    this._stm    = stm;

    this.updates = [] // [action, path, value?]
    this.version = stmVersion;
  }, 
  {
  set: function(path, value) {
    this.updates.push({action: 'set', path: path, value: value});
  },

  get: function(path) {
    var matches = rfind(this.updates, function(update) {
       return path.indexOf(update.path) === 0;
    });

    if (matches >= 0) {
      var update = this.updates[matches];
      return update.value;
    }
    else {
      return this._stm._read(path, this.version);
    }
  },

  remove: function(path) {
    this.updates.push({action: 'del', path: path});
  }
});


function rfind(arr, iterator) {
   var i, match;
   for(i=arr.length-1; i>=0; i--) {
      if (iterator(arr[i], i)) {return i;}
   }
   return -1;
};
