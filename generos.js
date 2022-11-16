const { type } = require('express/lib/response');
const { Sequelize } = require('./bd');
const db = require('./bd');

const dominio = require('./dominios');
const reino = require('./reinos')
const filo = require('./filos')
const classe = require('./classes')
const ordem = require('./ordens')
const familia = require('./familias')

const genero = db.sequelize.define('generos', {
    id: {type: db.Sequelize.INTEGER,
        autoIncrement: true,
        allowNull: false,
        primaryKey: true,
    },
    nome:{type: db.Sequelize.TEXT},
    autor:{type: db.Sequelize.TEXT},
    resumo:{type: db.Sequelize.TEXT}
});
genero.belongsTo(dominio, {
    constraint: true,
    foreignKey: 'fk_dominios'
})
genero.belongsTo(reino, {
    constraint: true,
    foreignKey: 'fk_reinos'
})
genero.belongsTo(filo, {
    constraint: true,
    foreignKey: 'fk_filos'
})
genero.belongsTo(classe, {
    constraint: true,
    foreignKey: 'fk_classes'
})
genero.belongsTo(ordem, {
    constraint: true,
    foreignKey: 'fk_ordens'
})
genero.belongsTo(familia, {
    constraint: true,
    foreignKey: 'fk_familias'
})

module.exports = genero;