const mongoose = require("mongoose");

const UserSchema = mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  username: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
  },
  password: {
    type: String,
    required: true,
  },
  role: {
    type: String,
    required: true,
  },
  createdAt: {
    type: Date,
    default: Date.now(),
  },
  updatedAt: {
    type: Date,
    default: Date.now(),
  },
  services: {
    type: String,
  },
  companyName: {
    type: String,
  },
  address: {
    type: String,
  },
  gender: {
    type: String,
  },
    active: {
      type: Boolean,
      default: true,
      required: true
    }
  
  // services:[{
  //   type: Schema.Types.ObjectId,
  //   ref: 'ServiceType'
  // }]
});


// export model user with UserSchema
module.exports = mongoose.model("user", UserSchema);
