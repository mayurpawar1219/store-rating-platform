require("dotenv").config();
const express = require("express");
const cors = require("cors");
const db = require("./config/db");

const app = express();

const userRoutes = require("./routes/userRoutes");
const authRoutes = require("./routes/authRoutes");
const adminRoutes = require("./routes/adminRoutes");
const ratingRoutes = require("./routes/ratingRoutes");
const storeRoutes = require("./routes/storeRoutes");

app.use(cors());
app.use(express.json());

app.get("/", (req, res) => {
  res.send("Store Rating API Running...");
});

const PORT = process.env.PORT || 5000;

app.use("/api/auth", authRoutes);
app.use("/api/user", userRoutes);
app.use("/api/admin", adminRoutes);
app.use("/api/ratings",ratingRoutes);
app.use("/api/stores", storeRoutes);

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});