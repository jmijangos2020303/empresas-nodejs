const mongoose = require('mongoose');
const bcrypt = require('bcrypt-nodejs');
const jwt = require('../services/jwt')
const res = require('express/lib/response');
const Sucursales = require("../models/sucursales.model");
const ProductoSurcursales = require("../models/productos.sucursales.model");
const ProductosEmpresas = require("../models/productos.empresa.model");

function agregarSucursales(req, res) {
  const parametros = req.body;
  const modeloSucursales = new Sucursales();

  if (parametros.nombre && parametros.telefono && parametros.direccion) {
    modeloSucursales.nombre = parametros.nombre;
    modeloSucursales.telefono = parametros.telefono;
    modeloSucursales.direccion = parametros.direccion;

    Sucursales.find({ nombre: parametros.nombre },(err, sucursalEmcontrada) => {
        if (sucursalEmcontrada.length == 0) {
          modeloSucursales.save((err, SurcursalGuardada) => {
            if (err)
              return res.status(500).send({ mensaje: "Error en la peticion" });
            if (!SurcursalGuardada)
              return res
                .status(500).send({ mensaje: "Error al agregar Surcusal" });
                return res.status(200).send({ Surcusal: SurcursalGuardada });
          });
        } else {
          return res
            .status(500)
            .send({ Surcusal: "La Sucursal ya a sido creada" });
        }
      }
    );
  } else {
    return res.status(500).send({ Surcusal: "enviar parametros obligatorios" });
  }
}

function eliminarSucursales(req, res) {
  const sucursalesid = req.params.idSucursal;

  Sucursales.findOne(
    { _id: sucursalesid},
    (err, sucursalEmpresa) => {
      if (!sucursalEmpresa) {
        return res
          .status(401)
          .send({ mensaje: "No puede eliminar Sucursales de otras empresas" });
      }

      Sucursales.findByIdAndDelete(
        sucursalesid,
        (err, sucursalEmpresaEliminado) => {
          if (err)
            return res.status(500).send({ mensaje: "Error en la peticion" });
          if (!sucursalEmpresaEliminado)
            return res
              .status(500)
              .send({ mensaje: "Error al eliminar al Sucursales" });

          return res.status(200).send({ Sucursal: sucursalEmpresaEliminado });
        }
      );
    }
  );
}

function editarSurcursal(req, res) {
  var idSurcursal = req.params.idSurcursal;
  var parametros = req.body;

  Sucursales.findOne(
    { _id: idSurcursal},
    (err, SurcursalEnciontrada) => {
      if (!SurcursalEnciontrada) {
        return res
          .status(500)
          .send({ mensaje: "Esta Surcursal No Te Pertenece" });
      } else {
        Sucursales.findByIdAndUpdate(
          idSurcursal,
          parametros,
          { new: true },
          (err, SurcursalEditada) => {
            if (err)
              return res.status(500).send({ mensaje: "Error en la peticion" });
            if (!SurcursalEditada)
              return res
                .status(403)
                .send({ mensaje: "Error al editar la Surcusal" });

            return res.status(200).send({ Surcusal: SurcursalEditada });
          }
        );
      }
    }
  );
}
//Buscar todas las sucursales

function verSucursalesEmpresas(req, res) {
  Sucursales.find({},(err, sucursalEmpresaEncontrada) => {
      return res.status(200).send({ Sucursales: sucursalEmpresaEncontrada });
    }
  );
}

function visualizarSucursal(req, res) {
    
  Empresa.find({}, (err, catEncontrado) => {
      if (err) return res.status(500).send({ mensaje: 'Error en la peticion' })
      if (!catEncontrado) return res.status(500).send({ mensaje: 'Error al buscar empresa' })

      return res.status(200).send({ Empresas: catEncontrado })
  })
}

//Se usa para poder editar la sucursal
function verSucursalesId(req, res) {
  const idSucursal = req.params.idSucursal;
  Sucursales.findById(
    { _id: idSucursal},
    (err, sucursalId) => {
      return res.status(200).send({ Sucursal: sucursalId });
    }
  );
}

//Produtos Por Sucursales ---------------------------------------------------------------------

