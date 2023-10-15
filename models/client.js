const mongoose = require("mongoose");
const clientSchema = new mongoose.Schema(
  {
    username: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    name: String,
    adress: String,
    profileImg: String,
    phone: { type: Number, },
    email: { type: String, required: true },
    languages: Array,
    gender: String,
  },
  {
    timestamps: true,
  }
);
const Client = mongoose.model("Client", clientSchema);
module.exports = Client;
