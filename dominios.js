const { type } = require('express/lib/response');
const { Sequelize } = require('./bd');
const db = require('./bd')

const dominio = db.sequelize.define('dominios', {
    id: {type: db.Sequelize.INTEGER,
        autoIncrement: true,
        allowNull: false,
        primaryKey: true,
    },
    nome:{type: db.Sequelize.TEXT},
    autor:{type: db.Sequelize.TEXT},
    resumo:{type: db.Sequelize.TEXT}
});

module.exports = dominio;