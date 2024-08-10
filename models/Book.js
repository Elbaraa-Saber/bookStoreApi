const { required } = require("joi");
const mongoose = require("mongoose");
const joi = require("joi");

const BookSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
      trim: true,
      minlength: 3,
      maxlenght: 250,
    },
    description: {
      type: String,
      required: true,
      trim: true,
    },
    author: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: "Author",
    },
    price: {
      type: Number,
      required: true,
      min: 0,
    },
    cover: {
      type: String,
      required: false,
      enum: ["soft cover", "hard cover"],
    },
  },
  { timestamps: true }
);
const Book = mongoose.model("Book", BookSchema);

function validateAddBook(book) {
  const schema = joi.object({
    title: joi.string().trim().min(3).max(250).required(),
    description: joi.string().trim().min(5).required(),
    author: joi.string().required(),
    price: joi.number().min(0).required(),
    cover: joi.string().valid("soft cover", "hard cover").required(),
  });
  return schema.validate(book);
}
function validateUpdateBook(book) {
  const schema = joi.object({
    title: joi.string().trim().min(3).max(250),
    description: joi.string().trim().min(5),
    author: joi.string(),
    price: joi.number().min(0),
    cover: joi.string().valid("soft cover", "hard cover"),
  });
  return schema.validate(book);
}

module.exports = {
  Book,
  validateAddBook,
  validateUpdateBook,
};
