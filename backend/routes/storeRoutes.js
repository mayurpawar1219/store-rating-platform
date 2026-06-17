const express = require("express");
const router = express.Router();

const verifyToken = require("../middleware/authMiddleware");

const { getAllStores,getOwnerDashboard,getOwnerProfile } = require("../controllers/storeController");

router.get("/", verifyToken, getAllStores);

router.get(
  "/owner-dashboard",
  verifyToken,
  getOwnerDashboard
);


router.get(
  "/owner-profile",
  verifyToken,
  getOwnerProfile
);  

module.exports = router;