const { type } = require('express/lib/response');
const { Sequelize } = require('./bd');
const db = require('./bd')

const dominio = require('./dominios');
const reino = require('./reinos');

const filo = db.sequelize.define('filos', {
    id: {type: db.Sequelize.INTEGER,
        autoIncrement: true,
        allowNull: false,
        primaryKey: true,
    },
    nome:{type: db.Sequelize.TEXT},
    autor:{type: db.Sequelize.TEXT},
    resumo:{type: db.Sequelize.TEXT}
});
filo.belongsTo(dominio, {
    constraint: true,
    foreignKey: 'fk_dominios'
})
filo.belongsTo(reino, {
    constraint: true,
    foreignKey: 'fk_reinos'
})

module.exports = filo;