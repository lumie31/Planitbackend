const mongoose = require('mongoose');
var Schema = mongoose.Schema,
  ObjectId = Schema.ObjectId;

  const CartSchema = mongoose.Schema({
      userId:{
          type:String,
          required:true
      },
      serviceId: {
          type:String,
          required:true
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
module.exports = mongoose.model("Cart", CartSchema);