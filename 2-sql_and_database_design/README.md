# SQL dan Database Design - Article Management System

## Struktur Tabel

```sql
CREATE TABLE users (
    id SERIAL PRIMARY KEY,
    username VARCHAR(50) NOT NULL,
    email VARCHAR(100),
    created_at TIMESTAMP DEFAULT NOW()
);

CREATE TABLE articles (
    id SERIAL PRIMARY KEY,
    user_id INTEGER REFERENCES users(id),
    title TEXT,
    body TEXT,
    status VARCHAR(20),
    created_at TIMESTAMP DEFAULT NOW()
);
```

## Jawaban Pertanyaan

### 1. SQL untuk Menampilkan 5 Artikel Terakhir dari User Tertentu

#### Query 1: Menggunakan JOIN
```sql
SELECT 
    a.id,
    a.title,
    a.body,
    a.status,
    a.created_at,
    u.username
FROM articles a
JOIN users u ON a.user_id = u.id
WHERE u.username = 'john_doe'
ORDER BY a.created_at DESC
LIMIT 5;
```

#### Query 2: Menggunakan User ID
```sql
SELECT 
    a.id,
    a.title,
    a.body,
    a.status,
    a.created_at
FROM articles a
WHERE a.user_id = 1
ORDER BY a.created_at DESC
LIMIT 5;
```

#### Query 3: Dengan Informasi User Lengkap
```sql
SELECT 
    a.id,
    a.title,
    a.body,
    a.status,
    a.created_at,
    u.username,
    u.email
FROM articles a
INNER JOIN users u ON a.user_id = u.id
WHERE u.id = 1
ORDER BY a.created_at DESC
LIMIT 5;
```

### 2. SQL untuk Menghitung Jumlah Artikel Published dan Draft per User

#### Query 1: Menggunakan GROUP BY dan COUNT
```sql
SELECT 
    u.username,
    u.email,
    COUNT(CASE WHEN a.status = 'published' THEN 1 END) as published_count,
    COUNT(CASE WHEN a.status = 'draft' THEN 1 END) as draft_count,
    COUNT(*) as total_articles
FROM users u
LEFT JOIN articles a ON u.id = a.user_id
GROUP BY u.id, u.username, u.email
ORDER BY total_articles DESC;
```

#### Query 2: Menggunakan PIVOT (PostgreSQL)
```sql
SELECT 
    u.username,
    u.email,
    COALESCE(published.count, 0) as published_count,
    COALESCE(draft.count, 0) as draft_count,
    COALESCE(published.count, 0) + COALESCE(draft.count, 0) as total_articles
FROM users u
LEFT JOIN (
    SELECT user_id, COUNT(*) as count
    FROM articles 
    WHERE status = 'published'
    GROUP BY user_id
) published ON u.id = published.user_id
LEFT JOIN (
    SELECT user_id, COUNT(*) as count
    FROM articles 
    WHERE status = 'draft'
    GROUP BY user_id
) draft ON u.id = draft.user_id
ORDER BY total_articles DESC;
```

#### Query 3: Dengan Filter User Tertentu
```sql
SELECT 
    u.username,
    COUNT(CASE WHEN a.status = 'published' THEN 1 END) as published_count,
    COUNT(CASE WHEN a.status = 'draft' THEN 1 END) as draft_count,
    COUNT(*) as total_articles
FROM users u
LEFT JOIN articles a ON u.id = a.user_id
WHERE u.username = 'john_doe'
GROUP BY u.id, u.username;
```

### 3. Optimasi Query (Minimal 2 Cara)

#### Optimasi 1: Menambahkan Index
```sql
-- Index untuk foreign key
CREATE INDEX idx_articles_user_id ON articles(user_id);

-- Index untuk status (jika sering filter by status)
CREATE INDEX idx_articles_status ON articles(status);

-- Index untuk created_at (untuk sorting)
CREATE INDEX idx_articles_created_at ON articles(created_at);

-- Composite index untuk kombinasi user_id dan created_at
CREATE INDEX idx_articles_user_created ON articles(user_id, created_at DESC);

-- Composite index untuk user_id dan status
CREATE INDEX idx_articles_user_status ON articles(user_id, status);
```

#### Optimasi 2: Query Optimization
```sql
-- Query yang dioptimasi untuk 5 artikel terakhir
SELECT 
    a.id,
    a.title,
    a.body,
    a.status,
    a.created_at
FROM articles a
WHERE a.user_id = 1
ORDER BY a.created_at DESC
LIMIT 5;
```

