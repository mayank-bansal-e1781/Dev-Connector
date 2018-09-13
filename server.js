// importing DB connection
require('./db/db');
const express = require('express');
var app = express();
const passport = require('passport');
const bodyParser = require('body-parser');
const port = process.env.PORT || 3000;

// importing middlewares
app.use(bodyParser.urlencoded({extended: false}));
app.use(bodyParser.json());
app.use(passport.initialize());
require('./config/passport')(passport);
// importing routes

require('./routes/route')(app);

// litening on port
app.listen(port, () => {
  console.log(`Server is running on ${port}`);
});
