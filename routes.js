const express = require('express');
const routes = express.Router();

const UsuarioController = require('./controllers/UsuarioController');
const ProdutoController = require('./controllers/ProdutoController');
const AgendaController = require('./controllers/AgendaController');
const login = require('./middleware/login');

//Usuários::CRUD + Login
routes.get('/usuarios', UsuarioController.index)
      .post('/addUsuario', UsuarioController.store)
      .delete('/rmvUsuario/:id', UsuarioController.destroy)
      .put('/updateUsuario/:id', UsuarioController.update)
      .post('/login', UsuarioController.login);

//Produtos::CRUD
routes.get('/produtos', ProdutoController.index)
      .get('/produto/:id', ProdutoController.show)
      .post('/addProdutos', login, ProdutoController.store)
      .put('/updateProdutos/:id', ProdutoController.update)
      .delete('/rmvProdutos/:id', ProdutoController.destroy);

//Produtos::Métodos do trabalho
routes.put('/produtos/destacar/:id', ProdutoController.destacar)
      .get('/destaques', ProdutoController.destaques)
      .post('/produtos/filtro/', ProdutoController.filtro);

//Agendamentos::CRUD
routes.get('/agendamento/:id', AgendaController.show)
      .get('/agendamentos', AgendaController.index)
      .post('/addAgendamentos', AgendaController.store)
      .delete('/rmvAgendamentos/:id', AgendaController.destroy);

//Agendamento::Método estatístico
routes.get('/agendamentos/dadosEstatisticos', AgendaController.dadosEstatisticos);      

routes.get('/info', (req, res) => {
      res.send("Trabalho 2 - Programação para Internet II (Rafael Ochoa Mello)");
});

module.exports = routes;