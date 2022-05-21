const express = require('express');
const controladorEmpresa = require('../controllers/empresas.controller');
const md_autenticacion = require('../middlewares/autentication');

const api = express.Router();


api.post('/registrarEmpresa', controladorEmpresa.RegistrarEmpresa);
api.put('/editarEmpresa/:idEmpresa', md_autenticacion.Auth ,controladorEmpresa.EditarEmpresa);
api.delete('/eliminarEmpresa/:idCat', md_autenticacion.Auth, controladorEmpresa.EliminarEmpresa);
api.get('/obtenerEmpresa/:idEmpresa', md_autenticacion.Auth, controladorEmpresa.ObtenerEmpresaId);
api.get('/verEmpresas', md_autenticacion.Auth,controladorEmpresa.visualizarEmpresas);
api.get('/verEmpresa', md_autenticacion.Auth,controladorEmpresa.obtenerEmpresas);
api.put('/agregarProductosEmpresa', md_autenticacion.Auth, controladorEmpresa.agregarProductos);
api.put('/editarProductosEmpresa/:idProducto', md_autenticacion.Auth, controladorEmpresa.editarProductos);
api.get('/obtenerProductosEmpresa', md_autenticacion.Auth, controladorEmpresa.obtenerProductos);
api.delete('/eliminarProductosEmpresa/:idProducto', md_autenticacion.Auth, controladorEmpresa.eliminarProductos);
api.get('/obtenerProductoEmpresa/:idProducto', md_autenticacion.Auth, controladorEmpresa.obtenerProducto);
api.put('/agregarProductosSucursal/:idSucursal/:idProducto', md_autenticacion.Auth, controladorEmpresa.agregarProductosSucursal);



module.exports = api;
