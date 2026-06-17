const express = require("express");
const router = express.Router();

const verifyToken = require("../middleware/authMiddleware");

const {
  registerUser,
  loginUser,
  changePassword,getProfile,
} = require("../controllers/authController");

router.post("/register", registerUser);
router.post("/login", loginUser);

router.put("/change-password", verifyToken, changePassword);

router.get(
  "/profile",
  verifyToken,
  getProfile
);

module.exports = router;