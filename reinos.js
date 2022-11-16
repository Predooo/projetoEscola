const { type } = require('express/lib/response');
const { Sequelize } = require('./bd');
const db = require('./bd');

const dominio = require('./dominios');

const reino = db.sequelize.define('reinos', {
    id: {type: db.Sequelize.INTEGER,
        autoIncrement: true,
        allowNull: false,
        primaryKey: true,
    },
    nome:{type: db.Sequelize.TEXT},
    autor:{type: db.Sequelize.TEXT},
    resumo:{type: db.Sequelize.TEXT}
});
reino.belongsTo(dominio, {
    constraint: true,
    foreignKey: 'fk_dominios'
})

module.exports = reino;