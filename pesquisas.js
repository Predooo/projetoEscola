const { type } = require('express/lib/response');
const { Sequelize } = require('./bd');
const db = require('./bd')

const classe = require('./classes');
const especie = require('./especies');
const familia = require('./familias');
const filo = require('./filos');
const genero = require('./generos');
const ordem = require('./ordens');
const reino = require('./reinos');
const dominio = require('./dominios');

const pesquisa = db.sequelize.define('pesquisas', {
    id: {type: db.Sequelize.INTEGER,
        autoIncrement: true,
        allowNull: false,
        primaryKey: true,
    },
    originalname: {type: db.Sequelize.TEXT},
    fileName:{type: db.Sequelize.TEXT}
});
pesquisa.belongsTo(dominio, {
    constraint: true,
    foreignKey: 'fk_dominios'
})
pesquisa.belongsTo(reino, {
    constraint: true,
    foreignKey: 'fk_reinos'
})
pesquisa.belongsTo(filo, {
    constraint: true,
    foreignKey: 'fk_filos'
})
pesquisa.belongsTo(classe, {
    constraint: true,
    foreignKey: 'fk_classes'
})
pesquisa.belongsTo(ordem, {
    constraint: true,
    foreignKey: 'fk_ordens'
})
pesquisa.belongsTo(familia, {
    constraint: true,
    foreignKey: 'fk_familias'
})
pesquisa.belongsTo(genero, {
    constraint: true,
    foreignKey: 'fk_generos'
})
pesquisa.belongsTo(especie, {
    constraint: true,
    foreignKey: 'fk_especies'
})

module.exports = pesquisa;