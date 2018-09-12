const express = require('express');

const router = express.Router();

// @route /api/profile/test
router.get('/test', (req, res) => {
  res.json({post: 'profile is working'});
});

module.exports = router;
