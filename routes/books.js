const express = require("express");
const router = express.Router();
const {
  getAllBooks,
  gotBookById,
  addNewBook,
  editBook,
  deleteBook,
} = require("../controllers/bookController");
const { verifyTokenAndAdmin } = require("../middlewares/verifyToken");
// api/books
router.route("/").get(getAllBooks).post(verifyTokenAndAdmin, addNewBook);
// api/books/:id
router
  .route("/:id")
  .get(gotBookById)
  .put(verifyTokenAndAdmin, editBook)
  .delete(verifyTokenAndAdmin, deleteBook);

module.exports = router;
