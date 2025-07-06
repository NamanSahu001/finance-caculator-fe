# Finance Calculator Frontend

A React-based financial planning calculator with integrated authentication.

## Features

- User registration and login
- JWT-based authentication
- Financial planning calculator
- Admin panel for user management
- Responsive design with Tailwind CSS

## Prerequisites

- Node.js (v16 or higher)
- MySQL database
- Backend server running on port 3000

## Setup

1. Install dependencies:

```bash
npm install
```

2. Start the backend server first (in the `finance-calculator` directory):

```bash
cd ../finance-calculator
npm install
npm start
```

3. Start the frontend development server:

```bash
npm run dev
```

The frontend will be available at `http://localhost:5173`

## Authentication Flow

The application uses JWT tokens for authentication:

1. **Registration**: Users can create new accounts with name, email, and password
2. **Login**: Users authenticate with email and password
3. **Token Management**: Access tokens are stored in localStorage
4. **User Routing**: Users are automatically routed based on their type:
   - Type 1 (Simple User) → Calculator page
   - Type 2 (Admin User) → Admin panel
5. **Logout**: Clears tokens and redirects to login

## API Integration

The frontend integrates with the following backend APIs:

- `POST /api/auth/register` - User registration
- `POST /api/auth/login` - User login
- `POST /api/auth/logout` - User logout
- `GET /api/auth/users` - Get all users (admin only)

## Environment Variables

Make sure your backend has the following environment variables:

- `JWT_SECRET` - Secret key for JWT tokens
- `DB_HOST`, `DB_USER`, `DB_PASSWORD`, `DB_NAME` - Database configuration

## Development

- Built with React 18, TypeScript, and Vite
- Styled with Tailwind CSS
- Uses React Router for navigation
- Context API for state management
