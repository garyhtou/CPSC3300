-- use bw_db16;
-- drop tables if they exist
drop table if exists OrderItems;
drop table if exists Orders;
drop table if exists Stores;
drop table if exists Items;
drop table if exists Customers;
-- Create tables
CREATE TABLE Customers (
	id BIGINT UNSIGNED AUTO_INCREMENT,
	name TEXT NOT NULL,
	email VARCHAR(255) UNIQUE NOT NULL,
	phone VARCHAR(255) UNIQUE,
	PRIMARY KEY (ID)
);
CREATE TABLE Items (
	id BIGINT UNSIGNED AUTO_INCREMENT,
	name TEXT NOT NULL,
	price_cents BIGINT UNSIGNED NOT NULL,
	calories BIGINT UNSIGNED,
	PRIMARY KEY (ID)
);
CREATE TABLE Stores (
	id BIGINT UNSIGNED AUTO_INCREMENT,
	address_street TEXT NOT NULL,
	address_city TEXT NOT NULL,
	address_state TEXT NOT NULL,
	address_zip TEXT NOT NULL,
	address_country TEXT NOT NULL,
	PRIMARY KEY (ID)
);
CREATE TABLE Orders (
	id BIGINT UNSIGNED AUTO_INCREMENT,
	date DATETIME NOT NULL,
	customer_id BIGINT UNSIGNED NOT NULL,
	store_id BIGINT UNSIGNED NOT NULL,
	PRIMARY KEY (ID),
	FOREIGN KEY (Customer_id) REFERENCES Customers(id) ON UPDATE CASCADE ON DELETE CASCADE,
	FOREIGN KEY (store_id) REFERENCES Stores(id) ON UPDATE CASCADE ON DELETE CASCADE
);
CREATE TABLE OrderItems (
	order_id BIGINT UNSIGNED NOT NULL,
	item_id BIGINT UNSIGNED NOT NULL,
	FOREIGN KEY (Order_id) REFERENCES Orders(id) ON UPDATE CASCADE ON DELETE CASCADE,
	FOREIGN KEY (Item_id) REFERENCES Items(id) ON UPDATE CASCADE ON DELETE CASCADE
);
-- Insert tuples
INSERT INTO Customers (name, email, phone)
VALUES (
		"Sponge Bob",
		"sponge@pineapple.com",
		"+1 555 555 5555"
	),
	(
		"Patrick Star",
		"starfish@rock.com",
		"+1 123 456 7890"
	),
	("Squidward", "squid@stone.com", NULL),
	(
		"Mr. Krabs",
		"crab@anchor.com",
		"+1 306 555 1212"
	),
	("Sandy Cheeks", "squirrel@tree.com", NULL);
INSERT INTO Items (name, price_cents, calories)
VALUES ("Oreo McFlurry", 432, 690),
	("Big Mac", 779, 530),
	("McDouble", 353, 380),
	("Filet O Fish", 719, 390),
	("McChicken", 399, 360);
INSERT INTO Stores (
		address_street,
		address_city,
		address_state,
		address_zip,
		address_country
	)
VALUES ("1530 3rd Ave", "Seattle", "WA", "98101", "USA"),
	("222 5th Ave N", "Seattle", "WA", "98109", "USA"),
	(
		"2401 4th Ave S",
		"Seattle",
		"WA",
		"98134",
		"USA"
	),
	(
		"2336 25th Ave S",
		"Seattle",
		"WA",
		"98144",
		"USA"
	),
	(
		"3003 California Ave SW",
		"Seattle",
		"WA",
		"98116",
		"USA"
	);
INSERT INTO Orders (date, customer_id, store_id)
VALUES ("2022-01-02 02:53:44", 1, 4),
	("2022-01-02 10:47:30", 2, 3),
	("2022-01-03 12:35:17", 3, 1),
	("2022-01-03 19:36:33", 1, 2),
	("2022-01-04 3:09:41", 4, 1);
INSERT INTO OrderItems (order_id, item_id)
VALUES (1, 1),
	(2, 2),
	(3, 3),
	(4, 4),
	(5, 5);
-- Describe tables
DESC Customers;
DESC Items;
DESC Stores;
DESC Orders;
DESC OrderItems;
-- Project all data
SELECT *
FROM Customers;
SELECT *
FROM Items;
SELECT *
FROM Stores;
SELECT *
FROM Orders;
SELECT *
FROM OrderItems;