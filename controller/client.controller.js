const Client = require("../models/client");
const express = require("express");
const bcrypt = require("bcrypt"); // For password hashing
const jwt = require("jsonwebtoken"); // For generating JWT tokens
const dotenv = require("dotenv").config();
const router = express.Router();

router.get("/all", async (req, res) => {
  try {
    const allClients = await Client.find();
    if (allClients.length > 0) {
      res.send({
        success: true,
        data: allClients,
      });
    } else {
      res.send({
        success: true,
        data: "No Client present db.",
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
    // Find the client by username
    const client = await Client.findOne({ username });

    // Check if the client exists
    if (!client) {
      return res.status(404).json({ message: "Client not found" });
    }

    // Compare the provided password with the hashed password in the database
    const isPasswordValid = await bcrypt.compare(password, client.password);

    if (!isPasswordValid) {
      return res.status(401).json({ message: "Invalid password" });
    }

    // If the password is valid, generate a JWT token
    const token = jwt.sign(
      { id: client._id, username: client.username },
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
    const existingClient = await Client.findOne({
      $or: [{ username }, { email }],
    });

    if (existingClient) {
      return res
        .status(400)
        .json({ message: "Username or email already in use" });
    }

    // Hash the password before storing it in the database
    const hashedPassword = await bcrypt.hash(password, 10); // Salt rounds: 10

    // Create a new client document
    const newClient = new Client({
      username,
      password: hashedPassword,
      email,
    });

    // Save the new client in the database
    await newClient.save();

    res.status(201).json({ message: "Client registered successfully" });
  } catch (error) {
    console.log(error.message);
    res.status(500).json({ message: "Internal server error" });
  }
});

router.put("/update/:id", async (req, res) => {
  const clientId = req.params.id;
  const { profileImg } = req.body; // Request body should contain fields to be updated

  try {
    const updatedClient = await Client.findByIdAndUpdate(
      clientId,
      updateFields,
      { new: true }
    );

    if (!updatedClient) {
      return res.status(404).json({ message: "Client not found" });
    }

    res.status(200).json(updatedClient);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal server error" });
  }
});

router.delete("/delete/:id", async (req, res) => {
  try {
    const _id = req.params.id;
    const deleteClient = await Client.findByIdAndDelete({ _id });

    res.send({
      success: true,
      message: "User deleted.",
      data: deleteClient,
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Internal server error" });
  }
});
module.exports = router;
