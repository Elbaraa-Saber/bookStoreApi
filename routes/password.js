const express = require("express");
const router = express.Router();
const {
  getForgotPassword,
  sendForgotPasswordLink,
  getResetPasswordView,
  resetPassword,
} = require("../controllers/passwordController");

router
  .route("/forgot-password")
  .get(getForgotPassword)
  .post(sendForgotPasswordLink);

router
  .route(`/reset-password/:userId/:token`)
  .get(getResetPasswordView)
  .post(resetPassword);

module.exports = router;
