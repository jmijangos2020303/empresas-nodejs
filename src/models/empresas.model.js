const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const EmpresaSchema = Schema({
    nombre:String,
    direccion:String,
    telefono: Number,
    descripcion:String,
    rol: String,
    tipoEmpresa:String,
    productos:[
        {
            nombreProducto: String,
            precioProducto: Number,
            stock: Number
    }
],
creador: {type:Schema.Types.String, ref: 'Usuarios'}
});

module.exports = mongoose.model('Empresas',EmpresaSchema);