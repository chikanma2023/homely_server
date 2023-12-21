const express = require("express");
const router = express.Router();
const { register_user } = require("../../controllers/user/register");
const { user_login } = require("../../controllers/user/login");
const { update_profile } = require("../../controllers/user/update_profile");
const { reset_password } = require("../../controllers/user/reset_password");
const {
  forgotten_password,
} = require("../../controllers/user/forgotton_password");
const { get_single_user } = require("../../controllers/user/single_user");

router.post("/register", register_user);
router.post("/login", user_login);
router.put("/update/profile", update_profile);
router.put("/reset/password", reset_password);
router.put("/forgotton/password", forgotten_password);
router.post("/:id", get_single_user);


module.exports = router;
