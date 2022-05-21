const Empresa = require('../models/empresas.model');
const mongoose = require('mongoose');
const bcrypt = require('bcrypt-nodejs');
const jwt = require('../services/jwt')
const res = require('express/lib/response');
const Sucursales = require('../models/sucursales.model')



function RegistrarEmpresa(req, res) {
    const parametros = req.body; 
    const modeloEmpresa = new Empresa();
    if(parametros.nombre ) {
        
            bcrypt.hash(parametros.password, null, null, (err, passwordEncryptada) => {
    
    
                modeloEmpresa.nombre = parametros.nombre;
                modeloEmpresa.direccion = parametros.direccion; 
                modeloEmpresa.telefono = parametros.telefono; 
                modeloEmpresa.descripcion = parametros.descripcion; 
                modeloEmpresa.rol = 'EMPRESA'; 
                modeloEmpresa.tipoEmpresa = parametros.tipoEmpresa;
                modeloEmpresa.save((err, empresaGuardada)=>{
                        if(err) return res.status(500).send({mensaje: 'error en la peticion 1'})
                        if(!empresaGuardada) return res.status(500).send({mensaje: 'error al agregar empresa'})
                
                        return res.status(200).send({empresa: empresaGuardada})
                    })
                })
}else{
    return res.status(500).send({ mensaje: 'Debe agregar un Nombre obligatoriamente.!' });
}
}


//OBTENER UN PRODUCTO EN ESPECIFICO
function ObtenerEmpresaId (req, res) {
    const idEmpresa = req.params.idEmpresa;

    Empresa.findById(idEmpresa, (err, empresaEncontrado)=>{
        if(err) return res.status(500).send({ mensaje: 'Error en la peticion' });
        if(!empresaEncontrado) return res.status(500).send({ mensaje: 'Error al obtener la Empresa'});

        return res.status(200).send({ empresa: empresaEncontrado })
    })
}


function EditarEmpresa(req, res) {
    var EmpresaID = req.params.idEmpresa;
    var parametros = req.body;

    Empresa.findByIdAndUpdate(EmpresaID, parametros, { new : true } ,(err, empresaEditada)=>{
        if (err) return res.status(500).send({ mensaje: 'Error en la peticion' });
        if(!empresaEditada) return res.status(404)
            .send({ mensaje: 'Error al Editar la Empresa' });

        return res.status(200).send({ empresa: empresaEditada});
    })
}


function EliminarEmpresa(req, res) {
    var idCat= req.params.idCat;

   
    Empresa.findByIdAndDelete(idCat, (err, catEliminada)=>{
        if(err) return res.status(400).send({ mensaje: "Error en la peticion de eliminar la categoria"});
        if(!catEliminada) return res.status(400).send({ mensaje: "Error al eliminar la Empresa"});

        return res.status(200).send({ Empresa_Eliminada: catEliminada})
    })
   
}


function visualizarEmpresas(req, res) {
    
    Empresa.find({}, (err, catEncontrado) => {
        if (err) return res.status(500).send({ mensaje: 'Error en la peticion' })
        if (!catEncontrado) return res.status(500).send({ mensaje: 'Error al buscar empresa' })

        return res.status(200).send({ Empresas: catEncontrado })
    })
}



function obtenerEmpresas(req, res){
    

    if(req.user.rol == 'ADMIN'){

            Empresa.find({}, (err, empresaEncontradas)=>{
                if(err) return res.status(500).send({mensaje: 'error en la peticion 1'})
                if(!empresaEncontradas) return res.status(500).send({mensaje: 'error al mostrar las empresas'})
    
                return res.status(200).send({Empresas: empresaEncontradas})
            })
    


        }else if (req.user.rol =='EMPRESA' ){
            Empresa.find({_id: req.user.sub}, (err, empresaEncontradas)=>{
                if(err) return res.status(500).send({mensaje: 'error en la peticion 2'})
                if(!empresaEncontradas) return res.status(500).send({mensaje: 'error al mostrar las empresas'})
    
                return res.status(200).send({Empresas: empresaEncontradas})
            })
            }
}


function agregarProductos(req, res){
    const parametros = req.body;
    const idEmpresa = req.user.sub;

    
        Empresa.findByIdAndUpdate(idEmpresa, {$push: {productos: {
            nombreProducto: parametros.nombreProducto, 
            precioProducto: parametros.precioProducto, 
            stock: parametros.stock}}},{new:true},(err, productoAgregado)=>{
            if(err) return res.status(500).send({mensaje: 'error en la peticion 1'})
            if(!productoAgregado) return res.status(500).send({mensaje: 'error al agregar  producto'})

            return res.status(200).send({productos: productoAgregado})
        })
}



