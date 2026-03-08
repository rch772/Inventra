URL: http://127.0.0.1:5500/product-inventory-system/public/


Product Inventory System
Project Overview

The Product Inventory System is a full-stack web application designed to help businesses manage their product stock efficiently. It allows users to:

Add new products

View existing products

Update product quantities

Identify low-stock items

This system is ideal for small to medium businesses looking to automate their inventory management and reduce manual errors.

Features
Basic Features

Add Products: Add new products with details like name, category, quantity, and price.

View Products: Display all products in a clean, tabular format.

Update Quantity: Modify product stock easily.

Low Stock Alerts: Identify products that are running low.

Advanced Features (Optional)

Search and filter products by category or name.

Sort products by price, quantity, or name.

Responsive UI for desktops and tablets.

Tech Stack
Layer	Technology
Frontend	HTML, CSS, JavaScript
Backend	Node.js, Express.js
Database	MongoDB / MySQL (based on your choice)
API Testing	Postman
Version Control	Git
Project Structure
product-inventory-system/
│
├── backend/             # Node.js server code
│   ├── routes/          # API routes
│   ├── models/          # Database models
│   ├── controllers/     # Request handlers
│   └── server.js        # Entry point
│
├── frontend/            # Frontend code
│   ├── index.html
│   ├── style.css
│   └── script.js
│
├── README.md            # Project documentation
└── package.json
Installation & Setup

Clone the repository:

git clone <repository-url>

Navigate to backend folder:

cd backend

Install dependencies:

npm install

Start the server:

node server.js

Open frontend:

Open frontend/index.html in your browser

API Endpoints
Method	Endpoint	Description
POST	/products	Add a new product
GET	/products	Get all products
PUT	/products/:id	Update product quantity
DELETE	/products/:id	Delete a product
Usage

Open the app in your browser.

Add new products using the form.

View, edit, or delete products from the dashboard.

Monitor low-stock alerts to prevent shortages.

Future Enhancements

User authentication and roles (Admin/User)

Product categories and advanced filtering

Export reports as CSV or PDF

Integration with barcode scanners

Author

Name: Roshan Chiluka

Email:roshanchiluka25@gmail.com

