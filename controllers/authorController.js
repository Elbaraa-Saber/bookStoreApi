const asyncHandler = require("express-async-handler");

const {
  Author,
  validateAddAuthor,
  validateUpdateAuthor,
} = require("../models/Author");

/**
 * @desc Get all authors
 * @route /api/authors
 * @method GET
 * @access public
 */
const getAllAuthors = asyncHandler(async (req, res) => {
  const { pageNumber } = req.query;
  const authorsPerPage = 2; // how many authors per page
  // pagenation we can add, to return different data for each page by num of page
  // .skip(2) will skip first two objects from database, and limit(2) will return next two objects just
  let authorList;
  if (pageNumber) {
    authorList = await Author.find()
      .skip((pageNumber - 1) * authorsPerPage)
      .limit(authorsPerPage);
  } else {
    authorList = await Author.find();
  }
  // If i want to return for frontend sorted arr, i have to add after .find().sort( forExapmple: { firstName: 1 });
  // and if sort( {firstName: -1 }); it well be reserved sroted arr

  // if i want to return for example just FirstName, lastNames and without id too
  // i can use .find().select("firstName lastName -_id");
  res.status(200).json(authorList);
});

/**
 * @desc Get a single author by id
 * @route /api/authors/:id
 * @method GET
 * @access public
 */

const getAuthorById = asyncHandler(async (req, res) => {
  const author = await Author.findById(req.params.id);
  if (author) {
    res.status(200).json(author);
  } else {
    return res.status(404).json({ message: "Author is nod found" });
  }
});

/**
 * @desc Create a new author
 * @route /api/authors
 * @method POST
 * @access private (admin) protected route
 */

const createNewAuthor = asyncHandler(async (req, res) => {
  const { error } = validateAddAuthor(req.body);

  if (error) {
    return res.status(400).json({ message: error.details[0].message });
  }

  const author = new Author({
    firstName: req.body.firstName,
    lastName: req.body.lastName,
    nationality: req.body.nationality,
    image: req.body.image,
  });

  const result = await author.save();

  res.status(201).json(result);
});

/**
 * @desc Edit an author by id
 * @route /api/authors/:id
 * @method PUT
 * @access private (admin) protected route
 */

const editAnAuthor = asyncHandler(async (req, res) => {
  const { error } = validateUpdateAuthor(req.body);
  if (error) {
    return res.status(400).json({ message: error.details[0].message });
  }

  const author = await Author.findByIdAndUpdate(
    req.params.id,
    {
      // we give the author a new data by $set and $set from mongoose
      $set: {
        firstName: req.body.firstName,
        lastName: req.body.lastName,
        nationality: req.body.nationality,
        image: req.body.image,
      },
    },
    // { new: true } we should to do it, for return the new value of author
    { new: true }
  );
  res.status(200).json(author);
});

/**
 * @desc Delete an author by id
 * @route /api/authors/:id
 * @method DELETE
 * @access private (admin) protected route
 */

const deleteAnAuthor = asyncHandler(async (req, res) => {
  const author = await Author.findById(req.params.id);
  if (author) {
    await Author.findByIdAndDelete(req.params.id);
    res.status(200).json({ message: "Author has been deleted successfully" });
  } else {
    res.status(404).json({ message: "Author not found" });
  }
});

module.exports = {
  getAllAuthors,
  getAuthorById,
  createNewAuthor,
  editAnAuthor,
  deleteAnAuthor,
};
