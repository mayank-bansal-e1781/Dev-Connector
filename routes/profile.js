const express = require('express');
const router = express.Router();
const passport = require('passport');
const Profile = require('../models/profile');
const User = require('../models/users');
const validate = require('../helpers/InputValidator');
// @route /api/profile/test
// @access public
// @desc test route
router.get('/test', (req, res) => {
  res.json({post: 'profile is working'});
});

// @route /api/profile
// @access private
// @desc get profile
router.get('/', passport.authenticate('jwt', {session: false}), (req, res) => {
  Profile.findOne({user: req.user.id})
    .populate('user', ['name', 'avatar'])
    .then((profile) => {
      let errors = {};
      if (!profile) {
        errors.profile = 'You dont have a profile';
        return res.status(404).send(errors);
      }
      return res.send(profile);
    })
    .catch((err) => {
      return res.status(404).json(err);
    });
});

// @route /api/profile/handle/:handle
// @access public
// @desc get profile
router.get('/handle/:handle', (req, res) => {
  Profile.findOne({handle: req.params.handle})
    .populate('user', ['name', 'avatar'])
    .then((profile) => {
      let errors = {};
      if (!profile) {
        errors.profile = 'You dont have a profile';
        return res.status(404).send(errors);
      }
      return res.send(profile);
    })
    .catch((err) => {
      return res.status(404).json(err);
    });
});

// @route /api/profile/user/user_id
// @access private
// @desc get profile
router.get('/user/:user_id', passport.authenticate('jwt', {session: false}), (req, res) => {
  Profile.findOne({user: req.params.user_id})
    .populate('user', ['name', 'avatar'])
    .then((profile) => {
      let errors = {};
      if (!profile) {
        errors.profile = 'You dont have a profile';
        return res.status(404).send(errors);
      }
      return res.send(profile);
    })
    .catch((err) => {
      return res.status(404).json(err);
    });
});

// @route /api/profile
// @access private
// @desc create profile
router.post('/', passport.authenticate('jwt', {session: false}), (req, res) => {
  let {errors, isValid} = validate.validateProfileInput(req.body);
  if (!isValid) {
    return res.status(400).json(errors);
  }
  let profileFileds = {};
  profileFileds.user = req.user.id;
  if (req.body.handle) profileFileds.handle = req.body.handle;
  if (req.body.status) profileFileds.status = req.body.status;
  if (req.body.company) profileFileds.company = req.body.company;
  if (req.body.website) profileFileds.website = req.body.website;
  if (req.body.location) profileFileds.handle = req.body.handle;
  if (req.body.bio) profileFileds.bio = req.body.bio;
  if (req.body.githubusername) profileFileds.githubusername = req.body.githubusername;

  // Skills
  if (typeof req.body.skills != undefined) profileFileds.skills = req.body.skills.split(',');

  // Social Media
  profileFileds.social = {};
  if (req.body.youtube) profileFileds.social.youtube = req.body.youtube;
  if (req.body.facebook) profileFileds.social.facebook = req.body.facebook;
  if (req.body.instagram) profileFileds.social.instagram = req.body.instagram;
  if (req.body.linkedin) profileFileds.social.linkedin = req.body.linkedin;
  if (req.body.twitter) profileFileds.social.twitter = req.body.twitter;

  Profile.findOne({user: req.user.id})
    .then((profile) => {
      if (profile) {
        // update existing
        Profile.findOneAndUpdate({user: req.user.id}, {$set: profileFileds}, {new: true})
          .then((profile) => {
            return res.json(profile);
          })
          .catch(err => {
            return res.send(err);
          });
      }else {

        // check if handle already exists
        Profile.findOne({handle: req.body.handle})
          .then((profile) => {
            if (profile) {
              errors.handle = 'username already exists';
              return res.status(400).json(errors);
            }else {
              // create new
              Profile.create(profileFileds).then((profile) => {
                return res.json(profile);
              }).catch(err => {
                return res.send(err);
              });
            }
          })
          .catch(err => {
            return res.json(err);
          });
      }
    })
    .catch(() => {
    });
});

