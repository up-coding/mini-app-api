let trim = str => {
  return String(str).replace(/^\s+|\s+$/gm, "");
};

module.exports.isEmpty = val => {
  if (
    val === null ||
    val === undefined ||
    val.length === 0 ||
    trim(val) === ""
  ) {
    return true;
  } else {
    return false;
  }
};
