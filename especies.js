const { type } = require('express/lib/response');
const { Sequelize } = require('./bd');
const db = require('./bd');

const dominio = require('./dominios');
const reino = require('./reinos')
const filo = require('./filos')
const classe = require('./classes')
const ordem = require('./ordens')
const familia = require('./familias')
const genero = require('./generos')

const especie = db.sequelize.define('especies', {
    id: {type: db.Sequelize.INTEGER,
        autoIncrement: true,
        allowNull: false,
        primaryKey: true,
    },
    nome:{type: db.Sequelize.TEXT},
    autor:{type: db.Sequelize.TEXT},
    resumo:{type: db.Sequelize.TEXT}
});
especie.belongsTo(dominio, {
    constraint: true,
    foreignKey: 'fk_dominios'
})
especie.belongsTo(reino, {
    constraint: true,
    foreignKey: 'fk_reinos'
})
especie.belongsTo(filo, {
    constraint: true,
    foreignKey: 'fk_filos'
})
especie.belongsTo(classe, {
    constraint: true,
    foreignKey: 'fk_classes'
})
especie.belongsTo(ordem, {
    constraint: true,
    foreignKey: 'fk_ordens'
})
especie.belongsTo(familia, {
    constraint: true,
    foreignKey: 'fk_familias'
})
especie.belongsTo(genero, {
    constraint: true,
    foreignKey: 'fk_generos'
})

module.exports = especie;