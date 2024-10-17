const userModel = require("../models/userModel"); // Assuming you have a userModel
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const sendApiResponseSingle = require("../utils/response_single");

exports.login = async (req, res) => {
  try {
    const { userName, password } = req.body;

    const user = await userModel.getUserNameForLogin(userName); // Find user by username

    if (user.length === 0) {
      return sendApiResponseSingle(
        res,
        null,
        "Invalid username or password",
        401
      );
    }

    // Get the hashed password from the database
    const hashedPassword = user[0].password;
    // Compare the plain text password with the hashed password
    const isPasswordValid = await bcrypt.compare(password, hashedPassword);

    if (!isPasswordValid) {
      return sendApiResponseSingle(
        res,
        null,
        "Invalid username or password",
        401
      );
    }

    // Create and sign the JWT
    const token = jwt.sign({ userId: user[0].id }, process.env.JWT_SECRET, {
      expiresIn: "24h",
    });
    const responseData = {
      accessToken: token,
      tokenType: "JWT", // Added token type
      expiresIn: "24h",
      id: user[0].id,
      userName: user[0].userName,
      emailAddress: user[0].emailAddress,
    };

    sendApiResponseSingle(res, responseData, "Login successful", 200);
  } catch (error) {
    console.error("Error during login:", error);
    sendApiResponseSingle(res, null, "Login failed", 500);
  }
};

// Get user profile
exports.profile = async (req, res) => {
  try {
    // Assuming your JWT payload has a userId
    const userId = req.user.userId;

    console.log(userId);
    const user = await userModel.getUserById(userId);

    if (!user) {
      return sendApiResponseSingle(res, null, "User not found", 404);
    }

    // Exclude the password from the response
    const { password, ...userWithoutPassword } = user;

    sendApiResponseSingle(
      res,
      userWithoutPassword,
      "Profile fetched successfully",
      200
    );
  } catch (error) {
    console.error("Error fetching profile:", error);
    sendApiResponseSingle(res, null, "Failed to fetch profile", 500);
  }
};
