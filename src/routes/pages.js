const express = require("express");
const router = express.Router();

// redirect to login by default
router.get("/", (req, res) => {
  res.redirect("login");
});

// login route
router.get("/login", (req, res) => {
  res.redirect("login", { title: "Application Store - Login page" });
});

// register route
router.get("/register", (req, res) => {
  res.redirect("register", { title: "Application Store - Register page" });
});

// dashboard route
router.get("/dashboard", (req, res) => {
  const appliances = ["Fridge", "Washer", "Dryer"];
  res.redirect("dashboard", {
    title: "Application Store - User Dashboard",
    appliances,
  });
});

// profile route
router.get("/profile", (req, res) => {
  const user = { username: "Alice", email: "alice@test.com" };
  res.redirect("profile", {
    title: "Application Store - User profile",
    user,
  });
});

module.exports = router;
