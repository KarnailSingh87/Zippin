-- ====================================================================
-- Zippin Instant Grocery Delivery Platform - Database Schema (DBMS)
-- Inspired by and compatible with: Tanya534580/Zippin-Database-Design-ER-Model
-- Dialect: MySQL 8.0+ / MariaDB / Relational ANSI SQL
-- ====================================================================

CREATE DATABASE IF NOT EXISTS zippin_db;
USE zippin_db;

-- --------------------------------------------------------------------
-- 1. Table: customer
-- Stores user/customer profiles and geographic delivery cities
-- --------------------------------------------------------------------
DROP TABLE IF EXISTS payment;
DROP TABLE IF EXISTS delivery;
DROP TABLE IF EXISTS order_item;
DROP TABLE IF EXISTS customer_order;
DROP TABLE IF EXISTS inventory;
DROP TABLE IF EXISTS product;
DROP TABLE IF EXISTS delivery_partner;
DROP TABLE IF EXISTS store;
DROP TABLE IF EXISTS customer;

CREATE TABLE customer (
    customer_id INT PRIMARY KEY AUTO_INCREMENT,
    first_name VARCHAR(50) NOT NULL,
    last_name VARCHAR(50) DEFAULT '',
    phone CHAR(10) NOT NULL UNIQUE,
    email VARCHAR(100) NOT NULL UNIQUE,
    city VARCHAR(50) NOT NULL,
    address TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- --------------------------------------------------------------------
-- 2. Table: store (Dark Stores / Mini Warehouses)
-- Represents hyperlocal fulfillment hubs located across Indian cities
-- --------------------------------------------------------------------
CREATE TABLE store (
    store_id INT PRIMARY KEY AUTO_INCREMENT,
    store_name VARCHAR(100) NOT NULL,
    store_code VARCHAR(30) NOT NULL UNIQUE,
    city VARCHAR(50) NOT NULL,
    area VARCHAR(100) NOT NULL,
    pincode CHAR(6),
    contact_phone VARCHAR(15),
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- --------------------------------------------------------------------
-- 3. Table: delivery_partner (Riders / Fleet)
-- Manages delivery riders, live availability status, and cities
-- --------------------------------------------------------------------
CREATE TABLE delivery_partner (
    partner_id INT PRIMARY KEY AUTO_INCREMENT,
    first_name VARCHAR(50) NOT NULL,
    last_name VARCHAR(50) DEFAULT '',
    phone CHAR(10) NOT NULL UNIQUE,
    city VARCHAR(50) NOT NULL,
    status ENUM('available', 'busy', 'offline') DEFAULT 'available',
    vehicle_type VARCHAR(30) DEFAULT 'Bike',
    rating DECIMAL(2,1) DEFAULT 4.8,
    total_deliveries INT DEFAULT 0,
    current_store_id INT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (current_store_id) REFERENCES store(store_id) ON DELETE SET NULL
);

-- --------------------------------------------------------------------
-- 4. Table: product
-- Catalog items with pricing, category, unit, and default fulfillment store
-- --------------------------------------------------------------------
CREATE TABLE product (
    product_id INT PRIMARY KEY AUTO_INCREMENT,
    product_name VARCHAR(150) NOT NULL,
    category VARCHAR(100) NOT NULL,
    price DECIMAL(10,2) NOT NULL,
    mrp DECIMAL(10,2) NOT NULL,
    unit VARCHAR(30) DEFAULT '1 unit',
    store_id INT NOT NULL,
    is_available BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (store_id) REFERENCES store(store_id) ON DELETE CASCADE
);

-- --------------------------------------------------------------------
-- 5. Table: customer_order
-- Core order header linking customer, fulfillment store, and rider
-- --------------------------------------------------------------------
CREATE TABLE customer_order (
    order_id INT PRIMARY KEY AUTO_INCREMENT,
    customer_id INT NOT NULL,
    store_id INT NOT NULL,
    partner_id INT NULL,
    order_datetime DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    subtotal DECIMAL(10,2) NOT NULL DEFAULT 0.00,
    delivery_fee DECIMAL(10,2) NOT NULL DEFAULT 0.00,
    total_amount DECIMAL(10,2) NOT NULL,
    order_status ENUM('placed', 'confirmed', 'picking', 'out_for_delivery', 'delivered', 'cancelled') DEFAULT 'placed',
    delivery_address TEXT,
    FOREIGN KEY (customer_id) REFERENCES customer(customer_id) ON DELETE CASCADE,
    FOREIGN KEY (store_id) REFERENCES store(store_id) ON DELETE RESTRICT,
    FOREIGN KEY (partner_id) REFERENCES delivery_partner(partner_id) ON DELETE SET NULL
);

-- --------------------------------------------------------------------
-- 6. Table: order_item
-- Line items for each customer order mapping to products & quantities
-- --------------------------------------------------------------------
CREATE TABLE order_item (
    order_item_id INT PRIMARY KEY AUTO_INCREMENT,
    order_id INT NOT NULL,
    product_id INT NOT NULL,
    quantity INT NOT NULL DEFAULT 1,
    unit_price DECIMAL(10,2) NOT NULL,
    FOREIGN KEY (order_id) REFERENCES customer_order(order_id) ON DELETE CASCADE,
    FOREIGN KEY (product_id) REFERENCES product(product_id) ON DELETE RESTRICT
);

-- --------------------------------------------------------------------
-- 7. Table: payment
-- Financial settlement record linked to the order
-- --------------------------------------------------------------------
CREATE TABLE payment (
    payment_id INT PRIMARY KEY AUTO_INCREMENT,
    order_id INT NOT NULL UNIQUE,
    payment_method ENUM('cod', 'upi', 'card', 'netbanking', 'wallet') DEFAULT 'cod',
    payment_status ENUM('pending', 'completed', 'failed', 'refunded') DEFAULT 'pending',
    transaction_id VARCHAR(100),
    amount DECIMAL(10,2) NOT NULL,
    paid_at DATETIME NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (order_id) REFERENCES customer_order(order_id) ON DELETE CASCADE
);

-- --------------------------------------------------------------------
-- 8. Table: inventory (Dark Store Stock Management)
-- Tracks quantity on hand per product inside each dark store warehouse
-- --------------------------------------------------------------------
CREATE TABLE inventory (
    inventory_id INT PRIMARY KEY AUTO_INCREMENT,
    store_id INT NOT NULL,
    product_id INT NOT NULL,
    stock_quantity INT NOT NULL DEFAULT 0,
    low_stock_threshold INT NOT NULL DEFAULT 10,
    last_restocked DATETIME DEFAULT CURRENT_TIMESTAMP,
    UNIQUE KEY uk_store_product (store_id, product_id),
    FOREIGN KEY (store_id) REFERENCES store(store_id) ON DELETE CASCADE,
    FOREIGN KEY (product_id) REFERENCES product(product_id) ON DELETE CASCADE
);

-- --------------------------------------------------------------------
-- 9. Table: delivery (Real-Time Dispatch & Tracking)
-- Tracks the 10-minute instant delivery workflow from dispatch to drop-off
-- --------------------------------------------------------------------
CREATE TABLE delivery (
    delivery_id INT PRIMARY KEY AUTO_INCREMENT,
    order_id INT NOT NULL UNIQUE,
    partner_id INT NULL,
    store_id INT NOT NULL,
    delivery_status ENUM('pending_assignment', 'assigned', 'picking', 'out_for_delivery', 'delivered', 'failed', 'cancelled') DEFAULT 'pending_assignment',
    assigned_at DATETIME NULL,
    picked_up_at DATETIME NULL,
    delivered_at DATETIME NULL,
    estimated_minutes INT DEFAULT 10,
    delivery_notes VARCHAR(255),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (order_id) REFERENCES customer_order(order_id) ON DELETE CASCADE,
    FOREIGN KEY (partner_id) REFERENCES delivery_partner(partner_id) ON DELETE SET NULL,
    FOREIGN KEY (store_id) REFERENCES store(store_id) ON DELETE RESTRICT
);

-- Indexes for ultra-fast query performance
CREATE INDEX idx_order_customer ON customer_order(customer_id);
CREATE INDEX idx_order_store ON customer_order(store_id);
CREATE INDEX idx_order_partner ON customer_order(partner_id);
CREATE INDEX idx_product_store ON product(store_id);
CREATE INDEX idx_product_category ON product(category);
CREATE INDEX idx_inventory_low_stock ON inventory(stock_quantity);
CREATE INDEX idx_partner_city_status ON delivery_partner(city, status);
