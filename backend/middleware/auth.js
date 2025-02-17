const jwt = require('jsonwebtoken');
const db = require('../config/database');

module.exports = async (req, res, next) => {
  try {
    // Get token from header
    const token = req.header('Authorization')?.replace('Bearer ', '');

    if (!token) {
      return res.status(401).json({ message: 'No authentication token, access denied' });
    }

    // Verify token
    const decoded = jwt.verify(token, process.env.JWT_SECRET || 'your-secret-key');

    // Get user from database
    const [users] = await db.query(
      'SELECT id, username, email FROM users WHERE id = ?',
      [decoded.id]
    );

    if (users.length === 0) {
      throw new Error();
    }

    req.user = users[0];
    next();
  } catch (error) {
    res.status(401).json({ message: 'Token is invalid' });
  }
};
