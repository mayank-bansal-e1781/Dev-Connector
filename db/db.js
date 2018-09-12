const mongoose = require('mongoose');

const db = require('../config/keys').mongoURI;

// database connection
mongoose
  .connect(db, {useNewUrlParser: true})
  .then(() => {
    console.log('database connected');
  })
  .catch((err) => {
    console.log(err);
  });

module.exports = mongoose;
