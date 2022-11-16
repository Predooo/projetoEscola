const { type } = require('express/lib/response');
const { Sequelize } = require('./bd');
const db = require('./bd');

const dominio = require('./dominios');
const reino = require('./reinos')
const filo = require('./filos')
const classe = require('./classes')
const ordem = require('./ordens');

const familia = db.sequelize.define('familias', {
    id: {type: db.Sequelize.INTEGER,
        autoIncrement: true,
        allowNull: false,
        primaryKey: true,
    },
    nome:{type: db.Sequelize.TEXT},
    autor:{type: db.Sequelize.TEXT},
    resumo:{type: db.Sequelize.TEXT}
});
familia.belongsTo(dominio, {
    constraint: true,
    foreignKey: 'fk_dominios'
})
familia.belongsTo(reino, {
    constraint: true,
    foreignKey: 'fk_reinos'
})
familia.belongsTo(filo, {
    constraint: true,
    foreignKey: 'fk_filos'
})
familia.belongsTo(classe, {
    constraint: true,
    foreignKey: 'fk_classes'
})
familia.belongsTo(ordem, {
    constraint: true,
    foreignKey: 'fk_ordens'
})

module.exports = familia;