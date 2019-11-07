/**Libraries */
const response = require("./responseLib");
const check = require("./checkLib");
const time = require("./timeLib");
const shortId = require("shortid");
const path = require("path");

/**Models */
const Item = require("./../models/Item");

let findItems = req => {
  return new Promise((resolve, reject) => {
    Item.find({ itemCreatorId: req.user.userId })
      .select("-_id -__v")
      .lean()
      .exec((err, itemsDetails) => {
        if (err) {
          reject(response.generate(true, "Failed to find items.", 500, null));
        } else if (check.isEmpty(itemsDetails)) {
          reject(response.generate(true, "Items not found.", 404, null));
        } else {
          resolve(itemsDetails);
        }
      });
  });
};

let findItem = itemId => {
  return new Promise((resolve, reject) => {
    Item.findOne({ itemId: itemId })
      .select("-_id -__v")
      .lean()
      .exec((err, itemDetails) => {
        if (err) {
          reject(response.generate(true, "Failed to find item.", 500, null));
        } else if (check.isEmpty(itemDetails)) {
          reject(response.generate(true, "Item not found.", 404, null));
        } else {
          resolve(itemDetails);
        }
      });
  });
};

let update = req => {
  return new Promise((resolve, reject) => {
    let options = req.body;
    options.modifiedOn = time.now();
    Item.update({ itemId: req.params.itemId }, options).exec((err, result) => {
      if (err) {
        reject(response.generate(true, "Failed to update item.", 500, null));
      } else if (check.isEmpty(result)) {
        reject(response.generate(true, "Item not found.", 404, null));
      } else {
        resolve(result);
      }
    });
  });
};

let create = req => {
  return new Promise((resolve, reject) => {
    let newItem = new Item({
      itemId: shortId.generate(),
      title: req.body.title,
      description: req.body.description,
      imagePath: ".\\" + req.file.path,
      itemCreatorId: req.body.itemCreatorId,
      itemCreatedOn: time.now(),
      itemModifiedOn: time.now()
    });
    console.log(newItem);
    newItem.save((err, newItem) => {
      if (err) {
        reject(response.generate(true, "Failed to create item.", 500, null));
      } else {
        resolve(newItem.toObject());
      }
    });
  });
};

let findSubItem = subItemId => {
  return new Promise((resolve, reject) => {
    Item.findOne({ subItems: { $elemMatch: subItemId } }).exec(
      (err, subItemDetails) => {
        if (err) {
          reject(
            response.generate(true, "Failed to find sub item.", 500, null)
          );
        } else if (check.isEmpty(subItemDetails)) {
          reject(response.generate(true, "Sub item not found.", 404, null));
        } else {
          resolve(subItemDetails);
        }
      }
    );
  });
};
module.exports = {
  findItems: findItems,
  findItem: findItem,
  update: update,
  create: create,
  findSubItem: findSubItem
};
