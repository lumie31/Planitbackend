const express = require("express");
const multer = require("multer");

var storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "./uploads");
  },
  filename: function (req, file, cb) {
    const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
    cb(null, file.originalname + "-" + uniqueSuffix);
  },
});

var upload = multer({ storage: storage });


const { check } = require("express-validator");
const router = express.Router();
const {
  service,
  getService,
  getVendors,
  getVendorsById,
  getServiceById,
  deleteService,
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

router.post("/createService", upload.single('display_image'), verifyUser, verifyVendor, service);

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

router.delete("/deleteService/:id", verifyUser, deleteService)

module.exports = router;