function editarProductos(req, res){
    const parametros = req.body; 
    const idProducto = req.params.idProducto;
    
        if(idProducto== null){
            return res.status(500).send({mensaje: 'por favor envie el id del producto que queire editar'})
    
        }else{
            Empresa.updateOne({"productos._id": idProducto}, {$set : {"productos.$.nombreProducto": parametros.nombreProducto, "productos.$.precioProducto": parametros.precioProducto, "productos.$.stock": parametros.stock}}, {new: true}, (err, productosActualizados)=>{
    
                if(err) return res.status(500).send({mensaje: 'Hubo un error en la peticion'})
                if(!productosActualizados) return res.status(500).send({mensaje: 'Hubo un error al editar el producto'})
        
                return res.status(200).send({producto: productosActualizados})
        
            })
    
        }
    
       
    
    }


function obtenerProductos(req, res){
    const idEmpresa = req.user.sub;
    
       
        Empresa.aggregate([
                {
                    $match: {"_id": mongoose.Types.ObjectId(idEmpresa)  }
                },
                {
                    $unwind: "$productos"
                },
                {
                    $match: {}
                }, 
                {
                    $group: {
                        "_id": "$_id",
                        "nombre": { "$first": "$nombre" },
                        "productos": { $push: "$productos" }
                    }
                }
            ]).exec((err, productosEncontrados) => {
                if(err) return res.status(400).send({mensaje: 'error en la peticion'})
                if(!productosEncontrados) return res.status(500).send({mensaje: 'error al obtener los productos'})
    
                return res.status(200).send({ productos: productosEncontrados[0].productos})
    
            })
    }


    function eliminarProductos(req, res){

        const idProducto = req.params.idProducto;
            if(idProducto== null){
    
                return res.status(500).send({mensaje: 'por favor envie el id del producto que quiere eliminar'})
            }else{
                Empresa.updateMany({_id: req.user.sub}, {$pull :{productos:{_id: idProducto}}}, (err, productoEliminado) =>{
                    if(err) return res.status(500).send({mensaje: 'error en la peticion'})
                    if(!productoEliminado) return res.status(500).send({mensaje: 'error al eliminar el producto'})
            
                    return res.status(200).send({carrito: productoEliminado})
                })
    
            }
    
        
    }



    function obtenerProducto(req, res){
        const idProducto = req.params.idProducto;
        const idEmpresa = req.user.sub
    
        if(idProducto== null){
            return res.status(500).send({mensaje: 'por favor envie el id del producto'})
        }
          
            Empresa.aggregate([
                {
                    $match: {"_id": mongoose.Types.ObjectId(idEmpresa)  }
                },
                {
                    $unwind: "$productos"
                },
                {
                    $match: {"productos._id": mongoose.Types.ObjectId(idProducto)}
                }, 
                {
                    $group: {
                        "_id": "$_id",
                        "nombre": { "$first": "$nombre" },
                        "productos": { $push: "$productos" }
                    }
                }
            ]).exec((err, productosEncontrados) => {
                if(err) return res.status(400).send({mensaje: 'error en la peticion'})
                if(!productosEncontrados) return res.status(500).send({mensaje: 'error al obtener los productos'})
    
                return res.status(200).send({ productos: productosEncontrados[0].productos[0]})
    
            })
    }



    
    function agregarProductosSucursal(req, res){
        const parametros = req.body;
        const idSucursal = req.params.idSucursal; 
        const idProducto = req.params.idProducto;
      
        
            Sucursales.findByIdAndUpdate(idSucursal, {$push: {productos:{nombreProducto: parametros.nombreProducto, precioProducto: parametros.precioProducto, stock: parametros.stock} }}, {new: true}, (err, productoAgregado)=>{
            
                Empresa.updateOne({"productos._id": idProducto},{$inc: {"productos.$.stock": -parametros.stock}},{new: true}, (err, empresaActualizada)=>{
                    if(err) return res.status(500).send({mensaje: 'Hubo un error en la peticion'})
                    if(!empresaActualizada) return res.status(500).send({mensaje: 'Hubo un error al editar el stock de la empresa'})
                })
                
                
                if(err) return res.status(500).send({mensaje: 'Hubo un error en la peticion'})
                if(!productoAgregado) return res.status(500).send({mensaje: 'Hubo un error al editar la sucursal'})
                return res.status(200).send({producto: productoAgregado})
            })
        
        }


module.exports={
    RegistrarEmpresa,
    visualizarEmpresas,
    EliminarEmpresa,
    EditarEmpresa,
    ObtenerEmpresaId,
    obtenerEmpresas,
    agregarProductos,
    editarProductos, 
    obtenerProductos,
    eliminarProductos,
    obtenerProducto,
    agregarProductosSucursal
    }