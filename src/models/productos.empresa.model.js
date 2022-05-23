const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const ProductosEmpresasSchema = Schema({
  NombreProducto: String,
  NombreProveedor: String,
  Stock: Number,
  idEmpresa: { type: Schema.Types.ObjectId, ref: "Usuarios" }
});

module.exports = mongoose.model("ProductosEmpresas", ProductosEmpresasSchema);