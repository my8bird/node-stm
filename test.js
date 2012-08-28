var STM    = require('./stm'),
    expect = require('chai').expect;

// Internal STM object for each test
var data;

describe('STM', function() {
  describe('Creation', function() {
    it('with no data', function() {
      // When a STM blob is created with out initial data
      data = new STM();
      // Then its data is an empty Object
      expect(data._read()).to.be.empty;
    });

    it('with data', function() {
      // Given the STM object is seeded with some data
      var input = {item1: '1', item2: 2, nested: {nested: 'done'}};
      data = new STM(input);

      // Then that data is stored as the background data for the STM object
      var stored = data._read();
      expect(stored).to.have.property('item1', '1');
      expect(stored).to.have.property('item2', 2);
      expect(stored).to.have.deep.property('nested.nested', 'done');
    });
  });

  describe('Transactions', function() {
    it('adding a key', function() {
       // Given a STM with no data
       data = new STM();

       // When it is updated to contain new data in a transaction
       data.update(function(transaction) {
         transaction.set('item1', 1);
       });

       // Then the new data is stored.
       expect(data._read()).to.deep.equal({item1: 1});
    });

    it('adding a key (nested)', function() {
       // Given a STM with no data
       data = new STM();

       // When it is updated to contain new data in a transaction
       data.update(function(transaction) {
         transaction.set('item1.nested', 1);
       });

       // Then the new data is stored.
       expect(data._read()).to.deep.equal({item1: {nested: 1}});
    });

    it('updating an existing key', function() {
       // Given a STM with some data
       data = new STM({item1: 1});

       // When it is updated to contain new data in a transaction
       data.update(function(transaction) {
         transaction.set('item1', 2);
       });

       // Then the new data is stored
       expect(data._read()).to.deep.equal({item1: 2});
    });

    it('updating an existing key (nested)', function() {
       // Given a STM with some data
       data = new STM({item1: {nested: 1}});

       // When it is updated to contain new data in a transaction
       data.update(function(transaction) {
         transaction.set('item1.nested', 2);
       });

       // Then the new data is stored
       expect(data._read()).to.deep.equal({item1: {nested: 2}});
    });

    it('should allow removing values', function() {
       // Given some data
       data = new STM({item1: 1});

       // When in a transaction
       data.update(function(trans) {
           trans.remove('item1');
       });

       // Then the value should be lost
       expect(data._read()).to.deep.equal({});
    });

    it('should allow reading values during transaction', function() {
       // Given an stm object with data
       data = new STM({item: 1, item2: 2, item3: 3});
       // When the transaction is active
       data.update(function(trans) {
          // And a value has been changed
          trans.set('item1', '1');

          // And a value has been removed
          trans.remove('item3');

          expect(trans.get('item1')).to.equal('1');
          expect(trans.get('item2')).to.equal(2);
          expect(trans.get('item3')).to.equal(undefined);
       });
    });

  });

});

