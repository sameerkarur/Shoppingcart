const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');

// Get cart items
router.get('/', auth, async (req, res) => {
  try {
    // In a real application, you would fetch cart items from a database
    // For now, we'll use the cart from the session
    res.json(req.session.cart || []);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error fetching cart items' });
  }
});

// Add item to cart
router.post('/add', auth, async (req, res) => {
  try {
    const { itemId, quantity } = req.body;
    
    // Initialize cart if it doesn't exist
    if (!req.session.cart) {
      req.session.cart = [];
    }

    // Check if item already exists in cart
    const existingItem = req.session.cart.find(item => item.id === itemId);
    
    if (existingItem) {
      existingItem.quantity += quantity;
    } else {
      req.session.cart.push({ id: itemId, quantity });
    }

    res.json(req.session.cart);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error adding item to cart' });
  }
});

// Update cart item quantity
router.put('/update/:itemId', auth, async (req, res) => {
  try {
    const { itemId } = req.params;
    const { quantity } = req.body;

    if (!req.session.cart) {
      return res.status(404).json({ message: 'Cart not found' });
    }

    const item = req.session.cart.find(item => item.id === itemId);
    
    if (!item) {
      return res.status(404).json({ message: 'Item not found in cart' });
    }

    item.quantity = quantity;
    res.json(req.session.cart);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error updating cart item' });
  }
});

// Remove item from cart
router.delete('/remove/:itemId', auth, async (req, res) => {
  try {
    const { itemId } = req.params;

    if (!req.session.cart) {
      return res.status(404).json({ message: 'Cart not found' });
    }

    req.session.cart = req.session.cart.filter(item => item.id !== itemId);
    res.json(req.session.cart);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error removing item from cart' });
  }
});

// Clear cart
router.delete('/clear', auth, async (req, res) => {
  try {
    req.session.cart = [];
    res.json({ message: 'Cart cleared successfully' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error clearing cart' });
  }
});

module.exports = router;
