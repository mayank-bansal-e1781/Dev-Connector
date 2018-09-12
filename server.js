// importing DB connection
require('./db/db');
const express = require('express');
var app = express();
const port = process.env.PORT || 3000;

// importing routes
require('./routes/route')(app);
app.listen(port, () => {
  console.log(`Server is running on ${port}`);
});
