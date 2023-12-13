import mysql.connector
import colorama
from colorama import Fore, Style
from prettytable import PrettyTable

# Initialize colorama
colorama.init()

# Establish database connection
connection = mysql.connector.connect(
    host="localhost",
    user="root",
    password="Atinf@tmsL1220#",
    database="sameerdb"
)
cursor = connection.cursor()

# Function to display items with colorized output
def display_items():
    print(f"{Fore.YELLOW}Available Items:")
    print("----------------")

    try:
        cursor.execute("SELECT * FROM items")
        items = cursor.fetchall()
    except mysql.connector.Error as e:
        print(f"Error fetching items: {e}")
        return

    if not items:
        print("No items available.")
        return

    # Create a PrettyTable object
    table = PrettyTable()
    table.field_names = ["Serial Number", "Item Name", "Price", "Units"]

    # Add data to the table
    for item in items:
        table.add_row(item)

    # Print the table
    print(table)

# Function to update item units in the database
def update_units(serial_number):
    try:
        serial_number = int(serial_number)
    except ValueError:
        print(f"{Fore.RED}Invalid input. Please enter a valid integer for the serial number.")
        return

    cursor.execute("SELECT item_name, price, units FROM items WHERE serial_number = %s", (serial_number,))
    item_data = cursor.fetchone()

    while True:
        quantity_input = input("Enter the quantity to update: ")
        
        if not quantity_input.isdigit():
            print(f"{Fore.RED}Invalid input. Please enter a valid integer for the quantity.")
        else:
            quantity = int(quantity_input)
            break  # Exit the loop if a valid integer is entered

    if item_data:
        item_name, price, old_units = item_data
        new_units = old_units + quantity
        cursor.execute("UPDATE items SET units = %s WHERE serial_number = %s", (new_units, serial_number))
        connection.commit()
        print(f"{Fore.GREEN}The number of units for item with serial number {serial_number} has been updated to {new_units}.")
    else:
        print("Invalid serial number.")


# Function to add a new item to the inventory
def add_item(item, price, units):
    try:
        # Validate price and units as integers
        price = float(price)
        units = int(units)
    except ValueError:
        print("Invalid input. Please enter valid numeric values for the price and units.")
        return

    cursor.execute("SELECT MAX(serial_number) FROM items")
    result = cursor.fetchone()
    last_serial_number = result[0] if result[0] else 0
    serial_number = last_serial_number + 1

    # Capitalize the item name
    item = item.capitalize()

    cursor.execute("INSERT INTO items (serial_number, item_name, price, units) VALUES (%s, %s, %s, %s)",
                   (serial_number, item, price, units))
    connection.commit()
    print(f"{Fore.GREEN}Item with serial number {serial_number} has been added to the database.")


# Function to remove an item from the inventory
def remove_item(serial_number):
    while True:
        try:
            serial_number = int(serial_number)
            break  # Exit the loop if the conversion to int is successful
        except ValueError:
            print(f"{Fore.RED}Invalid input. Please enter a valid integer for the serial number.")
            serial_number = input("Enter the serial number of the item to remove: ")

    cursor.execute("DELETE FROM items WHERE serial_number = %s", (serial_number,))
    connection.commit()

    # Update the serial numbers after item removal
    cursor.execute("SET @serial_number := 0")
    connection.commit()

    cursor.execute("UPDATE items SET serial_number = (@serial_number := @serial_number + 1) ORDER BY item_name ASC")
    connection.commit()

    print(f"{Fore.GREEN}Item removed from the inventory.")
    return True  # Indicate success to trigger the loop back to Inventory management

# Function to update serial numbers based on item names
def update_serial_numbers():
    # Add the new column with a temporary name as the first column
    cursor.execute("ALTER TABLE items ADD COLUMN temp_serial_number INT FIRST")
    connection.commit()

    # Set the values of the new column to the desired serial numbers using an auto-incrementing value
    cursor.execute("SET @serial_number := 0")
    cursor.execute("UPDATE items SET temp_serial_number = (@serial_number := @serial_number + 1) ORDER BY item_name ASC")
    connection.commit()

    # Drop the existing serial_number column
    cursor.execute("ALTER TABLE items DROP COLUMN serial_number")
    connection.commit()

    # Rename the new column to serial_number
    cursor.execute("ALTER TABLE items CHANGE COLUMN temp_serial_number serial_number INT FIRST")
    connection.commit()

    # Add the unique constraint back to the serial_number column
    cursor.execute("ALTER TABLE items ADD CONSTRAINT uk_serial_number UNIQUE (serial_number)")
    connection.commit()


