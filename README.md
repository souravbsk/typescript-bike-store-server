# typescript-bike-store-server

### Project Overview

This is a simple server-side application built with TypeScript, Express.js, and MongoDB mongoose . It's designed
to manage a bike store inventory.

### Features

- **Bike Management**: Users can add, remove,get, and update bikes in the inventory.
- **Order Management**: User can easily place orders for bikes.
- **Error Handling**: The server handles errors and exceptions, providing informative error messages.
- **Zod Error**: the server uses zod to validate product data and order data

### Setup

1. Clone the repo: `git clone https://github.com/souravbsk/typescript-bike-store-server.git`
2. Install dependencies: `npm install`
3. Start the server: `npm start`
4. Use Postman with the API endpoints.

### API Endpoints

- **POST /api/products**:create a new product .
- **GET /api/products**: get all products.
- **GET /api/products/:productId**: get a product by id.
- **PUT /api/products/:productId**: Updates an product with product id.
- **DELETE /api/products/:productId**: Removes a product from database .

- **POST /api/orders**: create a new order.
- **GET /api/orders/revenue**: get all order revenue value.
