let appConfig = require("../../config/appConfig");

/* Minimum 8 characters which contain only characters,numeric 
digits,underscore and first character must be a letter */
module.exports.checkPassword = password => {
  if (password.match(appConfig.passwordRegex)) return password;
  return false;
};

module.exports.checkEmail = email => {
  if (email.match(appConfig.emailRegex)) return email;
  return false;
};
