// modulos
const express = require("express");
const app = express();
const bodyParser = require('body-parser');
const session = require("express-session")
var path = require('path');
const multer = require('multer');
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'public/uploads');
  },
  filename: function (req, file, cb) {
    cb(null, file.originalname + dates + path.extname(file.originalname));
  }
})
var upload = multer({ storage });

// banco de dados
const usuario = require('./user');
const dominio = require('./dominios');
const reino = require('./reinos');
const filo = require('./filos');
const classe = require('./classes');
const ordem = require('./ordens');
const familia = require('./familias');
const genero = require('./generos');
const especie = require('./especies');
const pesquisa = require('./pesquisas');
const imagem = require('./imagens');
const { sequelize } = require('./bd');
const { Sequelize } = require('./bd');
const { or, and, gt, lt } = Sequelize.Op;
const bcrypt = require('bcryptjs');
// sessão
app.use(session({
  secret: "amamosbiotecnologia",
  resave: true,
  saveUninitialized: true
}))
//configurando o EJS
app.set('view engine', 'ejs');

// body-parser
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

// variaveis e funcoes
var dates = Date.now(), i = 0, erro_login = [], erros = [];

function alterURL(url) {
  if (url == "TABELA_DOMINIOS") {
    url = "TABELA_REINOS"
  } else if (url == "TABELA_REINOS") {
    url = "TABELA_FILOS"
  } else if (url == "TABELA_FILOS") {
    url = "TABELA_CLASSES"
  } else if (url == "TABELA_CLASSES") {
    url = "TABELA_ORDENS"
  } else if (url == "TABELA_ORDENS") {
    url = "TABELA_FAMILIAS"
  } else if (url == "TABELA_FAMILIAS") {
    url = "TABELA_GENEROS"
  } else if (url == "TABELA_GENEROS") {
    url = "TABELA_ESPECIES"
  } return url
}

// ********************* ROTAS *************************** 
/// LOGIN E REGISTRO
app.get('/', function (req, res) {
  req.session.login = false
  req.session.user = ""
  res.render('login', { title: '', erro_login: erro_login });
});
app.get('/login', function (req, res) {
  req.session.login = false
  req.session.user = ""
  res.render('login', { title: 'Express', erro_login: erro_login });
});
app.post('/logar', (req, res, next) => {
  req.session.login = false
  usuario.findOne({ where: { email: req.body.email } }).then((params) => {
    console.log(params)
    if (!params) {
      erro_login.push({ texto: "Email não consta na base de dados!" })
      res.redirect('/login')
      next()
    } else {
      let validar = bcrypt.compareSync(req.body.senha, params.senha);
      if (!validar) {
        erro_login.push({ texto: "Email ou senha incorretos!" })
        res.redirect('/login')
      } else {
        req.session.user = params.nome + " " + params.sobrenome
        req.session.login = true
        res.redirect('/home')
      }
    }
  }).catch(() => {
    erro_login.push({ texto: "Tente novamente mais tarde!" })
    res.redirect('/login')
  })
})
app.get('/register', function (req, res, next) {
  res.render('register', { erros: erros });
});
app.post('/registrodedados', function (req, res, next) {
  if (!req.body.nome || typeof req.body.nome == undefined || req.body.nome == null) {
    erros.push({ texto: "Nome Inválido!" })
  } if (!req.body.sobrenome || typeof req.body.sobrenome == undefined || req.body.sobrenome == null) {
    erros.push({ texto: "Sobrenome Inválido!" })
  } if (!req.body.email || typeof req.body.email == undefined || req.body.email == null) {
    erros.push({ texto: "Email Inválido!" })
  } if (!req.body.senha || typeof req.body.senha == undefined || req.body.senha == null) {
    erros.push({ texto: "Senha Inválida!" })
  } if (req.body.senha.length < 6) {
    erros.push({ texto: "A senha deve ter no mínimo 6 caracteres!" })
  } if (req.body.senha != req.body.senha2) {
    erros.push({ texto: "As senhas não estão iguais!" })
  } if (!req.body.formacao || typeof req.body.formacao == undefined || req.body.formacao == null) {
    erros.push({ texto: "Formação Inválida!" })
  }
  if (erros.length > 0) {
    res.render('register', { erros: erros });
  } else {
    usuario.findAll({ where: { email: req.body.email } }).then((params) => {
      if (params.length > 0) {
        erros.push({ texto: "Já possui um usuário com este email!" })
        res.render('register', { erros: erros })
      } else {
        const novoUsuario = new usuario({
          id: null,
          nome: req.body.nome,
          sobrenome: req.body.sobrenome,
          formacao: req.body.formacao,
          email: req.body.email,
          senha: req.body.senha
        })
        bcrypt.genSalt(10, (erro, salt) => {
          bcrypt.hash(novoUsuario.senha, salt, (erro, hash) => {
            if (erro) {
              erros = "Ocorreu um erro ao salvar usuário no Banco de Dados!"
              res.redirect("/register")
            }
            novoUsuario.senha = hash;
            novoUsuario.save().then(() => {
              res.redirect('/login')
            }).catch((err) => {
              erros = "Ocorreu um erro ao salvar usuário no Banco de Dados!"
              res.redirect('/register')
            })
          })

        })
      }
    })
  }
})

/// GET Home
app.get('/home', function (req, res,) {
  req.session.fk_dominios = ""
  req.session.fk_reinos = ""
  req.session.fk_filos = ""
  req.session.fk_classes = ""
  req.session.fk_ordens = ""
  req.session.fk_familias = ""
  req.session.fk_generos = ""
  req.session.fk_especies = ""
  req.session.url = "TABELA_DOMINIOS"
  if (!req.session.login) { res.redirect('/login') } else {
    dominio.findAll().then(function (params) {
      imagem.findAll({
        where: {
          [or]: [
            { id: '1' },
            {
              [and]: [
                { id: { [gt]: 1 } },
                { id: { [lt]: 100 } }
              ]
            }
          ]
        }
      }).then((img) => {
        req.session.params = params
        req.session.resumo = "Os dominios são a maior classificacao existente, eles abrangem toda a vida do planeta!"
        res.render('index', { title: params, resumo: req.session.resumo, img: img, user: req.session.user })
      })
    })
  }
});

