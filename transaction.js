var _ = require('underscore');

var Transaction = module.exports = function(stm, stmVersion) {
  this._stm    = stm;

  this.updates = [] // [action, path, value?]
  this.version = stmVersion;
};

_.extend(Transaction.prototype, {
  set: function(path, value) {
    this.updates.push({action: 'set', path: path, value: value});
  }
});

