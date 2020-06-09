//mongodb+srv://Dami_user1:<password>@cluster0-teywi.mongodb.net/test?retryWrites=true&w=majority

const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const user = require('./routes/user')
const booking = require('./routes/booking');
const vendor = require("./routes/vendor");

const app = express();

mongoose.connect('mongodb+srv://Dami_user1:La6xrkFYtO6EFesA@cluster0-teywi.mongodb.net/test?retryWrites=true&w=majority', {useNewUrlParser: true, useUnifiedTopology: true})
.then(() => {
    console.log('Successfully connected to MongoDB Atlas!');
  })
  .catch((error) => {
    console.log('Unable to connect to MongoDB Atlas!');
    console.error(error);
  });

app.post("/image", function (req, res) {
  upload(req, res, function (err) {
    if (err instanceof multer.MulterError) {
      // A Multer error occurred when uploading.
      res.status(400).json({
        error: "Multer error ocurred here",
      });
    } else if (err) {
      // An unknown error occurred when uploading.
      res.status(500).json({
        error: "Something unusual went wrong",
      });
    }
    // req.file is the name of your file in the form above, here 'uploaded_file'
    // req.body will hold the text fields, if there were any
    console.log(req.file, req.body);
    return true
  });
});


app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

app.use('/api', user);
app.use('/api', booking);
app.use('/api/vendors', vendor);


app.get('/', async(req, res)=>{
  res.json({ message: "App Working" });
});

app.all("*", (req, res) =>
  res.status(404).json({
    error: "Page not found!",
  })
);

module.exports = app;