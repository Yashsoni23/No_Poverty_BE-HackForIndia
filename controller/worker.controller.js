const Worker = require("../models/worker");
const express = require("express");
const bcrypt = require("bcrypt"); // For password hashing
const jwt = require("jsonwebtoken"); // For generating JWT tokens
const Category = require("../models/workerCatagory");
const dotenv = require("dotenv").config();
const router = express.Router();

router.get("/all", async (req, res) => {
  try {
    const allWorkers = await Worker.find();
    if (allWorkers.length > 0) {
      res.send({
        success: true,
        data: allWorkers,
      });
    } else {
      res.send({
        success: true,
        data: "No Workers present db.",
      });
    }
  } catch (error) {
    console.log(error.message);
    res.status(500).json({ success: false, message: "Internal server error" });
  }
});

// Login controller
router.post("/login", async (req, res) => {
  const { username, password } = req.body;

  try {
    // Find the worker by username
    const worker = await Worker.findOne({ username });

    // Check if the worker exists
    if (!worker) {
      return res.status(404).json({ message: "Worker not found" });
    }

    // Compare the provided password with the hashed password in the database
    const isPasswordValid = await bcrypt.compare(password, worker.password);

    if (!isPasswordValid) {
      return res.status(401).json({ message: "Invalid password" });
    }

    // If the password is valid, generate a JWT token
    const token = jwt.sign(
      { id: worker._id, username: worker.username },
      process.env.JWT_SECRET, // Use a secret key from your environment variables
      { expiresIn: "1h" } // Token expires in 1 hour (adjust as needed)
    );

    // Send the token back as a response
    res.status(200).json({ token });
  } catch (error) {
    console.log(error.message);
    res.status(500).json({ message: "Internal server error" });
  }
});

router.post("/signup", async (req, res) => {
  const { username, password, email } = req.body;

  try {
    // Check if the username or email is already in use
    const existingWorker = await Worker.findOne({
      $or: [{ username }, { email }],
    });

    if (existingWorker) {
      return res
        .status(400)
        .json({ message: "Username or email already in use" });
    }

    // Hash the password before storing it in the database
    const hashedPassword = await bcrypt.hash(password, 10); // Salt rounds: 10

    // Create a new client document
    const newWorker = new Worker({
      username,
      password: hashedPassword,
      email,
    });

    // Save the new client in the database
    await newWorker.save();

    res.status(201).json({ message: "Worker registered successfully" });
  } catch (error) {
    console.log(error.message);
    res.status(500).json({ message: "Internal server error" });
  }
});

router.patch("/update/category", async (req, res) => {
  try {
    const workerId = req.params.id;
    const worker = await Worker.findById(workerId);
    const category = await Category.findById(req.body.categoryId); // Replace with the actual field that contains the Category ID in the request body

    // Check if the worker's category ID is already present in the worker's type (category) array
    const isCatAlreadyPresent = worker.type.includes(req.body.categoryId);

    if (!isCatAlreadyPresent) {
      // If the category ID is not present, assign it to the worker's type
      worker.type.push(req.body.categoryId);
      await worker.save();
    }

    // Check if the worker's ID is already present in the category's workers array
    const isWorkerAlreadyPresent = category.workers.includes(workerId);

    if (!isWorkerAlreadyPresent) {
      // If the worker is not present, add it to the category's workers array
      category.workers.push(workerId);
      await category.save();
    }

    if (!updatedWorker) {
      return res.status(404).json({ message: "Worker not found" });
    }
  } catch (error) {
    console.log(error.message);
  }
});

router.put("/update/:id", async (req, res) => {
  const workerId = req.params.id;
  const updateFields = req.body; // Request body should contain fields to be updated

  try {
    const updatedWorker = await Worker.findByIdAndUpdate(
      workerId,
      updateFields,
      { new: true }
    );

    res.status(200).json(updatedWorker);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal server error" });
  }
});

router.delete("/delete/:id", async (req, res) => {
  try {
    const workerId = req.params.id;
    const deleteWorker = await Worker.findByIdAndDelete(workerId);

    res.send({
      success: true,
      message: "Worker deleted.",
      data: deleteWorker,
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Internal server error" });
  }
});
module.exports = router;
