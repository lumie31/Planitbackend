// Filename : user.js

const express = require("express");
const { check } = require("express-validator");
const router = express.Router();
const { signup, login, vendorSignup, getUsers } = require("../controllers/user");
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
 * @method - GET
 * @param - /getAllUsers
 * @description - Get User
 */

router.get("/getAllUsers", verifyUser, verifyAdmin, getUsers);


module.exports = router;
