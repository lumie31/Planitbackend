const mongoose = require("mongoose");
// let ObjectId = Schema.ObjectId;

const BookingSchema = mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
  },
  phone: {
    type: String,
    required: true,
  },
  address: {
    type: String,
    required: true,
  },
  dateNeeded: {
    type: String,
    required: true,
  },
  vendorId: {
    type: String,
    required: true,
  },
  serviceId: {
    type: String,
    required: true,
  },
  userId: {
    type: String
  },
  accepted: {
    type: Boolean
  },
  attendanceNo: {
    type:Number
  },
  createdAt: {
    type: Date,
    default: Date.now(),
  },
  updatedAt: {
    type: Date,
    default: Date.now(),
  }
});

// export model booking with BookingSchema
module.exports = mongoose.model("Booking", BookingSchema);
