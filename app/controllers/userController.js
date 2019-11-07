const response = require("./../libs/responseLib");
const userLib = require("./../libs/userLib");
const validate = require("./../libs/validateLib");
const check = require("./../libs/checkLib");

/**User SignUp Function */
let userSignup = (req, res) => {
  const { firstName, lastName, email, password } = req.body;
  if (
    check.isEmpty(firstName) ||
    check.isEmpty(lastName) ||
    check.isEmpty(email) ||
    check.isEmpty(password)
  ) {
    return res.send(
      response.generate(true, "parameter(s) is missing.", 400, null)
    );
  }
  if (!validate.checkEmail(email)) {
    return res.send(response.generate(true, "Invalid email.", 400, null));
  } else if (!validate.checkPassword(password)) {
    return res.send(
      response.generate(true, "Weak password (length 8)", 400, null)
    );
  }

  userLib
    .createUser(req, res)
    .then(result => {
      delete result.password;
      delete result._id;
      delete result.__v;
      res.send(response.generate(false, "Signup successfull.", 200, result));
    })
    .catch(err => {
      res.send(err);
    });
};

/**User login function. */
let userLogin = (req, res) => {
  const { email, password } = req.body;
  if (check.isEmpty(email) || check.isEmpty(password)) {
    res.send(
      reject(response.generate(true, "parameter(s) is missing.", 400, null))
    );
  } else if (
    !validate.checkEmail(req.body.email) ||
    !validate.checkPassword(req.body.password)
  ) {
    reject(
      res.send(response.generate(true, "Invalid email or password.", 400, null))
    );
  }

  userLib
    .findUser(req)
    .then(resolve => userLib.validatePassword(req, resolve))
    .then(userLib.generateToken)
    .then(userLib.saveToken)
    .then(result => {
      res.send(response.generate(false, "Login successfull.", 200, result));
    })
    .catch(err => {
      res.send(err);
    });
};

let userLogout = (req, res) => {
  userLib
    .deleteToken(req, res)
    .then(result => {
      res.send(response.generate(false, "Logged out successfully.", 200, null));
    })
    .catch(err => {
      res.send(err);
    });
};

let getAllUsers = (req, res) => {
  userLib
    .getAll(req.query.skip)
    .then(result => {
      res.send(response.generate(false, "All users found.", 200, result));
    })
    .catch(err => {
      res.send(err);
    });
};

let getSingleUser = (req, res) => {
  userLib
    .getUser(req)
    .then(result => {
      res.send(response.generate(false, "User details found.", 200, result));
    })
    .catch(err => {
      res.send(err);
    });
};

//edit user
let editUserDetails = (req, res) => {
  if (
    check.isEmpty(req.body.firstName) ||
    check.isEmpty(req.body.lastName) ||
    check.isEmpty(req.user.email)
  ) {
    return res.send(
      response.generate(true, "Parameter is missing.", 400, null)
    );
  }

  userLib
    .edit()
    .then(result => {
      res.send(response.generate(false, "User updated.", 200, null));
    })
    .catch(err => {
      res.send(err);
    });
};

//delete user
let deleteUser = (req, res) => {
  if (check.isEmpty(req.params.email)) {
    return res.send(
      response.generate(true, "Parameter is missing.", 400, null)
    );
  }

  userLib
    .remove()
    .then(result => {
      res.send(
        response.generate(false, "User deleted successfully.", 200, null)
      );
    })
    .catch(err => {
      res.send(err);
    });
};

module.exports = {
  userSignup: userSignup,
  userLogin: userLogin,
  userLogout: userLogout,
  getSingleUser: getSingleUser,
  getAllUsers: getAllUsers,
  editUserDetails: editUserDetails,
  deleteUser: deleteUser
};
