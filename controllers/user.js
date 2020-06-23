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

  const { username, email, password, name, address, gender, phonenumber } = req.body;
  try {
    let user = await UserModel.findOne({
      email,
    });
    if (user) {
      return res.status(400).json({
        message: "User Already Exists",
      });
    }

    user = new UserModel({
      name,
      address,
      gender,
      phonenumber,
      username,
      email,
      password,
      role: "user",
      active:true
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

  const { username, email, password, services, companyName, name, phonenumber, address, gender} = req.body;
  try {
    let checkemail = await UserModel.findOne({
      email,
    });
    let checkusername = await UserModel.findOne({
      username,
    });
    if (checkemail || checkusername) {
      return res.status(400).json({
        message: "Vendor Already Exists",
      });
    }

    user = new UserModel({
      address,
      companyName,
      phonenumber,
      name,
      username,
      email,
      password,
      services,
      gender,
      role: "vendor",
      active:true
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
// Vendor Signup
exports.adminSignup = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({
      errors: errors.array(),
    });
  }

  const {name, username, email, password, gender, passcode} = req.body;
  try {
    let checkemail = await UserModel.findOne({
      email,
    });
    let checkusername = await UserModel.findOne({
      username,
    });
    if (checkemail || checkusername) {
      return res.status(400).json({
        message: "Admin Already Exists",
      });
    }
    if(passcode !== "root") {
      return res.status(401).json({
        message: "unauthorized",
      });
    }
    user = new UserModel({
      name,
      username,
      email,
      password,
      gender,
      role: "admin",
      active:true
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
          message: "admin created Successfully",
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
              if(user.role.toLowerCase() === "vendor")
              res.status(200).json({
                userId: user._id,
                token,
                role: user.role,
                serviceTypes: user.services.split(",")
              });
              else
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

exports.getMyInfo = async(req, res) => {
  try {
    let id = await req.params.id;
    let user = await UserModel.findOne({
      _id: id,
    });
    if (user) {
      return res.status(200).json({
        user,
      });
    }
  } catch (err) {
    console.log(err.message);
    res.status(500).send("Error fetching user info");
  }
}