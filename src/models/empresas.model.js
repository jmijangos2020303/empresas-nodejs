const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const EmpresaSchema = Schema({
    nombre:String,
    direccion:String,
    telefono: Number,
    descripcion:String,
    tipoEmpresa:String
    //id_usuario: { type: Schema.Types.ObjectId, ref: 'Usuarios'},
});

module.exports = mongoose.model('Empresas',EmpresaSchema);