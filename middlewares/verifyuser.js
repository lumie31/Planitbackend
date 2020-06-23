// import { verify } from "jsonwebtoken";
const {verify} = require("jsonwebtoken");

  /**
   * @description Verify User Token
   * @param {object} req
   * @param {object} res
   * @param {object} next
   *
   * @returns {object} response object
   */

  exports.verifyUser = async (req, res, next) => {
  
    const token =
      req.headers["x-access-token"] ||
      req.query.token ||
      req.headers.authorization;

    if (!token) {
      return res.status(401).json({
        message:
          "Unauthorized! You need to be logged in to perform this operation",
      });
    }
    try {
      const decoded =  verify(token, "randomString");
      // console.log(req, decoded);
      req.user = decoded;
      return next();
    } catch (error) {
      return res
        .status(403)
        .json({ message: "Authentication failed! Invalid token" });
    }
  }

  /**
   * Verify admin Token
   * @param {object} req
   * @param {object} res
   * @param {object} next
   *
   * @returns {object} response object
   */

  exports.verifyAdmin = (req, res, next) => {
   const {
     user: {
       user: { role },
     },
   } = req;

    if (role !== "admin") {
      return res.status(401).json({
        message:
          "Unauthorized! You are not an admin!",
      });
    }
    return next();
  }

  /**
   * Verify Vendor Token
   * @param {object} req
   * @param {object} res
   * @param {object} next
   *
   * @returns {object} response object
   */

  exports.verifyVendor = (req, res, next) => {
    // const user  = req.body;
    // console.log(user)

    const {
      user: { user: {
        role
      } },
    } = req;

    console.log(req.user);
    if (role !== "vendor") {
      return res.status(401).json({
        message:
          "Unauthorized! You are not a vendor!",
      });
    }
    return next();
  }
