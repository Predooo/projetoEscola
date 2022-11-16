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

const imagem = db.sequelize.define('imagens', {
    id: {type: db.Sequelize.INTEGER,
        autoIncrement: true,
        allowNull: false,
        primaryKey: true,
    },
    nome:{type: db.Sequelize.STRING},
    originalname:{type: db.Sequelize.STRING},
    fileName:{type: db.Sequelize.STRING}
});
imagem.belongsTo(dominio, {
    constraint: true,
    foreignKey: 'fk_dominios'
})
imagem.belongsTo(reino, {
    constraint: true,
    foreignKey: 'fk_reinos'
})
imagem.belongsTo(filo, {
    constraint: true,
    foreignKey: 'fk_filos'
})
imagem.belongsTo(classe, {
    constraint: true,
    foreignKey: 'fk_classes'
})
imagem.belongsTo(ordem, {
    constraint: true,
    foreignKey: 'fk_ordens'
})
imagem.belongsTo(familia, {
    constraint: true,
    foreignKey: 'fk_familias'
})
imagem.belongsTo(genero, {
    constraint: true,
    foreignKey: 'fk_generos'
})
imagem.belongsTo(especie, {
    constraint: true,
    foreignKey: 'fk_especies'
})

module.exports = imagem;