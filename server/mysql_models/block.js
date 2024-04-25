'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Block extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      Block.belongsTo(models.User, {
        foreignKey: 'blocker_user_id',
        as: 'blocker'
      });

      Block.belongsTo(models.User, {
        foreignKey: 'blocked_user_id',
        as: 'blocked'
      });
    }
  }
  Block.init({
    block_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      autoIncrement: true,
      primaryKey: true
    },
    blocker_user_id: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    blocked_user_id: {
      type: DataTypes.INTEGER,
      allowNull: false
    }
  }, {
    sequelize,
    modelName: 'Block',
  });
  return Block;
};