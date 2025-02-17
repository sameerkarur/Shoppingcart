const express = require('express');
const router = express.Router();
const mysql = require('mysql2/promise');
const db = require('../config/database');

// Get all products
router.get('/', async (req, res) => {
  try {
    const [products] = await db.query(
      'SELECT i.*, c.name as category_name FROM items i LEFT JOIN categories c ON i.category_id = c.id'
    );
    res.json(products);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error fetching products' });
  }
});

// Get product by ID
router.get('/:id', async (req, res) => {
  try {
    const [product] = await db.query(
      'SELECT i.*, c.name as category_name FROM items i LEFT JOIN categories c ON i.category_id = c.id WHERE i.serial_number = ?',
      [req.params.id]
    );
    
    if (product.length === 0) {
      return res.status(404).json({ message: 'Product not found' });
    }
    
    res.json(product[0]);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error fetching product' });
  }
});

// Get products by category
router.get('/category/:categoryId', async (req, res) => {
  try {
    const [products] = await db.query(
      'SELECT i.*, c.name as category_name FROM items i LEFT JOIN categories c ON i.category_id = c.id WHERE i.category_id = ?',
      [req.params.categoryId]
    );
    res.json(products);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error fetching products by category' });
  }
});

// Search products
router.get('/search/:query', async (req, res) => {
  try {
    const searchQuery = `%${req.params.query}%`;
    const [products] = await db.query(
      'SELECT i.*, c.name as category_name FROM items i LEFT JOIN categories c ON i.category_id = c.id WHERE i.item_name LIKE ?',
      [searchQuery]
    );
    res.json(products);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error searching products' });
  }
});

module.exports = router;
