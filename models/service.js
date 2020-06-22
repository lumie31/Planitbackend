const mongoose = require('mongoose');
var Schema = mongoose.Schema,
  ObjectId = Schema.ObjectId;


const serviceSchema = mongoose.Schema({
  title: { type: String, required: true },
  description: { type: String, required: true },
  imageUrl: { type: String, required: true },
  price: { type: Number, required: true },
  createdAt: {
    type: Date,
    default: Date.now(),
  },
  updatedAt: {
    type: Date,
    default: Date.now(),
  },
  userid: {type:String, required: true},
  serviceType: {type: String, required:true},
  active:{type:Boolean, required:true, default:true},
  state:{type:String, required:true, default:"Lagos"},
  address:{type:String, required:true, default:""},
  discount:{type:String, default:""}
  // userId: [
  //   {
  //     type: ObjectId,
  //     ref: "user",
  //   },
  // ],
});

module.exports = mongoose.model('Service', serviceSchema);