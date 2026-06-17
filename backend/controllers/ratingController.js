const db = require("../config/db");

const submitRating = (req, res) => {
  const { store_id, rating } = req.body;

  const user_id = req.user.id;

  if (rating < 1 || rating > 5) {
    return res.status(400).json({
      message: "Rating must be between 1 and 5",
    });
  }

  db.query(
    "SELECT * FROM ratings WHERE user_id=? AND store_id=?",
    [user_id, store_id],
    (err, results) => {
      if (err) {
        return res.status(500).json(err);
      }

      if (results.length > 0) {
        return res.status(400).json({
          message: "You have already rated this store. Use Update Rating.",
        });
      }

      db.query(
        "INSERT INTO ratings(user_id,store_id,rating) VALUES(?,?,?)",
        [user_id, store_id, rating],
        (err, result) => {
          if (err) {
            return res.status(500).json(err);
          }

          res.status(201).json({
            message: "Rating Submitted Successfully",
          });
        }
      );
    }
  );
};

const updateRating = (req, res) => {
  const { store_id, rating } = req.body;

  const user_id = req.user.id;

  if (rating < 1 || rating > 5) {
  return res.status(400).json({
    message: "Rating must be between 1 and 5",
  });
}

  db.query(
    "UPDATE ratings SET rating=? WHERE user_id=? AND store_id=?",
    [rating, user_id, store_id],
    (err, result) => {
      if (err) {
        return res.status(500).json(err);
      }

      res.json({
        message: "Rating Updated Successfully",
      });
    }
  );
};

module.exports = {
  submitRating,
  updateRating,
};