////  *********************** ROTA DE REDIRECIONAMENTO PARA ADICIONAR *****************************
/////////// BOTÃO DE ADICIONAR
// DOMINIOS
app.get('/adicionarDominios', (req, res) => {
  if (!req.session.login) { res.redirect('/login') }
  else {
    dominio.findAll({
      where: {
        [or]: [
          { id: '1' }
        ]
      }
    }).then(function (params) {
      res.render('adicionarTaxon', { title: params, user: req.session.user })
    }).catch(function (erro) {
      res.redirect('/home')
    })
  }
})
// REINOS 
app.get('/adicionarReinos', (req, res) => {
  if (!req.session.login) { res.redirect('/login') }
  else {
    dominio.findAll({
      where: {
        [or]: [
          { id: req.session.fk_dominios },
          { id: '1' }
        ]
      }
    }).then(function (params) {
      res.render('adicionarTaxon', { title: params, user: req.session.user })
    }).catch(function (erro) {
      res.redirect('/home')
    })
  }
})
// FILOS 
app.get('/adicionarFilos', (req, res) => {
  if (!req.session.login) { res.redirect('/login') }
  else {
    reino.findAll({
      where: {
        [or]: [
          { 
            id: req.session.fk_reinos,
            fk_dominios: req.session.fk_dominios
          },
          { id: '1' }
        ]
      }
    }).then(function (params) {
      console.log(req.session.url+ req.session.fk_dominios+" PREDO" + req.session.fk_reinos)
      res.render('adicionarTaxon', { title: params, user: req.session.user })
    }).catch(function (erro) {
      res.redirect('/home')
    })
  }
})
// CLASSES 
app.get('/adicionarClasses', (req, res) => {
  if (!req.session.login) { res.redirect('/login') }
  else {
    filo.findAll({
      where: {
        [or]: [
          {
            id: req.session.fk_filos,
            fk_dominios: req.session.fk_dominios,
            fk_reinos: req.session.fk_reinos
          },
          { id: '1' }
        ]
      }
    }).then(function (params) {
      res.render('adicionarTaxon', { title: params, user: req.session.user })
    }).catch(function (erro) {
      res.redirect('/home')
    })
  }
})
// ORDENS 
app.get('/adicionarOrdens', (req, res) => {
  if (!req.session.login) { res.redirect('/login') }
  else {
    classe.findAll({
      where: {
        [or]: [
          {
            id: req.session.fk_classes,
            fk_dominios: req.session.fk_dominios,
            fk_reinos: req.session.fk_reinos,
            fk_filos: req.session.fk_filos
          },
          { id: '1' }
        ]
      }
    }).then(function (params) {
      res.render('adicionarTaxon', { title: params, user: req.session.user })
    }).catch(function (erro) {
      res.redirect('/home')
    })
  }
})
// FAMILIA 
app.get('/adicionarFamilias', (req, res) => {
  if (!req.session.login) { res.redirect('/login') }
  else {
    ordem.findAll({
      where: {
        [or]: [
          {
            id: req.session.fk_ordens,
            fk_dominios: req.session.fk_dominios,
            fk_reinos: req.session.fk_reinos,
            fk_filos: req.session.fk_filos,
            fk_classes: req.session.fk_classes
          },
          { id: '1' }
        ]
      }
    }).then(function (params) {
      res.render('adicionarTaxon', { title: params, user: req.session.user })
    }).catch(function (erro) {
      res.redirect('/home')
    })
  }
})
// GENERO 
app.get('/adicionarGeneros', (req, res) => {
  if (!req.session.login) { res.redirect('/login') }
  else {
    familia.findAll({
      where: {
        [or]: [
          {
            id: req.session.fk_familias,
            fk_dominios: req.session.fk_dominios,
            fk_reinos: req.session.fk_reinos,
            fk_filos: req.session.fk_filos,
            fk_classes: req.session.fk_classes,
            fk_ordens: req.session.fk_ordens
          },
          { id: '1' }
        ]
      }
    }).then(function (params) {
      res.render('adicionarTaxon', { title: params, user: req.session.user })
    }).catch(function (erro) {
      res.redirect('/home')
    })
  }
})
// ESPECIE 
app.get('/adicionarEspecies', (req, res) => {
  if (!req.session.login) { res.redirect('/login') }
  else {
    genero.findAll({
      where: {
        [or]: [
          {
            id: req.session.fk_generos,
            fk_dominios: req.session.fk_dominios,
            fk_reinos: req.session.fk_reinos,
            fk_filos: req.session.fk_filos,
            fk_classes: req.session.fk_classes,
            fk_ordens: req.session.fk_ordens
          },
          { id: '1' }
        ]
      }
    }).then(function (params) {
      res.render('adicionarTaxon', { title: params, user: req.session.user })
    }).catch(function (erro) {
      res.redirect('/home')
    })
  }
})
// add button
app.post('/adicionarTaxons', (req, res) => {
  if (!req.session.login) { res.redirect('/login') }
  else {
    if (req.body.chave == "1") {
      if (req.session.url == "TABELA_DOMINIOS") {
        if (!req.body.chavePaginaClado) {
          req.session.fk_dominios = req.body.fk
        }
        req.session.url = "TABELA_REINOS"
      } else if (req.session.url == "TABELA_REINOS") {
        if (!req.body.chavePaginaClado) {
          req.session.fk_reinos = req.body.fk
        }
        req.session.url = "TABELA_FILOS"
      } else if (req.session.url == "TABELA_FILOS") {
        if (!req.body.chavePaginaClado) {
          req.session.fk_filos = req.body.fk
        }
        req.session.url = "TABELA_CLASSES"
      } else if (req.session.url == "TABELA_CLASSES") {
        if (!req.body.chavePaginaClado) {
          req.session.fk_classes = req.body.fk
        }
        req.session.url = "TABELA_ORDENS"
      } else if (req.session.url == "TABELA_ORDENS") {
        if (!req.body.chavePaginaClado) {
          req.session.fk_ordens = req.body.fk
        }
        req.session.url = "TABELA_FAMILIAS"
      } else if (req.session.url == "TABELA_FAMILIAS") {
        if (!req.body.chavePaginaClado) {
          req.session.fk_familias = req.body.fk
        }
        req.session.url = "TABELA_GENEROS"
      } else if (req.session.url == "TABELA_GENEROS") {
        if (!req.body.chavePaginaClado) {
          req.session.fk_generos = req.body.fk
        }
        req.session.url = "TABELA_ESPECIES"
      }
    }
    if (req.session.url == "TABELA_DOMINIOS") {
      res.redirect('/adicionarDominios')
    } else if (req.session.url == "TABELA_REINOS") {
      res.redirect('/adicionarReinos')
    } else if (req.session.url == "TABELA_FILOS") {
      res.redirect('/adicionarFilos')
    } else if (req.session.url == "TABELA_CLASSES") {
      res.redirect('/adicionarClasses')
    } else if (req.session.url == "TABELA_ORDENS") {
      res.redirect('/adicionarOrdens')
    } else if (req.session.url == "TABELA_FAMILIAS") {
      res.redirect('/adicionarFamilias')
    } else if (req.session.url == "TABELA_GENEROS") {
      res.redirect('/adicionarGeneros')
    } else if (req.session.url == "TABELA_ESPECIES") {
      res.redirect('/adicionarEspecies')
    }
  }
})

