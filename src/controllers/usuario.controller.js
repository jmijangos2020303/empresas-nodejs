const Usuario = require('../models/usuarios.model');
const bcrypt = require('bcrypt-nodejs');
const jwt = require('../services/jwt');
const ProductosEmpresas = require("../models/productos.empresa.model");



function RegistrarAd(req, res) {

    let usuarioModelo = new Usuario();

    usuarioModelo.nombre='SuperAdmin';
    usuarioModelo.usuario = 'SuperAdmin';
    usuarioModelo.email = 'Superadmin';
    usuarioModelo.rol = 'ADMIN';
    usuarioModelo.password = '123456'

    Usuario.find({$or:[
        {usuario: usuarioModelo.usuario}
    ]}).exec((err, buscarUsuario)=>{
        if(err) return console.log("ERROR en la peticion")
        
        if(buscarUsuario && buscarUsuario.length>=1){
            console.log("Usuario Super Admin creado con anterioridad")
        }else{
            bcrypt.hash(usuarioModelo.password,null,null, (err, passCrypt)=>{
                usuarioModelo.password = passCrypt;
            })

            usuarioModelo.save((err,usuarioGuardado)=>{
                if(err) return console.log( "ERROR al crear el usuario Admin" )

                if(usuarioGuardado){
                    console.log( "Usuario Super Admin Creado" )
                }
            })
        }
    })
}



