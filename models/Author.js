const mongoose = require("mongoose");
const joi = require("joi");

const AuthorSchema = new mongoose.Schema(
  {
    firstName: {
      type: String,
      required: true,
      trim: true,
      minlength: 3,
      maxlength: 200,
    },
    lastName: {
      type: String,
      required: true,
      trim: true,
      minlength: 3,
      maxlength: 200,
    },
    nationality: {
      type: String,
      required: true,
      trim: true,
      minlength: 2,
      maxlength: 100,
    },
    image: {
      type: String,
      default: "default-avatar.png",
    },
  },
  {
    // this will give us the data of creating every author, and will give every update date the
    timestamps: true,
  }
);

const Author = mongoose.model("Author", AuthorSchema);

function validateAddAuthor(author) {
    const schema = joi.object({
      firstName: joi.string().trim().min(3).max(200).required(),
      lastName: joi.string().trim().min(3).max(200).required(),
      nationality: joi.string().trim().min(2).max(100).required(),
      image: joi.string(),
    });
    return schema.validate(author);
  }
  
  function validateUpdateAuthor(author) {
    const schema = joi.object({
      firstName: joi.string().trim().min(3).max(200),
      lastName: joi.string().trim().min(3).max(200),
      nationality: joi.string().trim().min(2).max(100),
      image: joi.string(),
    });
    return schema.validate(author);
  }

module.exports = {
    Author,
    validateAddAuthor,
    validateUpdateAuthor,
  
};