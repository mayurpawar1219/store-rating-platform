const db = require("../config/db");



const getOwnerProfile = (req, res) => {
  const ownerId = req.user.id;

  db.query(
    `
    SELECT
      s.name AS store_name,
      s.email,
      s.address,
      IFNULL(ROUND(AVG(r.rating),1),0) AS average_rating
    FROM stores s
    LEFT JOIN ratings r
    ON s.id = r.store_id
    WHERE s.owner_id=?
    GROUP BY s.id
    `,
    [ownerId],
    (err, results) => {
      if (err) {
        return res.status(500).json(err);
      }

      res.json(results[0]);
    }
  );
};

const getAllStores = (req, res) => {
  const { search } = req.query;

  let query = `
  SELECT
    s.id,
    s.name,
    s.email,
    s.address,
    IFNULL(ROUND(AVG(r.rating),1),0) AS average_rating
  FROM stores s
  LEFT JOIN ratings r
  ON s.id = r.store_id
  `;

  let values = [];

  if (search) {
    query += `
    WHERE s.name LIKE ? OR s.address LIKE ?
    `;

    values.push(`%${search}%`, `%${search}%`);
  }

  query += ` GROUP BY s.id`;

  db.query(query, values, (err, results) => {
    if (err) {
      return res.status(500).json(err);
    }

    res.json(results);
  });
};

const getOwnerDashboard = (req, res) => {
  const owner_id = req.user.id;

  const query = `
  SELECT
    s.name AS store_name,
    ROUND(AVG(r.rating),1) AS average_rating,
    u.name AS user_name,
    r.rating
  FROM stores s
  LEFT JOIN ratings r ON s.id = r.store_id
  LEFT JOIN users u ON r.user_id = u.id
  WHERE s.owner_id = ?
  GROUP BY s.id, u.id, r.rating
  `;

  db.query(query, [owner_id], (err, results) => {
    if (err) {
      return res.status(500).json(err);
    }

    res.json(results);
  });
};

module.exports = {
  getAllStores,
  getOwnerDashboard,
  getOwnerProfile,
};