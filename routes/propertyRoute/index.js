const express = require("express");
const router = express.Router();
const {
  get_all_properties,
  get_single_property,
} = require("../../controllers/property/get");
const { search } = require("../../controllers/property/search");
const { create_property } = require("../../controllers/property/create");
const { update_property } = require("../../controllers/property/update");
const { delete_property } = require("../../controllers/property/delete");
const { rate_property } = require("../../controllers/property/rating");

router.get("/", get_all_properties);
router.get("/single/:id", get_single_property);
router.post("/search/:query", search);
router.post("/create", create_property);
router.put("/update", update_property);
router.delete("/delete", delete_property);
router.post("/rate", rate_property);


module.exports = router;
