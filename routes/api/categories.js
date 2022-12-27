const express = require("express");
const router = express.Router();
const categoriesController = require("../../controllers/categoriesController");
const ROLES_LIST = require("../../config/roles_list");
const verifyRoles = require("../../middleware/verifyRoles");

router
  .route("/")
  .get(categoriesController.index)
  .post(verifyRoles(ROLES_LIST.Admin), categoriesController.create);

router
  .route("/:id")
  .get(categoriesController.show)
  .put(verifyRoles(ROLES_LIST.Admin), categoriesController.update)
  .delete(verifyRoles(ROLES_LIST.Admin), categoriesController.destroy);

module.exports = router;
