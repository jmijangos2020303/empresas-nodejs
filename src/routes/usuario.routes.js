const express = require('express');
const controladorUsuario = require('../controllers/usuario.controller');

//const md_autenticacion = require('../middlewares/autenticacion');

const api = express.Router();


api.post('/registrar', controladorUsuario.RegistrarAd);
api.post('/login', controladorUsuario.Login);
api.post('/registrarUsuario', controladorUsuario.RegistrarUsuario)


module.exports = api;
