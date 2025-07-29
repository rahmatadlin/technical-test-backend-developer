# Technical Test Backend Developer

## 📋 Overview

Repository ini berisi solusi lengkap untuk technical test backend developer yang mencakup implementasi REST API, database design, dan fitur-fitur tambahan.

## 🚀 Project Structure

```
technical-test-backend-developer/
├── 1-mini_project/                                 # Article Management System API
├── 2-sql_and_database_design/                      # SQL queries & database optimization
├── 3-algoritma_and_logika/                         # Algorithm & logic challenges
├── 4-system_design_and_skalabilitas/               # System design & scalability
└── 5-bonus/                                        # Bonus features implementation
```

## 📁 Project Details

### 1. Mini Project - Article Management System
**Tech Stack:** Node.js, Express, Sequelize, PostgreSQL, JWT

**Features:**
- ✅ JWT Authentication (Register/Login)
- ✅ CRUD Articles dengan user isolation
- ✅ Search artikel case-insensitive
- ✅ Filter by status (draft/published)
- ✅ Pagination support
- ✅ SQL Injection protection
- ✅ Swagger documentation
- ✅ Database seeding

**Quick Start:**
```bash
cd 1-mini_project
npm install
npm run setup
npm run seed
npm run dev
```

### 2. SQL & Database Design
**Content:**
- ✅ SQL queries untuk artikel terakhir per user
- ✅ Aggregation queries untuk statistik artikel
- ✅ Database optimization strategies
- ✅ Index strategies & best practices
- ✅ Performance monitoring queries

### 3. Algoritma & Logika
**Content:**
- Algorithm challenges & solutions
- Logic problem solving
- Code optimization techniques

### 4. System Design & Skalabilitas
**Content:**
- System architecture design
- Scalability considerations
- Performance optimization strategies

### 5. Bonus Features
**Content:**
- ✅ Article search implementation
- ✅ Case-insensitive search
- ✅ SQL injection protection
- ✅ Empty result handling
- ✅ Performance optimization

## 🛠️ Technologies Used

- **Backend:** Node.js, Express.js
- **Database:** PostgreSQL, Sequelize ORM
- **Authentication:** JWT, bcryptjs
- **Validation:** express-validator
- **Documentation:** Swagger/OpenAPI
- **Security:** Helmet, CORS, Rate Limiting

## 📚 API Endpoints

### Authentication
- `POST /auth/register` - Register user
- `POST /auth/login` - Login user

### Articles
- `GET /articles` - Get articles (with search, filter, pagination)
- `GET /articles/:id` - Get single article
- `POST /articles` - Create article
- `PUT /articles/:id` - Update article
- `DELETE /articles/:id` - Delete article

## 🔍 Search Examples

```bash
# Basic search
GET /articles?search=golang

# Search with pagination
GET /articles?search=golang&page=1&limit=5

# Search with filter
GET /articles?search=golang&status=published

# Combined search
GET /articles?search=golang&status=published&page=1&limit=10
```

## 🗄️ Database Schema

```sql
CREATE TABLE users (
    id SERIAL PRIMARY KEY,
    username VARCHAR(50) NOT NULL,
    email VARCHAR(100),
    password VARCHAR(255) NOT NULL,
    created_at TIMESTAMP DEFAULT NOW()
);

CREATE TABLE articles (
    id SERIAL PRIMARY KEY,
    user_id INTEGER REFERENCES users(id),
    title TEXT NOT NULL,
    body TEXT NOT NULL,
    status VARCHAR(20) DEFAULT 'draft',
    created_at TIMESTAMP DEFAULT NOW()
);
```

## 🔐 Security Features

- ✅ JWT Authentication
- ✅ Password hashing (bcrypt)
- ✅ SQL Injection protection
- ✅ Input validation
- ✅ Rate limiting
- ✅ CORS protection
- ✅ Security headers

## 📊 Sample Data

**Users:**
- `john_doe` / `password123`
- `jane_smith` / `password123`
- `bob_wilson` / `password123`

**Articles:** 10 sample articles dengan berbagai topik (Node.js, Express, PostgreSQL, JWT, Golang)

## 🚀 Quick Start

1. **Clone repository**
   ```bash
   git clone <repository-url>
   cd technical-test-backend-developer
   ```

2. **Setup Article Management System**
   ```bash
   cd 1-mini_project
   npm install
   npm run setup
   # Edit .env file with your PostgreSQL credentials
   npm run seed
   npm run dev
   ```

3. **Access API**
   - API: http://localhost:3000
   - Documentation: http://localhost:3000/api-docs
   - Health Check: http://localhost:3000/health

4. **Test API**
   ```bash
   npm test
   ```

## 📖 Documentation

- **API Docs:** Swagger UI at `/api-docs`
- **Database Design:** See `2-sql_and_database_design/`
- **Bonus Features:** See `5-bonus/`

## 🎯 Key Features

- **Production Ready:** Comprehensive error handling, validation, security
- **Well Documented:** Swagger docs, README files, code comments
- **Tested:** Unit tests, API tests, security tests
- **Scalable:** Database optimization, caching strategies
- **User Friendly:** Clear error messages, pagination, search

## 📝 License

MIT License

---

**Author:** Rahmat Adlin  
**Date:** 29/07/2025  
**Status:** Complete ✅