'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class searchHistory extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      searchHistory.belongsTo(models.User, {
        foreignKey: 'user_id',
        as: 'seacher'
      });

      searchHistory.belongsTo(models.User, {
        foreignKey: 'looking_for_user_id',
        as: 'look_for_user'
      });
    }
  }
  searchHistory.init({
    history_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      autoIncrement: true,
      primaryKey: true
    },
    user_id: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    looking_for_user_id: {
      type: DataTypes.INTEGER,
      allowNull: false
    }
  }, {
    sequelize,
    modelName: 'searchHistory',
  });
  return searchHistory;
};