const express = require("express");
const {
  loginWithEmailPassword,
  registerUser,
  getUserProfileByEmail,
} = require("../services/auth_service");
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

// POST /register - for form submit
router.post("/register", async (req, res) => {
  try {
    const { email, password, firstName, middleName, lastName } = req.body;

    const user = await registerUser({
      email,
      password,
      firstName,
      middleName,
      lastName,
    });

    // if successful, redirect to the login page
    return res.render("login", {
      title: "Application Store - Login page",
      message: "Registration successful. Please log in.",
    });
  } catch (error) {
    console.log("error :: error on register submit ==>", error);

    const status = error.statusCode || 500;

    const errorMessage =
      status === 400
        ? error.message
        : "Something went wrong. Please try again.";

    return res.render("register", {
      title: "Application Store - Register",
      error: errorMessage,
    });
  }
});

// auth guard to prevent non logged in users to access dashboard and profile
function requireLogin(req, res, next) {
  if (!req.session || !req.session.user) {
    return res.redirect("/login");
  }
  next();
}

// dashboard route
router.get("/dashboard", requireLogin, (req, res) => {
  // get user
  const user = req.session.user;

  // appliacances list
  const appliances = [
    { name: "Smart Fridge", price: 1200 },
    { name: "Washing Machine", price: 800 },
    { name: "Microwave Oven", price: 200 },
  ];

  // render page
  res.render("dashboard", {
    title: "Application Store - User Dashboard",
    user,
    appliances,
  });
});

// profile route
router.get("/profile", requireLogin, async (req, res) => {
  try {
    const email = req.session.user.email;

    // get user profile by email
    const userProfile = await getUserProfileByEmail(email);

    // return response
    res.render("profile", {
      title: "Application Store - User Profile",
      user: userProfile,
    });
  } catch (error) {
    console.log("error :: error gettign user profile data ==>", error);
    res.render("profile", {
      title: "Application Store - Profile",
      error: "Error loading User Profile. Please try again.",
      user: null,
    });
  }
});

// logout route
router.get("/logout", (req, res) => {
  req.session.destroy(() => {
    res.redirect("/login");
  });
});

module.exports = router;
