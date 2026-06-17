const express = require("express");
const router = express.Router();

const verifyToken = require("../middleware/authMiddleware");
const isAdmin = require("../middleware/adminMiddleware");

const {
  getDashboardStats,
  createStoreOwner,
  createStore,
  getAllUsers,getAllStores
} = require("../controllers/adminController");


router.get(
  "/users",
  verifyToken,
  isAdmin,
  getAllUsers
);

router.get("/dashboard", verifyToken, getDashboardStats);

router.post(
  "/create-owner",
  verifyToken,
  isAdmin,
  createStoreOwner
);

router.post(
  "/create-store",
  verifyToken,
  isAdmin,
  createStore
);

router.get(
  "/stores",
  verifyToken,
  isAdmin,
  getAllStores
); 
module.exports = router;