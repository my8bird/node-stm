var _ = require('underscore');

var Transaction = require('./transaction'),
    util        = require('./util');

var STM = module.exports = util.klass(
  function(data) {
    this._data = data || {};

    this._version        = 0;
    this._activeVersions = [];
  },
  {
   /*
   Takes a path or paths and returns a cloned version of the current
   state of the data for those paths.   If no paths are supplied then 
   the entire object is returned.
   */
   clone: function(path) {
      if (path === undefined) {
         return deepCopy(this._data);
      }

      path = typeof(path) === 'Array' ? path : [path];
      return path.map(function(part) {
         return deepCopy(util.dataAtPath(this._data, part));
      }, this);
   },

   /** Takes an optional set of paths as well as a transform to be 
   called which will update the data.
   */
   update: function() {
      var transform = arguments[arguments.length -1];
      var trans = this._addTransaction();

      // XXX Handle update failure
      transform(trans);
   

      // XXX Check if all updates will apply or not
 
      _.all(trans.updates, function(update) {
         util.setAtPath(this._data, update.path, function(obj, key) {
            if (update.action === 'set') {
               obj[key] = update.value;
            }
            else {
               delete obj[key];
            }
         });
      }, this);
   },

   /**
   Accessor that returns the raw data at a given path.
   While this is much faster then `clone` it should not be used
   because it breaks the contracts STM has setup for data usage.
   */
   _read: function(path, version) {
      // Determine which version of the data to use
      var data = version === undefined ? this._data : this._activeVersions[version][1];

      // If no path was sent then send the full thing back
      // This could be an error condition but I am feeling nice.
      if (path === undefined) {
         return data;
      }

      // if the user asked for several things return a list of them
      // otherwise, send back the single value.
      if (typeof(path) === 'Array') {
         return path.map(function(part) {
            return util.dataAtPath(data, part);
         });
      }
      else {
         return util.dataAtPath(data, path);
      }
   },

   _addTransaction: function() {
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
   }
});

