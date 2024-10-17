const userModel = require("../models/userModel");
const { body, validationResult } = require("express-validator");
const sendApiResponse = require("../utils/response");
const sendApiResponseSingle = require("../utils/response_single");
const formatDate = require("../utils/formatdata");
const sendMessage = require("../kafka/producer"); // Import the producer

// Get all users
exports.getUsers = async (req, res) => {
  const page = parseInt(req.query.page) || 1;
  const limit = parseInt(req.query.limit) || 10;
  const search = req.query.search || "";

  const offset = (page - 1) * limit;

  try {
    const { count, rows } = await userModel.getAllUsers({
      limit,
      offset,
      search,
    });
    const data = rows || null;
    const total = count || 0;
    sendApiResponse(
      res,
      data,
      page,
      limit,
      total,
      "data successfuly show",
      200
    );
  } catch (error) {
    console.error("Error fetching User:", error);
    const message = "Failed to fetch User";
    sendApiResponseSingle(res, "null", message, 500);
  }
};

// Get a single user by ID
exports.getUserById = async (req, res) => {
  try {
    const user = await userModel.getUserById(req.params.id);

    // Check if user is found directly
    if (!user) {
      return null;
    }

    sendApiResponseSingle(res, user, "Data successfully shown", 200);
  } catch (error) {
    console.error("Error fetching User:", error);
    const message = "Failed to fetch User";
    sendApiResponseSingle(res, null, message, 500);
  }
};

// Create a new user

exports.createUser = async (req, res) => {
  try {
    const newUser = await userModel.createUser(req.body);

    const { password, ...userWithoutPassword } = newUser;
    userWithoutPassword.createdAt = formatDate(userWithoutPassword.createdAt);
    userWithoutPassword.updatedAt = formatDate(userWithoutPassword.updatedAt);

    // Send a message to Kafka after successful user creation
    // await sendMessage("user-created", userWithoutPassword);
    const message = "User successfully created";
    sendApiResponseSingle(res, userWithoutPassword, message, 200);
  } catch (error) {
    console.error("Error creating User:", error);
    const message = "Failed to create User";
    sendApiResponseSingle(res, null, message, 500);
  }
};

// Update a user by ID
exports.updateUser = async (req, res) => {
  try {
    const updatedUser = await userModel.updateUser(req.params.id, req.body);

    const { password, ...userWithoutPassword } = updatedUser;

    userWithoutPassword.createdAt = formatDate(userWithoutPassword.createdAt);
    userWithoutPassword.updatedAt = formatDate(userWithoutPassword.updatedAt);
    // Send a message to Kafka after successful user update
    // await sendMessage("user-updated", userWithoutPassword);
    const message = "User successfully updated";
    sendApiResponseSingle(res, userWithoutPassword, message, 200);
  } catch (error) {
    console.error("Error fetching User:", error);
    const message = "Failed to fetch User";
    sendApiResponseSingle(res, "null", message, 500);
  }
};

// Delete a user by ID
exports.deleteUser = async (req, res) => {
  try {
    const deletedUser = await userModel.deleteUser(req.params.id);
    const { password, ...userWithoutPassword } = deletedUser;

    userWithoutPassword.createdAt = formatDate(userWithoutPassword.createdAt);
    userWithoutPassword.updatedAt = formatDate(userWithoutPassword.updatedAt);
    // Send a message to Kafka after successful user deletion
    // await sendMessage("user-deleted", userWithoutPassword); // Use a different topic or the same one
    const message = "User successfully deleted";
    sendApiResponseSingle(res, userWithoutPassword, message, 200);
  } catch (error) {
    console.error("Error fetching User:", error);
    const message = "Failed to fetch User";
    sendApiResponseSingle(res, "null", message, 500);
  }
};

exports.checkExistingUsername = async (userName) => {
  return await userModel.getUserName(userName);
};

exports.checkExistingEmail = async (emailAddress) => {
  return await userModel.getUserByEmail(emailAddress); // You'll need to implement getUserByEmail in your userModel
};

exports.checkFindUserId = async (id) => {
  return await userModel.getUserById(id); // You'll need to implement getUserByEmail in your userModel
};
