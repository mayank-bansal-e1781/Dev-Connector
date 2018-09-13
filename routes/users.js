const express = require("express");
const router = express.Router();
const gravatar = require("gravatar");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const keys = require("../config/keys");
const passport = require("passport");
const validator = require("../helpers/InputValidator");

// Load users model
const User = require("../models/users");
// @route /api/users/test
// @access public
// @desc test route
router.get("/test", (req, res) => {
  res.json({ post: "user is working" });
});

// @route /api/users/register
// @access public
// @desc register route
router.post("/register", (req, res) => {
  let { errors, isValid } = validator.validateRegisterInput(req.body);

  if (!isValid) {
    return res.status(400).send(errors);
  }
  User.findOne({ email: req.body.email })
    .then(user => {
      errors.user = "user already exists";
      if (user) return res.status(400).send(errors);
      else {
        const avatar = gravatar.url(req.body.email, {
          r: "pg",
          s: 200,
          d: "mm"
        });
        const user = {
          name: req.body.name,
          email: req.body.email,
          avatar,
          password: bcrypt.hashSync(req.body.password, bcrypt.genSaltSync(10))
        };
        User.create(user, (err, user) => {
          if (err) throw err;
          else {
            return res.json(user);
          }
        });
      }
    })
    .catch(err => {
      return res.status(500).send("Server error");
    });
});

// @route /api/users/login
// @access public
// @desc login user / return jwt
router.post("/login", (req, res) => {
  let { errors, isValid } = validator.validateLoginInput(req.body);

  let email = req.body.email;
  let password = req.body.password;
  if (!isValid) {
    return res.status(400).json(errors);
  }
  User.findOne({ email: email })
    .then(user => {
      if (!user) {
        errors.email = "User not Found";
        return res.status(404).json(errors);
      }

      bcrypt
        .compare(password, user.password)
        .then(result => {
          if (result) {
            jwt.sign(
              { id: user.id, name: user.name, email: user.email },
              keys.secretKey,
              { expiresIn: 3600 },
              (err, token) => {
                res.json({
                  success: true,
                  token: "Bearer " + token
                });
              }
            );
          } else {
            errors.password = "password is wrong";
            return res.status(400).json(errors);
          }
        })
        .catch(err => {
          return res.send(err);
        });
    })
    .catch(err => {
      console.log(err);
    });
});

// @route /api/users/current
// @access private
// @desc user screen
router.get(
  "/current",
  passport.authenticate("jwt", { session: false }),
  (req, res) => {
    return res.json(req.user);
  }
);
module.exports = router;
