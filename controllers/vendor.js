const { validationResult } = require("express-validator");
const ServiceModel = require("../models/service");
const UserModel = require("../models/user");
const shuffle = require("../functions/shuffle");



// Create a service
exports.service = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({
      errors: errors.array(),
    });
  }

  const {
    body: { title, description, imageUrl, price, serviceType, userId, state, address, discount },
    user: { id },
    file
  } = req;
  console.log(req.user)
  // const { title, description, imageUrl, price } = req.body;
  try {
    let service = await ServiceModel.findOne({
      title,
      userId
    });
    if (service) {
      return res.status(422).json({
        message: "You can't enlist a service more than once",
      });
    }

    service = new ServiceModel({
      title,
      description,
      imageUrl,
      price, 
      userId,
      serviceType,
      active: true,
      state,
      address, 
      discount
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
    let services = await ServiceModel.find();
    if (services) {
      return res.status(200).json({
        services,
      });
    }
  } catch (err) {
    console.log(err.message);
    res.status(500).send("Error fetching services");
  }
};

// Get all services
exports.getSixAllDiscountServices = async (req, res) => {
  try {
    let services = await ServiceModel.find( { discount : { $exists: true } } ).limit(6);
    if (services) {
      // console.log({services});
      const shuffledservices = shuffle  (services);
      
      return res.status(200).json({
        services: shuffledservices,
      });
    }
  } catch (err) {
    console.log(err.message);
    res.status(500).send("Error fetching services");
  }
};
// Get all services
exports.getSixServicesByServiceType = async (req, res) => {
  try {
    let id = req.params.id;
    console.log(id)
    let services = await ServiceModel.find( { "serviceType" :   { $regex: new RegExp('^'+ id + '$', "i") }} ).limit(6);
    if (services) {
      // console.log({services});
      const shuffledservices = shuffle  (services);
      
      return res.status(200).json({
        services: shuffledservices,
      });
    }
  } catch (err) {
    console.log(err.message);
    res.status(500).send("Error fetching services");
  }
};
// Get all services
exports.adminGetAllService = async (req, res) => {
  try {
    let services = await ServiceModel.find({},{title:1, serviceType:1, name:1, userId:1, email:1, active:1});
    if (services) {
      // services.map(val => {
      //   let d = val;
      //   delete d['imageUrl'];
      //   return d;
      // });
      return res.status(200).json({
        services,
      });
    }
  } catch (err) {
    console.log(err.message);
    res.status(500).send("Error fetching services");
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
exports.getServiceByVendorId = async (req, res) => {
  try {
    let id = req.params.vendorid;
    // console.log(id);
    let service = await ServiceModel.find({
      userId: id
    });
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
    let service = await ServiceModel.findByIdAndUpdate(
      id,
      {
        $set: {
          title:service.title,
          description:service.description,
          imageUrl:service.imageUrl,
          price:service.price,
          userId:service.userId,
          serviceType:service.serviceType,
          active:false,
          address: service.address,
          state: service.state
        },
      },
      { new: true, runValidators: true }
    );
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

// Delete a service
exports.activateService = async (req, res) => {
  try {
    let id = req.params.id;
    let service = await ServiceModel.findByIdAndUpdate(
      id,
      {
        $set: {
          title:service.title,
          description:service.description,
          imageUrl:service.imageUrl,
          price:service.price,
          userId:service.userId,
          serviceType:service.serviceType,
          active:true,
          address: service.address,
          state: service.state
        },
      },
      { new: true, runValidators: true }
    );
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
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({
      errors: errors.array(),
    });
  }
  
  try {
    let id = req.params.id;
    let {title, description, imageUrl, price, userId,serviceType, address, state, discount} = req.body;
    let service = await ServiceModel.findByIdAndUpdate(
      id,
      {
        $set: {
          title,
          description,
          imageUrl,
          price,
          userId,
          serviceType,
          active:true,
          address,
          state, 
          discount
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
      message: error.message,
    });
  }
};