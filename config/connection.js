const mongoose = require("mongoose");
const dotenv = require("dotenv").config();
const connect_DB = () => {
  mongoose.connect(process.env.DB_URL).then((res) => {
    console.log("Connected to DB.");
  });
};
module.exports = { connect_DB };