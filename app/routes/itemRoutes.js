const express = require("express");
const router = express.Router();
const itemController = require("./../controllers/itemController");
const auth = require("./../middlewares/auth");
var multer = require("multer");

const storage = multer.diskStorage({
  destination: function(req, file, cb) {
    cb(null, "./uploads/");
  },
  filename: function(req, file, cb) {
    cb(null, new Date().toISOString().replace(/:/g, "-") + file.originalname);
  }
});

const fileFilter = (req, file, cb) => {
  // reject a file
  if (file.mimetype === "image/jpeg" || file.mimetype === "image/png") {
    cb(null, true);
  } else {
    cb(null, false);
  }
};

const upload = multer({ storage: storage, fileFilter: fileFilter });

module.exports.setRouter = app => {
  app.post(
    "/item/create/",
    auth.isAuthorized,
    upload.single("file"),
    itemController.createItem
  );
  app.post(
    "/item/delete/:itemId",
    auth.isAuthorized,
    itemController.deleteItem
  );

  app.put("/item/update/:itemId", auth.isAuthorized, itemController.updateItem);

  app.get("/item/details/:itemId", auth.isAuthorized, itemController.getItem);
  app.get("/item/view/all", auth.isAuthorized, itemController.getAllItems);
};