function Login(req, res) {
    var parametros = req.body;
    Usuario.findOne({ email: parametros.email }, (err, usuarioEncontrado) => {
      if (err) return res.status(500).send({ mensaje: "Error en la peticion" });
      if (usuarioEncontrado) {
        // COMPARO CONTRASENA SIN ENCRIPTAR CON LA ENCRIPTADA
        bcrypt.compare(
          parametros.password,
          usuarioEncontrado.password,
          (err, verificacionPassword) => {
            //TRUE OR FALSE
            // VERIFICO SI EL PASSWORD COINCIDE EN BASE DE DATOS
            if (verificacionPassword) {
              // SI EL PARAMETRO OBTENERTOKEN ES TRUE, CREA EL TOKEN
              if (parametros.obtenerToken === "true") {
                return res
                  .status(200)
                  .send({ token: jwt.crearToken(usuarioEncontrado) });
              } else {
                usuarioEncontrado.password = undefined;
                return res.status(200).send({ usuario: usuarioEncontrado });
              }
            } else {
              return res
                .status(500)
                .send({ mensaje: "Las contrasena no coincide" });
            }
          }
        );
      } else {
        return res
          .status(500)
          .send({ mensaje: "Error, el correo no se encuentra registrado." });
      }
    });
  }
  
  function RegistrarEmpresa(req, res) {
    var parametro = req.body;
    var usuarioModel = new Usuario();
  
    if (
      parametro.nombre &&
      parametro.email &&
      parametro.password &&
      parametro.tipoEmpresa
    ) {
      usuarioModel.nombre = parametro.nombre;
      usuarioModel.email = parametro.email;
      usuarioModel.telefono = parametro.telefono;
      usuarioModel.direccion = parametro.direccion;
      usuarioModel.password = parametro.password;
      usuarioModel.rol = "ROL_EMPRESA";
      usuarioModel.tipoEmpresa = parametro.tipoEmpresa;
  
      Usuario.find({ email: parametro.email }, (err, usuarioEncontrado) => {
        if (usuarioEncontrado.length == 0) {
          bcrypt.hash(
            parametro.password,
            null,
            null,
            (err, passwordEncriptada) => {
              usuarioModel.password = passwordEncriptada;
  
              usuarioModel.save((err, usuarioGuardado) => {
                if (err)
                  return res
                    .status(500)
                    .send({ mensaje: "Error en la peticion" });
                if (!usuarioGuardado)
                  return res
                    .status(500)
                    .send({ mensaje: "Error al agregar Empresa" });
  
                return res.status(200).send({ usuario: usuarioGuardado });
              });
            }
          );
        } else {
          return res.status(500).send({ mensaje: "La empresa ya a sido creada" });
        }
      });
    } else {
      return res.status(500).send({ mensaje: "Enviar parametros obligatorios" });
    }
  }
  
  function EditarEmpresa(req, res) {
    var idUser = req.params.idUser;
    var parametros = req.body;
  
    Usuario.findOne({ idUser: idUser }, (err, usuarioEncontrado) => {
      if (req.user.rol == "ROL_ADMIN") {
          Usuario.findByIdAndUpdate(
            idUser,
            {
              $set: {
                nombre: parametros.nombre,
                telefono: parametros.telefono,
                direccion: parametros.direccion,
                tipoEmpresa: parametros.tipoEmpresa,
              },
            },
            { new: true },
            (err, usuarioActualizado) => {
              if (err)
                return res
                  .status(500)
                  .send({ mensaje: "Error en la peticon de editar-admin" });
              if (!usuarioActualizado)
                return res
                  .status(500)
                  .send({ mensaje: "Error al editar usuario-admin" });
              return res.status(200).send({ usuario: usuarioActualizado });
            }
          );
        
      } else {
        Usuario.findByIdAndUpdate({$set: {
              nombre: parametros.nombre,
              telefono: parametros.telefono,
              direccion: parametros.direccion,
              tipoEmpresa: parametros.tipoEmpresa,
            },
          },
          { new: true },
          (err, usuarioActualizado) => {
            if (err)
              return res.status(500).send({ mensaje: "Error en la peticion" });
            if (!usuarioActualizado)
              return res
                .status(500)
                .send({ mensaje: "Error al editar el Usuario" });
  
            return res.status(200).send({ usuario: usuarioActualizado });
          }
        );
      }
    });
  }
  
  //Falta este tambien
  function EliminarEmpresas(req, res) {
    var idUsua = req.params.idUser;
  
    if (req.user.rol !== "ROL_ADMIN") {
      return res
        .status(500)
        .send({ mensaje: "No tiene los permisos para eliminar Empresas." });
    }
  
  
    Usuario.findByIdAndDelete(idUsua, (err, UsuarioEliminado) => {
      if (err) return res.status(500).send({ mensaje: "Error en la peticion" });
      if (!UsuarioEliminado)
        return res.status(500).send({ mensaje: "Error al eliminar el producto" });
  
      return res.status(200).send({ usuario: UsuarioEliminado });
    });
  }
  
  /*function VerEmpresas(req, res) {
    Usuario.findOne({}, (err, usuarioEncontrado) => {
      if (req.user.rol == "ROL_ADMIN") {
        Usuario.find({rol: 'ROL_EMPRESA'}, (err, UsuarioEncontrado) => {
          return res.status(200).send({ Empresas: UsuarioEncontrado });
        });
      } else {
        Usuario.find({}, (err, UsuarioEncontrado) => {
          return res.status(200).send({ mensaje: UsuarioEncontrado });
        });
      }
    });
  }*/




  function VerEmpresas(req, res) {
    
    Usuario.find({}, (err, catEncontrado) => {
        if (err) return res.status(500).send({ mensaje: 'Error en la peticion' })
        if (!catEncontrado) return res.status(500).send({ mensaje: 'Error al buscar empresa' })

        return res.status(200).send({ Empresas: catEncontrado })
    })
}



  
  function EmpresaId(req, res) {
    const idUser = req.params.idUser;
  
    if (req.user.rol == "ROL_EMPRESA") {
      Usuario.findById(
        { _id: idUser},
        (err, EmpresaEncontrada) => {
            if (err)
              return res.status(404).send({ mensaje: "Empresa no encontrado" });
            if (!EmpresaEncontrada)
              return res.status(404).send({ mensaje: "Empresa no encontrado" });
            return res.status(200).send({ Empresa: EmpresaEncontrada });
          
        }
      );
    } else {
      Usuario.findById({ _id: idUser }, (err, EmpresaEncontrada) => {
        if (err)
          return res.status(404).send({ mensaje: "Empresa no encontrado" });
        if (!EmpresaEncontrada)
          return res.status(404).send({ mensaje: "Empresa no encontrado" });
        return res.status(200).send({ Empresa: EmpresaEncontrada });
      });
    }
  }
  
  //Productos
  
  function agregarProductosEmpresas(req, res) {
    var parametro = req.body;
    var productosEmpresasModel = new ProductosEmpresas();
  
    if (
      parametro.NombreProducto &&
      parametro.NombreProveedor &&
      parametro.Stock
    ) {
      productosEmpresasModel.NombreProducto = parametro.NombreProducto;
      productosEmpresasModel.NombreProveedor = parametro.NombreProveedor;
      productosEmpresasModel.Stock = parametro.Stock;
  
      ProductosEmpresas.find(
        { NombreProducto: parametro.NombreProducto},
        (err, productoEncontrado) => {
          if (productoEncontrado.length == 0) {
            productosEmpresasModel.save((err, productoGuardado) => {
              if (err)
                return res.status(500).send({ mensaje: "Error en la peticion" });
              if (!productoGuardado)
                return res
                  .status(500)
                  .send({ mensaje: "Error al agregar el producto" });
              return res.status(200).send({ productos: productoGuardado });
            });
          } else {
            return res
              .status(500)
              .send({ Surcusal: "El producto ya a sido creada" });
          }
        }
      );
    } else {
      return res
        .status(406)
        .send({ mensaje: "Debe enviar los parametro obligatorios" });
    }
  }
  
  //Tambien aqui
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
  
  function VerProductosId(req, res) {
    const idProducto = req.params.idProducto;
  
    ProductosEmpresas.findById(
      { _id: idProducto},
      (err, productoEncontrado) => {
        if (err)
          return res.status(404).send({ mensaje: "Producto no encontrado" });
        return res.status(200).send({ Productos: productoEncontrado });
      }
    );
  }
  
  function EliminarProductosEmpresas(req, res) {
    const productoEmpresaId = req.params.idProductoEmpresa;
  
    ProductosEmpresas.findOne(
      { _id: productoEmpresaId},
      (err, productoEmpresa) => {
        if (!productoEmpresa)
          return res
            .status(400)
            .send({ mensaje: "No puede eliminar productos de otras empresas" });
  
        ProductosEmpresas.findByIdAndDelete(
          productoEmpresaId,
          (err, productoEmpresaEliminado) => {
            if (err)
              return res.status(500).send({ mensaje: "Error en la peticion" });
            if (!productoEmpresaEliminado)
              return res
                .status(403)
                .send({ mensaje: "Error al eliminar el producto" });
            return res
              .status(200)
              .send({ productoEliminado: productoEmpresaEliminado });
          }
        );
      }
    );
  }
  
  function EditarProductoEmpresa(req, res) {
    const productoEmpresaId = req.params.idProductoEmpresa;
    const parametros = req.body;
  
    if (
      parametros.NombreProducto &&
      parametros.NombreProveedor &&
      parametros.Stock
    ) {
      ProductosEmpresas.findOne(
        { _id: productoEmpresaId},
        (err, productoEmpresa) => {
          if (!productoEmpresa)
            return res
              .status(400)
              .send({ mensaje: "No puede editar productos de otras empresas" });
  
          ProductosEmpresas.findByIdAndUpdate(
            productoEmpresaId,
            parametros,
            { new: true },
            (err, productoEmpresaEditado) => {
              if (err)
                return res.status(500).send({ mensaje: "Error en la peticion" });
              if (!productoEmpresaEditado)
                return res.status(404).send({ mensaje: "Error al editar" });
              return res
                .status(200)
                .send({ productoEditado: productoEmpresaEditado });
            }
          );
        }
      );
    } else {
      return res
        .status(404)
        .send({ mensaje: "Debe enviar parametros obligatorios" });
    }
  }
  
  function OrdenarStockMayor(req, res) {
    ProductosEmpresas.find(
      {},
      (err, productoEncontrado) => {
        if (err)
          return res.status(404).send({ mensaje: "Producto no encontrado" });
        return res.status(200).send({ Productos: productoEncontrado });
      }
    ).sort({ Stock: -1 });
  }
  
  function OrdenarStockMenor(req, res) {
    ProductosEmpresas.find(
      {},
      (err, productoEncontrado) => {
        if (err)
          return res.status(404).send({ mensaje: "Producto no encontrado" });
        return res.status(200).send({ Productos: productoEncontrado });
      }
    ).sort({ Stock: 1 });
  }
  
  module.exports = {
    RegistrarAd,
    Login,
    RegistrarEmpresa,
    EditarEmpresa,
    EliminarEmpresas,
    VerEmpresas,
    EmpresaId,
    agregarProductosEmpresas,
    VerProductos,
    EliminarProductosEmpresas,
    EditarProductoEmpresa,
    VerProductosId,
    OrdenarStockMayor,
    OrdenarStockMenor,
  };