function agregarProductosSurcursales(req, res) {
  const parametros = req.body;
  const idSurcursal = req.params.idSurcursal;

  const modeloProductosSurcursales = new ProductoSurcursales();

  if (parametros.NombreProductoSucursal && parametros.StockSurcursal) {
    Sucursales.findOne(
      {},
      (err, sucursalEmpresaEncontrada) => {
        console.log(sucursalEmpresaEncontrada);
        if (!sucursalEmpresaEncontrada)
          return res.status(404).send({ mensaje: "surcursal no encontrada" });
        if (err)
          return res.status(404).send({ mensaje: "surcursal no encontrada" });

        ProductosEmpresas.findOne(
          {
            NombreProducto: parametros.NombreProductoSucursal
          },
          (err, productoEncontrado) => {
            if (!productoEncontrado)
              return res
                .status(404)
                .send({ mensaje: "Producto no encontrado empresas" });
            if (err)
              return res
                .status(404)
                .send({ mensaje: "Producto no encontrado a" });

            ProductoSurcursales.findOne(
              {
                NombreProductoSucursal: parametros.NombreProductoSucursal,
                idSurcursal: sucursalEmpresaEncontrada.id,
              },
              (err, ProductoSurcursalesEncontrada) => {
                if (err)
                  return res
                    .status(404)
                    .send({ mensaje: "producto no encontrada surcursales" });

                if (parametros.StockSurcursal <= 0) {
                  return res
                    .status(404)
                    .send({ mensaje: "formato incorrecto" });
                }

                if (parametros.StockSurcursal > productoEncontrado.Stock) {
                  return res.status(404).send({ mensaje: "no hay stock " });
                }

                const data = {
                  Stock: productoEncontrado.Stock,
                };
                data.Stock =
                  productoEncontrado.Stock - parametros.StockSurcursal;

                if (ProductoSurcursalesEncontrada == null) {
                  modeloProductosSurcursales.idSurcursal =
                    sucursalEmpresaEncontrada.id;
                  modeloProductosSurcursales.NombreProductoSucursal =
                    parametros.NombreProductoSucursal;
                  modeloProductosSurcursales.StockSurcursal =
                    parametros.StockSurcursal;
                  modeloProductosSurcursales.CantidadVendida = 0;

                  modeloProductosSurcursales.save((err, SurcursalGuardada) => {
                    ProductosEmpresas.findOneAndUpdate(
                      { _id: productoEncontrado.id },
                      data,
                      { new: true },
                      (err, ActualizarStockEmpresa) => {}
                    );
                    if (err)
                      return res
                        .status(500)
                        .send({ mensaje: "Error en la peticion" });
                    if (!SurcursalGuardada)
                      return res
                        .status(500)
                        .send({ mensaje: "Error al agregar Surcusal" });

                    return res
                      .status(200)
                      .send({ Surcusal: SurcursalGuardada });
                  });
                } else {
                  ProductoSurcursales.findByIdAndUpdate(
                    { _id: ProductoSurcursalesEncontrada.id },
                    { $inc: { StockSurcursal: parametros.StockSurcursal } },
                    { new: true },
                    (err, StockModificado) => {
                      ProductosEmpresas.findOneAndUpdate(
                        { _id: productoEncontrado.id },
                        data,
                        { new: true },
                        (err, ActualizarStockEmpresa) => {}
                      );
                      if (!StockModificado)
                        return res
                          .status(404)
                          .send({ mensaje: "Producto no encontrado z" });
                      if (err)
                        return res
                          .status(404)
                          .send({ mensaje: "Producto no encontrado w" });

                      return res
                        .status(200)
                        .send({ productoafectado: StockModificado });
                    }
                  );
                }
              }
            );
          }
        );
      }
    );
  } else {
    return res
      .status(500)
      .send({
        Surcusal:
          "enviar parametros obligatorios" +
          " " +
          parametros.NombreProducto +
          " " +
          " " +
          parametros.StockEnviar,
      });
  }
}

function VerProductosPorSucursales(req, res) {

      ProductoSurcursales.find({}, (err, productoEncontrado) => {
          if (err)
            return res.status(404).send({ mensaje: "Producto no encontrado" });
          return res.status(200).send({ Productos: productoEncontrado });
        }
      );
    
  
}


function VerProductos(req, res) {
  ProductosEmpresas.find(
    {},
    (err, productoEncontrado) => {
      if (err)
        return res.status(404).send({ mensaje: "Producto no encontrado" });
      return res.status(200).send({ Productos: productoEncontrado });
    }
  );
}