// ********************* ADICIONAR ARQUIVOS *******************
// GET Arquivos Reinos
app.get('/arquivosDominios', (req, res) => {
  if (!req.session.login) { res.redirect('/login') }
  else {
    dominio.findAll({
      where: { nome: nome }
    }).then(function (params) {
      req.session.fk_dominios = params[0].id
      res.render('adicionarArquivos', { title: params, user: req.session.user })
    }).catch(function (erro) {
      res.redirect('/home')
    })
  }
})
// GET Arquivos Reinos
app.get('/arquivosReinos', (req, res) => {
  if (!req.session.login) { res.redirect('/login') }
  else {
    reino.findAll({
      where: { nome: nome }
    }).then(function (params) {
      req.session.fk_reinos = params[0].id
      res.render('adicionarArquivos', { title: params, user: req.session.user })
    }).catch(function (erro) {
      res.redirect('/home')
    })
  }
})
// GET Arquivos Filos
app.get('/arquivosFilos', (req, res) => {
  if (!req.session.login) { res.redirect('/login') }
  else {
    filo.findAll({
      where: {
        nome: nome,
        fk_dominios: req.session.fk_dominios,
        fk_reinos: req.session.fk_reinos
      }
    }).then(function (params) {
      req.session.fk_filos = params[0].id
      res.render('adicionarArquivos', { title: params, user: req.session.user })
    }).catch(function (erro) {
      res.redirect('/home')
    })
  }
})
// GET Arquivos Classes
app.get('/arquivosClasses', (req, res) => {
  if (!req.session.login) { res.redirect('/login') }
  else {
    classe.findAll({
      where: {
        nome: nome,
        fk_dominios: req.session.fk_dominios,
        fk_reinos: req.session.fk_reinos,
        fk_filos: req.session.fk_filos
      }
    }).then(function (params) {
      req.session.fk_classes = params[0].id
      res.render('adicionarArquivos', { title: params, user: req.session.user })
    }).catch(function (erro) {
      res.redirect('/home')
    })
  }
})
// GET Arquivos Ordens
app.get('/arquivosOrdens', (req, res) => {
  if (!req.session.login) {
    res.redirect('/login')
  } else {
    ordem.findAll({
      where: {
        nome: nome,
        fk_dominios: req.session.fk_dominios,
        fk_reinos: req.session.fk_reinos,
        fk_filos: req.session.fk_filos,
        fk_classes: req.session.fk_classes
      }
    }).then(function (params) {
      req.session.fk_ordens = params[0].id
      res.render('adicionarArquivos', { title: params, user: req.session.user })
    }).catch(function (erro) {
      res.redirect('/home')
    })
  }
})
// GET Arquivos Familias
app.get('/arquivosFamilias', (req, res) => {
  if (!req.session.login) { res.redirect('/login') }
  else {
    familia.findAll({
      where: {
        nome: nome,
        fk_dominios: req.session.fk_dominios,
        fk_reinos: req.session.fk_reinos,
        fk_filos: req.session.fk_filos,
        fk_classes: req.session.fk_classes,
        fk_ordens: req.session.fk_ordens
      }
    }).then(function (params) {
      req.session.fk_familias = params[0].id
      res.render('adicionarArquivos', { title: params, user: req.session.user })
    }).catch(function (erro) {
      console.log()
      res.redirect('/home')
    })
  }
})
// GET Arquivos Generos
app.get('/arquivosGeneros', (req, res) => {
  if (!req.session.login) { res.redirect('/login') }
  else {
    genero.findAll({
      where: {
        nome: nome,
        fk_dominios: req.session.fk_dominios,
        fk_reinos: req.session.fk_reinos,
        fk_filos: req.session.fk_filos,
        fk_classes: req.session.fk_classes,
        fk_ordens: req.session.fk_ordens,
        fk_familias: req.session.fk_familias
      }
    }).then(function (params) {
      req.session.fk_generos = params[0].id
      res.render('adicionarArquivos', { title: params, user: req.session.user })
    }).catch(function (erro) {
      res.redirect('/home')
    })
  }
})
// GET Arquivos Especies
app.get('/arquivosEspecies', (req, res) => {
  if (!req.session.login) { res.redirect('/login') }
  else {
    especie.findAll({
      where: {
        nome: nome,
        fk_dominios: req.session.fk_dominios,
        fk_reinos: req.session.fk_reinos,
        fk_filos: req.session.fk_filos,
        fk_classes: req.session.fk_classes,
        fk_ordens: req.session.fk_ordens,
        fk_familias: req.session.fk_familias,
        fk_generos: req.session.fk_generos
      }
    }).then(function (params) {
      req.session.fk_especies = params[0].id
      res.render('adicionarArquivos', { title: params, user: req.session.user })
    }).catch(function (erro) {
      res.redirect('/home')
    })
  }
})
// ADICIONAR ARQUIVOS A CATEGORIAS JA DEFINIDAS
app.post('/adicionarArquivos', (req, res) => {
  if (!req.session.login) { res.redirect('/login') }
  else {
    nome = req.body.nome
    if (req.session.url == "TABELA_REINOS") {
      res.redirect('/arquivosReinos')
    } else if (req.session.url == "TABELA_FILOS") {
      res.redirect('/arquivosFilos')
    } else if (req.session.url == "TABELA_CLASSES") {
      res.redirect('/arquivosClasses')
    } else if (req.session.url == "TABELA_ORDENS") {
      res.redirect('/arquivosOrdens')
    } else if (req.session.url == "TABELA_FAMILIAS") {
      res.redirect('/arquivosFamilias')
    } else if (req.session.url == "TABELA_GENEROS") {
      res.redirect('/arquivosGeneros')
    } else if (req.session.url == "TABELA_ESPECIES") {
      res.redirect('/arquivosEspecies')
    }
  }
})

