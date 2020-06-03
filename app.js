//mongodb+srv://Dami_user1:<password>@cluster0-teywi.mongodb.net/test?retryWrites=true&w=majority


const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const user = require('./routes/user')
const app = express();
const Thing = require('./models/thing');
mongoose.connect('mongodb+srv://Dami_user1:La6xrkFYtO6EFesA@cluster0-teywi.mongodb.net/test?retryWrites=true&w=majority')
.then(() => {
    console.log('Successfully connected to MongoDB Atlas!');
  })
  .catch((error) => {
    console.log('Unable to connect to MongoDB Atlas!');
    console.error(error);
  });

app.use((req, res, next) => {
  console.log('Request received!');
  next();
});

app.use(bodyParser.json());
app.post('/api/stuff', (req, res, next) => {
  const thing = new Thing({
    title: req.body.title,
    description: req.body.description,
    imageUrl: req.body.imageUrl,
    price: req.body.price,
  });
  thing.save().then(
    () => {
      res.status(201).json({
        message: 'Post saved successfully!'
      });
    }
  ).catch(
    (error) => {
      res.status(400).json({
        error: error
      });
    }
  );
});

app.use('/api', user);

app.get('/', async(req, res)=>{
  res.json({ message: "App Working" });
});

app.use((req, res, next) => {
  res.status(201);
  next();
});

app.use((req, res, next) => {
  res.json({ message: 'Your request was successful!' });
  next();
});

app.use((req, res, next) => {
  console.log('Response sent successfully!');
});

module.exports = app;