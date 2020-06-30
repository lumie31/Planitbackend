const express = require("express");
const { check } = require("express-validator");
const router = express.Router();
const {
 booking, acceptBookingByBookingId, getAllBookings, getCartCountByUserId, addToCart, getCartContentByUserId, getBookingsByVendorId
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
  "/bookVendor",
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
  "/addToCart",
  [
    check("serviceId", "name is required").not().isEmpty(),
    check("userId", "email is required").not().isEmpty()
  ],
  addToCart
);

/**
 * @method - GET
 * @param - /GetBookedService
 * @description - Accept a booking
 */

router.get(
  "/getCartCountByUserId/:vendorid", getCartCountByUserId
);

router.get(
  "/getCartContentByUserId/:vendorid", verifyUser, getCartContentByUserId
);



router.get(
  "/acceptBookingByBookingId/:id", verifyUser, verifyVendor, acceptBookingByBookingId
);

/**
 * @method - GET
 * @param - /GetAllBookedService(Admin)
 * @description - Get/see all bookings
 */

router.get(
  "/getAllBookings", verifyUser, verifyAdmin, getAllBookings
);


router.get(
  "/getBookingsByVendorId/:vendorId", verifyUser, verifyVendor, getBookingsByVendorId
);
module.exports = router;