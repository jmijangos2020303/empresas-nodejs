const express = require('express');
const controladorEmpresa = require('../controllers/empresas.controller');
const md_autenticacion = require('../middlewares/autentication');

const api = express.Router();


api.post('/registrarEmpresa', md_autenticacion.Auth ,controladorEmpresa.RegistrarEmpresa);
api.put('/editarEmpresa/:idEmpresa', md_autenticacion.Auth ,controladorEmpresa.EditarEmpresa);
api.get('/verEmpresas',md_autenticacion.Auth ,controladorEmpresa.visualizarEmpresas);
api.delete('/eliminarEmpresa/:idCat', md_autenticacion.Auth, controladorEmpresa.EliminarEmpresa);
api.get('/obtenerEmpresa/:idEmpresa', md_autenticacion.Auth, controladorEmpresa.ObtenerEmpresaId)


module.exports = api;
