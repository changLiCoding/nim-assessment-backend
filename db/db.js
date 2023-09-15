const mongoose = require("mongoose");
const getLogger = require("../logger");

const logger = getLogger("db");

const { MONGO_URI, DB_NAME } = process.env;

console.log("👹👹👹👹👹👹👹👹👹👹👹", MONGO_URI, DB_NAME);

const connectionString = MONGO_URI || "mongodb://localhost:27017/restaurant";

console.log("👹", connectionString);

mongoose
  .connect(`${connectionString}/${DB_NAME}?retryWrites=true&w=majority`)
  .then(() => {
    console.log("👹MongoDB Connected");
    logger.log("Connected to MongoDB");
  })
  .catch((error) => logger.error(error.message));
module.exports = mongoose;
