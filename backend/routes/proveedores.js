var express = require("express");
var router = express.Router();
// importamos la coneccion a la base de datos
var conexion = require("../database");

/* GET listar proveedores. */
router.get("/", function (req, res, next) {
  var query = "SELECT * FROM proveedores;";

  conexion.query(query, function (error, results, fields) {
    if (error) {
      console.log(error);
      res.status(500).send({
        error: error,
        message: "Error al realizar la peticion",
      });
    } else {
      console.log(results);
      res.status(200).send({
        data: results,
        message: "Listando proveedores",
      });
    }
  });
});

router.post("/store", function (req, res, next) {
  const { empresa, contacto, telefono, correo, direccion, estado } = req.body;

  var query = `INSERT INTO proveedores (empresa, contacto, telefono, correo, direccion, estado, created_at, updated_at) 
                  VALUES ("${empresa}", "${contacto}", "${telefono}", "${correo}", "${direccion}", "${estado}", CURRENT_TIMESTAMP(), CURRENT_TIMESTAMP());`;

  // ejecutamos la consulta
  conexion.query(query, function (error, results, fields) {
    if (error) {
      console.log(error);
      res.status(500).send({
        error: error,
        message: "Error al realizar la peticion",
      });
    } else {
      console.log(results.insertId);
      res.status(200).send({
        data: results.insertId,
        message: "Proveedor registrado correctamente",
      });
    }
  });
});

router.put("/update/:id", function (req, res, next) {
  const { empresa, contacto, telefono, correo, direccion, estado } = req.body;

  var query = `UPDATE proveedores SET empresa = "${empresa}", contacto = "${contacto}",
                                      telefono = "${telefono}", correo = "${correo}",
                                      direccion = "${direccion}", estado = "${estado}",
                                      updated_at = CURRENT_TIMESTAMP()
                                  WHERE id = ${req.params.id};`;

  // ejecutamos la consulta
  conexion.query(query, function (error, results, fields) {
    if (error) {
      console.log(error);
      res.status(500).send({
        error: error,
        message: "Error al realizar la peticion",
      });
    } else {
      console.log(results);
      res.status(200).send({
        data: results,
        message: "Proveedor actualizado correctamente",
      });
    }
  });
});

router.delete('/delete/:id', function(req, res, next) {

    var query = `DELETE FROM proveedores WHERE id = ${req.params.id};`;
  
    // ejecutamos la consulta
    conexion.query(query, function (error, results, fields) {
      if(error){
        console.log(error);
        res.status(500).send({
          error: error,
          message: 'Error al realizar la peticion'
        });
      } else {
        console.log(req.params.id);
        res.status(200).send({
          data: req.params.id,
          message: 'Proveedor eliminado correctamente'
        });
      }  
    });
});

router.get('/estado/:id', function(req, res, next) {

    var query = `UPDATE proveedores SET estado = !estado WHERE id = ${req.params.id};`;
  
    conexion.query(query, function (error, results, fields) {
      if(error){
        res.status(500).send({
          error: error,
          message: 'Error al realizar la peticion'
        });
      } else {
        res.status(200).send({
          data: results,
          message: 'Estado actualizado correctamente'
        });
      }  
    });
});
  
  

module.exports = router;
