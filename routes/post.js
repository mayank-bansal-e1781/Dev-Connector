const express = require('express');
const router = express.Router();
const passport = require('passport');
const Post = require('../models/post');
const validate = require('../helpers/InputValidator');
const Profile = require('../models/profile');
// @route /api/post/test
// @access private
// @desc test
router.get('/test', (req, res) => {
  res.json({ post: 'post is working' });
});

// @route /api/post
// @access private
// @desc create a post
router.post(
  '/',
  passport.authenticate('jwt', { session: false }),
  (req, res) => {
    let { errors, isValid } = validate.validatePostInput(req.body);
    if (!isValid) {
      return res.status(400).json(errors);
    }
    let post = {
      user: req.user.id,
      name: req.body.name,
      avatar: req.body.avatar,
      text: req.body.text
    };
    Post.create(post)
      .then(post => {
        return res.json(post);
      })
      .catch(err => {
        return res.json(err);
      });
  }
);

// @route /api/post/test
// @access private
// @desc test
router.get('/', (req, res) => {
  console.log('ia m here');
  Post.find()
    .sort({ date: -1 })
    .then(posts => {
      return res.json(posts);
    })
    .catch(err => {
      return res.json(err);
    });
});

// @route /api/post/test
// @access private
// @desc test
router.get('/:post_id', (req, res) => {
  Post.find({ _id: req.params.post_id })
    .then(post => {
      return res.json(post);
    })
    .catch(err => {
      return res.json(err);
    });
});

// @route /api/post
// @access private
// @desc delete post
router.delete(
  '/:post_id',
  passport.authenticate('jwt', { session: false }),
  (req, res) => {
    Profile.find({ user: req.user.id })
      .then(profile => {
        Post.findById({ _id: req.params.post_id })
          .then(post => {

            if (post.user.toString() !== req.user.id) {
              console.log('sahi h');
              return res.status(401).json({ msg: 'you are not authorized' });
            }
            post.remove().then(() => {
              return res.json({msg: 'post removed succesfully'});
            });
          })
          .catch(err => {
            return res
              .status(401)
              .json({ msg: 'There is no post with this id' });
          });
      })
      .catch(err => {
        return res.status(401).json({ msg: 'Your are not Authorized' });
      });
  }
);

// @route /api/post/likes
// @access private
// @desc like the post
router.post(
  '/likes/:post_id',
  passport.authenticate('jwt', { session: false }),
  (req, res) => {
    Post.findById({ _id: req.params.post_id })
      .then(post => {
        if (post.likes.map(item => item.user.toString()).includes(req.user.id.toString())) {
          console.log('mnee like');
          return res.status(401).json({ msg: 'you have already liked it' });
        }
        post.likes.unshift({ user: req.user.id });
        post
          .save()
          .then(post => {
            return res.json(post);
          })
          .catch(err => {
            return res.json(err);
          });
      })
      .catch(err => {
        return res.status(401).json({ msg: 'There is no post with this id' });
      });
  }
);

// @route /api/post/unlike
// @access private
// @desc unlike the post
router.delete(
  '/unlike/:post_id',
  passport.authenticate('jwt', { session: false }),
  (req, res) => {
    Post.findById({ _id: req.params.post_id })
      .then(post => {
        console.log(post.likes.map(item => item.user.toString()));
        console.log(post.likes.map(item => item.user.toString()).indexOf(req.user.id));
        console.log(req.user.id);
        if (post.likes.map(item => item.user.toString()).indexOf(req.user.id) > -1) {
          post.likes.splice(post.likes.map(item => item.user.toString()).indexOf(req.user.id), 1);
          post
            .save()
            .then(post => {
              return res.json(post);
            })
            .catch(err => {
              return res.json(err);
            });
        } else {
          return res.json({ msg: 'fuck off' });
        }
      })
      .catch(err => {
        return res.status(401).json({ msg: 'There is no post with this id' });
      });
  }
);

// @route /api/post/comment
// @access private
// @desc comment on  the post
router.post(
  '/comment/:post_id',
  passport.authenticate('jwt', { session: false }),
  (req, res) => {
    let {errors, isValid} = validate.validatePostInput(req.body);
    if (!isValid) {
      return res.status(400).json(errors);
    }
    let comment = {
      user: req.user.id,
      name: req.user.name,
      text: req.body.text,
      avatar: req.user.avatar
    };
    Post.findById({_id: req.params.post_id})
      .then((post) => {
        post.comment.push(comment);
        post.save()
          .then((post) => {
            return res.json(post);
          })
          .catch(err => {
            return res.json(err);
          });
      })
      .catch(err => {
        return res.json(err);
      });
  }
);

// @route /api/post/comment
// @access private
// @desc delete the comment
router.delete(
  '/comment/:post_id/:comment_id',
  passport.authenticate('jwt', { session: false }),
  (req, res) => {
    Post.findById({ _id: req.params.post_id })
      .then(post => {
        if (post.comment.filter(item => item._id.toString() === req.params.comment_id)) {
          post.comment.splice(post.comment.map(item => item._id.toString()).indexOf(req.params.comment_id), 1);
          post
            .save()
            .then(post => {
              return res.json(post);
            })
            .catch(err => {
              return res.json(err);
            });
        } else {
          return res.status(400).json({ msg: 'fuck off' });
        }
      })
      .catch(err => {
        return res.status(401).json({ msg: 'There is no comment with this id' });
      });
  }
);
module.exports = router;
