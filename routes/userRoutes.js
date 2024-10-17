const express = require("express");
const router = express.Router();
const userController = require("../controllers/userControllers");
const { param, body, validationResult } = require("express-validator");
const sendApiResponse = require("../utils/response");
const sendApiResponseSingle = require("../utils/response_single");

// Validation middleware for user ID
const validateUserId = [
  param("id")
    .notEmpty()
    .withMessage("User ID is required")
    .isUUID() // Use isUUID for PostgreSQL UUID validation
    .withMessage("user not found"), // Check if it's a valid MongoDB ObjectId
  // This middleware runs after the above validations
  (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      // return res.status(400).json({ errors: errors.array() });
      const errorMessage = errors.array()[0].msg;
      return sendApiResponseSingle(res, null, errorMessage, 400);
    }
    next(); // If no errors, proceed to the controller
  },
];

// Validation middleware for creating a new user
const validateCreateUser = [
  body("userName")
    .notEmpty()
    .withMessage("Username is required")
    .isAlphanumeric()
    .withMessage("Username can only contain letters and numbers")
    .custom(async (value) => {
      const existingUsers = await userController.checkExistingUsername(value);
      if (existingUsers.length > 0) {
        throw new Error("Username already exists");
      }
    }),

  body("emailAddress")
    .notEmpty()
    .withMessage("Email address is required")
    .isEmail()
    .withMessage("Invalid email address format")
    .custom(async (value) => {
      const existingUsers = await userController.checkExistingEmail(value);
      if (existingUsers.length > 0) {
        throw new Error("Email address already exists");
      }
    }),

  // Add validation for other fields as needed (accountNumber, identityNumber, password)

  (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      const errorMessage = errors.array()[0].msg;
      return sendApiResponseSingle(res, null, errorMessage, 400);
    }
    next();
  },
];

// Validation middleware for creating a new user
const validateUpdateUser = [
  validateUserId,
  body("userName")
    .notEmpty()
    .withMessage("Username is required")
    .isAlphanumeric()
    .withMessage("Username can only contain letters and numbers")
    .custom(async (value, { req }) => {
      const userId = req.params.id;
      const existingUser = await userController.checkFindUserId(userId);
      if (!existingUser) {
        throw new Error("User not found");
      }
      if (value !== existingUser.userName) {
        const existingUsersWithSameName =
          await userController.checkExistingUsername(value);

        if (existingUsersWithSameName.length > 0) {
          throw new Error("Username already exists");
        }
      }
    }),

  body("emailAddress")
    .notEmpty()
    .withMessage("Email address is required")
    .isEmail()
    .withMessage("Invalid email address format")
    .custom(async (value, { req }) => {
      const userId = req.params.id;
      const existingUser = await userController.checkFindUserId(userId);
      if (!existingUser) {
        throw new Error("User not found");
      }
      // If email is different and already exists for another user, throw error
      if (value !== existingUser.emailAddress) {
        const existingUsersWithEmail = await userController.checkExistingEmail(
          value
        );
        if (existingUsersWithEmail.length > 0) {
          throw new Error("Email address already exists");
        }
      }
    }),

  // Add validation for other fields as needed (accountNumber, identityNumber, password)

  (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      const errorMessage = errors.array()[0].msg;
      return sendApiResponseSingle(res, null, errorMessage, 400);
    }
    next();
  },
];

router.get("/", userController.getUsers);
router.get("/:id", validateUserId, userController.getUserById);
router.post("/", validateCreateUser, userController.createUser);
router.put("/:id", validateUpdateUser, userController.updateUser);
router.delete("/:id", validateUserId, userController.deleteUser);

module.exports = router;
