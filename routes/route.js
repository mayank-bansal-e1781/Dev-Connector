module.exports = function (app) {
  app.use('/api/post', require('./post'));
  app.use('/api/users', require('./users'));
  app.use('/api/profile', require('./profile'));
};
