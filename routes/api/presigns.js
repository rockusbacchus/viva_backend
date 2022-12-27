const express = require("express");
const router = express.Router();
const presignsController = require("../../controllers/presignsController.js");
const ROLES_LIST = require("../../config/roles_list");
const verifyRoles = require("../../middleware/verifyRoles");

router
  .route("/generate")
  .get(verifyRoles(ROLES_LIST.Admin), presignsController.generate);

module.exports = router;
