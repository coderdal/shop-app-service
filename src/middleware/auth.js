const jwt = require("jsonwebtoken");

const authMiddleware = (req, res, next) => {
  // Get the JWT token from the request header
  const token = req.header("Authorization");

  // Token check
  if (!token) {
    return res
      .status(401)
      .json({ error: "Authorization denied. Token missing." });
  }

  try {
    // Verify the token
    const decoded = jwt.verify(token, "jwt_secret_key");

    // Add the authenticated user to the request object
    req.user = decoded;

    // End the middleware and move on to the next operation
    next();
  } catch (error) {
    res.status(401).json({ error: "Authorization denied. Invalid token." });
  }
};

module.exports = authMiddleware;
