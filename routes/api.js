const express = require("express");
const router = express.Router();
const User = require("../models/user");
const {
  loginWithEmailPassword,
  registerUser,
  getUserProfileByEmail,
} = require("../services/auth_service");

// Register API - POST /api/register
router.post("/register", async (req, res) => {
  try {
    const { email, password, firstName, middleName, lastName } = req.body;

    // create user
    const user = await registerUser({
      email,
      password,
      firstName,
      middleName,
      lastName,
    });

    // success response for created user
    return res.status(201).json({
      message: "User created successfully",
      user: user,
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

    // get userProfile from authservice
    const userProfile = await getUserProfileByEmail(email);

    // return user
    return res.json(userProfile);
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
