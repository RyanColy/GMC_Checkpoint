const pool = require("../config/mysql");

const createTable = async () => {
  await pool.query(`
    CREATE TABLE IF NOT EXISTS products (
      id       INT AUTO_INCREMENT PRIMARY KEY,
      name     VARCHAR(255) NOT NULL,
      price    DECIMAL(10,2) NOT NULL,
      category VARCHAR(255),
      inStock  BOOLEAN DEFAULT TRUE
    )
  `);
  console.log("MySQL table ready");
};

module.exports = createTable;
