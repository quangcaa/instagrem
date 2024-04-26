'use strict'
const {
  Model
} = require('sequelize')
module.exports = (sequelize, DataTypes) => {
  class User extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      User.hasMany(models.Follow, {
        foreignKey: 'follower_user_id',
        as: 'getFollows'
      });
      User.hasMany(models.Follow, {
        foreignKey: 'followed_user_id',
        as: 'getFollowers'
      });

      User.hasMany(models.searchHistory, {
        foreignKey: 'user_id',
        as: 'getSearch'
      });
      User.hasMany(models.searchHistory, {
        foreignKey: 'looking_for_user_id',
        as: 'getLookFor'
      });

      User.hasMany(models.Block, {
        foreignKey: 'blocker_user_id',
        as: 'getBlocks'
      });
      User.hasMany(models.Block, {
        foreignKey: 'blocked_user_id',
        as: 'getBlocked'
      });

      User.hasMany(models.Activity, {
        foreignKey: 'sender_id',
        as: 'sendedActivities'
      });
      User.hasMany(models.Activity, {
        foreignKey: 'receiver_id',
        as: 'receivedActivities'
      });
    }
  }
  User.init({
    user_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      autoIncrement: true,
      primaryKey: true
    },
    username: {
      type: DataTypes.STRING,
      allowNull: false
    },
    email: {
      type: DataTypes.STRING,
      allowNull: false
    },
    password: {
      type: DataTypes.STRING,
      allowNull: false
    },
    full_name: {
      type: DataTypes.STRING,
      defaultValue: null
    },
    bio: {
      type: DataTypes.STRING,
      defaultValue: null
    },
    profile_image_url: {
      type: DataTypes.STRING,
      defaultValue: null
    },
  }, {
    sequelize,
    modelName: 'User',
    timestamps: true,
    indexes: [
      {
        name: 'idx_username',
        fields: ['username']  // Regular index on username
      }
    ]
  })
  return User
}