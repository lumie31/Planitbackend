const express = require("express");
const { check } = require("express-validator");
const router = express.Router();
const {
  service,
  getService,
  getVendors,
  getVendorsById,
  getServiceById,
} = require("../controllers/vendor");
const {
  verifyAdmin,
  verifyUser,
  verifyVendor,
} = require("../middlewares/verifyuser");


/**
 * @method - POST
 * @param - /createService
 * @description - Create Service
 */

router.post(
  "/createService", verifyUser, verifyVendor,
  [
    check("title", "Title cannot be empty").not().isEmpty(),
    check("description", "Description cannot be empty").not().isEmpty(),
    check("imageUrl", "Image is required").not().isEmpty(),
    check("price", "Price is required").not().isEmpty(),
  ],
  service
);

/**
 * @method - GET
 * @param - /getAllService
 * @description - Get Service
 */

router.get(
  "/getAllService", getService
);

/**
 * @method - GET
 * @param - /getAllVenodors
 * @description - Get Vendors
 */

router.get("/getAllVendors", verifyUser, verifyAdmin, getVendors);

/**
 * @method - GET
 * @param - /getVendorById
 * @description - Get Vendor by Id
 */

router.get("/getSingleVendor/:id", verifyUser, getVendorsById);

/**
 * @method - GET
 * @param - /getServiceById
 * @description - Get Service by Id
 */

router.get("/getSingleService/:id", verifyUser, getServiceById);

module.exports = router;