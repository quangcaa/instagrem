'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Activity extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      Activity.belongsTo(models.User, {
        foreignKey: 'sender_id',
        as: 'sender'
      });

      Activity.belongsTo(models.User, {
        foreignKey: 'receiver_id',
        as: 'receiver'
      });
    }
  }
  Activity.init({
    activity_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      autoIncrement: true,
      primaryKey: true
    },
    sender_id: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    receiver_id: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    activity_type: {
      type: DataTypes.ENUM('follows', 'likes', 'replies', 'mentions', 'reposts'),
      allowNull: false
    },
    post_id: {
      type: DataTypes.INTEGER
    },
    comment_id: {
      type: DataTypes.STRING
    },
    activity_title: {
      type: DataTypes.STRING
    },
    activity_message: {
      type: DataTypes.STRING
    },
    is_read: {
      type: DataTypes.BOOLEAN,
      defaultValue: false
    },
  }, {
    sequelize,
    modelName: 'Activity',
    tableName: 'activities'
  });
  return Activity;
};