// @route /api/profile/all
// @access public
// @desc get all profile
router.get('/all', (req, res) => {
  Profile.find()
    .populate('user', ['name', 'avatar'])
    .then((profiles) => {
      let errors = {};
      if (!profiles) {
        errors.profile = 'You dont have a profile';
        return res.status(404).send(errors);
      }
      return res.send(profiles);
    })
    .catch((err) => {
      return res.status(404).json(err);
    });
});

// @route /api/profile/experience
// @access private
// @desc add experience to profile
router.post('/experience', passport.authenticate('jwt', {session: false}), (req, res) => {

  let {errors, isValid} = validate.validateExperienceInput(req.body);
  if (!isValid) {
    return res.status(400).json(errors);
  }
  let exp = {
    title: req.body.title,
    company: req.body.company,
    from: req.body.from,
    to: req.body.to,
    current: req.body.current,
    desc: req.body.desc,
    location: req.body.location
  };
  Profile.findOne({user: req.user.id})
    .then(profile => {
      profile.experience.unshift(exp);
      profile.save()
        .then((profile) => {
          return res.status(200).json(profile);
        });
    })
    .catch((err) => {
      return res.status(500).json(err);
    });
});

// @route /api/profile/education
// @access private
// @desc add education to profile
router.post('/education', passport.authenticate('jwt', {session: false}), (req, res) => {

  let {errors, isValid} = validate.validateEducationInput(req.body);
  if (!isValid) {
    return res.status(400).json(errors);
  }
  let edu = {
    school: req.body.school,
    degree: req.body.degree,
    from: req.body.from,
    to: req.body.to,
    current: req.body.current,
    fieldofstudy: req.body.fieldofstudy,
    desc: req.body.desc,
    location: req.body.location
  };
  Profile.findOne({user: req.user.id})
    .then(profile => {
      profile.education.unshift(edu);
      profile.save()
        .then((profile) => {
          return res.status(200).json(profile);
        });
    })
    .catch((err) => {
      return res.status(500).json(err);
    });
});

// @route /api/profile/experience/:exp_id
// @access private
// @desc delete experience to profie
router.delete('/experience/:exp_id', passport.authenticate('jwt', {session: false}), (req, res) => {
  Profile.findOne({user: req.user.id})
    .then(profile => {
      let removeIndex = profile.experience
        .map((item => item.id))
        .indexOf(req.params.exp_id);

      profile.experience.splice(removeIndex, 1);
      profile.save()
        .then((profile) => {
          return res.json(profile);
        })
        .catch((err) => {
          return res.send(400).json(err);
        });
    })
    .catch((err) => {
      return res.status(500).json(err);
    });
});

// @route /api/profile/education/:edu_id
// @access private
// @desc delete experience to profie
router.delete('/education/:edu_id', passport.authenticate('jwt', {session: false}), (req, res) => {
  Profile.findOne({user: req.user.id})
    .then(profile => {
      let removeIndex = profile.education
        .map((item => {
          console.log(item.id);
          return item.id;
        }))
        .indexOf(req.params.edu_id);
      if (removeIndex >= 0) {
        profile.education.splice(removeIndex, 1);
        profile.save()
          .then((profile) => {
            return res.json(profile);
          })
          .catch((err) => {
            return res.send(400).json(err);
          });
      }else {
        return res.status(400).json({msg: 'abe chodu experience hi nhi h'});
      }
    })
    .catch((err) => {
      return res.status(500).json(err);
    });
});

// @route /api/profile
// @access private
// @desc delete the user and profile
router.delete('/', passport.authenticate('jwt', {session: false}), (req, res) => {
  Profile.findOneAndRemove({user: req.user.id})
    .then(() => {
      User.findByIdAndRemove({_id: req.user.id})
        .then(() => {
          return res.json({success: true});
        })
        .catch((err) => {
          return res.json(err);
        });
    })
    .catch((err) => {
      return res.status(500).json(err);
    });
});
module.exports = router;
