const express = require("express");
const router = express.Router();
const { Book, validateAddBook, validateUpdateBook } = require("../models/Book");
const asyncHandler = require("express-async-handler");
const { verifyTokenAndAdmin } = require("../middlewares/verifyToken");

/**
 * @desc Get all books
 * @route /api/books
 * @method GET
 * @access public
 */
router.get(
  "/",
  asyncHandler(async (req, res) => {
    // we can use send or json() method to send JSON data
    // populate method will fetch related data from other collections (in this case, authors)
    const bookList = await Book.find().populate("author");
    res.status(200).json(bookList);
  })
);

/**
 * @desc Get a single book by id
 * @route /api/books/:id
 * @method GET
 * @access public
 */
router.get(
  "/:id",
  asyncHandler(async (req, res) => {
    const book = await Book.findById(req.params.id).populate("author", [
      "_id",
      "firstName",
      "lastName",
    ]);
    if (book) {
      res.status(200).json(book);
    } else {
      res.status(404).json({ message: "Book not found" });
    }
  })
);

/**
 * @desc Create a new book
 * @route /api/books
 * @method POST
 * @access private (admin) protected route
 */
router.post(
  "/",
  verifyTokenAndAdmin,
  asyncHandler(
    async (req, res) => {
      const { error } = validateAddBook(req.body);
      if (error) {
        return res.status(400).json({ message: error.details[0].message });
      }

      const newBook = new Book({
        title: req.body.title,
        description: req.body.description,
        author: req.body.author,
        price: req.body.price,
        cover: req.body.cover,
      });

      const result = await newBook.save();
      res.status(201).json(result);
    } // 201 => created post successfully
  )
);

/**
 * @desc Update a book
 * @route /api/books/:id
 * @method PUT
 * @access private (admin) protected route
 */

router.put(
  "/:id",
  verifyTokenAndAdmin,
  asyncHandler(async (req, res) => {
    const { error } = validateUpdateBook(req.body);
    if (error) {
      return res.status(400).json({ message: error.details[0].message });
    }
    const book = await Book.findByIdAndUpdate(
      req.params.id,
      {
        $set: {
          title: req.body.title,
          description: req.body.description,
          author: req.body.author,
          price: req.body.price,
          cover: req.body.cover,
        },
      },
      { new: true }
    );
    res.status(200).json(book);
  })
);

/**
 * @desc Delete a book
 * @route /api/books/:id
 * @method DELETE
 * @access private (admin) protected route
 */

router.delete(
  "/:id",
  verifyTokenAndAdmin,
  asyncHandler(async (req, res) => {
    const book = await Book.findById(req.params.id);
    if (book) {
      await Book.findByIdAndDelete(book);
      res.status(200).json({ message: "Book has been deleted succlessfully" });
    } else {
      res.status(404).json({ message: "Book not found" });
    }
  })
);

module.exports = router;
