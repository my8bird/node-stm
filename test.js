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

  describe('Updating', function() {
    it('new key', function() {
       // Given a STM with no data
       data = new STM();

       // When it is updated to contain new data in a transaction
       data.update(function(transaction) {
         transaction.set('item1', 1);
       });

       // Then the new data is stored.
       expect(data._read()).to.deep.equal({item1: 1});
    });

    it('new key (nested)', function() {
       // Given a STM with no data
       data = new STM();

       // When it is updated to contain new data in a transaction
       data.update(function(transaction) {
         transaction.set('item1.nested', 1);
       });

       // Then the new data is stored.
       expect(data._read()).to.deep.equal({item1: {nested: 1}});
    });

    it('existing key', function() {
       // Given a STM with some data
       data = new STM({item1: 1});

       // When it is updated to contain new data in a transaction
       data.update(function(transaction) {
         transaction.set('item1', 2);
       });

       // Then the new data is stored
       expect(data._read()).to.deep.equal({item1: 2});
    });

    it('existing key (nested)', function() {
       // Given a STM with some data
       data = new STM({item1: {nested: 1}});

       // When it is updated to contain new data in a transaction
       data.update(function(transaction) {
         transaction.set('item1.nested', 2);
       });

       // Then the new data is stored
       expect(data._read()).to.deep.equal({item1: {nested: 2}});
    });

  });

});

