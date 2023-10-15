const mongoose = require("mongoose");
const workerSchema = new mongoose.Schema(
  {
    username: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    name: String,
    phone: { type: Number },
    email: { type: String, required: true },
    rating: Array,
    locationPrefs: Array,
    profileImg: String,
    type: [{ type: mongoose.Schema.Types.ObjectId, ref: "workerCatagory" }],
    languages: Array,
    gender: String,
    coWorkers: [{ type: mongoose.Schema.Types.ObjectId, ref: "coWorker" }],
  },
  {
    timestamps: true,
  }
);

workerSchema.pre("save", function (next) {
  if (!this.name) this.name = "";
  if (!this.phone) this.phone = 0;
  if (!this.profileImg) this.profileImg = "";
  if (!this.type) this.type = "";
  if (!this.gender) this.gender = "";
  next();
});
const Worker = mongoose.model("Worker", workerSchema);
module.exports = Worker;
