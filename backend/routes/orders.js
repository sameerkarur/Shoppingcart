const express = require('express');
const router = express.Router();
const db = require('../config/database');
const auth = require('../middleware/auth');

// Create new order
router.post('/', auth, async (req, res) => {
  try {
    const { items, totalAmount } = req.body;
    const userId = req.user.id;

    // Start transaction
    await db.beginTransaction();

    try {
      // Create order
      const [orderResult] = await db.query(
        'INSERT INTO orders (user_id, total_amount) VALUES (?, ?)',
        [userId, totalAmount]
      );

      const orderId = orderResult.insertId;

      // Create order items
      for (const item of items) {
        await db.query(
          'INSERT INTO order_items (order_id, item_name, quantity, price) VALUES (?, ?, ?, ?)',
          [orderId, item.name, item.quantity, item.price]
        );

        // Update inventory
        await db.query(
          'UPDATE items SET units = units - ? WHERE item_name = ?',
          [item.quantity, item.name]
        );
      }

      // Commit transaction
      await db.commit();

      res.status(201).json({
        message: 'Order created successfully',
        orderId,
      });
    } catch (error) {
      // Rollback transaction on error
      await db.rollback();
      throw error;
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error creating order' });
  }
});

// Get user's orders
router.get('/', auth, async (req, res) => {
  try {
    const [orders] = await db.query(
      `SELECT o.*, 
        JSON_ARRAYAGG(
          JSON_OBJECT(
            'item_name', oi.item_name,
            'quantity', oi.quantity,
            'price', oi.price
          )
        ) as items
      FROM orders o
      LEFT JOIN order_items oi ON o.id = oi.order_id
      WHERE o.user_id = ?
      GROUP BY o.id
      ORDER BY o.created_at DESC`,
      [req.user.id]
    );

    res.json(orders);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error fetching orders' });
  }
});

// Get order by ID
router.get('/:id', auth, async (req, res) => {
  try {
    const [orders] = await db.query(
      `SELECT o.*, 
        JSON_ARRAYAGG(
          JSON_OBJECT(
            'item_name', oi.item_name,
            'quantity', oi.quantity,
            'price', oi.price
          )
        ) as items
      FROM orders o
      LEFT JOIN order_items oi ON o.id = oi.order_id
      WHERE o.id = ? AND o.user_id = ?
      GROUP BY o.id`,
      [req.params.id, req.user.id]
    );

    if (orders.length === 0) {
      return res.status(404).json({ message: 'Order not found' });
    }

    res.json(orders[0]);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error fetching order' });
  }
});

module.exports = router;
