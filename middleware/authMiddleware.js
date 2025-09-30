// authMiddleware.js
require("dotenv").config();

const verifySecret = (req, res, next) => {
  const headers = (req && req.headers) ? req.headers : {};
  const secretKey = headers["shipping_secret_key"];

  if (!secretKey || secretKey.trim() == "") {
    return res.status(403).json({ 
      "error": "SHIPPING_SECRET_KEY is missing or invalid"
   });
  }

  if (secretKey != process.env.SHIPPING_SECRET_KEY) {
    return res.status(403).json({ 
      "error": "Failed to authenticate SHIPPING_SECRET_KEY"
   });
  }

  next();
};

module.exports =  {verifySecret} ;  
