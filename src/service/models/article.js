'use strict';

const {DataTypes, Model} = require(`sequelize`);

class Article extends Model {}

const define = (sequelize) => Article.init({
  title: {
    // eslint-disable-next-line new-cap
    type: DataTypes.STRING(1000),
    allowNull: false
  },
  announce: {
    // Можно воспользоваться скобочной нотацией:
    // type: DataTypes[STRING](1000)
    // eslint-disable-next-line new-cap
    type: DataTypes.STRING(1000),
    allowNull: false
  },
  fullText: {
    // eslint-disable-next-line new-cap
    type: DataTypes.STRING(1000),
    allowNull: false
  },
  picture: DataTypes.STRING,
}, {
  sequelize,
  modelName: `Article`,
  tableName: `articles`
});

module.exports = define;
