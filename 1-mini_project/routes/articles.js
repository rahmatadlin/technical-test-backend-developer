const express = require('express');
const router = express.Router();
const { authenticateToken } = require('../middleware/auth');
const { validateArticle, validateArticleQuery } = require('../middleware/validation');
const {
  getArticles,
  getArticleById,
  createArticle,
  updateArticle,
  deleteArticle
} = require('../controllers/articleController');

/**
 * @swagger
 * components:
 *   schemas:
 *     Article:
 *       type: object
 *       required:
 *         - title
 *         - body
 *       properties:
 *         id:
 *           type: integer
 *           description: Article ID
 *         user_id:
 *           type: integer
 *           description: User ID who owns the article
 *         title:
 *           type: string
 *           description: Article title
 *         body:
 *           type: string
 *           description: Article content
 *         status:
 *           type: string
 *           enum: [draft, published]
 *           default: draft
 *           description: Article status
 *         created_at:
 *           type: string
 *           format: date-time
 *           description: Article creation date
 *         user:
 *           $ref: '#/components/schemas/User'
 *     ArticleRequest:
 *       type: object
 *       required:
 *         - title
 *         - body
 *       properties:
 *         title:
 *           type: string
 *           description: Article title (1-1000 characters)
 *         body:
 *           type: string
 *           description: Article content
 *         status:
 *           type: string
 *           enum: [draft, published]
 *           description: Article status
 *     ArticleResponse:
 *       type: object
 *       properties:
 *         success:
 *           type: boolean
 *         message:
 *           type: string
 *         data:
 *           type: object
 *           properties:
 *             article:
 *               $ref: '#/components/schemas/Article'
 *     ArticlesResponse:
 *       type: object
 *       properties:
 *         success:
 *           type: boolean
 *         message:
 *           type: string
 *         data:
 *           type: object
 *           properties:
 *             articles:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Article'
 *             pagination:
 *               type: object
 *               properties:
 *                 currentPage:
 *                   type: integer
 *                   description: Current page number
 *                 totalPages:
 *                   type: integer
 *                   description: Total number of pages
 *                 totalItems:
 *                   type: integer
 *                   description: Total number of articles
 *                 hasNextPage:
 *                   type: boolean
 *                   description: Whether there is a next page
 *                 hasPrevPage:
 *                   type: boolean
 *                   description: Whether there is a previous page
 *                 limit:
 *                   type: integer
 *                   description: Number of items per page
 */

// Apply authentication middleware to all article routes
router.use(authenticateToken);

/**
 * @swagger
 * /articles:
 *   get:
 *     summary: Get all articles with pagination, filtering, and search
 *     description: |
 *       Retrieve articles with the following features:
 *       - **Pagination**: Use `page` and `limit` parameters
 *       - **Search**: Use `search` parameter for case-insensitive title search
 *       - **Filter**: Use `status` parameter to filter by draft/published
 *       - **Combined**: You can combine all parameters together
 *       
 *       **Examples:**
 *       - `GET /articles` - Get all articles (default pagination)
 *       - `GET /articles?search=golang` - Search for articles with "golang" in title
 *       - `GET /articles?status=published` - Get only published articles
 *       - `GET /articles?page=2&limit=5` - Get page 2 with 5 items per page
 *       - `GET /articles?search=golang&status=published&page=1&limit=10` - Combined search and filter
 *     tags: [Articles]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: page
 *         schema:
 *           type: integer
 *           minimum: 1
 *           default: 1
 *         description: Page number for pagination
 *         example: 1
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *           minimum: 1
 *           maximum: 100
 *           default: 10
 *         description: Number of items per page (max 100)
 *         example: 10
 *       - in: query
 *         name: status
 *         schema:
 *           type: string
 *           enum: [draft, published]
 *         description: Filter articles by status
 *         example: published
 *       - in: query
 *         name: search
 *         schema:
 *           type: string
 *         description: Search articles by title (case-insensitive)
 *         example: golang
 *     responses:
 *       200:
 *         description: Articles retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ArticlesResponse'
 *             examples:
 *               default:
 *                 summary: Default response
 *                 value:
 *                   success: true
 *                   message: "Articles retrieved successfully"
 *                   data:
 *                     articles:
 *                       - id: 1
 *                         title: "Introduction to Node.js"
 *                         body: "Node.js is a JavaScript runtime..."
 *                         status: "published"
 *                         created_at: "2024-01-15T00:00:00.000Z"
 *                         user_id: 1
 *                         user:
 *                           id: 1
 *                           username: "john_doe"
 *                           email: "john@example.com"
 *                     pagination:
 *                       currentPage: 1
 *                       totalPages: 3
 *                       totalItems: 25
 *                       hasNextPage: true
 *                       hasPrevPage: false
 *                       limit: 10
 *               empty:
 *                 summary: No articles found
 *                 value:
 *                   success: true
 *                   message: "No articles found matching \"nonexistent\""
 *                   data:
 *                     articles: []
 *                     pagination:
 *                       currentPage: 1
 *                       totalPages: 0
 *                       totalItems: 0
 *                       hasNextPage: false
 *                       hasPrevPage: false
 *                       limit: 10
 *       401:
 *         description: Unauthorized - Invalid or missing JWT token
 *       500:
 *         description: Internal server error
 */
