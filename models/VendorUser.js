const mongoose = require("mongoose");



const VendorUserSchema = mongoose.Schema({
  username: {
    type: String,
    required: true
  },
  email: {
    type: String,
    required: true
  },
  password: {
    type: String,
    required: true
  },
  createdAt: {
    type: Date,
    default: Date.now()
  },
  // services:[{
  //   type: Schema.Types.ObjectId,
  //   ref: 'Review'
  // }]
});


// export model user with UserSchema
module.exports = mongoose.model("VendorUser", VendorUserSchema);
