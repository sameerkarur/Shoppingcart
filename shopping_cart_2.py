import colorama
from colorama import Fore, Style

import mysql.connector

# Initialize colorama
colorama.init()

# Establish a connection to the MySQL database
connection = mysql.connector.connect(
    host="localhost",
    user="root",
    password="Atinf@tmsL1220#",
    database="sameerdb"
)

# Create a cursor object to interact with the database
cursor = connection.cursor()

# Function to display available items from the database
def display_items():
    print("Available Items:")
    print("----------------")

    # Fetch items from the database
    cursor.execute("SELECT serial_number, item_name, price, units FROM items")
    items = cursor.fetchall()

    for item in items:
        serial_number, item_name, price, units = item
        print(f"{Fore.CYAN}{serial_number}. {item_name}{Style.RESET_ALL} - Price: ${price} - Units Available: {units}")


# Function to add an item to the shopping cart
def add_to_cart(serial_number, quantity, cart):
    cursor.execute("SELECT item_name, price, units FROM items WHERE serial_number = %s", (serial_number,))
    item_data = cursor.fetchone()

    if item_data:
        item_name, price, units = item_data

        if units >= quantity:
            if serial_number in cart:
                cart[serial_number] += quantity
            else:
                cart[serial_number] = quantity
            print(f"{quantity} {item_name.capitalize()} added to the cart.")
        else:
            print("Insufficient units available.")
            print("Available units:", units)
    else:
        print("Invalid serial number.")

# Function to display cart with serial numbers
def display_cart(cart):
    print(f"{Fore.GREEN}Cart.{Style.RESET_ALL}")
    if not cart:
        print(f"{Fore.CYAN}No items added in cart.{Style.RESET_ALL}")
    else:
        for index, (serial_number, quantity) in enumerate(cart.items(), start=1):
            cursor.execute("SELECT item_name FROM items WHERE serial_number = %s", (serial_number,))
            item_name = cursor.fetchone()[0]
            print(f"{Fore.CYAN}{index}. {item_name.capitalize()}{Style.RESET_ALL} - Quantity: {quantity}")



# Function to remove an item from the shopping cart
def remove_from_cart(serial_number, cart):
    if serial_number in cart:
        quantity = int(input("Enter the quantity to remove: "))
        if quantity <= cart[serial_number]:
            cart[serial_number] -= quantity
            if cart[serial_number] == 0:
                del cart[serial_number]
            print("Item removed from the cart.")
        else:
            print("Insufficient quantity available in the cart.")
    else:
        print("Item not found in the cart.")


# Function to calculate the total price of items in the cart
def calculate_total(cart):
    total = 0
    for serial_number, quantity in cart.items():
        cursor.execute("SELECT price FROM items WHERE serial_number = %s", (serial_number,))
        price = cursor.fetchone()[0]
        total += price * quantity
    return total

# Function to calculate the delivery charge based on the distance
def calculate_delivery_charge(distance):
    if distance <= 5:
        return 10
    elif distance <= 10:
        return 12
    elif distance <= 15:
        return 14
    else:
        return 20

# Main program loop
cart = {}
while True:
    print("=== Shopping Cart ===")
    print("1. Display available items")
    print("2. Add an item to the cart")
    print("3. Remove an item from the cart")
    print("4. View cart")
    print("5. Checkout")
    print("6. Quit")

    choice = input("Enter your choice (1-6): ")

    if choice == "1":
        display_items()
    elif choice == "2":
        serial_number = input("Enter the serial number of the item: ")
        quantity = int(input("Enter the quantity to add: "))
        add_to_cart(serial_number, quantity, cart)
    elif choice == "3":
        display_cart(cart)
        if not cart:
            print("Cart is empty. Nothing to remove.")
        else:
            item_index = int(input("Enter the item number to remove: "))
            cart_items = list(cart.keys())
            if item_index >= 1 and item_index <= len(cart_items):
                remove_from_cart(cart_items[item_index - 1], cart)
            else:
                print("Invalid item number. Please try again.")

    elif choice == "4":
        display_cart(cart)
    elif choice == "5":
        name = input("Enter your name: ")
        address = input("Enter your address: ")

        total_items_amount = calculate_total(cart)
        delivery_distance = float(input("Enter the distance from the store to your home (in miles): "))
        delivery_charge = calculate_delivery_charge(delivery_distance)
        total_amount = total_items_amount + delivery_charge

        print("=== Checkout ===")
        print(f"{Fore.GREEN}Customer: {name}{Style.RESET_ALL}")
        print(f"{Fore.GREEN}Address: {address}{Style.RESET_ALL}")
        print(f"{Fore.YELLOW}Total amount for items: ${total_items_amount}{Style.RESET_ALL}")
        print(f"{Fore.YELLOW}Delivery charge: ${delivery_charge}{Style.RESET_ALL}")
        print(f"{Fore.YELLOW}Total amount to pay: ${total_amount}{Style.RESET_ALL}")

        # Update the units in the database
        for serial_number, quantity in cart.items():
            cursor.execute("SELECT units FROM items WHERE serial_number = %s", (serial_number,))
            units = cursor.fetchone()[0]
            new_units = units - quantity
            cursor.execute("UPDATE items SET units = %s WHERE serial_number = %s", (new_units, serial_number))
            connection.commit()

        cart.clear()
        print("Checkout complete. Thank you!")
        break
    elif choice == "6":
        break
    else:
        print("Invalid choice. Please try again.")

# Close the database connection
connection.close()
