const express = require("express");
const router = express.Router();
const locationsController = require("../../controllers/locationsController");
const ROLES_LIST = require("../../config/roles_list");
const verifyRoles = require("../../middleware/verifyRoles");

router
  .route("/")
  .get(locationsController.index)
  .post(verifyRoles(ROLES_LIST.Admin), locationsController.create);

router
  .route("/:id")
  .get(locationsController.show)
  .put(verifyRoles(ROLES_LIST.Admin), locationsController.update)
  .delete(verifyRoles(ROLES_LIST.Admin), locationsController.destroy);

module.exports = router;
