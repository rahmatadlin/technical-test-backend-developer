const User = require('./User');
const Article = require('./Article');

// Define associations
User.hasMany(Article, {
  foreignKey: 'user_id',
  as: 'articles'
});

Article.belongsTo(User, {
  foreignKey: 'user_id',
  as: 'user'
});

module.exports = {
  User,
  Article
}; 