router.get('/', validateArticleQuery, getArticles);

/**
 * @swagger
 * /articles/{id}:
 *   get:
 *     summary: Get single article by ID
 *     description: Retrieve a specific article by its ID. Users can only access their own articles.
 *     tags: [Articles]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: Article ID
 *         example: 1
 *     responses:
 *       200:
 *         description: Article retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ArticleResponse'
 *       401:
 *         description: Unauthorized - Invalid or missing JWT token
 *       404:
 *         description: Article not found or doesn't belong to user
 *       500:
 *         description: Internal server error
 */
router.get('/:id', getArticleById);

/**
 * @swagger
 * /articles:
 *   post:
 *     summary: Create new article
 *     description: Create a new article. The article will be associated with the authenticated user.
 *     tags: [Articles]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/ArticleRequest'
 *           examples:
 *             draft:
 *               summary: Create draft article
 *               value:
 *                 title: "My New Article"
 *                 body: "This is the content of my article."
 *                 status: "draft"
 *             published:
 *               summary: Create published article
 *               value:
 *                 title: "Published Article"
 *                 body: "This article is published immediately."
 *                 status: "published"
 *     responses:
 *       201:
 *         description: Article created successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ArticleResponse'
 *       400:
 *         description: Validation error - Check request body
 *       401:
 *         description: Unauthorized - Invalid or missing JWT token
 *       500:
 *         description: Internal server error
 */
router.post('/', validateArticle, createArticle);

/**
 * @swagger
 * /articles/{id}:
 *   put:
 *     summary: Update article
 *     description: Update an existing article. Users can only update their own articles.
 *     tags: [Articles]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: Article ID
 *         example: 1
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/ArticleRequest'
 *           examples:
 *             update_title:
 *               summary: Update article title and body
 *               value:
 *                 title: "Updated Article Title"
 *                 body: "Updated article content."
 *             publish_article:
 *               summary: Publish a draft article
 *               value:
 *                 status: "published"
 *     responses:
 *       200:
 *         description: Article updated successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ArticleResponse'
 *       400:
 *         description: Validation error - Check request body
 *       401:
 *         description: Unauthorized - Invalid or missing JWT token
 *       404:
 *         description: Article not found or doesn't belong to user
 *       500:
 *         description: Internal server error
 */
router.put('/:id', validateArticle, updateArticle);

/**
 * @swagger
 * /articles/{id}:
 *   delete:
 *     summary: Delete article
 *     description: Delete an article. Users can only delete their own articles.
 *     tags: [Articles]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: Article ID
 *         example: 1
 *     responses:
 *       200:
 *         description: Article deleted successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                 message:
 *                   type: string
 *             example:
 *               success: true
 *               message: "Article deleted successfully"
 *       401:
 *         description: Unauthorized - Invalid or missing JWT token
 *       404:
 *         description: Article not found or doesn't belong to user
 *       500:
 *         description: Internal server error
 */
router.delete('/:id', deleteArticle);

module.exports = router; 