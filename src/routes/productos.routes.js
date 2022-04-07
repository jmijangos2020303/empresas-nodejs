const express = require('express');
const controlProd = require('../controllers/productos.controller');
const md_autenticacion = require('../middlewares/autentication');

const api = express.Router();


api.post('/registrarProducto', md_autenticacion.Auth,controlProd.RegistrarProduct);
api.get('/verProductos', md_autenticacion.Auth,controlProd.visualizarProds);
api.delete('/eliminarProducto/:idProd', md_autenticacion.Auth,controlProd.EliminarProd);


module.exports = api;