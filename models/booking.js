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
  accepted: {
    type: Boolean,
    default: false
  }
});

// export model booking with BookingSchema
module.exports = mongoose.model("Booking", BookingSchema);
