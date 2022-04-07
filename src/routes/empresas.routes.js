const express = require('express');
const controladorEmpresa = require('../controllers/empresas.controller');
const md_autenticacion = require('../middlewares/autentication');

const api = express.Router();


api.post('/registrarEmpresa', md_autenticacion.Auth ,controladorEmpresa.RegistrarEmpresa);
api.get('/verEmpresas',md_autenticacion.Auth ,controladorEmpresa.visualizarEmpresas);
api.delete('/eliminarEmpresa/:idCat', md_autenticacion.Auth, controladorEmpresa.EliminarEmpresa);

module.exports = api;
