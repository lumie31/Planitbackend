const express = require("express");
const { check } = require("express-validator");
const router = express.Router();
const {
 booking
} = require("../controllers/booking");
const {
  verifyAdmin,
  verifyUser,
  verifyVendor,
} = require("../middlewares/verifyuser");


/**
 * @method - POST
 * @param - /bookVendor
 * @description - Book a Vendor
 */

router.post(
  "/bookVendor", verifyUser,
  [
    check("name", "name is required").not().isEmpty(),
    check("email", "email is required").not().isEmpty(),
    check("phone", "phone is required").not().isEmpty(),
    check("address", "address is required").not().isEmpty(),
    check("dateNeeded", "dateNeeded is required").not().isEmpty(),
  ],
  booking
);

module.exports = router;