const bcrypt = require("bcrypt");
const saltRounds = 10;

let comparePassword = (oldPassword, hashPassword, callback) => {
  bcrypt.compare(oldPassword, hashPassword, (err, res) => {
    if (err) {
      callback(err, null);
    } else {
      callback(null, res);
    }
  });
};

let hashPassword = rowPassword => {
  let salt = bcrypt.genSaltSync(saltRounds);
  let hash = bcrypt.hashSync(rowPassword, salt);
  return hash;
};

module.exports = {
  comparePassword: comparePassword,
  hashPassword: hashPassword
};
