const axios = require('axios');

const BASE_URL = 'http://localhost:3000';

// Test data
const testUser = {
  username: 'test_user',
  email: 'test@example.com',
  password: 'password123'
};

const testArticle = {
  title: 'Test Article',
  body: 'This is a test article for API testing.',
  status: 'draft'
};

let authToken = '';

async function testAPI() {
  console.log('🚀 Starting API Tests...\n');

  try {
    // Test 1: Health Check
    console.log('1. Testing Health Check...');
    const healthResponse = await axios.get(`${BASE_URL}/health`);
    console.log('✅ Health check passed:', healthResponse.data.message);

    // Test 2: Register User
    console.log('\n2. Testing User Registration...');
    const registerResponse = await axios.post(`${BASE_URL}/auth/register`, testUser);
    authToken = registerResponse.data.data.token;
    console.log('✅ User registered successfully:', registerResponse.data.data.user.username);

    // Test 3: Login User
    console.log('\n3. Testing User Login...');
    const loginResponse = await axios.post(`${BASE_URL}/auth/login`, {
      username: testUser.username,
      password: testUser.password
    });
    console.log('✅ Login successful');

    // Test 4: Create Article
    console.log('\n4. Testing Article Creation...');
    const createResponse = await axios.post(`${BASE_URL}/articles`, testArticle, {
      headers: { Authorization: `Bearer ${authToken}` }
    });
    const articleId = createResponse.data.data.article.id;
    console.log('✅ Article created successfully:', createResponse.data.data.article.title);

    // Test 5: Get All Articles
    console.log('\n5. Testing Get All Articles...');
    const getAllResponse = await axios.get(`${BASE_URL}/articles`, {
      headers: { Authorization: `Bearer ${authToken}` }
    });
    console.log('✅ Retrieved articles successfully. Count:', getAllResponse.data.data.articles.length);

    // Test 6: Get Single Article
    console.log('\n6. Testing Get Single Article...');
    const getSingleResponse = await axios.get(`${BASE_URL}/articles/${articleId}`, {
      headers: { Authorization: `Bearer ${authToken}` }
    });
    console.log('✅ Retrieved single article:', getSingleResponse.data.data.article.title);

    // Test 7: Update Article
    console.log('\n7. Testing Article Update...');
    const updateResponse = await axios.put(`${BASE_URL}/articles/${articleId}`, {
      title: 'Updated Test Article',
      body: 'This article has been updated.',
      status: 'published'
    }, {
      headers: { Authorization: `Bearer ${authToken}` }
    });
    console.log('✅ Article updated successfully');

    // Test 8: Search Articles
    console.log('\n8. Testing Article Search...');
    const searchResponse = await axios.get(`${BASE_URL}/articles?search=test`, {
      headers: { Authorization: `Bearer ${authToken}` }
    });
    console.log('✅ Search completed. Found:', searchResponse.data.data.articles.length, 'articles');

    // Test 9: Filter Articles by Status
    console.log('\n9. Testing Article Filter by Status...');
    const filterResponse = await axios.get(`${BASE_URL}/articles?status=published`, {
      headers: { Authorization: `Bearer ${authToken}` }
    });
    console.log('✅ Filter completed. Published articles:', filterResponse.data.data.articles.length);

    // Test 10: Pagination
    console.log('\n10. Testing Pagination...');
    const paginationResponse = await axios.get(`${BASE_URL}/articles?page=1&limit=5`, {
      headers: { Authorization: `Bearer ${authToken}` }
    });
    console.log('✅ Pagination working. Current page:', paginationResponse.data.data.pagination.currentPage);

    // Test 11: Delete Article
    console.log('\n11. Testing Article Deletion...');
    const deleteResponse = await axios.delete(`${BASE_URL}/articles/${articleId}`, {
      headers: { Authorization: `Bearer ${authToken}` }
    });
    console.log('✅ Article deleted successfully');

    console.log('\n🎉 All tests passed successfully!');
    console.log('\n📚 API Documentation available at: http://localhost:3000/api-docs');

  } catch (error) {
    console.error('\n❌ Test failed:', error.response?.data || error.message);
    console.log('\n💡 Make sure the server is running on http://localhost:3000');
  }
}

// Run tests if this file is executed directly
if (require.main === module) {
  testAPI();
}

module.exports = testAPI; 