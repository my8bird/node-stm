this is not ready to use yet

# Usage
```javascript
// Create a place to share data
data = new STM();
// Update the data
data.update(function(trans) { // The update function gets a transaction
   // Add some values to our data
  trans.set('name.first', 'Bobo');
  trans.set('name.last',  'Clown');
  trans.set('location',   'funky town');
});

// At this point our data ooks like this
{name: {first: 'Bobo', last: 'Clown'}, location: 'funky town'}
// To access a value (note this clones the data so that you can mutate as needed)
data.read('first.name') // 'Bobo'

// Ah snap, Bobo left funky town so we should clean up date
date.update(function(trans){
   trans.remove('location');
});
```