// authMiddleware.js
require(".env").config();

const verifySecret = (req, res, next) => {
  const secretKey = req.headers["shipping_secret_key"];

  if (!secretKey) {
    return res.status(403).json({ error: "SHIPPING_SECRET_KEY is missing or invalid" });
  }

  if (secretKey !== process.env.SHIPPING_SECRET_KEY) {
    return res.status(403).json({ error: "Failed to authenticate SHIPPING_SECRET_KEY" });
  }

  next();
};

module.exports =  verifySecret ;
