const { hashSync } = require('bcryptjs');
const { type } = require('express/lib/response');
const { Sequelize } = require('./bd');
const db = require('./bd')

const dominio = require('./dominios');
const reino = require('./reinos')
const filo = require('./filos')

const classe = db.sequelize.define('classes', {
    id: {type: db.Sequelize.INTEGER,
        autoIncrement: true,
        allowNull: false,
        primaryKey: true,
    },
    nome:{type: db.Sequelize.TEXT},
    autor:{type: db.Sequelize.TEXT},
    resumo:{type: db.Sequelize.TEXT}
});
classe.belongsTo(dominio, {
    constraint: true,
    foreignKey: 'fk_dominios'
})
classe.belongsTo(reino, {
    constraint: true,
    foreignKey: 'fk_reinos'
})
classe.belongsTo(filo, {
    constraint: true,
    foreignKey: 'fk_filos'
})
// classe.sync({force:true})

module.exports = classe;