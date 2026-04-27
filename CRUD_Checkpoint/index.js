require("dotenv").config();
const express = require("express");
const connectMongo = require("./config/mongodb");
const createTable = require("./models/initMySQL");
const nosqlRoutes = require("./routes/nosqlRoutes");
const sqlRoutes = require("./routes/sqlRoutes");

const app = express();
app.use(express.json());

app.use("/nosql/products", nosqlRoutes);
app.use("/sql/products", sqlRoutes);

const start = async () => {
  await connectMongo();
  await createTable();
  app.listen(process.env.PORT, () =>
    console.log(`Server running on port ${process.env.PORT}`)
  );
};

start();
