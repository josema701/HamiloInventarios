var express = require("express");
var router = express.Router();
// importamos la coneccion a la base de datos
var conexion = require("../database");

/* GET listar ventas. */
router.get("/", function (req, res, next) {
  var numFilas;
  var porPagina = 10;
  var pagina = parseInt(req.query.page, 10) || 1;
  var numPaginas;
  var salto = (pagina - 1) * porPagina;
  var limite = salto + "," + porPagina;

  var queryFilas = "SELECT COUNT(*) AS numFilas FROM ventas;";
  conexion.query(queryFilas, function (error, results, fields) {
    numFilas = results[0].numFilas;
    numPaginas = Math.ceil(numFilas / porPagina);

    var query = `SELECT ventas.*, clientes.nombres AS cliente
                FROM ventas
                LEFT JOIN clientes ON clientes.id = ventas.cliente_id
                ORDER BY ventas.id DESC
                LIMIT ${limite};
                `;

    conexion.query(query, function (error, results, fields) {
      if (error) {
        console.log(error);
        res.status(500).send({
          error: error,
          message: "Error al realizar la peticion",
        });
      } else {
        // console.log(results);
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
          message: "Listando ventas",
        });
      }
    });
  });
});

router.post("/store", function (req, res, next) {
  console.log(req.body);

  const { cliente_id, total, descuento, fecha, comprobante, detalles } =
    req.body;

  let compr = 0;
  // obtener comprobante
  // var nro = "SELECT COUNT(*) +1 AS nro FROM ventas;";

  var nro = "SELECT MAX(CAST(comprobante AS UNSIGNED)) +1 AS nro FROM ventas;";

  conexion.query(nro, function (error, results, fields) {
    if (error) {
      console.log(error);
      res.status(500).send({
        error: error,
        message: "Error al realizar la peticion",
      });
    } else {
      console.log(results[0].nro);
      compr = results[0].nro == null ? 1001 : results[0].nro;

      // registramos la compra
      var querVenta = `INSERT INTO ventas (cliente_id, total, descuento, fecha, comprobante, created_at, updated_at) 
                      VALUES ("${cliente_id}", "${total}", "${descuento}", "${fecha}", "${compr}", CURRENT_TIMESTAMP(), CURRENT_TIMESTAMP());`;

      conexion.query(querVenta, function (error, results, fields) {
        if (error) {
          console.log(error);
          res.status(500).send({
            error: error,
            message: "Error al realizar la peticion",
          });
        } else {
          console.log(results.insertId);
          const venta_id = results.insertId;
          // ejecutamos el detalle
          var queryDetalles = `INSERT INTO ventas_detalles (venta_id, producto_id, precio, cantidad) VALUES`;
          detalles.forEach((element) => {
            queryDetalles += `("${venta_id}", "${element.producto_id}", "${element.precio}", "${element.cantidad}"),`;
          });
          queryDetalles = queryDetalles.slice(0, -1) + ";";

          conexion.query(queryDetalles, function (error, results, fields) {
            if (error) {
              console.log(error);
              res.status(500).send({
                error: error,
                message: "Error al realizar la peticion",
              });
            } else {
              // console.log(results.insertId);

              // actualizamos stock de productos de los detalles
              detalles.forEach((element) => {
                var queryProductos = `UPDATE productos SET stock = stock - ${element.cantidad} WHERE id = ${element.producto_id};`;

                // ejecutamos la consulta
                conexion.query(
                  queryProductos,
                  function (error, results, fields) {
                    if (error) {
                      console.log(error);
                      res.status(500).send({
                        error: error,
                        message: "Error al realizar la peticion",
                      });
                    }
                  }
                );
              });
            }
          });

          res.status(200).send({
            data: "ok",
            message: "Venta registrada correctamente",
          });
        }
      });
    }
  });
});

// compras/detalle/:id
router.get("/detalle/:id", function (req, res, next) {
  var query = `SELECT ventas_detalles.*, productos.codigo, productos.nombre AS producto
                FROM ventas_detalles
                LEFT JOIN productos ON productos.id = ventas_detalles.producto_id
                WHERE venta_id = ${req.params.id}
                ;`;

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
        message: "Listando detalles",
      });
    }
  });
});

// eliminar/:id
router.delete("/eliminar/:id", function (req, res, next) {
  // obtener los detalles
  const queryDet = `SELECT * FROM ventas_detalles WHERE venta_id = ${req.params.id}`;

  conexion.query(queryDet, function (error, results, fields) {
    if (error) {
      console.log(error);
      res.status(500).send({
        error: error,
        message: "Error al realizar la peticion",
      });
    } else {
      // recorrer los detalles y actualizar el stock
      results.forEach((element) => {
        var query = `UPDATE productos SET stock = stock - ${element.cantidad} WHERE id = ${element.producto_id};`;

        // ejecutamos la consulta
        conexion.query(query, function (error, results, fields) {
          if (error) {
            console.log(error);
            res.status(500).send({
              error: error,
              message: "Error al realizar la peticion",
            });
          }
        });
      });

      // eliminar el detalle
      var query = `DELETE FROM ventas_detalles WHERE venta_id = ${req.params.id};`;

      // ejecutamos la consulta
      conexion.query(query, function (error, results, fields) {
        if (error) {
          console.log(error);
          res.status(500).send({
            error: error,
            message: "Error al realizar la peticion",
          });
        } else {
          // eliminar la venta
          var query = `DELETE FROM ventas WHERE id = ${req.params.id};`;

          conexion.query(query, function (error, results, fields) {
            if (error) {
              console.log(error);
              res.status(500).send({
                error: error,
                message: "Error al realizar la peticion",
              });
            } else {
              res.status(200).send({
                data: req.params.id,
                message: "Venta eliminada correctamente",
              });
            }
          });
        }
      });
    }
  });
});

module.exports = router;
