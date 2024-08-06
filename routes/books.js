const express = require("express");
const router = express.Router();
const joi = require("joi");

const books = [
  {
    id: 1,
    title: "Black Swan",
    description: "About Black Swan",
    author: "Nasim Taleb",
    price: 10,
    cover: "soft cover",
  },
  {
    id: 2,
    title: "Rich Dad and Poor Dad",
    description: "About Rich Dad and Poor Dad",
    author: "Robert Kiyosaki",
    price: 12,
    cover: "soft cover",
  },
];

/**
 * @desc Get all books
 * @route /api/books
 * @method GET
 * @access public
 */
router.get("/", (req, res) => {
  // we can use send or json() method to send JSON data
  res.status(200).json(books);
});

/**
 * @desc Get a single book
 * @route /api/books/:id
 * @method GET
 * @access public
 */
router.get("/:id", (req, res) => {
  const book = books.find((b) => b.id === parseInt(req.params.id));
  if (book) {
    res.status(200).json(book);
  } else {
    res.status(404).json({ message: "Book not found" });
  }
});

/**
 * @desc Create a book
 * @route /api/books
 * @method POST
 * @access public
 */
router.post(
  "/",
  (req, res) => {
    const { error } = validateAddBook(req.body);
    if (error) {
      return res.status(400).json({ message: error.details[0].message });
    }

    const newBook = {
      id: books.length + 1,
      title: req.body.title,
      description: req.body.description,
      author: req.body.author,
      price: parseFloat(req.body.price),
      cover: req.body.cover,
    };
    books.push(newBook);
    res.status(201).json(newBook);
  } // 201 => created post successfully
);

/**
 * @desc Update a book
 * @route /api/books/:id
 * @method PUT
 * @access public
 */

router.put("/:id", (req, res) => {
  const { error } = validateUpdateBook(req.body);
  if (error) {
    return res.status(400).json({ message: error.details[0].message });
  }
  const book = books.find((b) => b.id === parseInt(req.params.id));
  if (book) {
    res.status(200).json({ message: "Book updated successfully" });
  } else {
    res.status(404).json({ message: "Book not founded" });
  }
});

/**
 * @desc Delete a book
 * @route /api/books/:id
 * @method DELETE
 * @access public
 */

router.delete("/:id", (req, res) => {
    const book = books.find((b) => b.id === parseInt(req.params.id));
    if(book) {
        res.status(200).json({ message: 'Book has been deleted succlessfully'});
    } else {
        res.status(404).json({ message: 'Book not found'});
    }
})

function validateAddBook(book) {
  const schema = joi.object({
    title: joi.string().trim().min(3).max(200).required(),
    description: joi.string().trim().min(5).max(200).required(),
    author: joi.string().trim().min(3).max(200).required(),
    price: joi.number().min(0).required(),
    cover: joi.string().trim().required(),
  });
  return schema.validate(book);
}
function validateUpdateBook(book) {
  const schema = joi.object({
    title: joi.string().trim().min(3).max(200),
    description: joi.string().trim().min(5).max(200),
    author: joi.string().trim().min(3).max(200),
    price: joi.number().min(0),
    cover: joi.string().trim(),
  });
  return schema.validate(book);
}

module.exports = router;
