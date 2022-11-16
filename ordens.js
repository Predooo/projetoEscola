const { type } = require('express/lib/response');
const { Sequelize } = require('./bd');
const db = require('./bd');

const dominio = require('./dominios');
const reino = require('./reinos')
const filo = require('./filos')
const classe = require('./classes');

const ordem = db.sequelize.define('ordens', {
    id: {type: db.Sequelize.INTEGER,
        autoIncrement: true,
        allowNull: false,
        primaryKey: true,
    },
    nome:{type: db.Sequelize.TEXT},
    autor:{type: db.Sequelize.TEXT},
    resumo:{type: db.Sequelize.TEXT}
});
ordem.belongsTo(dominio, {
    constraint: true,
    foreignKey: 'fk_dominios'
})
ordem.belongsTo(reino, {
    constraint: true,
    foreignKey: 'fk_reinos'
})
ordem.belongsTo(filo, {
    constraint: true,
    foreignKey: 'fk_filos'
})
ordem.belongsTo(classe, {
    constraint: true,
    foreignKey: 'fk_classes'
})

module.exports = ordem;