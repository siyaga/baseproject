const jwt = require("jsonwebtoken");
const sendApiResponseSingle = require("../utils/response_single");
const authenticateJWT = (req, res, next) => {
  const authHeader = req.headers.authorization;

  if (authHeader) {
    const token = authHeader.split(" ")[1];

    jwt.verify(token, process.env.JWT_SECRET, (err, user) => {
      if (err) {
        return sendApiResponseSingle(res, null, "Forbidden", 403);
        // return res.sendStatus(403); // Forbidden
      }

      req.user = user;
      next();
    });
  } else {
    return sendApiResponseSingle(res, null, "Unauthorized", 401);
    // res.sendStatus(401); // Unauthorized
  }
};

module.exports = authenticateJWT;
