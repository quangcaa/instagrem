'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Follow extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      Follow.belongsTo(models.User, {
        foreignKey: 'follower_user_id',
        as: 'follower'
      });

      Follow.belongsTo(models.User, {
        foreignKey: 'followed_user_id',
        as: 'followed'
      });
    }
  }
  Follow.init({
    follow_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      autoIncrement: true,
      primaryKey: true
    },
    follower_user_id: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    followed_user_id: {
      type: DataTypes.INTEGER,
      allowNull: false
    }
  }, {
    sequelize,
    modelName: 'Follow',
  });
  return Follow;
};