const jwt = require("jsonwebtoken");

module.exports = function (req, res, next) {
  const authHeader = req.headers.authorization;

  console.log("Token received:", authHeader);

  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return res.status(401).json({ message: "No token" });
  }

  const token = authHeader.split(" ")[1]; // 👈 extract real token

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    console.log("Decoded:", decoded);

    req.user = decoded.id;
    next();
  } catch (err) {
    return res.status(401).json({ message: "Token invalid" });
  }
};

