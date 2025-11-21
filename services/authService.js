const User = require("../models/user");

async function registerUser({
  email,
  password,
  firstName,
  middleName,
  lastName,
}) {
  // check for required data
  if (!email || !password || !firstName || !lastName) {
    const err = new Error(
      "Email, password, Firstname and Lastname are required."
    );
    err.statusCode = 400;
    throw err;
  }

  // check if user already exists
  const existing = await User.findOne({ email });
  if (existing) {
    const err = new Error("Email already in use");
    err.statusCode = 400;
    throw err;
  }

  // create user
  const user = await User.create({
    email,
    password,
    firstName,
    middleName,
    lastName,
  });

  // return safe user object (no password)
  return {
    email: user.email,
    firstName: user.firstName,
    middleName: user.middleName,
    lastName: user.lastName,
  };
}

async function loginWithEmailPassword(email, password) {
  if (!email || !password) {
    const err = new Error("Email and password are required");
    err.statusCode = 400;
    throw err;
  }

  const user = await User.findOne({ email });

  if (!user || user.password !== password) {
    const err = new Error("Invalid email or password");
    err.statusCode = 401;
    throw err;
  }

  // return user details
  return {
    email: user.email,
    firstName: user.firstName,
    middleName: user.middleName,
    lastName: user.lastName,
  };
}

async function getUserProfileByEmail(email) {
  // error if no email
  if (!email) {
    const err = new Error("Email is required");
    err.statusCode = 400;
    throw err;
  }

  // find user by email id
  const user = await User.findOne({ email });

  // error if no user found
  if (!user) {
    const err = new Error("User not found");
    err.statusCode = 404;
    throw err;
  }

  // return user detail
  return {
    email: user.email,
    firstName: user.firstName,
    middleName: user.middleName,
    lastName: user.lastName,
    createdAt: user.createdAt,
  };
}

module.exports = {
  loginWithEmailPassword,
  registerUser,
  getUserProfileByEmail,
};
