// Filename : user.js

const express = require("express");
const app = express();
const bodyParser = require('body-parser');
//app.use(bodyParser.urlencoded());
const {
    check
} = require("express-validator");
const router = express.Router();
const {signup,login} = require('../controllers/user');

/**
 * @method - POST
 * @param - /signup
 * @description - User SignUp
 */

router.post("/signup",[
        check("username", "Please Enter a Valid Username")
        .not()
        .isEmpty(),
        check("email", "Please enter a valid email").isEmail(),
        check("password", "Please enter a valid password").isLength({
            min: 6
        })
    ], signup
);

router.post("/login",[
    check("email", "Please Enter a Valid email")
    .not()
    .isEmpty(),
    check("email", "Please enter a valid email").isEmail(),
    check("password", "Please enter a valid password").isLength({
        min: 6
    })
], login
);
module.exports = router;
