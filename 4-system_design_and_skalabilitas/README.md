# SYSTEM DESIGN & SKALABILITAS

## Arsitektur untuk 1 Juta Pengguna

### 1. Load Balancer & Multiple Instances

- Gunakan load balancer (nginx/HAProxy) untuk mendistribusi traffic
- Deploy multiple Node.js instances dengan PM2 cluster mode
- Implementasi horizontal scaling dengan container (Docker + Kubernetes)

### 2. Database Scaling Strategy

#### Read Replicas
- Pisahkan read/write operations
- Master database untuk write operations
- Multiple read replicas untuk query artikel dan user data

#### Database Partitioning
- Partition users berdasarkan user_id atau region
- Partition articles berdasarkan created_at (monthly/yearly)

### Connection Pooling
- Gunakan pg-pool untuk PostgreSQL connection management

### 3. Caching Layer

```javascript
// Redis untuk session dan frequent queries
const redis = require('redis');
const client = redis.createClient();

// Cache popular articles
app.get('/articles/popular', async (req, res) => {
  const cached = await client.get('popular_articles');
  if (cached) return res.json(JSON.parse(cached));
  
  const articles = await db.query('SELECT * FROM articles WHERE status = $1 ORDER BY views DESC LIMIT 10', ['published']);
  await client.setex('popular_articles', 300, JSON.stringify(articles)); // 5 min TTL
  res.json(articles);
});
```

## Komponen yang Harus Di-scale

### 1. Application Layer
- Horizontal scaling dengan container orchestration
- Stateless application design
- Microservices architecture untuk fitur kompleks

### 2. Database Layer
- Read replicas untuk query-heavy operations
- Database sharding untuk write-heavy scenarios
- Indexing optimization:

```sql
CREATE INDEX idx_articles_user_status ON articles(user_id, status);
CREATE INDEX idx_articles_created_at ON articles(created_at DESC);
CREATE INDEX idx_users_email ON users(email);
```

### 3. Caching Strategy
- Redis cluster untuk session storage
- CDN untuk static assets
- Application-level caching untuk expensive queries

### 4. Message Queue
- Implement async processing dengan Bull Queue atau AWS SQS
- Background jobs untuk email notifications, image processing

## Mengatasi Endpoint API Lambat (>3 detik)

### 1. Profiling & Monitoring

```javascript
// Add performance monitoring
const performanceMiddleware = (req, res, next) => {
  const start = Date.now();
  res.on('finish', () => {
    const duration = Date.now() - start;
    if (duration > 3000) {
      console.warn(`Slow endpoint: ${req.method} ${req.path} - ${duration}ms`);
    }
  });
  next();
};
```

### 2. Database Query Optimization

```javascript
// Before: N+1 query problem
const getArticlesWithUsers = async () => {
  const articles = await db.query('SELECT * FROM articles');
  for (let article of articles) {
    article.user = await db.query('SELECT * FROM users WHERE id = $1', [article.user_id]);
  }
};

// After: Single JOIN query
const getArticlesWithUsers = async () => {
  return await db.query(`
    SELECT a.*, u.username, u.email 
    FROM articles a 
    JOIN users u ON a.user_id = u.id 
    WHERE a.status = 'published'
  `);
};
```

### 3. Implement Caching

```javascript
// Cache expensive operations
const getArticleWithCache = async (articleId) => {
  const cacheKey = `article_${articleId}`;
  let article = await redis.get(cacheKey);
  
  if (!article) {
    article = await db.query('SELECT * FROM articles WHERE id = $1', [articleId]);
    await redis.setex(cacheKey, 3600, JSON.stringify(article)); // 1 hour
  } else {
    article = JSON.parse(article);
  }
  
  return article;
};
```

### 4. Pagination & Limiting

```javascript
// Add pagination untuk large datasets
app.get('/articles', async (req, res) => {
  const page = parseInt(req.query.page) || 1;
  const limit = Math.min(parseInt(req.query.limit) || 20, 100); // Max 100
  const offset = (page - 1) * limit;
  
  const articles = await db.query(`
    SELECT * FROM articles 
    WHERE status = 'published' 
    ORDER BY created_at DESC 
    LIMIT $1 OFFSET $2
  `, [limit, offset]);
  
  res.json({ articles, page, limit });
});
```

### 5. Async Processing

```javascript
// Move heavy operations to background jobs
const Queue = require('bull');
const emailQueue = new Queue('email processing');

app.post('/articles', async (req, res) => {
  const article = await db.query('INSERT INTO articles ... RETURNING *');
  
  // Send notification asynchronously
  emailQueue.add('notify_subscribers', { articleId: article.id });
  
  res.json(article); // Return immediately
});
```