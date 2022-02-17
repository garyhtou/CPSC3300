"""
Generate CSV files for PDA 4.
Author: Gary Tou <gary@garytou.com> (https://garytou.com)

The following relations (tables) are generated:
- Customer
- Item
- Store
- Order
- OrderItem
"""

import sys
import os
import random
from faker import Faker
import csv

generate = Faker()
NULL = "NULL"
# Current path for file
dir_path = os.path.dirname(os.path.realpath(__file__))

"""
Helper function to wrap in quotes
"""
def wrapStr(s): return "\"" + str(s) + "\""


class McDonaldsMenu:
    """
    Used to access the McDonalds menu item data set. `menu.csv` must be
    present in the same directory as this file.
    """

    def __init__(self):
        self.products = []

        # Attempt to load data from file
        first = True
        try:
            with open(f"{dir_path}/menu.csv") as file:
                rows = csv.reader(file)
                for row in rows:
                    if first:
                        # Don't process the CSV header (first line)
                        first = False
                        continue

                    name = row[1]
                    calories = row[3]

                    # Remove non-ascii characters
                    name = name.encode("ascii", "ignore").decode("ascii")

                    self.products.append((name, calories))

        except FileNotFoundError:
            print("No menu file found, please place `menu.csv` from"
                  "https://www.kaggle.com/mcdonalds/nutrition-facts in the same"
                  "directory as this python script.")
            exit(1)

    def randItem(self):
        """
        Return a random unique menu item. If all menu items have been used, it
        will return None.

        Returns:
            (string, int) | None: Name and calories of the current menu item
        """
        # Return none if we've run out of items
        if len(self.products) == 0:
            return None

        # Get and remove a random item from the list of products
        return self.products.pop(random.randint(0, len(self.products) - 1))


# An instance of the McDonalds menu
menu = McDonaldsMenu()

# List of used phone numbers by `randPhoneE164`
usedPhones = []


def randPhoneE164():
    """
    Generate a random phone number in E.164 format.
    """
    def series(size): return "".join(
        [str(random.randint(0, 9)) for _ in range(size)])

    if len(usedPhones) == 10_000_000_000 - 1_000:
        # No more permutations left (1000 buffer)
        usedPhones.clear()

    # Find a random unused (unique) phone number
    while True:
        phone = "+1 " + " ".join([series(3), series(3), series(4)])
        if phone not in usedPhones:
            usedPhones.append(phone)
            return phone


class Relation(object):
    """
    Base class for all relations
    """
    id = 0  # Current id (autoincrement)
    config = {}
    associations = []
    ID_ATTRIBUTE = 'id'

    def __init__(self, associations=[]):
        # Set up dictionary to hold the attribute values
        self.attributes = {}
        self.associations = associations

        # Autoincrement id
        type(self).id += 1
        self.attributes[type(self).ID_ATTRIBUTE] = type(self).id

        # Generate and set attributes
        for attribute, generate in type(self).config.items():
            self.attributes[attribute] = generate()

        # Link associations (foreign keys)
        for relation in associations:
            attributeName = relation.fkAttributeName()
            relationId = relation.attributes[type(relation).ID_ATTRIBUTE]
            self.attributes[attributeName] = relationId

        # Nullify missing associations
        for relation in type(self).associations:
            attributeName = relation.fkAttributeName()
            if attributeName not in self.attributes:
                self.attributes[attributeName] = NULL

    def __str__(self):
        # Get attribute values and join with commas
        return ','.join([str(attribute) for attribute in self.attributes.values()])

    @classmethod
    def header(cls):
        """
        Returns the CSV header for the relation

        Returns:
            string: CSV header for the relation
        """
        # Get attribute names (add id)
        attributes = [cls.ID_ATTRIBUTE]+list(cls.config.keys())
        # Get foreign key attribute names
        relations = [relation.fkAttributeName()
                     for relation in cls.associations]
        # Join with commas
        return ','.join(attributes + relations)

    @classmethod
    def fkAttributeName(cls):
        """
        Return the column attribute name for when this relation is referenced as
        a foreign key.
        This assumes that the foreign key column name will be in the format of
        "{relation name}_id". e.g. "customer_id".

        Returns:
            string: column attribute name
        """
        return f'{cls.__name__.lower()}_{cls.ID_ATTRIBUTE}'


