const express = require("express");
const userRoutes = require("./routes/userRoutes");
const authRoutes = require("./routes/authRoutes");
const formatDate = require("./utils/formatdata");
const authenticateJWT = require("./middleware/authMiddleware");

const app = express();
const port = 3000;

app.use(express.json());
// Middleware to log API requests
app.use((req, res, next) => {
  console.log(
    `[${formatDate(new Date().toISOString())}] ${req.method} ${req.url}`
  );
  next(); // Continue to the next middleware
});

app.use("/api/user", userRoutes);
app.use("/api/auth", authRoutes);

// 404 Error Handler
app.use((req, res, next) => {
  const error = new Error("Not Found");
  error.status = 404;
  next(error); // Pass the error to the next middleware (error handler)
});

// Error Handler Middleware (must have 4 arguments)
app.use((err, req, res, next) => {
  res.status(err.status || 500);
  res.json({
    error: {
      message: err.message,
      //...(process.env.NODE_ENV === "production" ? null : { stack: err.stack }),
    },
  });
});

app.listen(port, () => {
  console.log(`Server listening at http://localhost:${port}`);
});
