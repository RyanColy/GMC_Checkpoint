require('dotenv').config();
const mongoose = require('mongoose');

// Connect to MongoDB Atlas using the URI stored in .env
mongoose.connect(process.env.MONGO_URI);

const db = mongoose.connection;
db.on('error', console.error.bind(console, 'Connection error:'));
db.once('open', () => console.log('Connected to MongoDB Atlas'));

// Person schema — name is required, favoriteFoods typed as [String] to avoid Mixed type issues
const personSchema = new mongoose.Schema({
  name: { type: String, required: true },
  age: Number,
  favoriteFoods: [String],
});

const Person = mongoose.model('Person', personSchema);

// Instantiate a Person and persist it to the database using document.save()
const createAndSavePerson = async (done) => {
  try {
    const person = new Person({ name: 'Alice', age: 28, favoriteFoods: ['pizza', 'sushi'] });
    const data = await person.save();
    done(null, data);
  } catch (err) {
    done(err);
  }
};

// Use Model.create() to insert multiple documents in a single call
const createManyPeople = async (arrayOfPeople, done) => {
  try {
    const data = await Person.create(arrayOfPeople);
    done(null, data);
  } catch (err) {
    done(err);
  }
};

// Use Model.find() to return all documents matching the given name
const findPeopleByName = async (personName, done) => {
  try {
    const data = await Person.find({ name: personName });
    done(null, data);
  } catch (err) {
    done(err);
  }
};

// Use Model.findOne() to return the first document that includes the given food
const findOneByFood = async (food, done) => {
  try {
    const data = await Person.findOne({ favoriteFoods: food });
    done(null, data);
  } catch (err) {
    done(err);
  }
};

// Use Model.findById() to locate a single document by its _id
const findPersonById = async (personId, done) => {
  try {
    const data = await Person.findById(personId);
    done(null, data);
  } catch (err) {
    done(err);
  }
};

// Find a person by _id, push "hamburger" into their favoriteFoods, then save
const findEditThenSave = async (personId, done) => {
  try {
    const person = await Person.findById(personId);
    person.favoriteFoods.push('hamburger');
    const data = await person.save();
    done(null, data);
  } catch (err) {
    done(err);
  }
};

// Use findOneAndUpdate() with { new: true } to return the updated document
const findAndUpdate = async (personName, done) => {
  try {
    const data = await Person.findOneAndUpdate(
      { name: personName },
      { age: 20 },
      { new: true }
    );
    done(null, data);
  } catch (err) {
    done(err);
  }
};

// Use findByIdAndRemove() to delete a single document by its _id
const removeById = async (personId, done) => {
  try {
    const data = await Person.findByIdAndDelete(personId);
    done(null, data);
  } catch (err) {
    done(err);
  }
};

// Use Model.deleteMany() to delete all documents where name is "Mary"
// Note: returns a result object with the count of deleted documents, not the documents themselves
const removeManyPeople = async (done) => {
  try {
    const data = await Person.deleteMany({ name: 'Mary' });
    done(null, data);
  } catch (err) {
    done(err);
  }
};

// Chain find/sort/limit/select/exec to query people who like burritos
// sorted by name, limited to 2 results, with the age field hidden
const queryChain = async (done) => {
  try {
    const data = await Person.find({ favoriteFoods: 'burritos' })
      .sort({ name: 1 })
      .limit(2)
      .select('-age');
    done(null, data);
  } catch (err) {
    done(err);
  }
};

module.exports = {
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
};
