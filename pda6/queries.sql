-- 1. List table names and their attributes.
DESC Customers;
DESC Items;
DESC Stores;
DESC Orders;
DESC OrderItems;


-- 2. List some data stored in tables (choose 2 tables).
SELECT *
FROM Customers
LIMIT 10;

SELECT *
FROM Items
LIMIT 10;

-- 3. Execute join queries and display the results.
SELECT o.*
FROM Orders o
INNER JOIN Customers c on o.customer_id = c.id
WHERE c.name LIKE ''
ORDER BY o.date DESC
LIMIT 5;


-- 4. Execute aggregation queries and display the results.
SELECT calories, COUNT(calories) as Count
FROM Items
WHERE id <= 100
GROUP BY calories
ORDER BY Count DESC;

SELECT AVG(calories)
FROM Items;

select calories, avg(calories) as Average
from Items
group by calories



SELECT calories, AVG(price_cents) as average_price_cents
FROM (
	SELECT ROUND(calories/100) * 100 as calories, price_cents
	FROM Items
) r
GROUP BY calories
ORDER BY average_price_cents DESC;


-- 5. Insert a new tuple into a table: the values of the tuple should be obtained by the user (Java keyboard input)
INSERT INTO Customers(name, email, phone)
VALUES ()



-- 6. Update a tuple’s value(s): the new value(s) of the tuple should be obtained by the user (Java Keyboard input)
-- Update the price of an Item
UPDATE Items
SET price_cents = 999
WHERE id = 16;

select *
from Items
where id = 5;


-- 7. Delete a particular tuple requested by the user.
DELETE FROM Customers
WHERE id = 1;


