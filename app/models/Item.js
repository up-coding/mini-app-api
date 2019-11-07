const mongoose = require("mongoose");

let itemSchema = new mongoose.Schema({
  itemId: {
    type: String,
    unique: true,
    index: true,
    required: true
  },
  title: {
    type: String,
    required: true
  },
  description: {
    type: String,
    required: true
  },
  imagePath: {
    type: String,
    required: true
  },
  itemCreatorId: {
    type: String,
    required: true
  },

  itemCreatedOn: {
    type: Date,
    default: Date.now()
  },
  itemModifiedOn: {
    type: Date,
    default: Date.now()
  }
});

module.exports = mongoose.model("Item", itemSchema);
