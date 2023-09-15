const express = require("express");
require("dotenv").config();
const cors = require("cors");
const getLogger = require("./logger");
const apiRouter = require("./routes/apiRouter");

const { PORT } = process.env;
console.log("👹👹👹👹👹👹👹", PORT);
const logger = getLogger("server");
const app = express();

app.use(cors());
app.use(express.json());
app.use("/api", apiRouter);

const server = app.listen(PORT, () => {
  console.log(`Express Running in Port: ${PORT}`);
  logger.log(`Server running on port ${PORT}`);
});

module.exports = server;
