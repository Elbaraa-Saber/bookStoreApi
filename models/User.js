const joi = require("joi");
const mongoose = require("mongoose");
const jwt = require("jsonwebtoken");

const UserSchema = new mongoose.Schema(
  {
    email: {
      type: String,
      required: true,
      unique: true,
      trim: true,
      minlength: 5,
      maxlength: 100,
    },
    username: {
      type: String,
      required: true,
      trim: true,
      minlength: 2,
      maxlength: 200,
    },
    password: {
      type: String,
      required: true,
      minlength: 8,
      trim: true,
    },
    isAdmin: {
      type: Boolean,
      default: false,
    },
  },
  { timestamps: true }
);

// generate token
UserSchema.methods.generateToken = function () {
  return jwt.sign(
    { id: this._id, isAdmin: this.isAdmin },
    process.env.JWT_SECRET_KEY,
    {
      expiresIn: "3d",
    }
  );
};

const User = mongoose.model("User", UserSchema);

// Validation for register user
function validateRegisterUser(obj) {
  const schema = joi.object({
    email: joi.string().trim().min(5).max(100).required(),
    username: joi.string().trim().min(2).max(200).required(),
    password: joi.string().trim().min(8).required(),
  });
  return schema.validate(obj);
}

// validation for login user
function validateLoginUser(obj) {
  const schema = joi.object({
    email: joi.string().trim().min(5).max(100),
    password: joi.string().min(8).trim(),
  });
  return schema.validate(obj);
}

// validation for update user
function validateUpdateUser(obj) {
  const schema = joi.object({
    email: joi.string().email().min(5).max(100),
    username: joi.string().min(2).max(200),
    password: joi.string().min(8),
  });
  return schema.validate(obj);
}

module.exports = {
  User,
  validateRegisterUser,
  validateLoginUser,
  validateUpdateUser,
};