// ******************* POST PARA CRIACAO DE TAxONS **********************
app.post('/registrodeTaxons', function (req, res) {
  if (!req.session.login) { res.redirect('/login') }
  else {
    nome = req.body.nome
    if (req.session.url == "TABELA_DOMINIOS") {
      dominio.create({
        id: null,
        nome: nome,
        autor: req.body.autor,
        resumo: req.body.resumo
      }).then(function () {
        res.redirect('/arquivosDominios')
      }).catch(function (erro) {
        res.redirect('/home')
      })
    } else if (req.session.url == "TABELA_REINOS") {
      reino.create({
        id: null,
        nome: nome,
        autor: req.body.autor,
        resumo: req.body.resumo,
        fk_dominios: req.session.fk_dominios
      }).then(function () {
        res.redirect('/arquivosReinos')
      }).catch(function (erro) {
        res.redirect('/home')
      })
    } else if (req.session.url == "TABELA_FILOS") {
      filo.create({
        id: null,
        nome: nome,
        autor: req.body.autor,
        resumo: req.body.resumo,
        fk_dominios: req.session.fk_dominios,
        fk_reinos: req.session.fk_reinos
      }).then(function () {
        res.redirect('/arquivosFilos')
      }).catch(function (erro) {
        res.send(erro)
      })
    } else if (req.session.url == "TABELA_CLASSES") {
      classe.create({
        id: null,
        nome: req.body.nome,
        autor: req.body.autor,
        resumo: req.body.resumo,
        fk_dominios: req.session.fk_dominios,
        fk_reinos: req.session.fk_reinos,
        fk_filos: req.session.fk_filos
      }).then(function () {
        res.redirect('/arquivosClasses')
      }).catch(function (erro) {
        res.redirect('/home')
      })
    } else if (req.session.url == "TABELA_ORDENS") {
      ordem.create({
        id: null,
        nome: req.body.nome,
        autor: req.body.autor,
        resumo: req.body.resumo,
        fk_dominios: req.session.fk_dominios,
        fk_reinos: req.session.fk_reinos,
        fk_filos: req.session.fk_filos,
        fk_classes: req.session.fk_classes
      }).then(function () {
        res.redirect('/arquivosOrdens')
      }).catch(function (erro) {
        res.redirect('/home')
      })
    } else if (req.session.url == "TABELA_FAMILIAS") {
      familia.create({
        id: null,
        nome: req.body.nome,
        autor: req.body.autor,
        resumo: req.body.resumo,
        fk_dominios: req.session.fk_dominios,
        fk_reinos: req.session.fk_reinos,
        fk_filos: req.session.fk_filos,
        fk_classes: req.session.fk_classes,
        fk_ordens: req.session.fk_ordens
      }).then(function () {
        res.redirect('/arquivosFamilias')
      }).catch(function (erro) {
        console.log(erro)
        res.redirect('/home')
      })
    } else if (req.session.url == "TABELA_GENEROS") {
      genero.create({
        id: null,
        nome: req.body.nome,
        autor: req.body.autor,
        resumo: req.body.resumo,
        fk_dominios: req.session.fk_dominios,
        fk_reinos: req.session.fk_reinos,
        fk_filos: req.session.fk_filos,
        fk_classes: req.session.fk_classes,
        fk_ordens: req.session.fk_ordens,
        fk_familias: req.session.fk_familias
      }).then(function () {
        res.redirect('/arquivosGeneros')
      }).catch(function (erro) {
        console.log(erro)
        res.redirect('/home')
      })
    } else if (req.session.url == "TABELA_ESPECIES") {
      especie.create({
        id: null,
        nome: req.body.nome,
        autor: req.body.autor,
        resumo: req.body.resumo,
        fk_dominios: req.session.fk_dominios,
        fk_reinos: req.session.fk_reinos,
        fk_filos: req.session.fk_filos,
        fk_classes: req.session.fk_classes,
        fk_ordens: req.session.fk_ordens,
        fk_familias: req.session.fk_familias,
        fk_generos: req.session.fk_generos
      }).then(function () {
        res.redirect('/arquivosEspecies')
      }).catch(function (erro) {
        res.redirect('/home')
      })
    }
  }
})

