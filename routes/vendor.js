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
  adminGetAllService,
  getService,
  getVendors,
  getVendorsById,
  getServiceById,
  deleteService,
  editService,
  getServiceByVendorId,
  activateService,
  getSixAllDiscountServices,
  getSixServicesByServiceType
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

router.get(
  "/getSixAllDiscountServices", getSixAllDiscountServices
);

router.get(
  "/adminGetAllService", adminGetAllService
);
/**
 * @method - GET
 * @param - /getAllVenodors
 * @description - Get Vendors
 */

router.get("/getAllVendors", getVendors);

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

router.get("/getSingleService/:id", getServiceById);

router.get("/getSixServicesByServiceType/:id", getSixServicesByServiceType);


router.get("/getServiceByVendorId/:vendorid", verifyUser, verifyVendor, getServiceByVendorId);

/**
 * @method - DELETE
 * @param - /deleteService
 * @description - Delete Service by Id
 */

router.delete("/deleteService/:id", verifyUser, verifyVendor, deleteService)

router.put("/activateService/:id", verifyUser, verifyVendor, activateService)

/**
 * @method - PATCH
 * @param - /editService
 * @description - Edit/Update Service by Id
 */

router.patch(
  "/editService/:id",
  [
    check("title", "Email cannot be empty").not().isEmpty(),
    check("description", "Description cannot be empty").not().isEmpty(),
    check("imageUrl", "ImageUrl cannot be empty").not().isEmpty(),
    check("price", "Price cannot be empty").not().isEmpty(),
  ],
  verifyUser,
  verifyVendor,
  editService
);
router.patch(
  "/adminEditService/:id",
  [
    check("title", "Email cannot be empty").not().isEmpty(),
    check("description", "Description cannot be empty").not().isEmpty(),
    check("imageUrl", "ImageUrl cannot be empty").not().isEmpty(),
    check("price", "Price cannot be empty").not().isEmpty(),
  ],
  verifyUser,
  verifyAdmin,
  editService
);


module.exports = router;