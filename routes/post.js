const express = require('express');

const router = express.Router();
// @route /api/post/test
router.get('/test', (req, res) => {
  res.json({post: 'post is working'});
});

module.exports = router;