app.post('/postArquivos', upload.any('img', 'pesquisa'), (req, res) => {
  if (!req.session.login) { res.redirect('/login') }
  else {
    dados = req.files
    dates = dates
    if (req.session.url == "TABELA_DOMINIOS") {
      dados.forEach(function (item) {
        if (item.fieldname == "pesquisa") {
          pesquisa.create({
            originalname: item.originalname,
            fileName: item.originalname + dates + path.extname(item.originalname),
            fk_dominios: req.session.fk_dominios
          })
        }
        if (item.fieldname == "img") {
          imagem.create({
            nome: req.body.nome,
            originalname: item.originalname,
            fileName: item.originalname + dates + path.extname(item.originalname),
            fk_dominios: req.session.fk_dominios
          })
        }
      });
      res.redirect('paginaDominio')
    } else if (req.session.url == "TABELA_REINOS") {
      dados.forEach(function (item) {
        if (item.fieldname == "pesquisa") {
          pesquisa.create({
            originalname: item.originalname,
            fileName: item.originalname + dates + path.extname(item.originalname),
            fk_dominios: req.session.fk_dominios,
            fk_reinos: req.session.fk_reinos
          })
        }
        if (item.fieldname == "img") {
          imagem.create({
            nome: req.body.nome,
            originalname: item.originalname,
            fileName: item.originalname + dates + path.extname(item.originalname),
            fk_dominios: req.session.fk_dominios,
            fk_reinos: req.session.fk_reinos
          })
        }
      });
      res.redirect('paginaReino')
    } else if (req.session.url == "TABELA_FILOS") {
      dados.forEach(function (item) {
        if (item.fieldname == "pesquisa") {
          pesquisa.create({
            originalname: item.originalname,
            fileName: item.originalname + dates + path.extname(item.originalname),
            fk_dominios: req.session.fk_dominios,
            fk_reinos: req.session.fk_reinos,
            fk_filos: req.session.fk_filos
          })
        }
        if (item.fieldname == "img") {
          imagem.create({
            nome: req.body.nome,
            originalname: item.originalname,
            fileName: item.originalname + dates + path.extname(item.originalname),
            fk_dominios: req.session.fk_dominios,
            fk_reinos: req.session.fk_reinos,
            fk_filos: req.session.fk_filos
          })
        }
      }); res.redirect('paginaFilo')
    } else if (req.session.url == "TABELA_CLASSES") {
      dados.forEach(function (item) {
        if (item.fieldname == "pesquisa") {
          pesquisa.create({
            originalname: item.originalname,
            fileName: item.originalname + dates + path.extname(item.originalname),
            fk_dominios: req.session.fk_dominios,
            fk_reinos: req.session.fk_reinos,
            fk_filos: req.session.fk_filos,
            fk_classes: req.session.fk_classes
          })
        }
        if (item.fieldname == "img") {
          imagem.create({
            nome: req.body.nome,
            originalname: item.originalname,
            fileName: item.originalname + dates + path.extname(item.originalname),
            fk_dominios: req.session.fk_dominios,
            fk_reinos: req.session.fk_reinos,
            fk_filos: req.session.fk_filos,
            fk_classes: req.session.fk_classes
          })
        }
      }); res.redirect('paginaClasse')
    } else if (req.session.url == "TABELA_ORDENS") {
      dados.forEach(function (item) {
        if (item.fieldname == "pesquisa") {
          pesquisa.create({
            originalname: item.originalname,
            fileName: item.originalname + dates + path.extname(item.originalname),
            fk_dominios: req.session.fk_dominios,
            fk_reinos: req.session.fk_reinos,
            fk_filos: req.session.fk_filos,
            fk_classes: req.session.fk_classes,
            fk_ordens: req.session.fk_ordens
          })
        }
        if (item.fieldname == "img") {
          imagem.create({
            nome: req.body.nome,
            originalname: item.originalname,
            fileName: item.originalname + dates + path.extname(item.originalname),
            fk_dominios: req.session.fk_dominios,
            fk_reinos: req.session.fk_reinos,
            fk_filos: req.session.fk_filos,
            fk_classes: req.session.fk_classes,
            fk_ordens: req.session.fk_ordens
          })
        }
      }); res.redirect('paginaOrdem')
    } else if (req.session.url == "TABELA_FAMILIAS") {
      dados.forEach(function (item) {
        if (item.fieldname == "pesquisa") {
          pesquisa.create({
            originalname: item.originalname,
            fileName: item.originalname + dates + path.extname(item.originalname),
            fk_dominios: req.session.fk_dominios,
            fk_reinos: req.session.fk_reinos,
            fk_filos: req.session.fk_filos,
            fk_classes: req.session.fk_classes,
            fk_ordens: req.session.fk_ordens,
            fk_familias: req.session.fk_familias
          })
        }
        if (item.fieldname == "img") {
          imagem.create({
            nome: req.body.nome,
            originalname: item.originalname,
            fileName: item.originalname + dates + path.extname(item.originalname),
            fk_dominios: req.session.fk_dominios,
            fk_reinos: req.session.fk_reinos,
            fk_filos: req.session.fk_filos,
            fk_classes: req.session.fk_classes,
            fk_ordens: req.session.fk_ordens,
            fk_familias: req.session.fk_familias
          })
        }
      }); res.redirect('paginaFamilia')
    } else if (req.session.url == "TABELA_GENEROS") {
      dados.forEach(function (item) {
        if (item.fieldname == "pesquisa") {
          pesquisa.create({
            originalname: item.originalname,
            fileName: item.originalname + dates + path.extname(item.originalname),
            fk_dominios: req.session.fk_dominios,
            fk_reinos: req.session.fk_reinos,
            fk_filos: req.session.fk_filos,
            fk_classes: req.session.fk_classes,
            fk_ordens: req.session.fk_ordens,
            fk_familias: req.session.fk_familias,
            fk_generos: req.session.fk_generos,
          })
        }
        if (item.fieldname == "img") {
          imagem.create({
            nome: req.body.nome,
            originalname: item.originalname,
            fileName: item.originalname + dates + path.extname(item.originalname),
            fk_dominios: req.session.fk_dominios,
            fk_reinos: req.session.fk_reinos,
            fk_filos: req.session.fk_filos,
            fk_classes: req.session.fk_classes,
            fk_ordens: req.session.fk_ordens,
            fk_familias: req.session.fk_familias,
            fk_generos: req.session.fk_generos
          })
        }
      }); res.redirect('paginaGenero')
    } else if (req.session.url == "TABELA_ESPECIES") {
      dados.forEach(function (item) {
        if (item.fieldname == "pesquisa") {
          pesquisa.create({
            originalname: item.originalname,
            fileName: item.originalname + dates + path.extname(item.originalname),
            fk_dominios: req.session.fk_dominios,
            fk_reinos: req.session.fk_reinos,
            fk_filos: req.session.fk_filos,
            fk_classes: req.session.fk_classes,
            fk_ordens: req.session.fk_ordens,
            fk_familias: req.session.fk_familias,
            fk_generos: req.session.fk_generos,
            fk_especies: req.session.fk_especies
          })
        }
        if (item.fieldname == "img") {
          imagem.create({
            nome: req.body.nome,
            originalname: item.originalname,
            fileName: item.originalname + dates + path.extname(item.originalname),
            fk_dominios: req.session.fk_dominios,
            fk_reinos: req.session.fk_reinos,
            fk_filos: req.session.fk_filos,
            fk_classes: req.session.fk_classes,
            fk_ordens: req.session.fk_ordens,
            fk_familias: req.session.fk_familias,
            fk_generos: req.session.fk_generos,
            fk_especies: req.session.fk_especies
          })
        }
      }); res.redirect('paginaEspecie')
    }
  }
});

