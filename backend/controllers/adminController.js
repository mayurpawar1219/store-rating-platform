const db = require("../config/db");

const getDashboardStats = (req, res) => {
  db.query("SELECT COUNT(*) AS totalUsers FROM users", (err, users) => {
    if (err) return res.status(500).json(err);

    db.query(
      "SELECT COUNT(*) AS totalStores FROM stores",
      (err, stores) => {
        if (err) return res.status(500).json(err);

        db.query(
          "SELECT COUNT(*) AS totalRatings FROM ratings",
          (err, ratings) => {
            if (err) return res.status(500).json(err);

            res.json({
              totalUsers: users[0].totalUsers,
              totalStores: stores[0].totalStores,
              totalRatings: ratings[0].totalRatings,
            });
          }
        );
      }
    );
  });
};

const bcrypt = require("bcryptjs");

const createStoreOwner = async (req, res) => {
  try {
    const { name, email, password, address } = req.body;

    const hashedPassword = await bcrypt.hash(password, 10);

    db.query(
      "INSERT INTO users(name,email,password,address,role) VALUES(?,?,?,?,?)",
      [name, email, hashedPassword, address, "owner"],
      (err, result) => {
        if (err) {
          return res.status(500).json(err);
        }

        res.status(201).json({
          message: "Store Owner Created Successfully",
        });
      }
    );
  } catch (error) {
    res.status(500).json(error);
  }
};

const createStore = (req, res) => {
  const { name, email, address, owner_id } = req.body;

  db.query(
    "INSERT INTO stores(name,email,address,owner_id) VALUES(?,?,?,?)",
    [name, email, address, owner_id],
    (err, result) => {
      if (err) {
        return res.status(500).json(err);
      }

      res.status(201).json({
        message: "Store Created Successfully",
      });
    }
  );
};

const getAllUsers = (req, res) => {
  db.query(
    `
    SELECT
      id,
      name,
      email,
      address,
      role,
      created_at
    FROM users
    ORDER BY id DESC
    `,
    (err, results) => {
      if (err) {
        return res.status(500).json(err);
      }

      res.json(results);
    }
  );
};


const getAllStores = (req, res) => {
  db.query(
    `
    SELECT
      s.id,
      s.name,
      s.email,
      s.address,
      u.name AS owner_name
    FROM stores s
    LEFT JOIN users u
    ON s.owner_id = u.id
    ORDER BY s.id DESC
    `,
    (err, results) => {
      if (err) {
        return res.status(500).json(err);
      }

      res.json(results);
    }
  );
};

module.exports = {
  getDashboardStats,
  createStoreOwner,
  createStore,
  getAllUsers,
  getAllStores,
};