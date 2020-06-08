// Filename : user.js

const express = require("express");
const { check } = require("express-validator");
const router = express.Router();
const { signup, login, vendorSignup, getUsers } = require("../controllers/user");
const {
  service,
  getService,
  getVendors,
  getVendorsById,
  getServiceById,
} = require("../controllers/vendor");
const {verifyAdmin, verifyUser, verifyVendor} = require('../middlewares/verifyuser')

/**
 * @method - POST
 * @param - /signup
 * @description - User SignUp
 */

router.post(
  "/signup",
  [
    check("username", "Please Enter a Valid Username").not().isEmpty(),
    check("email", "Please enter a valid email").isEmail(),
    check("password", "Please enter a valid password").isLength({
      min: 6,
    }),
  ],
  signup
);

/**
 * @method - POST
 * @param - /vendorSignup
 * @description - Vendor SignUp
 */

router.post(
  "/vendorSignup",
  [
    check("username", "Please Enter a Valid Username").not().isEmpty(),
    check("email", "Please enter a valid email").isEmail(),
    check("password", "Please enter a valid password").isLength({
      min: 6,
    }),
    check("services", "Services cannot be empty").not().isEmpty(),
  ],
  vendorSignup
);

/**
 * @method - POST
 * @param - /login
 * @description -  login
 */

router.post(
  "/login",
  [
    check("email", "Please Enter a Valid email").not().isEmpty(),
    check("email", "Please enter a valid email").isEmail(),
    check("password", "Please enter a valid password").isLength({
      min: 6,
    }),
  ],
  login
);


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
 * @param - /getAllUsers
 * @description - Get User
 */

router.get("/getAllUsers", verifyUser, verifyAdmin, getUsers);

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
