const {
  validationResult
} = require("express-validator");
const BookingModel = require("../models/booking"),
  CartModel = require("../models/cart"),
  ServiceModel = require("../models/service"),
  UserModel = require("../models/user");


// Book a service
exports.booking = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({
      errors: errors.array(),
    });
  }
  // console.log(req.user)
  // console.log(req);
  const {
    body: {
      name,
      email,
      phone,
      address,
      dateNeeded,
      bookings,
      attendanceNo,
      userId
    }
  } = req;
  try {

    const bookindetails = bookings.map((val, index) => {
        return {
          name,
          email,
          phone,
          address,
          dateNeeded,
          vendorId: val.vendorId,
          serviceId: val.serviceId,
          attendanceNo,
          userId
        }
      }),
      // let booking = await BookingModel.findOne({
      //   dateNeeded,
      //   userId: id,
      // });
      // if (booking) {
      //   return res.status(422).json({
      //     message: "Vendor is not available for the desired date",
      //   });
      // }

      // booking = new BookingModel({
      //   name,
      //   email,
      //   phone,
      //   address,
      //   dateNeeded,
      //   userId,
      //   vendorId,
      //   serviceId,
      //   attendanceNo
      // });
      bookinfo = await BookingModel.insertMany(bookindetails);
      
      console.log(bookindetails, bookinfo);
    if (typeof userId !== "undefined") {
      let result = await CartModel.deleteMany({
        userId
      });

      console.log(result);
    }
    res.status(201).json({
      bookinfo,
    });

  } catch (err) {
    // console.log(err.message);
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
      return res.status(422).json({
        message: "You can't add more than one of this to cart"
      });
    }

    cart = new CartModel({
      serviceId,
      userId
    });
    await cart.save();

    let newcart = await CartModel.find({
      userId
    });
    if (newcart) {
      res.status(200).json({
        count: newcart.length,
      });
    } else {
      return res.status(422).json({
        message: "Error in getting cart number",
      });
    }

  } catch (err) {
    // console.log(err.message);
    res.status(500).send("Error in adding to cart");
  }
};



// Get service by Id
exports.getCartCountByUserId = async (req, res) => {
  try {
    let id = req.params.vendorid;
    // console.log(id);
    let cart = await CartModel.find({
      userId: id,
    });
    // console.log(id, cart)
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
    // console.log(err.message);
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
      // console.log({serviceIds})
      const services = await ServiceModel.find({
        _id: {
          $in: serviceIds
        }
      }, {
        title: 1,
        price: 1,
        serviceType: 1,
        userId: 1
      });

      // console.log({ services})
      if (services) {
        return res.status(200).json({
          services: services
        });
      } else {
        return res.status(200).json({

        });
      }
    } else {
      return res.status(200).json({

      });
    }
  } catch (err) {
    // console.log(err.message);
    res.status(500).send("Error fetching service");
  }
};



// Accept a booking
exports.acceptBookingByBookingId = async (req, res) => {
  try {
    let id = req.params.id;
    // console.log(id);
    let booking = await BookingModel.findOneAndUpdate(
      {
        _id:id
      }, {
      accepted: true
    });
    // console.log(booking);
    if (booking) {
      return res.status(201).json({
        message: "Booking accepted",
      });
    } else {
      return res.status(404).send("Booking does not exist")
    }
  } catch (err) {
    // console.log(err.message);
    res.status(500).send("Error fetching your Bookings");
  }
};

// Get/See all bookings on platform (Admin)
exports.getAllBookings = async (req, res) => {
  try {
    const bookings = await BookingModel.find().sort({
      'createdAt': -1
    });
    if (!bookings) {
      res.status(404).json({
        message: "No Bookings available",
      });
    }
    // debugger;
    const serviceIds = bookings.map(e => e.serviceId),
      vendorIds = bookings.map(e => e.vendorId),
      services = await ServiceModel.find({
        _id: {
          $in: serviceIds
        }
      }, {
        title: 1,
        price: 1,
        serviceType: 1
      }),
      vendors = await UserModel.find({
        _id: {
          $in: vendorIds
        }
      }, {
        name: 1,
        companyName: 1,
        serviceType: 1,
        email: 1,
        phone: 1
      });
    // console.log({
    //   bookings
    // });
    let bookingdetails = bookings.map((booking, ind) => {
      const serve = services.filter((service, index) => service._id.toString() === booking.serviceId)[0];
      return {
        _id: booking._id,
        name: booking.name,
        email: booking.email,
        phone: booking.phone,
        address: booking.address,
        dateNeeded: booking.dateNeeded,
        userId: booking.userId,
        vendorId: booking.vendorId,
        serviceId: booking.serviceId,
        attendanceNo: booking.attendanceNo,
        service: serve,
        vendor: "",
        createdAt: booking.createdAt,
        accepted: booking.accepted
      }
    });
    // console.log({bookingdetails});

    bookingdetails = bookingdetails.map((booking, ind) => {
      const vend = vendors.filter((vendor, index) => vendor._id.toString() === booking.vendorId)[0];
      return {
        _id: booking._id,
        name: booking.name,
        email: booking.email,
        phone: booking.phone,
        address: booking.address,
        dateNeeded: booking.dateNeeded,
        userId: booking.userId,
        vendorId: booking.vendorId,
        serviceId: booking.serviceId,
        attendanceNo: booking.attendanceNo,
        service: booking.service,
        vendor: vend,
        createdAt: booking.createdAt,
        accepted: booking.accepted
      }
    })

    // await BookingModel.deleteMany();
    // console.log({serviceIds});
    return res.status(200).json({
      bookingdetails,
    });
  } catch (err) {
    res.status(500).json({
      error: "Error fetching bookings",
    });
  }
};

exports.getBookingsByVendorId = async (req, res) => {
  try {
    let vendorId = req.params.vendorId;
    const bookings = await BookingModel.find({
      vendorId
    }).sort({
      'createdAt': -1,
      'accepted': 1
    });
    if (!bookings) {
      res.status(404).json({
        message: "No Bookings available",
      });
    }
    // debugger;
    // console.log({bookings})
    const serviceIds = bookings.map(e => e.serviceId),
      services = await ServiceModel.find({
        _id: {
          $in: serviceIds
        }
      }, {
        title: 1,
        price: 1,
        serviceType: 1
      });
    const bookingdetails = bookings.map((booking, ind) => {
      const serve = services.filter((service, index) => service._id.toString() === booking.serviceId)[0];
      return {
        _id: booking._id,
        name: booking.name,
        email: booking.email,
        phone: booking.phone,
        address: booking.address,
        dateNeeded: booking.dateNeeded,
        userId: booking.userId,
        vendorId: booking.vendorId,
        serviceId: booking.serviceId,
        attendanceNo: booking.attendanceNo,
        service: serve,
        createdAt: booking.createdAt,
        accepted: booking.accepted
      }
    });

    // await BookingModel.deleteMany();
    // console.log({serviceIds});
    return res.status(200).json({
      bookingdetails,
    });
  } catch (err) {
    res.status(500).json({
      error: "Error fetching bookings",
    });
  }
};