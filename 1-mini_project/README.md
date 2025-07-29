# Article Management System API

A REST API for managing articles with JWT authentication, built with Node.js, Express, Sequelize ORM, and PostgreSQL.

## Features

- 🔐 **JWT Authentication** - Secure user registration and login
- 📝 **CRUD Operations** - Create, Read, Update, Delete articles
- 🔒 **User Isolation** - Users can only access their own articles
- 📄 **Pagination** - Efficient data loading with page-based navigation
- 🔍 **Search & Filter** - Search articles by title and filter by status
- 🛡️ **SQL Injection Protection** - Parameterized queries for security
- 📚 **API Documentation** - Interactive Swagger documentation
- 🌱 **Database Seeding** - Sample data for testing

## Tech Stack

- **Runtime**: Node.js
- **Framework**: Express.js
- **ORM**: Sequelize
- **Database**: PostgreSQL
- **Authentication**: JWT (jsonwebtoken)
- **Password Hashing**: bcryptjs
- **Validation**: express-validator
- **Documentation**: Swagger/OpenAPI
- **Security**: Helmet, CORS, Rate Limiting

## Prerequisites

- Node.js (v14 or higher)
- PostgreSQL (v12 or higher)
- npm or yarn

## Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd 1-mini_project
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Set up environment variables**
   ```bash
   cp env.example .env
   ```
   
   Edit `.env` file with your database credentials:
   ```env
   DB_HOST=localhost
   DB_PORT=5432
   DB_NAME=article_management
   DB_USER=postgres
   DB_PASSWORD=postgres
   JWT_SECRET=your_jwt_secret_key_here
   JWT_EXPIRES_IN=24h
   PORT=3000
   NODE_ENV=development
   ```

4. **Create PostgreSQL database**
   ```sql
   CREATE DATABASE article_management;
   ```

5. **Run database migrations and seed data**
   ```bash
   npm run seed
   ```

6. **Start the server**
   ```bash
   # Development mode
   npm run dev
   
   # Production mode
   npm start
   ```

The server will start on `http://localhost:3000`

## API Documentation

Once the server is running, you can access the interactive API documentation at:
- **Swagger UI**: http://localhost:3000/api-docs

## API Endpoints

### Authentication

| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/auth/register` | Register a new user |
| POST | `/auth/login` | Login user |

### Articles

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/articles` | Get all articles (with pagination, filtering, search) |
| GET | `/articles/:id` | Get single article by ID |
| POST | `/articles` | Create new article |
| PUT | `/articles/:id` | Update article |
| DELETE | `/articles/:id` | Delete article |

## Usage Examples

### 1. Register a new user
```bash
curl -X POST http://localhost:3000/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "username": "john_doe",
    "email": "john@example.com",
    "password": "password123"
  }'
```

### 2. Login user
```bash
curl -X POST http://localhost:3000/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "username": "john_doe",
    "password": "password123"
  }'
```

### 3. Get all articles (with authentication)
```bash
curl -X GET http://localhost:3000/articles \
  -H "Authorization: Bearer YOUR_JWT_TOKEN"
```

### 4. Search articles by title
```bash
curl -X GET "http://localhost:3000/articles?search=golang" \
  -H "Authorization: Bearer YOUR_JWT_TOKEN"
```

### 5. Filter articles by status
```bash
curl -X GET "http://localhost:3000/articles?status=published" \
  -H "Authorization: Bearer YOUR_JWT_TOKEN"
```

### 6. Pagination
```bash
curl -X GET "http://localhost:3000/articles?page=1&limit=5" \
  -H "Authorization: Bearer YOUR_JWT_TOKEN"
```

### 7. Create new article
```bash
curl -X POST http://localhost:3000/articles \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_JWT_TOKEN" \
  -d '{
    "title": "My New Article",
    "body": "This is the content of my article.",
    "status": "draft"
  }'
```

## Database Schema

### Users Table
```sql
CREATE TABLE users (
  id SERIAL PRIMARY KEY,
  username VARCHAR(50) NOT NULL UNIQUE,
  email VARCHAR(100) UNIQUE,
  password VARCHAR(255) NOT NULL,
  created_at TIMESTAMP DEFAULT NOW()
);
```

### Articles Table
```sql
CREATE TABLE articles (
  id SERIAL PRIMARY KEY,
  user_id INTEGER REFERENCES users(id),
  title TEXT NOT NULL,
  body TEXT NOT NULL,
  status VARCHAR(20) DEFAULT 'draft',
  created_at TIMESTAMP DEFAULT NOW()
);
```

## Security Features

- **JWT Authentication**: Secure token-based authentication
- **Password Hashing**: bcryptjs for password security
- **SQL Injection Protection**: Parameterized queries with Sequelize
- **Input Validation**: Comprehensive validation using express-validator
- **Rate Limiting**: Protection against brute force attacks
- **CORS**: Cross-origin resource sharing configuration
- **Helmet**: Security headers for Express

## Search and Filter Features

### Search
- **Case-insensitive** search in article titles
- Uses PostgreSQL's `ILIKE` operator for efficient searching
- Handles empty results gracefully

### Filtering
- Filter articles by status (`draft` or `published`)
- Combine search and status filters

### Pagination
- Configurable page size (1-100 items per page)
- Page-based navigation
- Includes pagination metadata in responses

## Sample Data

The seeder creates 3 sample users with articles:

**Users:**
- `john_doe` / `password123`
- `jane_smith` / `password123`
- `bob_wilson` / `password123`

**Articles include topics like:**
- Node.js and Express.js tutorials
- JavaScript best practices
- REST API design principles
- PostgreSQL database management
- JWT authentication implementation
- Golang programming language

## Error Handling

The API includes comprehensive error handling:

- **400 Bad Request**: Validation errors, missing required fields
- **401 Unauthorized**: Invalid or missing JWT token
- **404 Not Found**: Article not found or doesn't belong to user
- **500 Internal Server Error**: Server-side errors

## Development

### Scripts
- `npm start`: Start production server
- `npm run dev`: Start development server with nodemon
- `npm run seed`: Run database seeder

### Environment Variables
- `DB_HOST`: PostgreSQL host
- `DB_PORT`: PostgreSQL port
- `DB_NAME`: Database name
- `DB_USER`: Database username
- `DB_PASSWORD`: Database password
- `JWT_SECRET`: Secret key for JWT signing
- `JWT_EXPIRES_IN`: JWT token expiration time
- `PORT`: Server port
- `NODE_ENV`: Environment (development/production)

## Testing the API

1. **Start the server**: `npm run dev`
2. **Access Swagger docs**: http://localhost:3000/api-docs
3. **Register a user** using the `/auth/register` endpoint
4. **Login** using the `/auth/login` endpoint
5. **Copy the JWT token** from the response
6. **Use the token** in the Authorization header for article endpoints
7. **Test all CRUD operations** and search/filter features

## API Response Format

All API responses follow a consistent format:

```json
{
  "success": true,
  "message": "Operation successful",
  "data": {
    // Response data
  }
}
```

Error responses:
```json
{
  "success": false,
  "message": "Error description",
  "errors": [
    // Validation errors (if applicable)
  ]
}
```

## License

MIT License 