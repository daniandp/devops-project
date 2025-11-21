const express = require("express");
const { loginWithEmailPassword } = require("../services/authservice");
const router = express.Router();

// redirect to login by default
router.get("/", (req, res) => {
  res.redirect("login");
});

// login route
router.get("/login", (req, res) => {
  res.render("login", { title: "Application Store - Login page" });
});

// POST /login - for form submit, sets session
router.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;

    const safeUser = await loginWithEmailPassword(email, password);

    // Save to session
    req.session.user = safeUser;

    // Redirect to dashboard
    return res.redirect("/dashboard");
  } catch (err) {
    console.log("Error in view login:", err.message);

    const status = err.statusCode || 500;
    const errorMessage =
      status === 400 || status === 401
        ? err.message
        : "Something went wrong. Please try again.";

    return res.render("login", {
      title: "Application Store - Login page",
      error: errorMessage,
    });
  }
});

// register route
router.get("/register", (req, res) => {
  res.render("register", { title: "Application Store - Register page" });
});

// dashboard route
router.get("/dashboard", (req, res) => {
  const appliances = ["Fridge", "Washer", "Dryer"];
  res.render("dashboard", {
    title: "Application Store - User Dashboard",
    appliances,
  });
});

// logout route
router.get("/logout", (req, res) => {
  req.session.destroy(() => {
    res.redirect("/login");
  });
});

// profile route
router.get("/profile", (req, res) => {
  res.render("profile", {
    title: "Application Store - User profile",
    user,
  });
});

module.exports = router;
