CREATE DATABASE sameerdb;
use sameerdb;
CREATE TABLE items (
  item_name VARCHAR(50) PRIMARY KEY,
  price DECIMAL(8, 2),
  units INT
);

INSERT INTO items (item_name, price, units)
VALUES
  ('apple', 1.5, 10),
  ('banana', 0.5, 15),
  ('orange', 2.0, 8),
  ('grapes', 3.0, 5),
  ('oats', 1.99, 12),
  ('rice', 2.5, 20),
  ('biscuits', 4.99, 5),
  ('cereals', 7.5, 10),
  ('shampoo', 3.99, 15),
  ('face wash', 1.0, 2);
  
select * from items;

ALTER TABLE items ADD COLUMN serial_number INT AUTO_INCREMENT UNIQUE;

SET SQL_SAFE_UPDATES = 0;

SET @serial_number := 1;
UPDATE items SET serial_number = (@serial_number := @serial_number + 1);

ALTER TABLE items MODIFY COLUMN serial_number INT FIRST;

DELETE FROM items WHERE serial_number = 12;

update items set serial_number = 1 where serial_number = 20;

ALTER TABLE items
DROP CONSTRAINT ;

SELECT CONSTRAINT_NAME
FROM INFORMATION_SCHEMA.KEY_COLUMN_USAGE
WHERE TABLE_NAME = 'items'
  AND COLUMN_NAME = 'serial_number'
  AND CONSTRAINT_NAME LIKE 'unique%'


SELECT CONSTRAINT_NAME
FROM INFORMATION_SCHEMA.KEY_COLUMN_USAGE
WHERE TABLE_NAME = 'items'
  AND COLUMN_NAME = 'serial_number'
  AND CONSTRAINT_NAME LIKE 'SYS_%'
  
  SHOW CREATE TABLE items;
  
ALTER TABLE items
DROP COLUMN serial_number;

ALTER TABLE items
MODIFY COLUMN serial_number INT AUTO_INCREMENT;

ALTER TABLE items MODIFY COLUMN serial_number INT FIRST;

ALTER TABLE items DROP INDEX uk_serial_number

ALTER TABLE items ADD CONSTRAINT uk_serial_number UNIQUE (serial_number)

use sameerdb

INSERT INTO items (serial_number, item_name, price, units)
SELECT serial_number, UPPER(item_name), price, units
FROM items_backup
ON DUPLICATE KEY UPDATE
    price = CASE WHEN items_backup.price <> items.price THEN items_backup.price ELSE items.price END,
    units = CASE WHEN items_backup.units <> items.units THEN items_backup.units ELSE items.units END


CREATE TABLE items_backup AS SELECT * FROM items
CREATE TABLE items_backup_2 AS SELECT * FROM items_backup


select * from items;

select * from items_backup;

select * from items_backup_2;



