const { User, validateUpdateUser } = require("../models/User");
const asyncHandler = require("express-async-handler");

/**
 * @desc Update user profile
 * @route /api/users/:id
 * @method PUT
 * @access private
 */

const editUser = asyncHandler(async (req, res) => {
  const { error } = validateUpdateUser(req.body);
  if (error) {
    return res.status(400).json({ message: error.details[0].message });
  }

  if (req.body.password) {
    const salt = await bcrypt.genSalt(10);
    req.body.password = await bcrypt.hash(req.body.password, salt);
  }
  const updatedUser = await User.findByIdAndUpdate(
    req.params.id,
    {
      $set: {
        email: req.body.email,
        username: req.body.username,
        password: req.body.password,
      },
    },
    {
      new: true,
    }
  ).select("-password");

  res.status(200).json(updatedUser);
});

/**
 * @desc Get all users
 * @route /api/users/
 * @method GET
 * @access private
 */

const getAllUsers = asyncHandler(async (req, res) => {
  const allUsers = await User.find().select("-password");
  res.status(200).json(allUsers);
});

/**
 * @desc Get user by Id
 * @route /api/users/:id
 * @method GET
 * @access private ( admin & and the user himself)
 */

const getUserById = asyncHandler(async (req, res) => {
  const user = await User.findById(req.params.id).select("-password");
  if (user) {
    res.status(200).json(user);
  } else {
    res.status(404).json({ message: "User not found" });
  }
});

/**
 * @desc delete user by Id
 * @route /api/users/:id
 * @method DELETE
 * @access private ( Admin and user himself)
 */

const deleteUser = asyncHandler(async (req, res) => {
  const user = await User.findById(req.params.id).select("-password");
  if (user) {
    await User.findByIdAndDelete(req.params.id);
    res.status(200).json({ message: "User deleted successfully" });
  } else {
    res.status(404).json({ message: "User not found" });
  }
});


module.exports = {
  editUser,
  getAllUsers,
  getUserById,
  deleteUser,
};
