'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    queryInterface
      .createTable(
        'posts_likes',
        {
          id: {
            type: Sequelize.INTEGER,
            allowNull: false,
            autoIncrement: true,
            primaryKey: true,
          },
          post_id: {
            type: Sequelize.INTEGER,
            allowNull: false,
          },
          user_id: {
            type: Sequelize.INTEGER,
            allowNull: false,
          },
          value: {
            type: Sequelize.INTEGER,
            allowNull: false,
          },
        },
        {},
      )
      .then(() => {
        queryInterface.addConstraint('posts_likes', {
          type: 'unique',
          fields: ['post_id', 'user_id'],
          name: 'posts_likes_post_user_key',
        });
      });
  },

  down: (queryInterface, Sequelize) => {
    return queryInterface.dropTable('posts_likes');
  },
};