def restore_items_from_backup():
    try:
        cursor.execute("TRUNCATE TABLE items")
        connection.commit()

        # SQL query to restore data from backup table to items table
        restore_query = """
        INSERT INTO items (serial_number, item_name, price, units)
        SELECT serial_number, UPPER(item_name), price, units
        FROM items_backup
        ON DUPLICATE KEY UPDATE
            price = CASE WHEN items_backup.price <> items.price THEN items_backup.price ELSE items.price END,
            units = CASE WHEN items_backup.units <> items.units THEN items_backup.units ELSE items.units END

        """

        # Execute the SQL query to restore the data
        cursor.execute(restore_query)
        connection.commit()

        print(f"{Fore.GREEN}Data successfully restored from items_backup to items table.")

    except mysql.connector.Error as error:
        print("Error:", error)

# Function to create a backup of items
def backup_items():
    try:
        cursor.execute("TRUNCATE TABLE items_backup")
        connection.commit()

        backup_query = """
        INSERT INTO items_backup (serial_number, item_name, price, units)
        SELECT serial_number, UPPER(item_name), price, units
        FROM items
        ON DUPLICATE KEY UPDATE
            price = CASE WHEN items_backup.price <> items.price THEN items_backup.price ELSE items.price END,
            units = CASE WHEN items_backup.units <> items.units THEN items_backup.units ELSE items.units END

        """

        # Execute the SQL query to restore the data
        cursor.execute(backup_query)
        connection.commit()

        print(f"{Fore.GREEN}Data successfully backed up from items to items_backup.")

    except mysql.connector.Error as error:
        print("Error:", error)

# Create a backup of items before executing the main program loop
backup_items()

# Main program loop
while True:
    print(f"{Fore.CYAN}For=== Inventory Management ===")
    print("1. Display available items")
    print("2. Update item units")
    print("3. Add new item")
    print("4. Remove item")
    print("5. Restore data from backup")
    print("6. Quit")

    choice = input("Enter your choice (1-6): ")

    if choice == "1":
        display_items()

    elif choice == "2":
        serial_number = input("Enter the serial number of the item: ")

        # Validate serial_number as an integer
        try:
            serial_number = int(serial_number)
        except ValueError:
            print(f"{Fore.RED}Invalid input. Please enter a valid integer for the serial number.")
            continue  # Restart the loop

        # Now proceed with the update_units function
        update_units(serial_number)
        print(f"{Fore.GREEN}Item units updated successfully.")



    elif choice == "3":
        item_name = input("Enter the name of the new item: ")
    
    # Validate price as a numeric value
        price_input = input("Enter the price of the new item: ")
        try:
            price = float(price_input)
        except ValueError:
            print(f"{Fore.RED}Invalid input. Please enter a valid numeric value for the price.")
            continue  # Restart the loop

    # Validate units as a non-negative integer
        units_input = input("Enter the units of the new item: ")
        if not units_input.isdigit():
            print(f"{Fore.RED}Invalid input. Please enter a valid non-negative integer for the units.")
            continue  # Restart the loop
        units = int(units_input)

        add_item(item_name, price, units)
        update_serial_numbers()  # Update the serial numbers
        print(f"{Fore.GREEN}New item added to the inventory.")

    elif choice == "4":
        display_items()
        serial_number = input(f"{Fore.CYAN}Enter the serial number of the item to remove: ")
        success = remove_item(serial_number)
        
        if success:
            continue  # Restart the loop
        else:
            print("Failed to remove item. Please try again.")

    elif choice == "5":
        restore_items_from_backup()

    elif choice == "6":
        break
    else:
        print(f"{Fore.RED}Invalid choice. Please try again.")

# Close the database connection
connection.close()
