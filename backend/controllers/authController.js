const bcrypt = require("bcryptjs");
const db = require("../config/db");
const jwt = require("jsonwebtoken");

const changePassword = (req, res) => {
  const { oldPassword, newPassword } = req.body;

  const userId = req.user.id;

  db.query(
    "SELECT * FROM users WHERE id = ?",
    [userId],
    async (err, results) => {
      if (err) {
        return res.status(500).json(err);
      }

      if (results.length === 0) {
        return res.status(404).json({
          message: "User not found",
        });
      }

      const user = results[0];

      const isMatch = await bcrypt.compare(
        oldPassword,
        user.password
      );

      if (!isMatch) {
        return res.status(400).json({
          message: "Old password is incorrect",
        });
      }

      const hashedPassword = await bcrypt.hash(
        newPassword,
        10
      );

      db.query(
        "UPDATE users SET password=? WHERE id=?",
        [hashedPassword, userId],
        (err, result) => {
          if (err) {
            return res.status(500).json(err);
          }

          res.json({
            message: "Password Updated Successfully",
          });
        }
      );
    }
  );
};

const registerUser = async (req, res) => {
  try {
    const { name, email, password, address } = req.body;

    // Check existing user
    db.query(
      "SELECT * FROM users WHERE email = ?",
      [email],
      async (err, result) => {
        if (err) {
          return res.status(500).json(err);
        }

        if (result.length > 0) {
          return res.status(400).json({
            message: "Email already exists",
          });
        }

        // Hash password
        const hashedPassword = await bcrypt.hash(password, 10);

        db.query(
          "INSERT INTO users(name,email,password,address,role) VALUES(?,?,?,?,?)",
          [name, email, hashedPassword, address, "user"],
          (err, result) => {
            if (err) {
              return res.status(500).json(err);
            }

            res.status(201).json({
              message: "User Registered Successfully",
            });
          }
        );
      }
    );
  } catch (error) {
    res.status(500).json(error);
  }
};

const getProfile = (req, res) => {
  const userId = req.user.id;

  db.query(
    `
    SELECT
      id,
      name,
      email,
      address,
      role
    FROM users
    WHERE id=?
    `,
    [userId],
    (err, results) => {
      if (err) {
        return res.status(500).json(err);
      }

      res.json(results[0]);
    }
  );
};

const loginUser = (req, res) => {
  const { email, password } = req.body;

  db.query(
    "SELECT * FROM users WHERE email = ?",
    [email],
    async (err, result) => {
      if (err) {
        return res.status(500).json(err);
      }

      if (result.length === 0) {
        return res.status(404).json({
          message: "User not found",
        });
      }

      const user = result[0];

      const isMatch = await bcrypt.compare(
        password,
        user.password
      );

      if (!isMatch) {
        return res.status(400).json({
          message: "Invalid Password",
        });
      }

      const token = jwt.sign(
        {
          id: user.id,
          role: user.role,
        },
        process.env.JWT_SECRET,
        {
          expiresIn: "1d",
        }
      );

      res.status(200).json({
        message: "Login Successful",
        token,
        role: user.role,
      });
    }
  );
};

module.exports = {
  registerUser,
  loginUser,
  changePassword,
  getProfile,
};