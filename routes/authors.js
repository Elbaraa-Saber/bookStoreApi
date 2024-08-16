const express = require("express");
// we are using asyncHandler middleware to catch and handle errors
// without it, we should to write into async try and catch
// but with it we can simply use asyncHandler and into async will use our functions without try/catch
const router = express.Router();

const { verifyTokenAndAdmin } = require("../middlewares/verifyToken");
const {
  getAllAuthors,
  getAuthorById,
  createNewAuthor,
  editAnAuthor,
  deleteAnAuthor,
} = require("../controllers/authorController");

router.route("/").get(getAllAuthors).post(verifyTokenAndAdmin, createNewAuthor);

router
  .route("/:id")
  .get(getAuthorById)
  .put(verifyTokenAndAdmin, editAnAuthor)
  .delete(verifyTokenAndAdmin, deleteAnAuthor);

module.exports = router;
