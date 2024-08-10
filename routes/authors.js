const express = require("express");
// we are using asyncHandler middleware to catch and handle errors
// without it, we should to write into async try and catch
// but with it we can simply use asyncHandler and into async will use our functions without try/catch
const asyncHandler = require("express-async-handler");
const router = express.Router();
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

router.get(
  "/",
  asyncHandler(async (req, res) => {
    const authorList = await Author.find();
    // If i want to return for frontend sorted arr, i have to add after .find().sort( forExapmple: { firstName: 1 });
    // and if sort( {firstName: -1 }); it well be reserved sroted arr
    // if i want to return for example just FirstName, lastNames and without id too
    // i can use .find().select("firstName lastName -_id");
    res.status(200).json(authorList);
  })
);

/**
 * @desc Get a single author by id
 * @route /api/authors/:id
 * @method GET
 * @access public
 */

router.get(
  "/:id",
  asyncHandler(async (req, res) => {
    const author = await Author.findById(req.params.id);
    if (author) {
      res.status(200).json(author);
    } else {
      return res.status(404).json({ message: "Author is nod found" });
    }
  })
);

/**
 * @desc Create a new author
 * @route /api/authors
 * @method POST
 * @access public
 */

router.post(
  "/",
  asyncHandler(async (req, res) => {
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
  })
);

/**
 * @desc Edit an author by id
 * @route /api/authors/:id
 * @method PUT
 * @access public
 */

router.put(
  "/:id",
  asyncHandler(async (req, res) => {
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
  })
);

/**
 * @desc Delete an author by id
 * @route /api/authors/:id
 * @method DELETE
 * @access public
 */

router.delete(
  "/:id",
  asyncHandler(async (req, res) => {
    const author = await Author.findById(req.params.id);
    if (author) {
      await Author.findByIdAndDelete(req.params.id);
      res.status(200).json({ message: "Author has been deleted successfully" });
    } else {
      res.status(404).json({ message: "Author not found" });
    }
  })
);

module.exports = router;
