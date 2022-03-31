const express = require('express');
const controladorEmpresa = require('../controllers/empresas.controller');


const api = express.Router();


api.post('/registrarEmpresa', controladorEmpresa.RegistrarEmpresa);
api.get('/verEmpresas', controladorEmpresa.visualizarEmpresas);

module.exports = api;
