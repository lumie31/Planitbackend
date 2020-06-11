const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const { validationResult } = require("express-validator");
const UserModel = require("../models/user");

// User Signup
exports.signup = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({
      errors: errors.array(),
    });
  }

  const { username, email, password } = req.body;
  try {
    let user = await UserModel.findOne({
      email,
    });
    if (user) {
      return res.status(400).json({
        msg: "User Already Exists",
      });
    }

    user = new UserModel({
      name,
      username,
      email,
      password,
      role: "user"
    });

    const salt = await bcrypt.genSalt(10);
    user.password = await bcrypt.hash(password, salt);

    await user.save();
    
    const payload = {
      user: {
        id: user._id,
        role: user.role
      },
    };

    jwt.sign(
      payload,
      "randomString",
      {
        expiresIn: 10000,
      },
      (err, token) => {
        if (err) throw err;
        return res.status(201).json({
          token,
          role: user.role,
          message: "User created Successfully"
        });
      }
    );
  } catch (err) {
    console.log(err.message);
    res.status(500).send("Error in Saving");
  }
};

// Vendor Signup
exports.vendorSignup = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({
      errors: errors.array(),
    });
  }

  const { username, email, password, services } = req.body;
  try {
    let user = await UserModel.findOne({
      email,
    });
    if (user) {
      return res.status(400).json({
        msg: "Vendor Already Exists",
      });
    }

    user = new UserModel({
      companyName,
      name,
      username,
      email,
      password,
      services,
      role: "vendor",
    });

    const salt = await bcrypt.genSalt(10);
    user.password = await bcrypt.hash(password, salt);

    await user.save();

    const payload = {
      user: {
        id: user._id,
        role: user.role,
      },
    };

    jwt.sign(
      payload,
      "randomString",
      {
        expiresIn: 10000,
      },
      (err, token) => {
        if (err) throw err;
        return res.status(201).json({
          token,
          role: user.role,
          message: "Vendor created Successfully",
        });
      }
    );
  } catch (err) {
    console.log(err.message);
    res.status(500).send("Error in Saving");
  }
};

// User Login
exports.login = async (req, res, next) => {
  const { email, password } = req.body;
  try {
    let user = await UserModel.findOne({
      email,
    });
    if (user) {
      // console.log(user);
      bcrypt
        .compare(password, user.password)
        .then((valid) => {
          if (!valid) {
            return res.status(401).json({
              error: new Error("Email or password is incorrect!"),
            });
          }
          const payload = {
            user: {
              id: user._id,
              role: user.role
            },
          };
          jwt.sign(
            payload,
            "randomString",
            {
              expiresIn: 10000,
            },
            (err, token) => {
              if (err) throw err;
              res.status(200).json({
                userId: user._id,
                token,
                role: user.role
              });
            }
          );
        })
        .catch((error) => {
          res.status(500).json({
            error: error,
          });
        });
    } else if (!user) {
      res.status(400).json({
        error: "Email or password is incorrect"
      });
    }
  } catch (err) {
    console.log(err.message);
    res.status(500).send("Error in siging in");
  }
};

// Get all users
exports.getUsers = async (req, res) => {
  try {
    let users = await UserModel.find();
    console.log(users)
    if (users) {
      return res.status(200).json({
        users,
      });
    }
  } catch (err) {
    console.log(err.message);
    res.status(500).send("Error fetching users");
  }
};