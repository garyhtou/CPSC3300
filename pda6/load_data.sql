use sys;

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
	id BIGINT UNSIGNED AUTO_INCREMENT,
	order_id BIGINT UNSIGNED NOT NULL,
	item_id BIGINT UNSIGNED NOT NULL,
	PRIMARY KEY (ID),
	FOREIGN KEY (Order_id) REFERENCES Orders(id) ON UPDATE CASCADE ON DELETE CASCADE,
	FOREIGN KEY (Item_id) REFERENCES Items(id) ON UPDATE CASCADE ON DELETE CASCADE
);

-- Load the Data
LOAD DATA local INFILE '/Users/cattle/OneDrive - Seattle University/WINTER2022/CPSC 3300/PDA/data/Customers.csv' 
INTO TABLE Customers
FIELDS TERMINATED BY ',' 
ENCLOSED BY '"'
LINES TERMINATED BY '\n'
IGNORE 1 ROWS
(id,name,@vphone,email)
set phone =  NULLIF(@vphone,'NULL');

LOAD DATA local INFILE '/Users/cattle/OneDrive - Seattle University/WINTER2022/CPSC 3300/PDA/data/Items.csv' 
INTO TABLE Items
FIELDS TERMINATED BY ',' 
ENCLOSED BY '"'
LINES TERMINATED BY '\n'
IGNORE 1 ROWS
(id,name,price_cents,@vcalories)
set calories =  NULLIF(@vcalories,'NULL');

LOAD DATA local INFILE '/Users/cattle/OneDrive - Seattle University/WINTER2022/CPSC 3300/PDA/data/Stores.csv' 
INTO TABLE Stores
FIELDS TERMINATED BY ',' 
ENCLOSED BY '"'
LINES TERMINATED BY '\n'
IGNORE 1 ROWS
(id,address_street,address_city,address_state,address_zip,address_country);

LOAD DATA local INFILE '/Users/cattle/OneDrive - Seattle University/WINTER2022/CPSC 3300/PDA/data/Orders.csv' 
INTO TABLE Orders
FIELDS TERMINATED BY ',' 
ENCLOSED BY '"'
LINES TERMINATED BY '\n'
IGNORE 1 ROWS
(id,date,customer_id,store_id);

LOAD DATA local INFILE '/Users/cattle/OneDrive - Seattle University/WINTER2022/CPSC 3300/PDA/data/OrderItems.csv' 
INTO TABLE OrderItems
FIELDS TERMINATED BY ',' 
ENCLOSED BY '"'
LINES TERMINATED BY '\n'
IGNORE 1 ROWS
(id,order_id,item_id);


-- Querying 
select count(*) as CustomersCount from Customers;
select * from Customers limit 20;

select count(*) as ItemsCount from Items;
select * from Items limit 20;

select count(*) as StoresCount from Stores;
select * from Stores limit 20;

select count(*) as OrdersCount from Orders;
select * from Orders limit 20;

select count(*) as OrderItemsCount from OrderItems;
select * from OrderItems limit 20;
