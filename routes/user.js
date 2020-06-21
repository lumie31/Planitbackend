// Filename : user.js

const express = require("express");
const { check } = require("express-validator");
const router = express.Router();
const { signup, login, vendorSignup, getUsers, getMyInfo, adminSignup } = require("../controllers/user");
const {verifyAdmin, verifyUser, verifyVendor} = require('../middlewares/verifyuser')

/**
 * @method - POST
 * @param - /signup
 * @description - User SignUp
 */

router.post(
  "/signup",
  [
    check("name", "Please Enter a Valid name").not().isEmpty(),
    check("phonenumber", "Please Enter a Valid phonenumber").not().isEmpty(),
    check("gender", "Please pick a Valid gender").not().isEmpty(),
    check("address", "Please Enter a Valid address").not().isEmpty(),
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
    check("companyName", "Please Enter a Valid name").not().isEmpty(),
    check("name", "Please Enter a Valid name").not().isEmpty(),
    check("phonenumber", "Please Enter a Valid phonenumber").not().isEmpty(),
    check("username", "Please Enter a Valid Username").not().isEmpty(),
    check("email", "Email cannot be empty").not().isEmpty(),
    check("email", "Please enter a valid email").isEmail(),
    check("password", "Please enter a valid password").isLength({
      min: 6,
    }),
    check("services", "Services cannot be empty").not().isEmpty(),
  ],
  vendorSignup
);

router.post(
  "/adminSignup",
  [
    check("name", "Please Enter a Valid name").not().isEmpty(),
    check("username", "Please Enter a Valid Username").not().isEmpty(),
    check("email", "Email cannot be empty").not().isEmpty(),
    check("email", "Please enter a valid email").isEmail(),
    check("password", "Please enter a valid password").isLength({
      min: 6,
    })
  ],
  adminSignup
);

/**
 * @method - POST
 * @param - /login
 * @description -  login
 */

router.post(
  "/login",
  [
    check("email", "Email cannot be empty").not().isEmpty(),
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

router.get("/getMyInfo/:id", verifyUser, getMyInfo);


module.exports = router;
