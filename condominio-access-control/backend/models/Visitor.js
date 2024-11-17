const { DataTypes } = require('sequelize');
const sequelize = require('../database'); // Suponha que `database.js` configure a conexão ao PostgreSQL

const Visitor = sequelize.define('Visitor', {
  nome: {
    type: DataTypes.STRING,
    allowNull: false
  },
  documento: {
    type: DataTypes.STRING,
    allowNull: false
  },
  imagePath: {
    type: DataTypes.STRING,
    allowNull: false
  }
});

module.exports = Visitor;
