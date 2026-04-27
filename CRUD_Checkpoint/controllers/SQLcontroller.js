const pool = require("../config/mysql");

const createProduct = async (req, res) => {
  try {
    const { name, price, category, inStock } = req.body;
    if (!name || price === undefined) {
      return res.status(400).json({ message: "name and price are required" });
    }
    const [result] = await pool.query(
      "INSERT INTO products (name, price, category, inStock) VALUES (?, ?, ?, ?)",
      [name, price, category ?? null, inStock ?? true]
    );
    const [rows] = await pool.query("SELECT * FROM products WHERE id = ?", [result.insertId]);
    res.status(201).json(rows[0]);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

const getAllProducts = async (req, res) => {
  try {
    const [rows] = await pool.query("SELECT * FROM products");
    res.json(rows);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

const getProductById = async (req, res) => {
  try {
    const [rows] = await pool.query("SELECT * FROM products WHERE id = ?", [req.params.id]);
    if (!rows.length) return res.status(404).json({ message: "Product not found" });
    res.json(rows[0]);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

const updateProduct = async (req, res) => {
  try {
    const { name, price, category, inStock } = req.body;
    if (!name || price === undefined) {
      return res.status(400).json({ message: "name and price are required" });
    }
    const [result] = await pool.query(
      "UPDATE products SET name = ?, price = ?, category = ?, inStock = ? WHERE id = ?",
      [name, price, category ?? null, inStock ?? true, req.params.id]
    );
    if (!result.affectedRows) return res.status(404).json({ message: "Product not found" });
    const [rows] = await pool.query("SELECT * FROM products WHERE id = ?", [req.params.id]);
    res.json(rows[0]);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

const deleteProduct = async (req, res) => {
  try {
    const [result] = await pool.query("DELETE FROM products WHERE id = ?", [req.params.id]);
    if (!result.affectedRows) return res.status(404).json({ message: "Product not found" });
    res.json({ message: "Product deleted" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

module.exports = { createProduct, getAllProducts, getProductById, updateProduct, deleteProduct };
