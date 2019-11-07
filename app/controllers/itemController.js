const response = require("./../libs/responseLib");
const check = require("./../libs/checkLib");
const itemLib = require("../libs/itemLib");

/**Models */
const Item = require("./../models/Item");

let createItem = (req, res) => {
  if (
    check.isEmpty(req.body.title) ||
    check.isEmpty(req.body.description) ||
    check.isEmpty(req.file) ||
    check.isEmpty(req.body.itemCreatorId)
  ) {
    res.send(response.generate(true, "Parameter(s) missing.", 400, null));
  }

  itemLib
    .create(req)
    .then(result => {
      delete result._id;
      delete result.__v;
      res.send(response.generate(false, "Item created.", 200, result));
    })
    .catch(err => {
      res.send(err);
    });
};

let getAllItems = (req, res) => {
  itemLib
    .findItems(req)
    .then(result => {
      res.send(response.generate(false, "All items found.", 200, result));
    })
    .catch(err => {
      res.send(err);
    });
};

let getItem = (req, res) => {
  itemLib
    .findItem(req.params.itemId)
    .then(result => {
      res.send(response.generate(false, "Item found.", 200, result));
    })
    .catch(err => {
      res.send(err);
    });
};

let deleteItem = (req, res) => {
  let removeItem = () => {
    return new Promise((resolve, reject) => {
      Item.findOneAndRemove({ itemId: req.params.itemId }).exec(
        (err, result) => {
          if (err) {
            reject(response.generate(true, "Failed to find item.", 500, null));
          } else if (check.isEmpty(result)) {
            reject(response.generate(true, "Item not found.", 404, null));
          } else {
            resolve(result);
          }
        }
      );
    });
  };

  removeItem()
    .then(result => {
      res.send(response.generate(false, "Item deleted.", 200, null));
    })
    .catch(err => {
      res.send(err);
    });
};

let updateItem = (req, res) => {
  itemLib
    .update(req)
    .then(result => {
      res.send(response.generate(false, "Item updated.", 200, null));
    })
    .catch(err => {
      res.send(err);
    });
};

module.exports = {
  createItem: createItem,
  updateItem: updateItem,
  deleteItem: deleteItem,
  getAllItems: getAllItems,
  getItem: getItem
};
