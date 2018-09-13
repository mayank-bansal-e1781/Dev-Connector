const isEmpty = require('./help');
const validator = require('validator');

let validateRegisterInput = function (data) {
  let errors = {};
  data.name = isEmpty(data.name) ? '' : data.name;
  data.email = isEmpty(data.email) ? '' : data.email;
  data.password = isEmpty(data.password) ? '' : data.password;
  data.cpassword = isEmpty(data.cpassword) ? '' : data.cpassword;
  if (validator.isEmpty(data.name)) {
    errors.name = 'Name field is required';
  }
  if (!validator.isLength(data.name, {min: 2,  max: 30})) {
    errors.name = 'Name should be atleast 2 characters long and max 30 characters';
  }
  if (validator.isEmpty(data.email)) {
    errors.email = 'Email field is required';
  }
  if (!validator.isEmail(data.email)) {
    errors.email = 'Not a valid email';
  }
  if (validator.isEmpty(data.password)) {
    errors.password = 'password is required';
  }
  if (!validator.isLength(data.password, {min: 6,  max: 30})) {
    errors.password = 'password should be atleast 6 characters long and max 30 characters';
  }
  if (!validator.equals(data.password, data.cpassword)) {
    errors.cpassword = 'password field do not match';
  }
  if (validator.isEmpty(data.cpassword)) {
    errors.cpassword = 'confirm password is required';
  }
  return {
    errors,
    isValid: isEmpty(errors)
  };
};

let validateLoginInput = function (data) {
  let errors = {};
  data.email = isEmpty(data.email) ? '' : data.email;
  data.password = isEmpty(data.password) ? '' : data.password;

  if (!validator.isEmail(data.email)) {
    errors.email = 'Not a valid email';
  }
  if (validator.isEmpty(data.email)) {
    errors.email = 'Email field is required';
  }
  if (validator.isEmpty(data.password)) {
    errors.password = 'password is required';
  }
  return {
    errors,
    isValid: isEmpty(errors)
  };
};

let validateProfileInput = function (data) {
  let errors = {};
  data.handle = isEmpty(data.handle) ? '' : data.handle;
  data.status = isEmpty(data.status) ? '' : data.status;
  data.skills = isEmpty(data.skills) ? '' : data.skills;
  if (validator.isEmpty(data.handle)) {
    errors.handle = 'Handle is required';
  }
  if (validator.isEmpty(data.status)) {
    errors.status = 'status is required';
  }
  if (validator.isEmpty(data.skills)) {
    errors.skills = 'skills is required';
  }
  if (!isEmpty(data.website)) {
    if (!validator.isURL(data.website)) {
      errors.website = 'Not a valid URL';
    }
  }
  return {
    errors,
    isValid: isEmpty(errors)
  };
};

let validateExperienceInput = function (data) {
  let errors = {};
  data.title = isEmpty(data.title) ? '' : data.title;
  data.company = isEmpty(data.company) ? '' : data.company;
  data.from = isEmpty(data.from) ? '' : data.from;
  if (validator.isEmpty(data.title)) {
    errors.title = 'title is required';
  }
  if (validator.isEmpty(data.company)) {
    errors.company = 'company is required';
  }
  if (validator.isEmpty(data.from)) {
    errors.from = 'From  is required';
  }
  return {
    errors,
    isValid: isEmpty(errors)
  };
};

let validateEducationInput = function (data) {
  let errors = {};
  data.school = isEmpty(data.school) ? '' : data.school;
  data.degree = isEmpty(data.degree) ? '' : data.degree;
  data.from = isEmpty(data.from) ? '' : data.from;
  if (validator.isEmpty(data.school)) {
    errors.school = 'School is required';
  }
  if (validator.isEmpty(data.degree)) {
    errors.degree = 'Degree is required';
  }
  if (validator.isEmpty(data.from)) {
    errors.from = 'From  is required';
  }
  return {
    errors,
    isValid: isEmpty(errors)
  };
};

module.exports = {
  validateRegisterInput,
  validateLoginInput,
  validateProfileInput,
  validateExperienceInput,
validateEducationInput};
