const express = require("express");
const router = express.Router();
const activitiesController = require("../../controllers/activitiesController");
const ROLES_LIST = require("../../config/roles_list");
const verifyRoles = require("../../middleware/verifyRoles");

router
  .route("/")
  .get(activitiesController.index)
  .post(verifyRoles(ROLES_LIST.Admin), activitiesController.create);

router
  .route("/:id")
  .get(activitiesController.show)
  .put(verifyRoles(ROLES_LIST.Admin), activitiesController.update)
  .delete(verifyRoles(ROLES_LIST.Admin), activitiesController.destroy);

module.exports = router;
