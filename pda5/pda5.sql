-- One query is just a simple select from one relation with a limit clause that
-- retrieves 5 or fewer tuples.

-- Find the information (id, name, eamil, and phone) of any five Customers who
-- have a 'f' in their name (case insenseitive).
SELECT * 
FROM Customers
WHERE UPPER(name) LIKE '%F%'
LIMIT 5;

-- One query must involve a join (involving two tables) with a limit clause that
-- retrieves 5 or fewer tuples.

-- Find name and email of five customers who most recently ordered from store
-- with id=1.
SELECT c.name, c.email
FROM Customers c
INNER JOIN Orders o on o.customer_id = c.id
WHERE o.store_id = 1
ORDER BY o.date DESC
LIMIT 5;

-- That query is the same as...
SELECT c.name, c.email
FROM Customers c, Orders o
WHERE o.customer_id = c.id AND o.store_id = 1
ORDER BY o.date DESC
LIMIT 5;


-- One query must involve a nested query (outer and inner query without joins) with
-- a limit clause that retrieves 5 or fewer tuples.

-- Find the information of five stores that have had orders placed by customers
-- with ids between 100 and 2000.
SELECT *
FROM Stores s
WHERE s.id IN (
	SELECT o.store_id
	FROM Orders o
	WHERE o.customer_id BETWEEN 100 AND 2000
)
LIMIT 5;


-- One query must involve a correlated nested query (outer and inner query without
-- joins) with a limit clause that retrieves 5 or fewer tuples.

-- Find the information of five Customers who have ordered from multiple stores.
SELECT *
FROM Customers c
WHERE EXISTS (
	SELECT *
	FROM Orders o1, Orders o2
	WHERE o1.customer_id = c.id AND o2.customer_id = c.id AND o1.store_id != o2.store_id
)
LIMIT 5;

-- One query must involve an aggregate function, a GROUP BY, and HAVING
-- clause. Use a limit clause that retrieves 5 more fewer tuples. 

-- Find the id and country of stores that have had at least 100 orders. Include
-- the number of orders and sort from most to least. Limit to 5 tuples.
SELECT s.id, s.address_country, count(*) as num_orders
FROM Stores s
INNER JOIN Orders o ON o.store_id = s.id
GROUP BY s.id
HAVING count(*) >= 5
ORDER BY num_orders
LIMIT 5;


-- =============================================================================
-- ----------------------------- PART B ----------------------------------------
-- =============================================================================


-- A simple insert. 
INSERT INTO Stores (address_street, address_city, address_state, address_zip, address_country)
VALUES ("1530 3rd Ave", "Seattle", "WA", "98101", "USA");

-- Changes the price of all items with calories less than 100 to 100 cents (a dollar).
UPDATE Items
SET price_cents = 100
WHERE calories <= 100;

-- A delete that deletes a tuple. 
DELETE FROM Orders
WHERE id = 1;


-- =============================================================================
-- ----------------------------- PART C ----------------------------------------
-- =============================================================================


-- Create a view (B) based on one relation (A). Show your 
-- CREATE VIEW statements and the response of the system. Also, show a query 
-- (select, from and where clauses) involving the view and the system response. 
-- Your query should retrieves 5 more fewer tuples.  

CREATE VIEW CustomersWithA
-- Selects customers who's name starts with a captial 'A'
AS SELECT DISTINCT Customers.id, Customers.name, Customers.email
   FROM Customers
   WHERE Customers.name LIKE "A%"
	 ORDER BY Customers.name;

SELECT ID, Name 
FROM CustomersWithA
WHERE ID > 500
LIMIT 5;

-- Write an insert statement (inserting a tuple to table A). Show both tuples in table 
-- A and tuples in view B before and after the execution of the insertion statement. 
-- The results should show changes (or no changes) in table A and view B.  
INSERT INTO Customers (name, email)
VALUES ("Aaliyah Rudy", "rudy@seattleu.edu");


-- =============================================================================
-- ----------------------------- PART D ----------------------------------------
-- =============================================================================
delimiter //
CREATE TRIGGER customerTrigger
BEFORE INSERT on Orders
FOR EACH ROW
	IF (NEW.customer_id NOT IN (SELECT id FROM Customers))
	THEN INSERT INTO Customers(id, name, email)
		VALUES (NEW.customer_id, "Unknown", "Unknown@example.com");
	END IF;
//
delimiter ;

SELECT *
FROM Customers
WHERE id = 10000;

INSERT INTO Orders (date, customer_id, store_id)
VALUES ('2022-01-02 10:47:30', 10000, 1);

