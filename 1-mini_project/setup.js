const fs = require('fs');
const path = require('path');

console.log('🚀 Article Management System Setup\n');

// Check if .env file exists
const envPath = path.join(__dirname, '.env');
if (!fs.existsSync(envPath)) {
  console.log('📝 Creating .env file from template...');
  
  const envTemplate = `# Database Configuration
DB_HOST=localhost
DB_PORT=5432
DB_NAME=article_management
DB_USER=postgres
DB_PASSWORD=your_password

# JWT Configuration
JWT_SECRET=your_jwt_secret_key_here
JWT_EXPIRES_IN=24h

# Server Configuration
PORT=3000
NODE_ENV=development
`;

  fs.writeFileSync(envPath, envTemplate);
  console.log('✅ .env file created successfully!');
  console.log('⚠️  Please edit .env file with your database credentials before continuing.\n');
} else {
  console.log('✅ .env file already exists.\n');
}

console.log('📋 Setup Instructions:');
console.log('1. Install dependencies: npm install');
console.log('2. Edit .env file with your PostgreSQL credentials');
console.log('3. Create PostgreSQL database: CREATE DATABASE article_management;');
console.log('4. Run database seeder: npm run seed');
console.log('5. Start the server: npm run dev');
console.log('6. Access API docs: http://localhost:3000/api-docs');
console.log('7. Test the API: npm test\n');

console.log('🔧 Available Scripts:');
console.log('- npm start: Start production server');
console.log('- npm run dev: Start development server');
console.log('- npm run seed: Run database seeder');
console.log('- npm test: Run API tests\n');

console.log('📚 Sample Users (after seeding):');
console.log('- Username: john_doe, Password: password123');
console.log('- Username: jane_smith, Password: password123');
console.log('- Username: bob_wilson, Password: password123\n');

console.log('🎯 Key Features:');
console.log('- JWT Authentication');
console.log('- CRUD Articles with user isolation');
console.log('- Search articles by title (case-insensitive)');
console.log('- Filter by status (draft/published)');
console.log('- Pagination support');
console.log('- SQL Injection protection');
console.log('- Swagger API documentation\n');

console.log('🔍 Search Example:');
console.log('GET /articles?search=golang');
console.log('GET /articles?status=published&page=1&limit=10\n');

console.log('✨ Happy coding!'); 