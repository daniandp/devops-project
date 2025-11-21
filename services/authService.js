const User = require("../models/user");

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

module.exports = { loginWithEmailPassword };
