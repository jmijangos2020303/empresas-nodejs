const express = require('express');
const controladorSucursal = require('../controllers/sucursales.controller');
const md_autenticacion = require('../middlewares/autentication');

const api = express.Router();

api.post('/agregarSucursal', md_autenticacion.Auth, controladorSucursal.agregarSucursal);
api.put('/editarSucursal/:idSucursal', md_autenticacion.Auth, controladorSucursal.editarSucursal);
api.get('/obtenerProductos/:idSucursal', md_autenticacion.Auth, controladorSucursal.obtenerProductos);
api.put('/generarVenta/:idProducto/:idSucursal', md_autenticacion.Auth, controladorSucursal.generarVenta)
api.get('/obtenerProdid/:idProducto/:idSucursal', md_autenticacion.Auth, controladorSucursal.obtenerProductoId)
api.get('/obtenerSucursales', md_autenticacion.Auth, controladorSucursal.obtenerSucursales);
api.delete('/eliminarSucursales/:idSucursal', md_autenticacion.Auth, controladorSucursal.eliminarSucursal); 


module.exports = api;