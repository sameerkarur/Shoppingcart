# E-Commerce Shopping Cart

A modern e-commerce website built with React.js and Node.js, featuring a shopping cart system, user authentication, and order management.

## Features

- User authentication (login/register)
- Product browsing and searching
- Shopping cart functionality
- Order management
- Responsive design
- Secure payment processing (coming soon)

## Tech Stack

- Frontend:
  - React.js
  - Material-UI
  - React Router
  - Axios

- Backend:
  - Node.js
  - Express.js
  - MySQL
  - JWT Authentication

## Getting Started

1. Clone the repository
2. Install dependencies:
   ```bash
   # Install frontend dependencies
   cd frontend
   npm install

   # Install backend dependencies
   cd ../backend
   npm install
   ```

3. Set up the database:
   - Create a MySQL database
   - Import the schema from `backend/config/database.sql`
   - Create a `.env` file in the backend directory with your database credentials

4. Start the development servers:
   ```bash
   # Start backend server
   cd backend
   npm run dev

   # Start frontend development server
   cd frontend
   npm start
   ```

5. Open http://localhost:3000 in your browser

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License - see the LICENSE file for details
