const shortId = require("shortid");
const response = require("./../libs/responseLib");
const check = require("../libs/checkLib");
const passwordLib = require("./../libs/passwordLib");
const time = require("./../libs/timeLib");
const token = require("./../libs/tokenLib");
const User = require("./../models/User");
const Auth = require("./../models/Auth");

let createUser = (req, res) => {
  return new Promise((resolve, reject) => {
    User.findOne({
      email: req.body.email
    }).exec((err, user) => {
      if (err) {
        reject(response.generate(true, "Error occured.", 500, null));
      } else if (check.isEmpty(user)) {
        let newUser = new User({
          userId: shortId.generate(),
          firstName: req.body.firstName,
          lastName: req.body.lastName,
          email: req.body.email.toLowerCase(),
          password: passwordLib.hashPassword(req.body.password),
          createdOn: time.now()
        });
        newUser.save((err, newUser) => {
          if (err) {
            reject(response.generate(true, "Error occured.", 500, null));
          } else {
            resolve(newUser.toObject());
          }
        });
      } else if (user.email === req.body.email) {
        reject(response.generate(true, "Email already exist.", 500, null));
      } else if (user.userName === req.body.userName) {
        reject(response.generate(true, "Username already exist.", 500, null));
      }
    });
  });
};

let findUser = req => {
  return new Promise((resolve, reject) => {
    User.findOne({ email: req.body.email })
      .select("-_id -__v")
      .exec((err, user) => {
        if (err) {
          reject(response.generate(true, "Error occured.", 500, null));
        } else if (check.isEmpty(user)) {
          reject(response.generate(true, "No User found.", 404, null));
        } else {
          resolve(user);
        }
      });
  });
};

let validatePassword = (req, userDetails) => {
  return new Promise((resolve, reject) => {
    passwordLib.comparePassword(
      req.body.password,
      userDetails.password,
      (err, isMatched) => {
        if (err) {
          reject(response.generate(true, "Error occured.", 500, null));
        } else if (isMatched) {
          let userDetailsObj = userDetails.toObject();
          delete userDetailsObj.password;
          delete userDetailsObj.createdOn;
          resolve(userDetailsObj);
        } else {
          reject(response.generate(true, "Wrong password.", 400, null));
        }
      }
    );
  });
};

let generateToken = userDetails => {
  return new Promise((resolve, reject) => {
    token.generateToken(userDetails, (err, tokenDetails) => {
      if (err) {
        reject(response.generate(true, "Error occured.", 500, null));
      } else {
        tokenDetails.userId = userDetails.userId;
        tokenDetails.userDetails = userDetails;
        resolve(tokenDetails);
      }
    });
  });
};

let saveToken = tokenDetails => {
  return new Promise((resolve, reject) => {
    Auth.findOne({ userId: tokenDetails.userId })
      .exec()
      .then(token => {
        if (check.isEmpty(token)) {
          let newAuthToken = new Auth({
            userId: tokenDetails.userId,
            authToken: tokenDetails.token,
            tokenSecret: tokenDetails.tokenSecret,
            tokenGenerationTime: time.now()
          });
          newAuthToken.save((err, newTokenDetails) => {
            if (err) {
              reject(response.generate(true, "Error occured.", 500, null));
            } else {
              resolve({
                authToken: newTokenDetails.authToken,
                userDetails: tokenDetails.userDetails
              });
            }
          });
        } else {
          token.authToken = tokenDetails.token;
          token.tokenSecret = tokenDetails.tokenSecret;
          token.tokenGenerationTime = time.now();
          token.save((err, newTokenDetails) => {
            if (err) {
              reject(response.generate(true, "Error occured.", 404, null));
            } else {
              resolve({
                authToken: newTokenDetails.authToken,
                userDetails: tokenDetails.userDetails
              });
            }
          });
        }
      });
  });
};

let deleteToken = (req, res) => {
  return new Promise((resolve, reject) => {
    Auth.remove({ userId: req.user.userId }).exec((err, result) => {
      if (err) {
        logger.error(err.message, "userController: deleteToken()", 10);
        reject(response.generate(true, "Logout failed.", 500, null));
      } else if (check.isEmpty(result)) {
        logger.info(
          "User already logged out.",
          "userController:  deleteToken()",
          7
        );
        reject(response.generate(true, "User already logged out.", 404, null));
      } else {
        resolve(result);
      }
    });
  });
};

let getAll = (skip = 1) => {
  return new Promise((resolve, reject) => {
    User.find({ isVerified: true })
      .select("-_id -__v -password")
      .skip(parseInt(skip - 1) * 10)
      .limit(10)
      .lean()
      .exec((err, usersDetails) => {
        if (err) {
          logger.error(err.message, "userController: getAll()", 10);
          reject(
            response.generate(true, "Failed to find all users.", 500, null)
          );
        } else if (check.isEmpty(usersDetails)) {
          logger.info(
            "Users details not found.",
            "userController:  getAll()",
            7
          );
          reject(
            response.generate(true, "User already logged out.", 404, null)
          );
        } else {
          resolve(usersDetails);
        }
      });
  });
};

let getUser = req => {
  return new Promise((resolve, reject) => {
    User.findOne({
      $and: [{ userId: req.params.userId }, { isVerified: true }]
    })
      .select("-password -_id -__v")
      .lean()
      .exec((err, retrievedUserDetails) => {
        if (err) {
          logger.error(err.message, "userController: getUser()", 10);
          reject(response.generate(true, "Failed to find User.", 500, null));
        } else if (check.isEmpty(retrievedUserDetails)) {
          logger.info("User not found.", "userController:  getUser()", 7);
          reject(response.generate(true, "User not found.", 404, null));
        } else {
          resolve(retrievedUserDetails);
        }
      });
  });
};

module.exports = {
  generateToken: generateToken,
  createUser: createUser,
  findUser: findUser,
  saveToken: saveToken,
  deleteToken: deleteToken,
  getAll: getAll,
  getUser: getUser,
  validatePassword: validatePassword
};
