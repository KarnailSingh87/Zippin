-- ====================================================================
-- Blinkit DBMS Seed Data
-- ====================================================================

USE blinkit_db;

-- 1. Insert Stores (Dark Stores / Fulfillment Warehouses)
INSERT INTO store (store_name, store_code, city, area, pincode, contact_phone) VALUES
('Blinkit Dark Store #101 - Cyber Hub', 'STORE-GGN-101', 'Gurugram', 'DLF Cyber City', '122002', '0124-4112233'),
('Blinkit Dark Store #102 - Sector 56', 'STORE-GGN-102', 'Gurugram', 'Golf Course Road', '122011', '0124-4556677'),
('Blinkit Dark Store #103 - Saket', 'STORE-DEL-103', 'New Delhi', 'Saket District Centre', '110017', '011-26554433'),
('Blinkit Dark Store #104 - Indiranagar', 'STORE-BLR-104', 'Bengaluru', 'Indiranagar 100ft Road', '560038', '080-4998877'),
('Blinkit Dark Store #105 - Koramangala', 'STORE-BLR-105', 'Bengaluru', 'Koramangala 4th Block', '560034', '080-4112345');

-- 2. Insert Customers
INSERT INTO customer (first_name, last_name, phone, email, city, address) VALUES
('Harsh', 'Vardhan', '9876543210', 'harsh@example.com', 'Gurugram', 'Flat 402, DLF Phase 2, Gurugram'),
('Tanya', 'Sharma', '9811223344', 'tanya.sharma@example.com', 'Gurugram', 'Tower 3, Nirvana Country, Sector 50'),
('Rohit', 'Verma', '9988776655', 'rohit.v@example.com', 'New Delhi', 'B-12, Saket Residential Area, New Delhi'),
('Pooja', 'Nair', '9744332211', 'pooja.nair@example.com', 'Bengaluru', '12/4, 5th Cross, Indiranagar, Bengaluru'),
('Arjun', 'Mehta', '9655443322', 'arjun.mehta@example.com', 'Bengaluru', 'Plot 89, 7th Main, Koramangala, Bengaluru');

-- 3. Insert Delivery Partners
INSERT INTO delivery_partner (first_name, last_name, phone, city, status, vehicle_type, rating, total_deliveries, current_store_id) VALUES
('Ramesh', 'Yadav', '9876500001', 'Gurugram', 'available', 'Bike', 4.9, 342, 1),
('Suresh', 'Verma', '9876500002', 'Gurugram', 'busy', 'EV Scooter', 4.8, 512, 1),
('Vikas', 'Kumar', '9876500003', 'New Delhi', 'available', 'Bike', 4.7, 280, 3),
('Anil', 'Gowda', '9876500004', 'Bengaluru', 'available', 'Bike', 4.9, 420, 4),
('Deepak', 'Singh', '9876500005', 'Bengaluru', 'offline', 'EV Scooter', 4.6, 195, 5);

-- 4. Insert Products
INSERT INTO product (product_name, category, price, mrp, unit, store_id) VALUES
('Amul Taaza Toned Milk', 'Dairy, Bread & Eggs', 27.00, 27.00, '500 ml', 1),
('Fresh Hybrid Tomato', 'Vegetables & Fruits', 22.00, 30.00, '500 g', 1),
('Farm Fresh Potato (Aloo)', 'Vegetables & Fruits', 25.00, 35.00, '1 kg', 1),
('Amul Salted Butter', 'Dairy, Bread & Eggs', 58.00, 60.00, '100 g', 1),
('Harvest Gold White Bread', 'Dairy, Bread & Eggs', 30.00, 30.00, '400 g', 1),
('Lay\'s India\'s Magic Masala Chips', 'Munchies & Chips', 20.00, 20.00, '50 g', 1),
('Coca-Cola Soft Drink', 'Cold Drinks & Juices', 40.00, 40.00, '750 ml', 1),
('Maggi 2-Minute Instant Noodles', 'Instant & Frozen Food', 14.00, 14.00, '70 g', 1),
('Fortune Sunlite Sunflower Oil', 'Atta, Rice & Dal', 165.00, 190.00, '1 L', 1),
('Aashirvaad Shudh Chakki Atta', 'Atta, Rice & Dal', 245.00, 280.00, '5 kg', 1);

-- 5. Insert Inventory
INSERT INTO inventory (store_id, product_id, stock_quantity, low_stock_threshold) VALUES
(1, 1, 150, 20),
(1, 2, 85, 15),
(1, 3, 90, 15),
(1, 4, 60, 10),
(1, 5, 45, 10),
(1, 6, 200, 25),
(1, 7, 120, 20),
(1, 8, 300, 30),
(1, 9, 40, 10),
(1, 10, 35, 10);

-- 6. Insert Sample Customer Orders
INSERT INTO customer_order (order_id, customer_id, store_id, partner_id, order_datetime, subtotal, delivery_fee, total_amount, order_status, delivery_address) VALUES
(1001, 1, 1, 1, DATE_SUB(NOW(), INTERVAL 25 MINUTE), 142.00, 25.00, 167.00, 'delivered', 'Flat 402, DLF Phase 2, Gurugram'),
(1002, 2, 1, 2, DATE_SUB(NOW(), INTERVAL 8 MINUTE), 285.00, 0.00, 285.00, 'out_for_delivery', 'Tower 3, Nirvana Country, Sector 50'),
(1003, 3, 3, 3, DATE_SUB(NOW(), INTERVAL 2 MINUTE), 410.00, 0.00, 410.00, 'picking', 'B-12, Saket Residential Area, New Delhi');

-- 7. Insert Order Items
INSERT INTO order_item (order_id, product_id, quantity, unit_price) VALUES
(1001, 1, 2, 27.00), -- 2x Milk = 54
(1001, 4, 1, 58.00), -- 1x Butter = 58
(1001, 5, 1, 30.00), -- 1x Bread = 30 (Subtotal = 142)

(1002, 2, 1, 22.00),
(1002, 3, 1, 25.00),
(1002, 7, 2, 40.00),
(1002, 8, 4, 14.00),
(1002, 9, 1, 165.00), -- (Subtotal = 285)

(1003, 10, 1, 245.00),
(1003, 9, 1, 165.00); -- (Subtotal = 410)

-- 8. Insert Payments
INSERT INTO payment (order_id, payment_method, payment_status, transaction_id, amount, paid_at) VALUES
(1001, 'upi', 'completed', 'TXN_UPI_9988112233', 167.00, DATE_SUB(NOW(), INTERVAL 24 MINUTE)),
(1002, 'cod', 'pending', 'TXN_COD_1002', 285.00, NULL),
(1003, 'card', 'completed', 'TXN_CARD_45327711', 410.00, DATE_SUB(NOW(), INTERVAL 2 MINUTE));

-- 9. Insert Deliveries
INSERT INTO delivery (order_id, partner_id, store_id, delivery_status, assigned_at, picked_up_at, delivered_at, estimated_minutes) VALUES
(1001, 1, 1, 'delivered', DATE_SUB(NOW(), INTERVAL 23 MINUTE), DATE_SUB(NOW(), INTERVAL 18 MINUTE), DATE_SUB(NOW(), INTERVAL 5 MINUTE), 10),
(1002, 2, 1, 'out_for_delivery', DATE_SUB(NOW(), INTERVAL 7 MINUTE), DATE_SUB(NOW(), INTERVAL 4 MINUTE), NULL, 10),
(1003, 3, 3, 'picking', DATE_SUB(NOW(), INTERVAL 1 MINUTE), NULL, NULL, 10);
