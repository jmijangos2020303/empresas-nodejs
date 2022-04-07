const express = require('express');
const controladorSucursal = require('../controllers/sucursales.controller');
const md_autenticacion = require('../middlewares/autentication');

const api = express.Router();


api.post('/registrarSucursal', md_autenticacion.Auth,controladorSucursal.RegistrarSucursal);
api.get('/verSucursales', md_autenticacion.Auth,controladorSucursal.visualizarSucursal);
api.delete('/eliminarSucursal/:idStation', md_autenticacion.Auth,controladorSucursal.EliminarSucursal);


module.exports = api;