function VentaSimuladaSurcursales(req, res) {
  const parametros = req.body;

  if (parametros.NombreProductoSucursal && parametros.StockSurcursal) {
    Sucursales.findOne(
      {},
      (err, sucursalEmpresaEncontrada) => {
        if (!sucursalEmpresaEncontrada)
          return res.status(404).send({ mensaje: "surcursal no encontrada" });
        if (err)
          return res.status(404).send({ mensaje: "surcursal no encontrada" });

        ProductoSurcursales.findOne(
          {
            NombreProductoSucursal: parametros.NombreProductoSucursal
          },
          (err, ProductoSurcursalesEncontrada) => {
            if (err)
              return res
                .status(404)
                .send({ mensaje: "producto no encontrada surcursales" });

            if (parametros.StockSurcursal <= 0) {
              return res.status(404).send({ mensaje: "formato incorrecto" });
            }

            if (
              parametros.StockSurcursal >
              ProductoSurcursalesEncontrada.StockSurcursal
            ) {
              return res.status(404).send({ mensaje: "no hay stock " });
            }

            const data = {
              StockSurcursal: ProductoSurcursalesEncontrada.StockSurcursal,
              CantidadVendida: ProductoSurcursalesEncontrada.CantidadVendida,
            };
            data.StockSurcursal =
              ProductoSurcursalesEncontrada.StockSurcursal -
              parametros.StockSurcursal;
            data.CantidadVendida =
              parseFloat(data.CantidadVendida) +
              parseFloat(parametros.StockSurcursal);

            if (ProductoSurcursalesEncontrada == null) {
              return res
                .status(404)
                .send({ mensaje: "producto no encontrada en surcursales" });
            } else {
              ProductoSurcursales.findByIdAndUpdate(
                { _id: ProductoSurcursalesEncontrada.id },
                data,
                { new: true },
                (err, StockModificado) => {
                  if (!StockModificado)
                    return res
                      .status(404)
                      .send({ mensaje: "Producto no encontrado" });
                  if (err)
                    return res
                      .status(404)
                      .send({ mensaje: "Producto no encontrado" });

                  return res
                    .status(200)
                    .send({ productoafectado: StockModificado });
                }
              );
            }
          }
        );
      }
    );
  } else {
    return res.status(500).send({ Surcusal: "enviar parametros obligatorios" });
  }
}

function OrdenarStockSurcursaleskMayor(req, res) {
  const idSurcu = req.params.idSurcursal;

  ProductoSurcursales.find(
    { idSurcursal: idSurcu},
    (err, productoEncontrado) => {
      if (err)
        return res.status(404).send({ mensaje: "Producto no encontrado" });
      return res.status(200).send({ Productos: productoEncontrado });
    }
  ).sort({ StockSurcursal: -1 });
}

function OrdenarStockSurcursaleskMenor(req, res) {
  const idSurcu = req.params.idSurcursal;
  ProductoSurcursales.find(
    { idSurcursal: idSurcu},
    (err, productoEncontrado) => {
      if (err)
        return res.status(404).send({ mensaje: "Producto no encontrado" });
      return res.status(200).send({ Productos: productoEncontrado });
    }
  ).sort({ StockSurcursal: 1 });
}

function ElMasVendidoProductos(req, res) {
  const idSurcu = req.params.idSurcursal;
  ProductoSurcursales.find(
    { idSurcursal: idSurcu},
    (err, productoEncontrado) => {
      if (err)
        return res.status(404).send({ mensaje: "Producto no encontrado" });
      return res.status(200).send({ Productos: productoEncontrado });
    }
  ).sort({ CantidadVendida: -1 });
}

function VerProductosSurucrsalesId(req, res) {
  const idProducto = req.params.idProducto;

  ProductoSurcursales.findById(
    { _id: idProducto },
    (err, productoEncontrado) => {
      if (err)
        return res.status(404).send({ mensaje: "Producto no encontrado" });
      return res.status(200).send({ Productos: productoEncontrado });
    }
  );
}

function verSurcursalesAdmin(req, res) {
  const idEmpresa = req.params.idEmpresa;

  Sucursales.find(
    { idEmpresa: idEmpresa },
    (err, sucursalEmpresaEncontrada) => {
      return res.status(200).send({ Sucursales: sucursalEmpresaEncontrada });
    }
  );
}

module.exports = {
  agregarSucursales,
  eliminarSucursales,
  editarSurcursal,
  verSucursalesId,
  verSucursalesEmpresas,

  agregarProductosSurcursales,
  VerProductosPorSucursales,
  VentaSimuladaSurcursales,
  OrdenarStockSurcursaleskMayor,
  ElMasVendidoProductos,
  OrdenarStockSurcursaleskMenor,
  VerProductosSurucrsalesId,
  verSurcursalesAdmin,
  visualizarSucursal
};