class Customer(Relation):
    config = {
        "name": lambda: wrapStr(generate.unique.name()),
        "phone": lambda: wrapStr(random.choices(
            [randPhoneE164(), NULL],
            weights=[90, 10]  # 10% chance of NULL
        )[0]),
        "email": lambda: wrapStr(generate.unique.email()),
    }


class Item(Relation):
    menuItem = None

    @staticmethod
    def newRandMenuItem(cls):
        """
        Assign a new random menu item to the class. This is a janky way to make
        sure that `randItem` and `randCalories` return data that belong to the
        same menu item (until this method is called again).
        """
        cls.menuItem = menu.randItem()
        return cls.menuItem

    @classmethod
    def randName(cls):
        """
        Returns the name of the current random unique menu item

        Returns:
            string: The name of a menu item
        """
        name, _ = cls.menuItem
        return name

    @classmethod
    def randCalories(cls):
        """
        Returns the calories of the current random unique menu item

        Returns:
            string: The calories of a menu item
        """
        _, calories = cls.menuItem
        return calories

    config = {
        "name": lambda: wrapStr(Item.randName()),
        "price_cents": lambda: random.randint(1, 15_00),
        "calories": lambda: random.choices(
            [Item.randCalories(), NULL],
            weights=[90, 10]  # 10% chance of NULL
        )[0],
    }


class Store(Relation):
    config = {
        "address_street": lambda: wrapStr(generate.street_address()),
        "address_city": lambda: wrapStr(generate.city()),
        "address_state": lambda: wrapStr(generate.state()),
        "address_zip": lambda: wrapStr(generate.postcode()),
        "address_country": lambda: wrapStr(generate.country()),
    }


class Order(Relation):
    config = {
        "date": generate.date_time,
    }
    # Order has a foreign key that references a customer and a store
    associations = [Customer, Store]


class OrderItem(Relation):
    # OrderItem has a foreign key that references an item and an order.
    # Other than those two columns, there are no other attributes.
    associations = [Order, Item]


def export(relations):
    if len(relations) == 0:
        print("No relations to export")
        return

    relationClass = type(relations[0])
    relationName = relationClass.__name__

    fileName = f"{relationName}.csv"
    filePath = f"{dir_path}/data/{fileName}"
    with open(filePath, "w") as file:
        file.write(relationClass.header() + "\n")
        for relation in relations:
            if not isinstance(relation, relationClass):
                print(f"{relationName} relation is not of type"
                      "{relationClass}. Skipping")
                continue

            # Write relation (as a string) to the file
            file.write(str(relation) + "\n")

    print(f"\nExported {relationName} ({len(relations)} tuples) to {filePath}")


def print_results(relations):
    PRINT_LIMIT = 10

    if len(relations) == 0:
        print("No tuples to print.")
        return

    relationClass = type(relations[0])

    print(f"\n\n\n{relationClass.__name__}")
    print(relationClass.header())
    [print(str(relation)) for relation in (
        relations[:PRINT_LIMIT] if PRINT_LIMIT else relations)]

    if PRINT_LIMIT and len(relations) > PRINT_LIMIT:
        print(f"\n... ({len(relations) - PRINT_LIMIT} more tuples)")


def main():
    # Rough goal of number of tuples to generate
    numTuples = 3_000  # this is the default value
    try:
        # Override default value if command line argument is provided
        numTuples = int(sys.argv[1])
    except IndexError:
        pass

    # Generate relations!
    customers = [Customer() for _ in range(numTuples)]
    items = [Item() for _ in range(numTuples)
             if Item.newRandMenuItem(Item) is not None]
    stores = [Store() for _ in range(numTuples)]
    orders = [
        Order(associations=[random.choice(customers), random.choice(stores)])
        for _ in range(numTuples)
    ]
    orderItems = []
    for order in orders:
        # Each order must have at least one order item, I am looping through
        # the orders to generate the order items.
        orderItems.extend([
            OrderItem(associations=[order, random.choice(items)])
            for _ in range(random.randint(1, 10))
        ])

    # Print the generated tuples for each relation
    print_results(customers)
    print_results(items)
    print_results(stores)
    print_results(orders)
    print_results(orderItems)

    # Export the generated tuples as CSV files
    print("\n\n\nEXPORTING")
    export(customers)
    export(items)
    export(stores)
    export(orders)
    export(orderItems)


if __name__ == '__main__':
    main()
