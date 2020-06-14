const { validationResult } = require("express-validator");
const ServiceModel = require("../models/service");
const UserModel = require("../models/user");



// Create a service
exports.service = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({
      errors: errors.array(),
    });
  }

  const {
    body: { title, description, imageUrl, price },
    user: { id },
    file
  } = req;
  console.log(req.user)
  // const { title, description, imageUrl, price } = req.body;
  try {
    let service = await ServiceModel.findOne({
      title,
      userId: id
    });
    if (service) {
      return res.status(422).json({
        msg: "You can't enlist a service more than once",
      });
    }

    service = new ServiceModel({
      title,
      description,
      imageUrl,
      price, 
      userId: id
    });


    await service.save();
    res.status(201).json({
       service,
     });
    
  } catch (err) {
    console.log(err.message);
    res.status(500).send("Error in Saving Service");
  }
};
// Get all services
exports.getService = async (req, res) => {
  try {
    let service = await ServiceModel.find();
    if (service) {
      return res.status(200).json({
        service,
      });
    }
  } catch (err) {
    console.log(err.message);
    res.status(500).send("Error fetching service");
  }
};

// Get all vendors
exports.getVendors = async (req, res) => {
  try {
    let vendors = await UserModel.find().where({
      role: "vendor",
    });
    // console.log(vendors);
    if (vendors) {
      return res.status(200).json({
        vendors,
      });
    }
  } catch (err) {
    console.log(err.message);
    res.status(500).send("Error fetching Vendors");
  }
};

// Get vendor by Id
exports.getVendorsById = async (req, res) => {
  try {
    let id = req.params.id;
    // console.log(id)
    let vendor = await UserModel.findById(id);
    if (vendor) {
      return res.status(200).json({
        vendor,
      });
    }
  } catch (err) {
    // console.log(err.message);
    res.status(500).send("Error fetching Vendors");
  }
};

// Get service by Id
exports.getServiceById = async (req, res) => {
  try {
    let id = req.params.id;
    // console.log(id);
    let service = await ServiceModel.findById(id);
    if (service) {
      return res.status(200).json({
        service,
      });
    }
  } catch (err) {
    console.log(err.message);
    res.status(500).send("Error fetching service");
  }
};

// Delete a service
exports.deleteService = async (req, res) => {
  try {
    let id = req.params.id;
    let service = await ServiceModel.findByIdAndDelete(id);

    if (!service) {
      return res.status(404).json({
        message: "Service not found"
      })
    }
    return res.status(200).json({
      message: `${service.title} deleted successfully`
    })
  } catch (error) {
    res.status(500).json({
      message: "An error occured"
    })
  }
}

// Edit a service
exports.editService = async (req, res) => {
  try {
    let id = req.params.id;
    let {title, description, imageUrl, price} = req.body;
    let service = await ServiceModel.findByIdAndUpdate(
      id,
      {
        $set: {
          title,
          description,
          imageUrl,
          price,
        },
      },
      { new: true, runValidators: true }
    );

    if (!service) {
      return res.status(404).json({
        message: "Service not found",
      });
    }
    return res.status(200).json({
      message: "Service updated successfully",
      service,
    });
  } catch (error) {
    res.status(500).json({
      message: "An error occured",
    });
  }
};