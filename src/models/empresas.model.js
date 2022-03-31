const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const EmpresaSchema = Schema({
    nombre:String,
    descripcion:String,
});

module.exports = mongoose.model('Empresas',EmpresaSchema);