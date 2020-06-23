const {
  validationResult
} = require("express-validator");
const BookingModel = require("../models/booking");
const CartModel = require("../models/cart");
const ServiceModel = require("../models/service");
const UserModel = require("../models/user");


// Book a service
exports.booking = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({
      errors: errors.array(),
    });
  }
  // console.log(req.user)

  const {
    body: {
      name,
      email,
      phone,
      address,
      dateNeeded
    },
    user: {
      id
    },
  } = req;
  try {
    let booking = await BookingModel.findOne({
      dateNeeded,
      userId: id,
    });
    if (booking) {
      return res.status(422).json({
        message: "Vendor is not available for the desired date",
      });
    }

    booking = new BookingModel({
      name,
      email,
      phone,
      address,
      dateNeeded,
      userId: id
    });


    await booking.save();
    res.status(201).json({
      booking,
    });

  } catch (err) {
    console.log(err.message);
    res.status(500).send("Error in booking vendor");
  }
};


// Add to cart
exports.addToCart = async (req, res) => {

  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({
      errors: errors.array(),
    });
  }
  // console.log(req.user)

  const {
    body: {
      userId,
      serviceId
    }
  } = req;
  try {
    let cart = await CartModel.findOne({
      userId,
      serviceId
    });
    // console.log({cart})
    if (cart) {
      return res.status(422).json({message:"You can't add more than one of this to cart"});
    }

    cart = new CartModel({
      serviceId,
      userId
    });
    await cart.save();

     let newcart = await CartModel.find({
      userId
    });
    if(newcart){
      res.status(200).json({
        count:newcart.length,
      });
    } else {
      return res.status(422).json({
        message: "Error in getting cart number",
      });
    }
 
  } catch (err) {
    console.log(err.message);
    res.status(500).send("Error in adding to cart");
  }
};



// Get service by Id
exports.getCartCountByUserId = async (req, res) => {
  try {
    let id = req.params.vendorid;
    // console.log(id);
    let cart = await CartModel.find({
      userId: id
    });
    console.log(id, cart)
    if (cart) {
      return res.status(200).json({
        count: cart.length,
      });
    } else {
      return res.status(200).json({
        count: 0,
      });
    }
  } catch (err) {
    console.log(err.message);
    res.status(500).send("Error fetching service");
  }
};

exports.getCartContentByUserId = async (req, res) => {
  try {
    let id = req.params.vendorid;
    // console.log(id);
    let cart = await CartModel.find({
      userId: id
    });


    if (cart) {

      const serviceIds = cart.map(val => val.serviceId)
      const services = serviceIds.map(async (serviceId) => {
        return await ServiceModel.findById(serviceId);
      });
      if(services) {
        return res.status(200).json({
          services
        });
      } else{
        return res.status(200).json({
          
        });
      }
    } else {
      return res.status(200).json({
        
      });
    }
  } catch (err) {
    console.log(err.message);
    res.status(500).send("Error fetching service");
  }
};



// Accept a booking
exports.acceptBooking = async (req, res) => {
  try {
    let id = req.params.id;
    // console.log(id);
    let booking = await BookingModel.findById(id);
    if (booking) {
      return res.status(200).json({
        booking,
      });
    } else {
      return res.status(404).send("Booking does not exist")
    }
  } catch (err) {
    console.log(err.message);
    res.status(500).send("Error fetching your Bookings");
  }
};

// Get/See all bookings on platform (Admin)
exports.getAllBookings = async (req, res) => {
  try {
    let bookings = await BookingModel.find();
    if (!bookings) {
      res.status(404).json({
        message: "No Bookings available",
      });
    }
    return res.status(200).json({
      bookings,
    });
  } catch (err) {
    res.status(500).json({
      error: "Error fetching bookings",
    });
  }
};