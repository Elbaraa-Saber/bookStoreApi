const { Book, validateAddBook, validateUpdateBook } = require("../models/Book");
const asyncHandler = require("express-async-handler");

/**
 * @desc Get all books
 * @route /api/books
 * @method GET
 * @access public
 */

const getAllBooks = asyncHandler(async (req, res) => {
  // to do filteration we use Comparioson qusery operators
  // forExample: find({ price: { $eq: 10 } })
  // $eq (equal to) --- $ne( not equal to)
  // we can found all filterations method on mongodb site
  // https://www.mongodb.com/docs/manual/reference/operator/query-comparison/

  const { minPrice, maxPrice } = req.query;
  let bookList;
  if (minPrice && maxPrice) {
    bookList = await Book.find({
      price: { $gte: minPrice, $lte: maxPrice },
    }).populate({
      path: "author", // The path to the author field
      select: "firstName lastName nationality", // Select only these fields
    });
  } else {
    bookList = await Book.find().populate("author", [
      "firstName",
      "lastName",
      "nationality",
    ]);
  }
  res.status(200).json(bookList);
});

/**
 * @desc Get a single book by id
 * @route /api/books/:id
 * @method GET
 * @access public
 */

const gotBookById = asyncHandler(async (req, res) => {
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
});

/**
 * @desc Create a new book
 * @route /api/books
 * @method POST
 * @access private (admin) protected route
 */

const addNewBook = asyncHandler(
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
);

/**
 * @desc Update a book
 * @route /api/books/:id
 * @method PUT
 * @access private (admin) protected route
 */

const editBook = asyncHandler(async (req, res) => {
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
});


/**
 * @desc Delete a book
 * @route /api/books/:id
 * @method DELETE
 * @access private (admin) protected route
 */

const deleteBook = asyncHandler(async (req, res) => {
  const book = await Book.findById(req.params.id);
  if (book) {
    await Book.findByIdAndDelete(book);
    res.status(200).json({ message: "Book has been deleted succlessfully" });
  } else {
    res.status(404).json({ message: "Book not found" });
  }
});

module.exports = { getAllBooks, gotBookById, addNewBook, editBook, deleteBook };
