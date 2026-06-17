const express = require("express");
const router = express.Router();

const verifyToken = require("../middleware/authMiddleware");

const {
  submitRating,
  updateRating,
} = require("../controllers/ratingController");

router.post("/submit", verifyToken, submitRating);

router.put("/update", verifyToken, updateRating);

module.exports = router;