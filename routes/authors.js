const express = require("express");
const router = express.Router();
const { Author, validateAddAuthor, validateUpdateAuthor } = require("../models/Author");

/**
 * @desc Get all authors
 * @route /api/authors
 * @method GET
 * @access public
 */

router.get("/", async (req, res) => {
  try {
    const authorList = await Author.find();
    // If i want to return for frontend sorted arr, i have to add after .find().sort( forExapmple: { firstName: 1 });
    // and if sort( {firstName: -1 }); it well be reserved sroted arr
    // if i want to return for example just FirstName, lastNames and without id too
    // i can use .find().select("firstName lastName -_id");
    res.status(200).json(authorList);
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Server Error" });
  }
});

/**
 * @desc Get a single author by id
 * @route /api/authors/:id
 * @method GET
 * @access public
 */

router.get("/:id", async (req, res) => {
  try {
    const author = await Author.findById(req.params.id);
    if (author) {
      res.status(200).json(author);
    } else {
      return res.status(404).json({ message: "Author is nod found" });
    }
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Server Error" });
  }
});

/**
 * @desc Create a new author
 * @route /api/authors
 * @method POST
 * @access public
 */

router.post("/", async (req, res) => {
  const { error } = validateAddAuthor(req.body);

  if (error) {
    return res.status(400).json({ message: error.details[0].message });
  }

  try {
    const author = new Author({
      firstName: req.body.firstName,
      lastName: req.body.lastName,
      nationality: req.body.nationality,
      image: req.body.image,
    });

    const result = await author.save();

    res.status(201).json(result);
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Something went wrong" });
  }
});

/**
 * @desc Edit an author by id
 * @route /api/authors/:id
 * @method PUT
 * @access public
 */

router.put("/:id", async (req, res) => {
  const { error } = validateUpdateAuthor(req.body);
  if (error) {
    return res.status(400).json({ message: error.details[0].message });
  }

  try {
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
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Server Error" });
  }
});

/**
 * @desc Delete an author by id
 * @route /api/authors/:id
 * @method DELETE
 * @access public
 */

router.delete("/:id", async (req, res) => {
  try {
    const author = await Author.findById(req.params.id);
    if (author) {
      await Author.findByIdAndDelete(req.params.id);
      res.status(200).json({ message: "Author has been deleted successfully" });
    } else {
      res.status(404).json({ message: "Author not found" });
    }
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Server Error" });
  }
});


module.exports = router;
