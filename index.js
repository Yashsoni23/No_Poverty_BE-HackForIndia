const { connect_DB } = require("./config/connection");
const express = require("express");
const clientController = require("./controller/client.controller"); // Replace with the actual path to your client controller
const workerController = require("./controller/worker.controller");
const coWorkerController = require("./controller/coWorker.controller");
const workerCategory = require("./controller/workerCategory.controller");
const app = express();
const router = express.Router();
const dotenv = require("dotenv").config();
const bodyParser = require("body-parser");
const cors = require("cors");

app.get("/", (req, res) => {
  res.send("Server Running again");
});
// Middleware for parsing JSON in request bodies
app.use(bodyParser.json()); // Use body-parser for JSON parsing
app.use(bodyParser.urlencoded({ extended: true })); // Enable URL-encoded parsing

// Enable CORS for all routes
app.use(cors());
app.use("/client", clientController);
app.use("/worker", workerController);
app.use("/coworker", coWorkerController);
app.use("/category", workerCategory);
app.listen(5000, () => {
  console.log(`Server is running on Port ${process.env.PORT}`);
  connect_DB();
});