// ************************* PERFIL DO CLADO *************************
/// PAGINAS DOS REINOS
app.get('/paginaDominio', (req, res) => {
  if (!req.session.login) { res.redirect('/login') }
  else {
    dominio.findAll({
      where: { id: req.session.fk_dominios }
    }).then((title) => {
      imagem.findAll({
        where: { fk_dominios: req.session.fk_dominios }
      }).then((img) => {
        pesquisa.findAll({
          where: { fk_dominios: req.session.fk_dominios }
        }).then((pesquisa) => {
          res.render('paginaTaxon', { title: title, img: img, pesquisa: pesquisa, user: req.session.user })
        })
      })
    })
  }
})
/// PAGINAS DOS REINOS
app.get('/paginaReino', (req, res) => {
  if (!req.session.login) { res.redirect('/login') }
  else {
    reino.findAll({
      where: { 
        id: req.session.fk_reinos,
        fk_dominios: req.session.fk_dominios
      }
    }).then((title) => {
      imagem.findAll({
        where: { 
          fk_dominios: req.session.fk_dominios,
          fk_reinos: req.session.fk_reinos
         }
      }).then((img) => {
        pesquisa.findAll({
            where: {       
            fk_dominios: req.session.fk_dominios,
            fk_reinos: req.session.fk_reinos 
          }
        }).then((pesquisa) => {
          res.render('paginaTaxon', { title: title, img: img, pesquisa: pesquisa, user: req.session.user })
        })
      })
    })
  }
})
/// PAGINA DOS FILOS
app.get('/paginaFilo', (req, res) => {
  if (!req.session.login) { res.redirect('/login') }
  else {
    filo.findAll({
      where: {
        id: req.session.fk_filos,
        fk_dominios: req.session.fk_dominios,
        fk_reinos: req.session.fk_reinos
      }
    }).then((title) => {
      imagem.findAll({
        where: {
          fk_dominios: req.session.fk_dominios,
          fk_reinos: req.session.fk_reinos,
          fk_filos: req.session.fk_filos
        }
      }).then((img) => {
        pesquisa.findAll({
          where: {
            fk_dominios: req.session.fk_dominios,
            fk_reinos: req.session.fk_reinos,
            fk_filos: req.session.fk_filos
          }
        }).then((pesquisa) => {
          res.render('paginaTaxon', { title: title, img: img, pesquisa: pesquisa, user: req.session.user })
        })
      })
    })
  }
})
/// PAGINA DAS CLASSES
app.get('/paginaClasse', (req, res) => {
  if (!req.session.login) { res.redirect('/login') }
  else {
    classe.findAll({
      where: {
        id: req.session.fk_classes,
        fk_dominios: req.session.fk_dominios,
        fk_reinos: req.session.fk_reinos,
        fk_filos: req.session.fk_filos
      }
    }).then((title) => {
      imagem.findAll({
        where: {
          fk_dominios: req.session.fk_dominios,
          fk_reinos: req.session.fk_reinos,
          fk_filos: req.session.fk_filos,
          fk_classes: req.session.fk_classes
        }
      }).then((img) => {
        pesquisa.findAll({
          where: {
            fk_dominios: req.session.fk_dominios,
            fk_reinos: req.session.fk_reinos,
            fk_filos: req.session.fk_filos,
            fk_classes: req.session.fk_classes
          }
        }).then((pesquisa) => {
          res.render('paginaTaxon', { title: title, img: img, pesquisa: pesquisa, user: req.session.user })
        })
      })
    })
  }
})
/// PAGINA DAS ORDENS
app.get('/paginaOrdem', (req, res) => {
  if (!req.session.login) { res.redirect('/login') }
  else {
    ordem.findAll({
      where: {
        id: req.session.fk_ordens,
        fk_dominios: req.session.fk_dominios,
        fk_reinos: req.session.fk_reinos,
        fk_filos: req.session.fk_filos,
        fk_classes: req.session.fk_classes
      }
    }).then((title) => {
      imagem.findAll({
        where: {
          fk_dominios: req.session.fk_dominios,
          fk_reinos: req.session.fk_reinos,
          fk_filos: req.session.fk_filos,
          fk_classes: req.session.fk_classes,
          fk_ordens: req.session.fk_ordens
        }
      }).then((img) => {
        pesquisa.findAll({
          where: {
            fk_dominios: req.session.fk_dominios,
            fk_reinos: req.session.fk_reinos,
            fk_filos: req.session.fk_filos,
            fk_classes: req.session.fk_classes,
            fk_ordens: req.session.fk_ordens
          }
        }).then((pesquisa) => {
          res.render('paginaTaxon', { title: title, img: img, pesquisa: pesquisa, user: req.session.user })
        })
      })
    })
  }
})
/// PAGINA DAS FAMILIAS
app.get('/paginaFamilia', (req, res) => {
  if (!req.session.login) { res.redirect('/login') }
  else {
    familia.findAll({
      where: {
        id: req.session.fk_familias,
        fk_dominios: req.session.fk_dominios,
        fk_reinos: req.session.fk_reinos,
        fk_filos: req.session.fk_filos,
        fk_classes: req.session.fk_classes,
        fk_ordens: req.session.fk_ordens
      }
    }).then((title) => {
      imagem.findAll({
        where: {
          fk_dominios: req.session.fk_dominios,
          fk_reinos: req.session.fk_reinos,
          fk_filos: req.session.fk_filos,
          fk_classes: req.session.fk_classes,
          fk_ordens: req.session.fk_ordens,
          fk_familias: req.session.fk_familias
        }
      }).then((img) => {
        pesquisa.findAll({
          where: {
            fk_dominios: req.session.fk_dominios,
            fk_reinos: req.session.fk_reinos,
            fk_filos: req.session.fk_filos,
            fk_classes: req.session.fk_classes,
            fk_ordens: req.session.fk_ordens,
            fk_familias: req.session.fk_familias
          }
        }).then((pesquisa) => {
          res.render('paginaTaxon', { title: title, img: img, pesquisa: pesquisa, user: req.session.user })
        })
      })
    })
  }
})
/// PAGINA DOS GENEROS
app.get('/paginaGenero', (req, res) => {
  if (!req.session.login) { res.redirect('/login') }
  else {
    genero.findAll({
      where: {
        id: req.session.fk_generos,
        fk_dominios: req.session.fk_dominios,
        fk_reinos: req.session.fk_reinos,
        fk_filos: req.session.fk_filos,
        fk_classes: req.session.fk_classes,
        fk_ordens: req.session.fk_ordens,
        fk_familias: req.session.fk_familias
      }
    }).then((title) => {
      imagem.findAll({
        where: {
          fk_dominios: req.session.fk_dominios,
          fk_reinos: req.session.fk_reinos,
          fk_filos: req.session.fk_filos,
          fk_classes: req.session.fk_classes,
          fk_ordens: req.session.fk_ordens,
          fk_familias: req.session.fk_familias,
          fk_generos: req.session.fk_generos
        }
      }).then((img) => {
        pesquisa.findAll({
          where: {
            fk_dominios: req.session.fk_dominios,
            fk_reinos: req.session.fk_reinos,
            fk_filos: req.session.fk_filos,
            fk_classes: req.session.fk_classes,
            fk_ordens: req.session.fk_ordens,
            fk_familias: req.session.fk_familias,
            fk_generos: req.session.fk_generos
          }
        }).then((pesquisa) => {
          res.render('paginaTaxon', { title: title, img: img, pesquisa: pesquisa, user: req.session.user })
        })
      })
    })
  }
})
/// PAGINA DAS ESPECIES
app.get('/paginaEspecie', (req, res) => {
  if (!req.session.login) { res.redirect('/login') }
  else {
    especie.findAll({
      where: {
        id: req.session.fk_especies,
        fk_dominios: req.session.fk_dominios,
        fk_reinos: req.session.fk_reinos,
        fk_filos: req.session.fk_filos,
        fk_classes: req.session.fk_classes,
        fk_ordens: req.session.fk_ordens,
        fk_familias: req.session.fk_familias,
        fk_generos: req.session.fk_generos
      }
    }).then((title) => {
      imagem.findAll({
        where: {
          fk_dominios: req.session.fk_dominios,
          fk_reinos: req.session.fk_reinos,
          fk_filos: req.session.fk_filos,
          fk_classes: req.session.fk_classes,
          fk_ordens: req.session.fk_ordens,
          fk_familias: req.session.fk_familias,
          fk_generos: req.session.fk_generos,
          fk_especies: req.session.fk_especies
        }
      }).then((img) => {
        pesquisa.findAll({
          where: {
            fk_dominios: req.session.fk_dominios,
            fk_reinos: req.session.fk_reinos,
            fk_filos: req.session.fk_filos,
            fk_classes: req.session.fk_classes,
            fk_ordens: req.session.fk_ordens,
            fk_familias: req.session.fk_familias,
            fk_generos: req.session.fk_generos,
            fk_especies: req.session.fk_especies
          }
        }).then((pesquisa) => {
          res.render('paginaEspecie', { title: title, img: img, pesquisa: pesquisa, user: req.session.user })
        })
      })
    }).catch((erro) => {
      res.redirect("/home")
    })
  }
})

