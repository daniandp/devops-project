const express = require("express");
const router = express.Router();
const User = require("../models/user");
const { loginWithEmailPassword } = require("../services/authservice");

// Register API - POST /api/register
router.post("/register", async (req, res) => {
  try {
    const { email, password, firstName, middleName, lastName } = req.body;

    // check for required data
    if (!email || !password || !firstName || !lastName) {
      return res.status(400).json({
        error: "Email, password, Firstname and Lastname are required.",
      });
    }

    // check if user is already exists
    const existing = await User.findOne({ email });
    if (existing) {
      return res.status(400).json({ error: "Email already in use" });
    }

    // create user
    const user = await User.create({
      email,
      password,
      firstName,
      middleName,
      lastName,
    });

    // success response for created user
    return res.status(201).json({
      message: "User created successfully",
      user: {
        email: user.email,
        firstName: user.firstName,
        middleName: user.middleName,
        lastName: user.lastName,
      },
    });
  } catch (error) {
    console.log("error :: Error in register API ==>", error);
    return res
      .status(500)
      .json({ error: error.message ? error.message : "Internal server error" });
  }
});

// Login API - POST /api/login
router.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;

    const safeUser = await loginWithEmailPassword(email, password);

    // set session
    req.session.user = safeUser;

    // return success
    return res.json({
      message: "Login successful",
      user: safeUser,
    });
  } catch (error) {
    console.log("error :: Error in Login API ==>", error);
    return res
      .status(500)
      .json({ error: error.message ? error.message : "Internal server error" });
  }
});

// Get Profile by email API - GET /api/profile
router.get("/profile/:email", async (req, res) => {
  try {
    const { email } = req.params;

    // error if no email in req.params
    if (!email) {
      return res.status(400).json({ error: "Email is required" });
    }

    // find user by email id
    const user = await User.findOne({ email });

    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    // successful response
    return res.json({
      email: user.email,
      firstName: user.firstName,
      middleName: user.middleName,
      lastName: user.lastName,
      createdAt: user.createdAt,
    });
  } catch (error) {
    console.log("error :: Error in Profile API ==>", error);
    return res
      .status(500)
      .json({ error: error.message ? error.message : "Internal server error" });
  }
});

// Appliances API - GET /api/appliances
router.get("/appliances", (req, res) => {
  const appliances = [
    { name: "Smart Fridge", price: 1200 },
    { name: "Washing Machine", price: 800 },
    { name: "Microwave Oven", price: 200 },
  ];
  res.json({ appliances });
});

module.exports = router;
