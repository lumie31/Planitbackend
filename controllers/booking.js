const { validationResult } = require("express-validator");
const BookingModel = require("../models/booking");
const CartModel = require("../models/booking");
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
    body: { name, email, phone, address, dateNeeded },
    user: { id },
  } = req;
  try {
    let booking = await BookingModel.findOne({
      dateNeeded,
      userId: id,
    });
    if (booking) {
      return res.status(422).json({
        msg: "Vendor is not available for the desired date",
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


// Book a service
exports.addToCart = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({
      errors: errors.array(),
    });
  }
  // console.log(req.user)

  const {
    body: { userId, serviceId},
    user: { id },
  } = req;
  try {
    let cart = await CartModel.findOne({
      userId,
      serviceId
    });
    if (cart) {
      return res.status(422).json({
        msg: "You can't add motr than one of this to cart",
      });
    }

    cart = new CartModel({
      serviceId,
      userId
    });


    await cart.save();
    res.status(201).json({
      cart,
     });
    
  } catch (err) {
    console.log(err.message);
    res.status(500).send("Error in adding to cart");
  }
};// Accept a booking
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
      return res.status(404).json({
        msg: "Booking does not exist"
      })
    }
  } catch (err) {
    console.log(err.message);
    res.status(500).send("Error fetching your Bookings");
  }
}

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