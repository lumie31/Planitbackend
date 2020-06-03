const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const {
  validationResult
} = require("express-validator");
const UserModel = require("../models/VendorUser");
const VendorserviceModel = require("../models/Vendorservice");
exports.signup = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({
      errors: errors.array()
    });
  }

  const {
    username,
    email,
    password
  } = req.body;
  try {
    let user = await UserModel.findOne({
      email
    });
    if (user) {
      return res.status(400).json({
        msg: "User Already Exists"
      });
    }

    user = new UserModel({
      username,
      email,
      password
    });

    const salt = await bcrypt.genSalt(10);
    user.password = await bcrypt.hash(password, salt);

    await user.save();

    const payload = {
      user: {
        id: user._id
      }
    };

    jwt.sign(
      payload,
      "randomString", {
        expiresIn: 10000
      },
      (err, token) => {
        if (err) throw err;
        res.status(200).json({
          token
        });
      }
    );
  } catch (err) {
    console.log(err.message);
    res.status(500).send("Error in Saving");
  }
}

exports.login = async (req, res, next) => {
  const {
    email,
    password
  } = req.body;
  try {
    let user = await UserModel.findOne({
      email
    });
    if (user) {
      //console.log(user);
      bcrypt.compare(password, user.password).then(
        (valid) => {
          if (!valid) {
            return res.status(401).json({
              error: new Error('Email or password is incorrect!')
            });
          }
          const payload = {
            user: {
              id: user._id
            }
          };
          jwt.sign(
            payload,
            "randomString", {
              expiresIn: 10000
            },
            (err, token) => {
              if (err) throw err;
              res.status(200).json({
                userId: user._id,
                token
              });
            }
          );
        }
      ).catch(
        (error) => {
          res.status(500).json({
            error: error
          });
        }
      );
    } else if (!user) {
      return res.status(401).json({
        error: new Error('Email or password is incorrect')
      });
    }
  } catch (err) {
    console.log(err.message);
    res.status(500).send("Error in siging in");
  }
}

exports.vendorservices= async (req, res, next) => {
try{
  let vendorservices = await VendorserviceModel.find({});
 if (vendorservices) {
  res.status(200).json({
    vendorservices
  });
 } else {
  res.status(404).json({
    msg:"not found"
  });
 }
} catch (err) {
  console.log(err.message);
  res.status(500).send("Error in getting vendor services");
}

}

//module.exports = signup;