const CoWorker = require("../models/coWorker");
const express = require("express");
const bcrypt = require("bcrypt"); // For password hashing
const jwt = require("jsonwebtoken"); // For generating JWT tokens
const dotenv = require("dotenv").config();
const router = express.Router();

router.post("/", async (req, res) => {
  try {
    const newCoWorker = await CoWorker.create(req.body);
    res.status(201).json(newCoWorker);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal server error" });
  }
});
router.get("/all", async (req, res) => {
  try {
    const allCoWorkers = await CoWorker.find();
    if (allCoWorkers.length > 0) {
      res.send({
        success: true,
        data: allCoWorkers,
      });
    } else {
      res.send({
        success: true,
        data: "No Coworkers present db.",
      });
    }
  } catch (error) {
    console.log(error.message);
    res.status(500).json({ success: false, message: "Internal server error" });
  }
});

// // Login controller
// router.post("/login", async (req, res) => {
//   const { username, password } = req.body;

//   try {
//     // Find the coworker by username
//     const coWorker = await CoWorker.findOne({ username });

//     // Check if the coworker exists
//     if (!coWorker) {
//       return res.status(404).json({ message: "Coworker not found" });
//     }

//     // Compare the provided password with the hashed password in the database
//     const isPasswordValid = await bcrypt.compare(password, coWorker.password);

//     if (!isPasswordValid) {
//       return res.status(401).json({ message: "Invalid password" });
//     }

//     // If the password is valid, generate a JWT token
//     const token = jwt.sign(
//       { id: client._id, username: coWorker.username },
//       process.env.JWT_SECRET, // Use a secret key from your environment variables
//       { expiresIn: "1h" } // Token expires in 1 hour (adjust as needed)
//     );

//     // Send the token back as a response
//     res.status(200).json({ token });
//   } catch (error) {
//     console.log(error.message);
//     res.status(500).json({ message: "Internal server error" });
//   }
// });

// router.post("/signup", async (req, res) => {
//   const { username, password, email } = req.body;

//   try {
//     // Check if the username or email is already in use
//     const existingClient = await Client.findOne({
//       $or: [{ username }, { email }],
//     });

//     if (existingClient) {
//       return res
//         .status(400)
//         .json({ message: "Username or email already in use" });
//     }

//     // Hash the password before storing it in the database
//     const hashedPassword = await bcrypt.hash(password, 10); // Salt rounds: 10

//     // Create a new client document
//     const newClient = new Client({
//       username,
//       password: hashedPassword,
//       email,
//     });

//     // Save the new client in the database
//     await newClient.save();

//     res.status(201).json({ message: "Client registered successfully" });
//   } catch (error) {
//     console.log(error.message);
//     res.status(500).json({ message: "Internal server error" });
//   }
// });

router.put("/update/:id", async (req, res) => {
  const coWorkerId = req.params.id;
  //   const { profileImg } = req.body; // Request body should contain fields to be updated

  try {
    const updateFields = req.body;
    const updatedCoWorker = await CoWorker.findByIdAndUpdate(
      coWorkerId,
      updateFields,
      { new: true }
    );

    if (!updatedCoWorker) {
      return res.status(404).json({ message: "Co-Worker not found" });
    }

    res.status(200).json(updatedCoWorker);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal server error" });
  }
});

router.delete("/delete/:id", async (req, res) => {
  try {
    const _id = req.params.id;
    const deleteCoWorker = await CoWorker.findByIdAndDelete({ _id });

    res.send({
      success: true,
      message: "CoWorker deleted.",
      data: deleteCoWorker,
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Internal server error" });
  }
});
module.exports = router;
