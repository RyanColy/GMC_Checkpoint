require('dotenv').config();
const {
  createAndSavePerson,
  createManyPeople,
  findPeopleByName,
  findOneByFood,
  findPersonById,
  findEditThenSave,
  findAndUpdate,
  removeById,
  removeManyPeople,
  queryChain,
} = require('./server');

// Wait for the DB connection before running tests
const mongoose = require('mongoose');
mongoose.connection.once('open', async () => {
  console.log('\n--- Running tests ---\n');

  createAndSavePerson((err, data) => {
    if (err) return console.error('createAndSavePerson ERROR:', err);
    console.log('createAndSavePerson:', data);

    const id = data._id;

    createManyPeople(
      [
        { name: 'Mary', age: 25, favoriteFoods: ['burritos', 'pizza'] },
        { name: 'Bob', age: 30, favoriteFoods: ['burritos', 'tacos'] },
        { name: 'Mary', age: 22, favoriteFoods: ['sushi'] },
      ],
      (err, data) => {
        if (err) return console.error('createManyPeople ERROR:', err);
        console.log('createManyPeople:', data);

        findPeopleByName('Mary', (err, data) => {
          if (err) return console.error('findPeopleByName ERROR:', err);
          console.log('findPeopleByName:', data);
        });

        findOneByFood('burritos', (err, data) => {
          if (err) return console.error('findOneByFood ERROR:', err);
          console.log('findOneByFood:', data);
        });

        findPersonById(id, (err, data) => {
          if (err) return console.error('findPersonById ERROR:', err);
          console.log('findPersonById:', data);
        });

        findEditThenSave(id, (err, data) => {
          if (err) return console.error('findEditThenSave ERROR:', err);
          console.log('findEditThenSave:', data);
        });

        findAndUpdate('Bob', (err, data) => {
          if (err) return console.error('findAndUpdate ERROR:', err);
          console.log('findAndUpdate:', data);
        });

        removeById(id, (err, data) => {
          if (err) return console.error('removeById ERROR:', err);
          console.log('removeById:', data);
        });

        removeManyPeople((err, data) => {
          if (err) return console.error('removeManyPeople ERROR:', err);
          console.log('removeManyPeople:', data);
        });

        queryChain((err, data) => {
          if (err) return console.error('queryChain ERROR:', err);
          console.log('queryChain:', data);
        });
      }
    );
  });
});
