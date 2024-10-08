var express = require("express");
var router = express.Router();
// importamos la coneccion a la base de datos
var conexion = require("../database");

/* GET listar clientes. */
router.get("/", function (req, res, next) {
  var numFilas;
  var porPagina = 10;
  var pagina = parseInt(req.query.page, 10) || 1;
  var numPaginas;
  var salto = (pagina - 1) * porPagina;
  var limite = salto + "," + porPagina;

  var queryFilas = "SELECT COUNT(*) AS numFilas FROM clientes;";
  conexion.query(queryFilas, function (error, results, fields) {
    numFilas = results[0].numFilas;
    numPaginas = Math.ceil(numFilas / porPagina);

    var query = "SELECT * FROM clientes LIMIT " + limite + ";";

    conexion.query(query, function (error, results, fields) {
      if (error) {
        console.log(error);
        res.status(500).send({
          error: error,
          message: "Error al realizar la peticion",
        });
      } else {
        console.log(results);
        var paginacion = {
          total: numFilas,
          current: pagina,
          pages: numPaginas,
          perPage: porPagina,
          previous: null,
          next: null,
        };
        if (pagina <= numPaginas) {
          paginacion.current = pagina;
          paginacion.perPage = porPagina;
          paginacion.previous = pagina > 1 ? pagina - 1 : null;
          paginacion.next = pagina < numPaginas ? pagina + 1 : null;
        }
        res.status(200).send({
          data: results,
          pagination: paginacion,
          message: "Listando clientes",
        });
      }
    });
  });
});

router.post("/store", function (req, res, next) {
  const {
    nombres,
    apellidos,
    documento,
    tipo_documento,
    telefono,
    correo,
    estado,
  } = req.body;

  var query = `INSERT INTO clientes (nombres, apellidos, documento, tipo_documento, telefono, correo, estado, created_at, updated_at) 
                  VALUES ("${nombres}", "${apellidos}", "${documento}", "${tipo_documento}", "${telefono}", "${correo}", "${estado}", CURRENT_TIMESTAMP(), CURRENT_TIMESTAMP());`;

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
        message: "Clientes registrado correctamente",
      });
    }
  });
});

router.put("/update/:id", function (req, res, next) {
  const {
    nombres,
    apellidos,
    documento,
    tipo_documento,
    telefono,
    correo,
    estado,
  } = req.body;

  var query = `UPDATE clientes SET nombres = "${nombres}", apellidos = "${apellidos}",
                                      documento = "${documento}", tipo_documento = "${tipo_documento}",           
                                      telefono = "${telefono}", correo = "${correo}", estado = "${estado}",
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
        message: "Cliente actualizado correctamente",
      });
    }
  });
});

router.delete("/delete/:id", function (req, res, next) {
  var query = `DELETE FROM clientes WHERE id = ${req.params.id};`;

  // ejecutamos la consulta
  conexion.query(query, function (error, results, fields) {
    if (error) {
      console.log(error);
      res.status(500).send({
        error: error,
        message: "Error al realizar la peticion",
      });
    } else {
      console.log(req.params.id);
      res.status(200).send({
        data: req.params.id,
        message: "Cliente eliminado correctamente",
      });
    }
  });
});

router.get("/estado/:id", function (req, res, next) {
  var query = `UPDATE clientes SET estado = !estado WHERE id = ${req.params.id};`;

  conexion.query(query, function (error, results, fields) {
    if (error) {
      res.status(500).send({
        error: error,
        message: "Error al realizar la peticion",
      });
    } else {
      res.status(200).send({
        data: results,
        message: "Estado actualizado correctamente",
      });
    }
  });
});

module.exports = router;
