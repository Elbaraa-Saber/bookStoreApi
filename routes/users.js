const express = require("express");
const router = express.Router();
// bcrypt for password hashing to do save passwords in database securely
const bcrypt = require("bcryptjs");

const {
  verifyTokenAndAuthorization,
  verifyTokenAndAdmin,
} = require("../middlewares/verifyToken");

const {
  editUser,
  getAllUsers,
  getUserById,
  deleteUser,
} = require("../controllers/usercontroller");

router.route("/").get(verifyTokenAndAdmin, getAllUsers);

router
  .route("/:id")
  .get(verifyTokenAndAuthorization, getUserById)
  .put(verifyTokenAndAuthorization, editUser)
  .delete(verifyTokenAndAuthorization, deleteUser);

module.exports = router;
