const express = require('express');
const controladorSurcusales = require('../controllers/sucursales.controller')

//Middleware
const md_autenticacion = require('../middlewares/autentication');
const md_roles = require('../middlewares/roles');

const api = express.Router();

api.post('/agregarSucursales', controladorSurcusales.agregarSucursales);

api.delete('/eliminarSucursales/:idSucursal', controladorSurcusales.eliminarSucursales)

api.put('/editarSurcursal/:idSurcursal' ,controladorSurcusales.editarSurcursal)
api.get('/Sucursales', controladorSurcusales.verSucursalesEmpresas)
api.get('/SucursalesId/:idSucursal', controladorSurcusales.verSucursalesId)
//admin
api.get('/SurcursalesAdmin/:idEmpresa', controladorSurcusales.verSurcursalesAdmin)
//-----
//productos surcursales 
api.put('/EnviarProductosSurcursales/:idSurcursal', controladorSurcusales.agregarProductosSurcursales)
api.get('/VerProductosPorSucursales/:idSurcursal', controladorSurcusales.VerProductosPorSucursales)
api.put('/VentaSimuladaSurcursal' ,controladorSurcusales.VentaSimuladaSurcursales)
api.get('/stockMasAlto/:idSurcursal', controladorSurcusales.OrdenarStockSurcursaleskMayor)
api.get('/stockMasBajo/:idSurcursal', controladorSurcusales.OrdenarStockSurcursaleskMenor)
api.get('/ElProductoMasVendido/:idSurcursal', controladorSurcusales.ElMasVendidoProductos)
api.get('/ProductosSurcursalesId/:idProducto' , controladorSurcusales.VerProductosSurucrsalesId)
module.exports = api;