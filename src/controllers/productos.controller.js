const Product = require('../models/producto.model');


function RegistrarProduct(req, res) {
    var parametros = req.body;
    var cat = new Product();

    if(parametros.nombre ) {
            cat.nombreProduct = parametros.nombre;
            cat.Proveedor = parametros.proveedor;
            cat.cantidad = parametros.cantidad;
            Product.find({ nombre : parametros.nombre }, (err, catEncontrado) => {
                if ( catEncontrado.length == 0 ) {

                    cat.save((err, usuarioGuardado) => {
                        if (err) return res.status(500)
                            .send({ mensaje: 'Error en la peticion' });
                        if(!usuarioGuardado) return res.status(500)
                            .send({ mensaje: 'Error al agregar la empresa'});
                        
                        return res.status(200).send({ Producto: usuarioGuardado });
                    });                 
                } else {
                    return res.status(500)
                        .send({ mensaje: 'Este producto ya existe en la base de datos ' });
                }
            })
    }
}


function EditarEmpresa(req, res) {
    var idCat = req.params.idCat;
    var parametros = req.body;
    
    Product.findByIdAndUpdate(idCat, parametros, { new : true } ,(err, catEditado)=>{
        if (err) return res.status(500).send({ mensaje: 'Error en la peticion' });
        if(!catEditado) return res.status(404)
            .send({ mensaje: 'Error al editar los datos  de la  Categoria' });

        return res.status(200).send({ Empresa_Editada: catEditado});
    })

    
}


function EliminarProd(req, res) {
    var idCat= req.params.idCat;

   
    Product.findByIdAndDelete(idCat, (err, catEliminada)=>{
        if(err) return res.status(400).send({ mensaje: "Error en la peticion de eliminar producto"});
        if(!catEliminada) return res.status(400).send({ mensaje: "Error al eliminar el producto"});

        return res.status(200).send({ Producto_Eliminado: catEliminada})
    })
   
}


function visualizarProds(req, res) {
    
    Product.find({}, (err, catEncontrado) => {
        if (err) return res.status(500).send({ mensaje: 'Error en la peticion' })
        if (!catEncontrado) return res.status(500).send({ mensaje: 'Error al buscar productos' })

        return res.status(200).send({ Productos: catEncontrado })
    })
}

module.exports={
    RegistrarProduct,
    visualizarProds,
    EliminarProd
    }