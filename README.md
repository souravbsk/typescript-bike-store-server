# typescript-bike-store-server

### Project Overview

This is a simple server-side application built with TypeScript, Express.js, and MongoDB mongoose . It's designed
to manage a bike store inventory.

### Features

- **Bike Management**: Users can add, remove,get, and update bikes in the inventory.
- **Order Management**: User can easily place orders for bikes.
- **User Management**: Users can register and login to the system.
- **Error Handling**: The server handles errors and exceptions, providing informative error messages.
- **Zod Error**: the server uses zod to validate product data and order data

### Setup

1. Clone the repo: `git clone https://github.com/souravbsk/typescript-bike-store-server.git`
2. Install dependencies: `npm install`
3. Start the server: `npm run start:dev`
4. Use Postman with the API endpoints.

### API Endpoints

# baseURL: http://localhost:3000/api

User Endpoints:

- **POST /users/register**: Create a new user
- **POST /users/login**: Login to the system
- **post /users/change-password**: Change user password

- **GET /users**: Get all users

- **GET /users/:id/make-admin**: Make a user admin

- **PUT /users/:id/block**: Update a user status block

- **DELETE /users/:id**: Delete a user

Product Endpoints:

- **POST /products/create-product**: Create a new product
- **GET /products**: Get all products
- **GET /products/:productId**: Get a product by id
- **PATCh /products/:productId**: Update a product
- **DELETE /products/:productId/**: Delete a product

ORDER Endpoints:

- **POST /orders/create-order**: Create a new order
- **GET /orders**: Get all orders
- **POST /orders/success/:tran_id**: SSL SUccess Route
- **POST /orders/fail/:tran_id**: SSL Fail Route
- **POST /orders/cancel/:tran_id**: SSL Cancel Route
- **PATCH /orders/:order_id/order-status-change**: Update order status
- **DELETE /orders/:order_id**: Delete an order
