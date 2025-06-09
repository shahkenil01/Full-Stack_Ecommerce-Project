const jwt = require('jsonwebtoken');

const verifyToken = (req, res, next) => {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return res.status(401).json({ msg: "Access denied. Token missing or invalid." });
  }

  const token = authHeader.split(" ")[1];

  try {
    const decoded = jwt.verify(token, process.env.JSON_WEB_TOKEN_SECRECT_KEY);

    req.user = decoded;
    next();
  } catch (error) {
    return res.status(401).json({ msg: "Invalid token." });
  }
};

module.exports = verifyToken;