Overview
This repository provides an Inventory Management System built with React and Firebase. It allows users to:

Add items to inventory.
Remove items from inventory.
Search for items within the inventory.
View inventory details (name, quantity, and type).
The system also includes a Contact Form for users to send inquiries and a reusable Modal Component.

Features
Inventory Management
Add Items
Users can add new items to the inventory. If the item already exists, its quantity is updated.

Remove Items
Users can remove items or decrease their quantities. If the quantity reaches zero, the item is deleted from the database.

Search Items
Users can search for items by name using a text input field.

Inventory List
Displays all inventory items in a table format, including:

Item name
Quantity
Type (e.g., Vegetable, Fruit)
Components
Home
The main inventory management page. It provides functionality to add, remove, and search items.

Modal
A reusable modal component used for the Add and Remove item forms.

ContactForm
A responsive form for users to submit inquiries. It includes:

Name
Email
Subject
Message
Installation
Prerequisites
Node.js and npm installed on your system.
A Firebase project configured with Firestore.
Steps
Clone the repository:

bash
Copy code
git clone https://github.com/your-repo/inventory-management.git
cd inventory-management
Install dependencies:

npm install
Set up Firebase:

Replace Firebase configuration in @/lib/firebase with your project details.
Start the development server:

npm run dev

Adding Items
Click "Add Item".
Fill out the fields:
Item Name
Quantity
Type
Click "Add Item" to save changes.
Removing Items
Click "Remove Item".
Fill out the fields:
Item Name
Quantity to remove.
Click "Remove Item" to save changes.
Searching Items
Enter a search term in the Search bar.
The inventory list updates in real time to match the query.
