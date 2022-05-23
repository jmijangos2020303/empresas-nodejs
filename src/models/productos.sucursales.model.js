const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const ProductosSurcursalesSchema = Schema({
  NombreProductoSucursal: String,
  StockSurcursal: Number,
  CantidadVendida: Number,
  idSurcursal: { type: Schema.Types.ObjectId, ref: "Sucursales" }

});

module.exports = mongoose.model("ProductosSurcursales", ProductosSurcursalesSchema);