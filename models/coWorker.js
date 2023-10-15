const mongoose = require("mongoose");
const coWorkerSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    type: { type: mongoose.Schema.Types.ObjectId, ref: "workerCatagory" },
    gender: { type: String, required: true },
    mainWorker: { type: String, required: true },
    profileImg: String,
  },
  {
    timestamps: true,
  }
);
const CoWorker = mongoose.model("CoWorker", coWorkerSchema);
module.exports = CoWorker;
