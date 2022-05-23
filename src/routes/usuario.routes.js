const express = require('express');
const usuarioControlador = require('../controllers/usuario.controller');

const md_autenticacion = require('../middlewares/autentication');
const md_roles = require('../middlewares/roles');

const api = express.Router();

api.post('/login', usuarioControlador.Login)
api.post('/registrarEmpresa' ,usuarioControlador.RegistrarEmpresa)
api.put('/editarEmpresa/:idUser?', md_autenticacion.Auth ,usuarioControlador.EditarEmpresa)
api.delete('/eliminarEmpresa/:idUser', md_autenticacion.Auth , usuarioControlador.EliminarEmpresas);
api.get('/EmpresaId/:idUser', md_autenticacion.Auth, usuarioControlador.EmpresaId)
api.get('/empresas', usuarioControlador.VerEmpresas)

//Agregar Productos empresas

api.post('/AgregarproductosEmpresas', usuarioControlador.agregarProductosEmpresas)
api.get('/ProductosEmpresa', usuarioControlador.VerProductos)
api.delete('/eliminarProductoEmpresa/:idProductoEmpresa', usuarioControlador.EliminarProductosEmpresas)
api.put('/EditarProductosEmpresas/:idProductoEmpresa', usuarioControlador.EditarProductoEmpresa)
api.get('/ProductoId/:idProducto', usuarioControlador.VerProductosId)
api.get('/OrdenarStockMayor', usuarioControlador.OrdenarStockMayor)
api.get('/OrdenarStockMenor', usuarioControlador.OrdenarStockMenor)
module.exports = api;