#### Optimasi 3: Materialized View (untuk data yang jarang berubah)
```sql
-- Membuat materialized view untuk statistik artikel
CREATE MATERIALIZED VIEW article_stats AS
SELECT 
    u.id as user_id,
    u.username,
    COUNT(CASE WHEN a.status = 'published' THEN 1 END) as published_count,
    COUNT(CASE WHEN a.status = 'draft' THEN 1 END) as draft_count,
    COUNT(*) as total_articles
FROM users u
LEFT JOIN articles a ON u.id = a.user_id
GROUP BY u.id, u.username;

-- Refresh materialized view
REFRESH MATERIALIZED VIEW article_stats;

-- Query dari materialized view
SELECT * FROM article_stats WHERE username = 'john_doe';
```

#### Optimasi 4: Partitioning (untuk data besar)
```sql
-- Partitioning berdasarkan created_at
CREATE TABLE articles_partitioned (
    id SERIAL,
    user_id INTEGER,
    title TEXT,
    body TEXT,
    status VARCHAR(20),
    created_at TIMESTAMP DEFAULT NOW()
) PARTITION BY RANGE (created_at);

-- Membuat partition per bulan
CREATE TABLE articles_2024_01 PARTITION OF articles_partitioned
FOR VALUES FROM ('2024-01-01') TO ('2024-02-01');

CREATE TABLE articles_2024_02 PARTITION OF articles_partitioned
FOR VALUES FROM ('2024-02-01') TO ('2024-03-01');
```

#### Optimasi 5: Query Hints dan Execution Plan
```sql
-- Menggunakan EXPLAIN untuk menganalisis query
EXPLAIN (ANALYZE, BUFFERS) 
SELECT 
    a.id,
    a.title,
    a.body,
    a.status,
    a.created_at
FROM articles a
WHERE a.user_id = 1
ORDER BY a.created_at DESC
LIMIT 5;

-- Menggunakan query hints
SELECT /*+ INDEX(a idx_articles_user_created) */
    a.id,
    a.title,
    a.body,
    a.status,
    a.created_at
FROM articles a
WHERE a.user_id = 1
ORDER BY a.created_at DESC
LIMIT 5;
```

## Contoh Data untuk Testing

```sql
-- Insert sample users
INSERT INTO users (username, email) VALUES
('john_doe', 'john@example.com'),
('jane_smith', 'jane@example.com'),
('bob_wilson', 'bob@example.com');

-- Insert sample articles
INSERT INTO articles (user_id, title, body, status, created_at) VALUES
(1, 'Introduction to Node.js', 'Node.js is a JavaScript runtime...', 'published', '2024-01-15 10:00:00'),
(1, 'Express.js Framework', 'Express.js is a web framework...', 'published', '2024-01-20 11:00:00'),
(1, 'Sequelize ORM Tutorial', 'Sequelize is an ORM for Node.js...', 'draft', '2024-01-25 12:00:00'),
(2, 'JavaScript Best Practices', 'Learn JavaScript best practices...', 'published', '2024-01-10 09:00:00'),
(2, 'REST API Design', 'Understanding REST API design...', 'published', '2024-01-18 14:00:00'),
(3, 'PostgreSQL Database', 'PostgreSQL database management...', 'draft', '2024-01-22 16:00:00'),
(3, 'JWT Authentication', 'JWT authentication implementation...', 'published', '2024-01-28 13:00:00');
```

## Best Practices

### 1. Index Strategy
- **Primary Key**: Otomatis ter-index
- **Foreign Key**: Selalu buat index
- **Frequently Queried Columns**: Buat index untuk kolom yang sering di-filter
- **Composite Indexes**: Untuk kombinasi kolom yang sering digunakan bersama

### 2. Query Optimization
- **Use LIMIT**: Selalu gunakan LIMIT untuk query yang bisa return banyak data
- **Avoid SELECT ***: Pilih kolom yang diperlukan saja
- **Use EXPLAIN**: Analisis execution plan untuk query yang lambat
- **Consider Caching**: Gunakan Redis atau application-level caching

### 3. Database Design
- **Normalization**: Pastikan struktur tabel sudah normalized
- **Constraints**: Gunakan foreign key constraints untuk data integrity
- **Data Types**: Pilih data type yang tepat (VARCHAR vs TEXT)
- **Timestamps**: Gunakan TIMESTAMP untuk tracking waktu

### 4. Monitoring
```sql
-- Query untuk melihat index usage
SELECT 
    schemaname,
    tablename,
    indexname,
    idx_scan,
    idx_tup_read,
    idx_tup_fetch
FROM pg_stat_user_indexes
ORDER BY idx_scan DESC;

-- Query untuk melihat slow queries
SELECT 
    query,
    calls,
    total_time,
    mean_time,
    rows
FROM pg_stat_statements
ORDER BY mean_time DESC
LIMIT 10;
```
