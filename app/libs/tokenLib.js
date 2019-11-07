const jwt = require("jsonwebtoken");
const shortId = require("shortid");
const secretKey = "thisisthesecretkeyofthisproject";

/**Generate token */
let generateToken = (data, cb) => {
  try {
    let claims = {
      jwtid: shortId.generate(),
      iat: Date.now(),
      exp: Math.floor(Date.now() / 1000) + 60 * 60 * 24,
      sub: "authToken",
      iss: "mini-app",
      data: data
    };

    let tokenDetails = {
      token: jwt.sign(claims, secretKey),
      tokenSecret: secretKey
    };

    cb(null, tokenDetails);
  } catch (err) {
    cb(err, null);
  }
};

/**Verify user with secret key. */
let verifyToken = (token, secretKey, cb) => {
  jwt.verify(token, secretKey, (err, decoded) => {
    if (err) {
      cb(err, null);
    } else {
      cb(null, decoded);
    }
  });
};

/**Verify user without secret key. */
let verifyTokenWithoutSecret = (token, cb) => {
  jwt.verify(token, secretKey, (err, decoded) => {
    if (err) {
      cb(err, null);
    } else {
      cb(null, decoded);
    }
  });
};

module.exports = {
  generateToken: generateToken,
  verifyToken: verifyToken,
  verifyTokenWithoutSecret: verifyTokenWithoutSecret
};
