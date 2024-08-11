const express = require("express");
const router = express.Router();
const asyncHandler = require("express-async-handler");
// bcrypt for password hashing to do save passwords in database securely
const bcrypt = require("bcryptjs");
// jsonwebtoken for generating and verifying JWT tokens
const jwt = require("jsonwebtoken");

const {
  User,
  validateRegisterUser,
  validateLoginUser,
} = require("../models/User");

/**
 * @desc Register a new user
 * @route /api/auth/register
 * @method POST
 * @access public
 */

router.post(
  "/register",
  asyncHandler(async (req, res) => {
    const { error } = validateRegisterUser(req.body);
    if (error) {
      return res.status(400).json({ message: error.details[0].message });
    }

    let user = await User.findOne({ email: req.body.email });

    if (user) {
      res.status(400).json({ message: "Email already registerd" });
    }

    // Hash the password before saving it to the database
    const salt = await bcrypt.genSalt(10);
    req.body.password = await bcrypt.hash(req.body.password, salt);

    user = new User({
      email: req.body.email,
      username: req.body.username,
      password: req.body.password,
    });

    const result = await user.save();
    const token = user.generateToken();
    // return the result with password removed
    const { password, ...other } = result._doc;
    res.status(201).json({ ...other, token });
  })
);

/**
 * @desc Login a user
 * @route /api/auth/login
 * @method POST
 * @access public
 */

router.post(
  "/login",
  asyncHandler(async (req, res) => {
    const { error } = validateLoginUser(req.body);
    if (error) {
      return res.status(400).json({ message: error.details[0].message });
    }

    const user = await User.findOne({ email: req.body.email });

    // we use invalid email or password if user is not found or password is incorrect
    // to save it from hacking
    if (!user) {
      return res.status(400).json({ message: "Invalid Email Or Password" });
    }

    const isValidPassword = await bcrypt.compare(
      req.body.password,
      user.password
    );
    if (!isValidPassword) {
      return res.status(400).json({ message: "Invalid Email Or Password" });
    }

    // the third object is choisen, 3d = 3 days
    const token = user.generateToken(); // generate the token here

    // return the result with password removed
    const { password, ...other } = user._doc;
    res.status(200).json({ ...other, token });
  })
);
module.exports = router;
