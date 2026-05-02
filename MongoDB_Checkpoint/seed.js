require("dotenv").config();
const mongoose = require("mongoose");
const Contact = require("./models/Contact");

const contacts = [
  { lastName: "Ben",    firstName: "Moris",      email: "ben@gmail.com",     age: 26 },
  { lastName: "Kefi",   firstName: "Seif",       email: "kefi@gmail.com",    age: 15 },
  { lastName: "Emilie", firstName: "brouge",     email: "emilie.b@gmail.com", age: 40 },
  { lastName: "Alex",   firstName: "brown",                                   age: 4  },
  { lastName: "Denzel", firstName: "Washington",                              age: 3  },
];

mongoose.connect(process.env.MONGO_URI).then(async () => {
  await Contact.deleteMany();
  await Contact.insertMany(contacts);
  console.log("Collection seeded with 5 contacts.");
  mongoose.disconnect();
});
