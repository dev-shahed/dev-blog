# Dev Blog

## Description
A simple blog application built with Node.js, Express, and MongoDB. The application allows users to create, read, and delete blog posts. Only authenticated users with a valid JWT token can create a blog, and only the user who created a blog can delete it.

## Prerequisites
- [Node.js](https://nodejs.org/) (version X.X.X or higher)
- [npm](https://www.npmjs.com/) (version X.X.X or higher)
- A MongoDB database (local or remote)

## Getting Started

### 1. Install Dependencies
First, install the required dependencies for the project:

```bash
npm install
```

### 2. Set Up Environment Variables
Create a `.env` file in the root directory of the project with the following content:

```plaintext
MONGODB_URI = <YOUR-MONGODB-URI>
TEST_MONGODB_URI = <YOUR-TEST-MONGODB-URI>
NODE_ENV = test
PORT = 3001
JWT_SECRET = <YOUR-JWT-SECRET>
```

Replace the placeholder values (`<YOUR-MONGODB-URI>`, `<YOUR-TEST-MONGODB-URI>`, `<YOUR-JWT-SECRET>`) with your actual MongoDB connection strings and JWT secret.

### 3. Start the Application

#### Development Environment
To start the application in the development environment:

```bash
npm run dev
```

#### Production Environment
To start the application in the production environment:

```bash
npm start
```

### 4. Running Tests

#### Test Environment
To start the application in the test environment and run the tests:

```bash
npm run test
```

## API Routes

### 1. Posts
- **GET** `http://localhost:3001/api/posts`  
  Retrieves all blog posts.
  
- **POST** `http://localhost:3001/api/posts`  
  Creates a new blog post.  
  **Note**: Requires a valid JWT token in the Authorization header.

- **DELETE** `http://localhost:3001/api/posts/:id`  
  Deletes a blog post by ID.  
  **Note**: Only the user who created the blog can delete it, and a valid JWT token is required.

### 2. Users
- **GET** `http://localhost:3001/api/users`  
  Retrieves all users.

- **POST** `http://localhost:3001/api/users`  
  Registers a new user.

### 3. Login
- **POST** `http://localhost:3001/api/login`  
  Authenticates a user and returns a JWT token.

## Authentication
The application uses JWT (JSON Web Token) for authentication. Users must include a valid JWT token in the `Authorization` header as a `Bearer` token to create or delete blog posts.

## Additional Information

- Replace `<YOUR-MONGODB-URI>`, `<YOUR-TEST-MONGODB-URI>`, and `<YOUR-JWT-SECRET>` with your actual MongoDB connection strings and JWT secret.