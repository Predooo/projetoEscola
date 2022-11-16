// BANCO DE DADOS
const Sequelize = require('sequelize')

const sequelize = new Sequelize('taxon', 'root', 'mynewpassword',{
    host: 'localhost',
    dialect: 'mysql'
})

module.exports = {
    Sequelize: Sequelize,
    sequelize: sequelize
}