app.post('/paginaTaxon', (req, res) => {
  if (!req.session.login) { res.redirect('/login') }
  else {
    if (req.body.iPesquisa == 1) {
      req.session.fk_dominios = req.session.fk_dominios,
      req.session.fk_reinos = req.body.fk_reinos
      req.session.fk_filos = req.body.fk_filos
      req.session.fk_classes = req.body.fk_classes
      req.session.fk_ordens = req.body.fk_ordens
      req.session.fk_familias = req.body.fk_familias
      req.session.fk_generos = req.body.fk_generos
      req.session.fk_especies = req.body.fk_especies
      req.session.url = req.body.url
    }
    if (req.session.url == "TABELA_DOMINIOS") {
      req.session.fk_dominios = req.body.fk
      res.redirect('/paginaDominio')
    } else if (req.session.url == "TABELA_REINOS") {
      req.session.fk_reinos = req.body.fk
      res.redirect('/paginaReino')
    } else if (req.session.url == "TABELA_FILOS") {
      req.session.fk_filos = req.body.fk
      res.redirect('/paginaFilo')
    } else if (req.session.url == "TABELA_CLASSES") {
      req.session.fk_classes = req.body.fk
      res.redirect('/paginaClasse')
    } else if (req.session.url == "TABELA_ORDENS") {
      req.session.fk_ordens = req.body.fk
      res.redirect('/paginaOrdem')
    } else if (req.session.url == "TABELA_FAMILIAS") {
      req.session.fk_familias = req.body.fk
      res.redirect('/paginaFamilia')
    } else if (req.session.url == "TABELA_GENEROS") {
      req.session.fk_generos = req.body.fk
      res.redirect('/paginaGenero')
    } else if (req.session.url == "TABELA_ESPECIES") {
      req.session.fk_especies = req.body.fk
      res.redirect('/paginaEspecie')
    }
  }
})

