const Auth = require("./../models/Auth");
const response = require("./../libs/responseLib");
const token = require("./../libs/tokenLib");
const check = require("./../libs/checkLib");

let isAuthorized = (req, res, next) => {
  if (
    req.params.authToken ||
    req.query.authToken ||
    req.body.authToken ||
    req.header("authToken")
  ) {
    Auth.findOne({
      authToken:
        req.params.authToken ||
        req.query.authToken ||
        req.body.authToken ||
        req.header("authToken")
    })
      .exec()
      .then(authDetails => {
        if (check.isEmpty(authDetails)) {
          res.send(
            response.generate(true, "Invalid or Expired auth token.", 404, null)
          );
        } else {
          token.verifyToken(
            authDetails.authToken,
            authDetails.tokenSecret,
            (err, decoded) => {
              if (err) {
                res.send(
                  response.generate(true, "Failed to verify token.", 500, null)
                );
              } else {
                req.user = { userId: decoded.data.userId };
                next();
              }
            }
          );
        }
      })
      .catch(err => {
        res.send(response.generate(true, "Error Occured.", 500, null));
      });
  } else {
    res.send(
      response.generate(true, "Auth token is missing in request.", 400, null)
    );
  }
};

module.exports = {
  isAuthorized: isAuthorized
};
