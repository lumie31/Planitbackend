const express = require("express");
const { check } = require("express-validator");
const router = express.Router();
const {
 booking, acceptBooking, getAllBookings
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

router.post(
  "/addToCart", verifyUser,
  [
    check("name", "name is required").not().isEmpty(),
    check("email", "email is required").not().isEmpty(),
    check("phone", "phone is required").not().isEmpty(),
    check("address", "address is required").not().isEmpty(),
    check("dateNeeded", "dateNeeded is required").not().isEmpty(),
  ],
  booking
);

/**
 * @method - GET
 * @param - /GetBookedService
 * @description - Accept a booking
 */

router.get(
  "/acceptBooking", verifyUser, acceptBooking
);

/**
 * @method - GET
 * @param - /GetAllBookedService(Admin)
 * @description - Get/see all bookings
 */

router.get(
  "/getAllBookings", verifyUser, verifyAdmin, getAllBookings
);

module.exports = router;