// ********************* Adentrar Clado **********************
// REINOS
app.get('/reinos', (req, res) => {
  if (!req.session.login) { res.redirect('/login') }
  else {
    reino.findAll({
      where: {
        [or]: [
          { fk_dominios: req.session.fk_dominios },
          { id: '1' }
        ]
      }
    }).then(function (params) {
      imagem.findAll({
        where: {
          [or]: [
            { id: '1' },
            { fk_dominios: req.session.fk_dominios }
          ]
        }
      }).then((img) => {
        req.session.params = params
        res.render('index', { title: params, resumo: req.session.resumo, img: img, user: req.session.user })
      })
    }).catch((erro) => {
      res.redirect('/home')
    })
  }
});
// FILOS
app.get('/filos', (req, res) => {
  if (!req.session.login) { res.redirect('/login') }
  else {
    filo.findAll({
      where: {
        [or]: [
          { 
            fk_dominios: req.session.fk_dominios,
            fk_reinos: req.session.fk_reinos
          },
          { id: '1' }
        ]
      }
    }).then(function (params) {
      imagem.findAll({
        where: {
          [or]: [
            { id: '1' },
            {
              [and]: [
                { fk_dominios: req.session.fk_dominios },
                { fk_reinos: req.session.fk_reinos }
              ]
            }
          ]
        }
      }).then((img) => {
        req.session.params = params
        res.render('index', { title: params, resumo: req.session.resumo, img: img, user: req.session.user })
      })
    }).catch((erro) => {
      res.redirect('/home')
    })
  }
});
// CLASSES
app.get('/classes', (req, res) => {
  if (!req.session.login) { res.redirect('/login') }
  else {
    classe.findAll({
      where: {
        [or]: [
          { id: '1' },
          {
            [and]: [
              { fk_dominios: req.session.fk_dominios },
              { fk_reinos: req.session.fk_reinos },
              { fk_filos: req.session.fk_filos }
            ]
          }
        ]
      }
    }).then(function (params) {
      imagem.findAll({
        where: {
          [or]: [
            { id: '1' },
            {
              [and]: [
                { fk_dominios: req.session.fk_dominios },
                { fk_reinos: req.session.fk_reinos },
                { fk_filos: req.session.fk_filos }
              ]
            }
          ]
        }
      }).then((img) => {
        req.session.params = params
        res.render('index', { title: params, resumo: req.session.resumo, img: img, user: req.session.user })
      })
    }).catch((erro) => {
      res.redirect('/home')
    })
  }
})
// ORDENS
app.get('/ordens', (req, res) => {
  if (!req.session.login) { res.redirect('/login') }
  else {
    ordem.findAll({
      where: {
        [or]: [
          { id: '1' },
          {
            [and]: [
              { fk_dominios: req.session.fk_dominios },
              { fk_reinos: req.session.fk_reinos },
              { fk_filos: req.session.fk_filos },
              { fk_classes: req.session.fk_classes }
            ]
          }
        ]
      }
    }).then(function (params) {
      imagem.findAll({
        where: {
          [or]: [
            { id: '1' },
            {
              [and]: [
                { fk_dominios: req.session.fk_dominios },
                { fk_reinos: req.session.fk_reinos },
                { fk_filos: req.session.fk_filos },
                { fk_classes: req.session.fk_classes }
              ]
            }
          ]
        }
      }).then((img) => {
        req.session.params = params
        res.render('index', { title: params, resumo: req.session.resumo, img: img, user: req.session.user })
      })
    }).catch((erro) => {
      res.redirect('/home')
    })
  }
})
// FAMILIAS
app.get('/familias', (req, res) => {
  if (!req.session.login) { res.redirect('/login') }
  else {
    familia.findAll({
      where: {
        [or]: [
          { id: '1' },
          {
            [and]: [
              { fk_dominios: req.session.fk_dominios },
              { fk_reinos: req.session.fk_reinos },
              { fk_filos: req.session.fk_filos },
              { fk_classes: req.session.fk_classes },
              { fk_ordens: req.session.fk_ordens }
            ]
          }
        ]
      }
    }).then(function (params) {
      imagem.findAll({
        where: {
          [or]: [
            { id: '1' },
            {
              [and]: [
                { fk_dominios: req.session.fk_dominios },
                { fk_reinos: req.session.fk_reinos },
                { fk_filos: req.session.fk_filos },
                { fk_classes: req.session.fk_classes },
                { fk_ordens: req.session.fk_ordens }
              ]
            }
          ]
        }
      }).then((img) => {
        req.session.params = params
        res.render('index', { title: params, resumo: req.session.resumo, img: img, user: req.session.user })
      })
    }).catch((erro) => {
      res.redirect('/home')
    })
  }
})
// GENEROS  
app.get('/generos', (req, res) => {
  if (!req.session.login) { res.redirect('/login') }
  else {
    genero.findAll({
      where: {
        [or]: [
          { id: '1' },
          {
            [and]: [
              { fk_dominios: req.session.fk_dominios },
              { fk_reinos: req.session.fk_reinos },
              { fk_filos: req.session.fk_filos },
              { fk_classes: req.session.fk_classes },
              { fk_ordens: req.session.fk_ordens },
              { fk_familias: req.session.fk_familias }
            ]
          }
        ]
      }
    }).then(function (params) {
      imagem.findAll({
        where: {
          [or]: [
            { id: '1' },
            {
              [and]: [
                { fk_dominios: req.session.fk_dominios },
                { fk_reinos: req.session.fk_reinos },
                { fk_filos: req.session.fk_filos },
                { fk_classes: req.session.fk_classes },
                { fk_ordens: req.session.fk_ordens },
                { fk_familias: req.session.fk_familias }
              ]
            }
          ]
        }
      }).then((img) => {
        req.session.params = params
        res.render('index', { title: params, resumo: req.session.resumo, img: img, user: req.session.user })
      })
    }).catch((erro) => {
      res.redirect('/home')
    })
  }
})
// ESPECIES
app.get('/especies', (req, res) => {
  if (!req.session.login) { res.redirect('/login') }
  else {
    especie.findAll({
      where: {
        [or]: [
          { id: '1' },
          {
            [and]: [
              { fk_dominios: req.session.fk_dominios },
              { fk_reinos: req.session.fk_reinos },
              { fk_filos: req.session.fk_filos },
              { fk_classes: req.session.fk_classes },
              { fk_ordens: req.session.fk_ordens },
              { fk_familias: req.session.fk_familias },
              { fk_generos: req.session.fk_generos }
            ]
          }
        ]
      }
    }).then(function (params) {
      imagem.findAll({
        where: {
          [or]: [
            { id: '1' },
            {
              [and]: [
                { fk_dominios: req.session.fk_dominios },
                { fk_reinos: req.session.fk_reinos },
                { fk_filos: req.session.fk_filos },
                { fk_classes: req.session.fk_classes },
                { fk_ordens: req.session.fk_ordens },
                { fk_familias: req.session.fk_familias },
                { fk_generos: req.session.fk_generos }
              ]
            }
          ]
        }
      }).then((img) => {
        req.session.params = params
        res.render('indexEspecie', { title: params, resumo: req.session.resumo, img: img, user: req.session.user })
      })
    }).catch((erro) => {
      res.redirect('/home')
    })
  }
})
// VALIDAR PAGINA
app.post('/adentrarTaxons', function (req, res, next) {
  if (!req.session.login) { res.redirect('/login') }
  else {
    // func para pegar o resumo do clado
    for (i = 0; i < req.session.params.length; i++) {
      if (req.session.params[i].id == req.body.fk) {
        req.session.resumo = req.session.params[i].resumo
      }
    }
    if(req.body.iPesquisa==1){
        req.session.url = req.body.url
        req.session.fk_dominios = req.body.fk_dominios
        req.session.fk_reinos = req.body.fk_reinos
        req.session.fk_filos = req.body.fk_filos
        req.session.fk_classes = req.body.fk_classes
        req.session.fk_ordens = req.body.fk_ordens
        req.session.fk_familias = req.body.fk_familias
        req.session.fk_generos = req.body.fk_generos
        req.session.fk_especies = req.body.fk_especies
    }
    if (req.session.url == "TABELA_DOMINIOS") {
      req.session.url = alterURL(req.session.url)
      req.session.fk_dominios = req.body.fk
      res.redirect('/reinos')
    } else if (req.session.url == "TABELA_REINOS") {
      req.session.url = alterURL(req.session.url)
      req.session.fk_reinos = req.body.fk
      res.redirect('/filos')
    } else if (req.session.url == "TABELA_FILOS") {
      req.session.fk_filos = req.body.fk
      req.session.url = alterURL(req.session.url)
      res.redirect('/classes')
    } else if (req.session.url == "TABELA_CLASSES") {
      req.session.fk_classes = req.body.fk
      req.session.url = alterURL(req.session.url)
      res.redirect('/ordens')
    } else if (req.session.url == "TABELA_ORDENS") {
      req.session.fk_ordens = req.body.fk
      req.session.url = alterURL(req.session.url)
      res.redirect('/familias')
    } else if (req.session.url == "TABELA_FAMILIAS") {
      req.session.fk_familias = req.body.fk
      req.session.url = alterURL(req.session.url)
      res.redirect('/generos')
    } else if (req.session.url == "TABELA_GENEROS") {
      req.session.fk_generos = req.body.fk
      req.session.url = alterURL(req.session.url)
      res.redirect('/especies')
    }
  }
});
// **************** Pesquisar *****************
// PESQUISAR REINOS
app.get('/resultadoPesquisa', (req, res) => {
  if (!req.session.login) { res.redirect('/login') }
  else {
    dominio.findAll({ where: { [or]: [{ nome: consulta }, { id: '1' }] } }).then((paramsD) => {
      dominios = paramsD
      reino.findAll({ where: { [or]: [{ nome: consulta }, { id: '1' }] } }).then((paramsR) => {
        reinos = paramsR
        filo.findAll({ where: { [or]: [{ nome: consulta }, { id: '1' }] } }).then((paramsF) => {
          filos = paramsF
          classe.findAll({ where: { [or]: [{ nome: consulta }, { id: '1' }] } }).then((paramsC) => {
            classes = paramsC
            ordem.findAll({ where: { [or]: [{ nome: consulta }, { id: '1' }] } }).then((paramsO) => {
              ordens = paramsO
              familia.findAll({ where: { [or]: [{ nome: consulta }, { id: '1' }] } }).then((paramsF) => {
                familias = paramsF
                genero.findAll({ where: { [or]: [{ nome: consulta }, { id: '1' }] } }).then((paramsG) => {
                  generos = paramsG
                  especie.findAll({ where: { [or]: [{ nome: consulta }, { id: '1' }] } }).then((paramsE) => {
                    especies = paramsE
                    res.render('pesquisas', { dominios: dominios,reinos: reinos, filos: filos, classes: classes, ordens: ordens, familias: familias, generos: generos, especies: especies, user: req.session.user })
                  })
                })
              })
            })
          })
        })
      })
    }).catch(() => {
      redirect('home')
    })
  }
})

app.post('/pesquisar', (req, res) => {
  if (!req.session.login) { res.redirect('/login') }
  else {
    consulta = req.body.pesquisar;
    res.redirect('/resultadoPesquisa')
  }
})

app.get('/perfil', function (req, res, next) {
  usuario.findAll().then(function (params) {
    res.render('perfil', { title: params })
  })
});

app.use('/public', express.static('public'));
// servidor na porta 3000 :D
app.listen(3000, () => { console.log("Foi!") })