const mongoose = require('mongoose');
var Schema = mongoose.Schema,
  ObjectId = Schema.ObjectId;


const serviceSchema = mongoose.Schema({
  title: { type: String, required: true },
  description: { type: String, required: true },
  imageUrl: { type: String, required: true },
  price: { type: Number, required: true },
  // userId: [
  //   {
  //     type: ObjectId,
  //     ref: "user",
  //   },
  // ],
});

module.exports = mongoose.model('Service', serviceSchema);