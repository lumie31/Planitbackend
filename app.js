//mongodb+srv://Dami_user1:<password>@cluster0-teywi.mongodb.net/test?retryWrites=true&w=majority

const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const user = require('./routes/user')
const app = express();

mongoose.connect('mongodb+srv://Dami_user1:La6xrkFYtO6EFesA@cluster0-teywi.mongodb.net/test?retryWrites=true&w=majority', {useNewUrlParser: true, useUnifiedTopology: true})
.then(() => {
    console.log('Successfully connected to MongoDB Atlas!');
  })
  .catch((error) => {
    console.log('Unable to connect to MongoDB Atlas!');
    console.error(error);
  });

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

app.use('/api', user);

app.get('/', async(req, res)=>{
  res.json({ message: "App Working" });
});

app.all("*", (req, res) =>
  res.status(404).json({
    Error: "Page not found!",
  })
);

module.exports = app;