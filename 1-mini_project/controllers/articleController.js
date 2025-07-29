const { Article, User } = require('../models');
const { Op } = require('sequelize');

// Get all articles with pagination, filtering, and search
const getArticles = async (req, res) => {
  try {
    const { page = 1, limit = 10, status, search } = req.query;
    const userId = req.user.id;

    // Build where clause
    const whereClause = {
      user_id: userId
    };

    // Add status filter
    if (status) {
      whereClause.status = status;
    }

    // Add search filter (case-insensitive)
    if (search) {
      whereClause.title = {
        [Op.iLike]: `%${search}%`
      };
    }

    // Calculate offset
    const offset = (page - 1) * limit;

    // Get articles with pagination
    const { count, rows: articles } = await Article.findAndCountAll({
      where: whereClause,
      include: [
        {
          model: User,
          as: 'user',
          attributes: ['id', 'username', 'email']
        }
      ],
      order: [['created_at', 'DESC']],
      limit: parseInt(limit),
      offset: parseInt(offset)
    });

    // Calculate pagination info
    const totalPages = Math.ceil(count / limit);
    const hasNextPage = page < totalPages;
    const hasPrevPage = page > 1;

    // Handle empty results
    if (articles.length === 0) {
      let message = 'No articles found';
      if (search) {
        message = `No articles found matching "${search}"`;
      } else if (status) {
        message = `No ${status} articles found`;
      }

      return res.json({
        success: true,
        message,
        data: {
          articles: [],
          pagination: {
            currentPage: parseInt(page),
            totalPages,
            totalItems: count,
            hasNextPage,
            hasPrevPage,
            limit: parseInt(limit)
          }
        }
      });
    }

    res.json({
      success: true,
      message: 'Articles retrieved successfully',
      data: {
        articles,
        pagination: {
          currentPage: parseInt(page),
          totalPages,
          totalItems: count,
          hasNextPage,
          hasPrevPage,
          limit: parseInt(limit)
        }
      }
    });
  } catch (error) {
    console.error('Get articles error:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error'
    });
  }
};

// Get single article by ID
const getArticleById = async (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.user.id;

    const article = await Article.findOne({
      where: {
        id,
        user_id: userId
      },
      include: [
        {
          model: User,
          as: 'user',
          attributes: ['id', 'username', 'email']
        }
      ]
    });

    if (!article) {
      return res.status(404).json({
        success: false,
        message: 'Article not found'
      });
    }

    res.json({
      success: true,
      message: 'Article retrieved successfully',
      data: { article }
    });
  } catch (error) {
    console.error('Get article error:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error'
    });
  }
};

// Create new article
const createArticle = async (req, res) => {
  try {
    const { title, body, status = 'draft' } = req.body;
    const userId = req.user.id;

    const article = await Article.create({
      title,
      body,
      status,
      user_id: userId
    });

    // Fetch the created article with user info
    const createdArticle = await Article.findByPk(article.id, {
      include: [
        {
          model: User,
          as: 'user',
          attributes: ['id', 'username', 'email']
        }
      ]
    });

    res.status(201).json({
      success: true,
      message: 'Article created successfully',
      data: { article: createdArticle }
    });
  } catch (error) {
    console.error('Create article error:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error'
    });
  }
};

// Update article
const updateArticle = async (req, res) => {
  try {
    const { id } = req.params;
    const { title, body, status } = req.body;
    const userId = req.user.id;

    // Find article and check ownership
    const article = await Article.findOne({
      where: {
        id,
        user_id: userId
      }
    });

    if (!article) {
      return res.status(404).json({
        success: false,
        message: 'Article not found'
      });
    }

    // Update article
    await article.update({
      title: title || article.title,
      body: body || article.body,
      status: status || article.status
    });

    // Fetch updated article with user info
    const updatedArticle = await Article.findByPk(id, {
      include: [
        {
          model: User,
          as: 'user',
          attributes: ['id', 'username', 'email']
        }
      ]
    });

    res.json({
      success: true,
      message: 'Article updated successfully',
      data: { article: updatedArticle }
    });
  } catch (error) {
    console.error('Update article error:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error'
    });
  }
};

// Delete article
const deleteArticle = async (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.user.id;

    // Find article and check ownership
    const article = await Article.findOne({
      where: {
        id,
        user_id: userId
      }
    });

    if (!article) {
      return res.status(404).json({
        success: false,
        message: 'Article not found'
      });
    }

    // Delete article
    await article.destroy();

    res.json({
      success: true,
      message: 'Article deleted successfully'
    });
  } catch (error) {
    console.error('Delete article error:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error'
    });
  }
};

module.exports = {
  getArticles,
  getArticleById,
  createArticle,
  updateArticle,
  deleteArticle
}; 