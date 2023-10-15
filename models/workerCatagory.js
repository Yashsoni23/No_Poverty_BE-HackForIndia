const mongoose = require("mongoose");
const workerCategorySchema = new mongoose.Schema(
  {
    name: { type: String, required: true, unique: true },
    workers: [{ type: mongoose.Schema.Types.ObjectId, ref: "worker" }],
  },
  {
    timestamps: true,
  }
);
const Category = mongoose.model("WorkerCategory", workerCategorySchema);
module.exports = Category;
