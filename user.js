const { type } = require('express/lib/response');
const { Sequelize } = require('./bd');
const db = require('./bd')

const usuario = db.sequelize.define('usuarios', {
    nome:{type: db.Sequelize.TEXT},
    sobrenome:{type: db.Sequelize.TEXT,},
    formacao:{type: db.Sequelize.TEXT},
    email:{type: db.Sequelize.TEXT},
    senha:{type: db.Sequelize.TEXT}
})

module.exports = usuario;