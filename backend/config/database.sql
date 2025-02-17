-- Existing items table with modifications
ALTER TABLE items
ADD COLUMN category_id INT,
ADD COLUMN description TEXT,
ADD COLUMN image_url VARCHAR(255);

-- Create users table
CREATE TABLE users (
  id INT PRIMARY KEY AUTO_INCREMENT,
  username VARCHAR(50) UNIQUE NOT NULL,
  email VARCHAR(100) UNIQUE NOT NULL,
  password VARCHAR(255) NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Create categories table
CREATE TABLE categories (
  id INT PRIMARY KEY AUTO_INCREMENT,
  name VARCHAR(50) NOT NULL,
  description TEXT
);

-- Create orders table
CREATE TABLE orders (
  id INT PRIMARY KEY AUTO_INCREMENT,
  user_id INT NOT NULL,
  total_amount DECIMAL(10, 2) NOT NULL,
  status ENUM('pending', 'processing', 'shipped', 'delivered') DEFAULT 'pending',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (user_id) REFERENCES users(id)
);

-- Create order_items table
CREATE TABLE order_items (
  id INT PRIMARY KEY AUTO_INCREMENT,
  order_id INT NOT NULL,
  item_name VARCHAR(50) NOT NULL,
  quantity INT NOT NULL,
  price DECIMAL(8, 2) NOT NULL,
  FOREIGN KEY (order_id) REFERENCES orders(id),
  FOREIGN KEY (item_name) REFERENCES items(item_name)
);

-- Add sample categories
INSERT INTO categories (name, description) VALUES
  ('Fruits', 'Fresh fruits from local farms'),
  ('Grains', 'Healthy grains and cereals'),
  ('Personal Care', 'Personal care and hygiene products');

-- Update existing items with categories
UPDATE items SET 
  category_id = 1 WHERE item_name IN ('apple', 'banana', 'orange', 'grapes');
UPDATE items SET 
  category_id = 2 WHERE item_name IN ('oats', 'rice', 'biscuits', 'cereals');
UPDATE items SET 
  category_id = 3 WHERE item_name IN ('shampoo', 'face wash');
