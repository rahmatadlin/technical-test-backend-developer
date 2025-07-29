const sequelize = require('../config/database');
const { User, Article } = require('../models');
const bcrypt = require('bcryptjs');

const seedDatabase = async () => {
  try {
    // Sync database
    await sequelize.sync({ force: true });
    console.log('Database synced successfully');

    // Hash passwords manually for seeding
    const hashedPassword = await bcrypt.hash('password123', 10);

    // Create sample users with hashed passwords
    const users = await User.bulkCreate([
      {
        username: 'john_doe',
        email: 'john@example.com',
        password: hashedPassword
      },
      {
        username: 'jane_smith',
        email: 'jane@example.com',
        password: hashedPassword
      },
      {
        username: 'bob_wilson',
        email: 'bob@example.com',
        password: hashedPassword
      }
    ]);

    console.log('Sample users created successfully');

    // Create sample articles
    const articles = await Article.bulkCreate([
      {
        user_id: users[0].id,
        title: 'Introduction to Node.js',
        body: 'Node.js is a JavaScript runtime built on Chrome\'s V8 JavaScript engine. It allows you to run JavaScript on the server side.',
        status: 'published',
        created_at: new Date('2024-01-15')
      },
      {
        user_id: users[0].id,
        title: 'Express.js Framework Guide',
        body: 'Express.js is a minimal and flexible Node.js web application framework that provides a robust set of features for web and mobile applications.',
        status: 'published',
        created_at: new Date('2024-01-20')
      },
      {
        user_id: users[0].id,
        title: 'Sequelize ORM Tutorial',
        body: 'Sequelize is a promise-based Node.js ORM for Postgres, MySQL, MariaDB, SQLite and Microsoft SQL Server.',
        status: 'draft',
        created_at: new Date('2024-01-25')
      },
      {
        user_id: users[1].id,
        title: 'JavaScript Best Practices',
        body: 'Learn the best practices for writing clean, maintainable JavaScript code.',
        status: 'published',
        created_at: new Date('2024-01-10')
      },
      {
        user_id: users[1].id,
        title: 'REST API Design Principles',
        body: 'Understanding the fundamental principles of designing RESTful APIs.',
        status: 'published',
        created_at: new Date('2024-01-18')
      },
      {
        user_id: users[2].id,
        title: 'PostgreSQL Database Management',
        body: 'A comprehensive guide to managing PostgreSQL databases effectively.',
        status: 'draft',
        created_at: new Date('2024-01-22')
      },
      {
        user_id: users[2].id,
        title: 'JWT Authentication Implementation',
        body: 'How to implement secure JWT authentication in your applications.',
        status: 'published',
        created_at: new Date('2024-01-28')
      },
      {
        user_id: users[0].id,
        title: 'Golang Programming Language',
        body: 'Go is an open source programming language that makes it easy to build simple, reliable, and efficient software.',
        status: 'published',
        created_at: new Date('2024-02-01')
      },
      {
        user_id: users[1].id,
        title: 'Advanced Golang Concepts',
        body: 'Exploring advanced concepts in the Go programming language including goroutines, channels, and interfaces.',
        status: 'draft',
        created_at: new Date('2024-02-05')
      },
      {
        user_id: users[2].id,
        title: 'Golang Web Development',
        body: 'Building web applications using Go and popular frameworks like Gin and Echo.',
        status: 'published',
        created_at: new Date('2024-02-10')
      }
    ]);

    console.log('Sample articles created successfully');
    console.log(`Created ${users.length} users and ${articles.length} articles`);

    // Display sample data
    console.log('\nSample Users:');
    users.forEach(user => {
      console.log(`- ${user.username} (${user.email})`);
    });

    console.log('\nSample Articles:');
    articles.forEach(article => {
      console.log(`- "${article.title}" (${article.status}) by user ${article.user_id}`);
    });

    console.log('\nDatabase seeding completed successfully!');
    console.log('\nYou can now test the API with these sample users:');
    console.log('- Username: john_doe, Password: password123');
    console.log('- Username: jane_smith, Password: password123');
    console.log('- Username: bob_wilson, Password: password123');
    console.log('\n💡 Note: Passwords are manually hashed using bcrypt');

  } catch (error) {
    console.error('Seeding error:', error);
  } finally {
    await sequelize.close();
  }
};

// Run seeder if this file is executed directly
if (require.main === module) {
  seedDatabase();
}

module.exports = seedDatabase; 