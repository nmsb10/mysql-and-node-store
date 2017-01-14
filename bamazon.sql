
CREATE database Bamazon;

USE Bamazon;

CREATE TABLE products (
  item_id INT(9) AUTO_INCREMENT NOT NULL,
  product_name VARCHAR(100) NOT NULL,
  department_name VARCHAR(100) NOT NULL,
  price DECIMAL(10,2) NOT NULL,
  stock_quantity INT(10) NOT NULL,
  PRIMARY KEY (item_id)
);
  
SELECT * FROM products;

INSERT INTO products(product_name, department_name, price, stock_quantity)
VALUES ('rock', 'pets', 5.95, 15),
('pomegranate', 'fruits', 1.99, 10),
('kiwi', 'fruits', 0.75, 25),
('broccoli', 'vegetables', 2.99, 12),
('cashmere sweater', 'clothing', 79.80, 5),
('roasted chicken', 'grocery', 5.99, 8),
('shrimp tacos', 'grocery', 2.50, 2),
('neeke socks', 'clothing', 9.99, 21),
('white cotton dress shirt', 'clothing', 112.50, 6),
('ginger root', 'vegetables', 1.59, 8),
('custom suit made for you in Italy', 'experiences', 32500, 2),
('your life purpose explained to you by a professional', 'experiences', 80000, 5);

-- =====================================

CREATE TABLE departments (
  department_id INT(9) AUTO_INCREMENT NOT NULL,
  department_name VARCHAR(100) NOT NULL,
  over_head_costs INT(10) NOT NULL default 0,
  total_sales DECIMAL(12,2) NOT NULL default 0.00,
  PRIMARY KEY (department_id)
);

ALTER TABLE products ADD product_sales DECIMAL(12,2) default 0.00;

INSERT INTO departments(department_name, over_head_costs) VALUES
('artwork', 7000),
('booze', 10000),
('clothing', 5000),
('electronics',35000),
('experiences',50000),
('fruits',3500),
('garden',7800),
('grocery', 13800),
('office supplies', 2500),
('pets', 8000),
('vegetables', 3500);