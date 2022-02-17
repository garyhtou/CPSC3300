import sys
import os
import random
from faker import Faker

generate = Faker()

dir_path = os.path.dirname(os.path.realpath(__file__))
NULL = "NULL"


def wrapStr(s): return "\"" + str(s) + "\""


class McDonaldsMenu:
    def __init__(self):
        self.products = []

        # Attempt to load data from file
        first = True
        try:
            with open(f"{dir_path}/menu.csv") as file:
                while (line := file.readline().strip()):
                    if first:
                        # Don't process the CSV header (first line)
                        first = False
                        continue

                    data = line.split(",")
                    name = data[1]
                    calories = data[3]

                    self.products.append((name, calories))

        except FileNotFoundError:
            print("No menu file found, please include `menu.csv` from https://www.kaggle.com/mcdonalds/nutrition-facts")
            exit(1)

    def randItem(self):
        if len(self.products) == 0:
            return None

        # Get and remove a random item from the list of products
        return self.products.pop(random.randint(0, len(self.products) - 1))


def randPhoneE164():
    def series(size): return "".join(
        [str(random.randint(0, 9)) for _ in range(size)])
    return "+1 " + " ".join([series(3), series(3), series(4)])


class Relation(object):
    id = 0
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
        # Get attribute names (add id) and join with commas
        attributes = [cls.ID_ATTRIBUTE]+list(cls.config.keys())
        relations = [relation.fkAttributeName()
                     for relation in cls.associations]
        return ','.join(attributes + relations)

    @classmethod
    def fkAttributeName(
        cls): return f'{cls.__name__.lower()}_{cls.ID_ATTRIBUTE}'


class Customer(Relation):
    config = {
        "name": lambda: wrapStr(generate.unique.name()),
        "address": lambda: wrapStr(generate.address().replace('\n', ' ')),
        "phone": lambda: wrapStr(random.choices([randPhoneE164(), NULL], weights=[90, 10])[0]),
        "email": lambda: wrapStr(generate.unique.email()),
    }


menu = McDonaldsMenu()


class Item(Relation):
    menuItem = None

    @staticmethod
    def newRandMenuItem(cls):
        cls.menuItem = menu.randItem()
        return cls.menuItem

    @classmethod
    def randName(cls):
        name, _ = cls.menuItem
        return name

    @classmethod
    def randCalories(cls):
        _, calories = cls.menuItem
        return calories

    config = {
        "name": lambda: wrapStr(Item.randName()),
        "price_cents": lambda: random.randint(1, 15_00),
        # "calories": lambda: random.choices([random.randint(20, 2000), NULL], weights=[90, 10])[0],
        "calories": lambda: random.choices([Item.randCalories(), NULL], weights=[90, 10])[0],
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
    associations = [Customer, Store]


class OrderItem(Relation):
    config = {}
    associations = [Order, Item]


def export(relations):
    if len(relations) == 0:
        return

    relationClass = type(relations[0])
    relationName = relationClass.__name__
    fileName = f"{relationName}.csv"
    filePath = f"{dir_path}/data/{fileName}"
    with open(filePath, "w") as file:
        file.write(relationClass.header() + "\n")
        for relation in relations:
            file.write(str(relation) + "\n")

    print(f"\nExported {relationName} ({len(relations)} tuples) to {filePath}")


def main():
    numTuples = 3_000
    try:
        numTuples = int(sys.argv[1])
    except IndexError:
        pass

    customers = [Customer() for _ in range(numTuples)]
    items = [Item() for _ in range(numTuples) if Item.newRandMenuItem(Item) is not None]
    stores = [Store() for _ in range(numTuples)]
    orders = [Order(associations=[random.choice(customers), random.choice(stores)])
              for _ in range(numTuples)
              ]

    orderItems = []
    for order in orders:
        orderItems.extend(
            [OrderItem(associations=[order, random.choice(items)]) for _ in range(random.randint(1, 10))])

    print("\n\n\nCUSTOMERS")
    print(Customer.header())
    [print(str(customer)) for customer in customers]

    print("\n\n\nITEMS")
    print(Item.header())
    [print(str(item)) for item in items]

    print("\n\n\nSTORES")
    print(Store.header())
    [print(str(store)) for store in stores]

    print("\n\n\nORDERS")
    print(Order.header())
    [print(str(order)) for order in orders]

    print("\n\n\nORDER ITEMS")
    print(OrderItem.header())
    [print(str(orderItem)) for orderItem in orderItems]

    print("\n\n\nEXPORTING")
    export(customers)
    export(items)
    export(stores)
    export(orders)
    export(orderItems)


if __name__ == '__main__':
    main()
