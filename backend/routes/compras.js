var express = require("express");
var router = express.Router();
// importamos la coneccion a la base de datos
var conexion = require("../database");

/* GET listar compras. */
router.get("/", function (req, res, next) {
  var numFilas;
  var porPagina = 10;
  var pagina = parseInt(req.query.page, 10) || 1;
  var numPaginas;
  var salto = (pagina - 1) * porPagina;
  var limite = salto + "," + porPagina;

  var queryFilas = "SELECT COUNT(*) AS numFilas FROM compras;";
  conexion.query(queryFilas, function (error, results, fields) {
    numFilas = results[0].numFilas;
    numPaginas = Math.ceil(numFilas / porPagina);

    var query = `SELECT compras.*, proveedores.empresa AS proveedor
              FROM compras
              LEFT JOIN proveedores ON proveedores.id = compras.proveedor_id
              ORDER BY id DESC
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
          message: "Listando compras",
        });
      }
    });
  });
});

router.post("/store", function (req, res, next) {
  console.log(req.body);

  const { proveedor_id, total, fecha, comprobante, detalles } = req.body;

  // registramos la compra
  var querCompra = `INSERT INTO compras (proveedor_id, total, fecha, comprobante, created_at, updated_at) 
                        VALUES ("${proveedor_id}", "${total}", "${fecha}", "${comprobante}", CURRENT_TIMESTAMP(), CURRENT_TIMESTAMP());`;

  conexion.query(querCompra, function (error, results, fields) {
    if (error) {
      console.log(error);
      res.status(500).send({
        error: error,
        message: "Error al realizar la peticion",
      });
    } else {
      console.log(results.insertId);
      const compra_id = results.insertId;
      // ejecutamos el detalle
      var queryDetalles = `INSERT INTO compras_detalles (compra_id, producto_id, costo, cantidad) VALUES`;
      detalles.forEach((element) => {
        queryDetalles += `("${compra_id}", "${element.producto_id}", "${element.costo}", "${element.cantidad}"),`;
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
            var queryProductos = `UPDATE productos SET stock = stock + ${element.cantidad} WHERE id = ${element.producto_id};`;

            // ejecutamos la consulta
            conexion.query(queryProductos, function (error, results, fields) {
              if (error) {
                console.log(error);
                res.status(500).send({
                  error: error,
                  message: "Error al realizar la peticion",
                });
              }
            });
          });
        }
      });

      res.status(200).send({
        data: "ok",
        message: "Compras registrada correctamente",
      });
    }
  });
});

// compras/detalle/:id
router.get("/detalle/:id", function (req, res, next) {
  var query = `SELECT compras_detalles.*, productos.codigo, productos.nombre AS producto
                FROM compras_detalles
                LEFT JOIN productos ON productos.id = compras_detalles.producto_id
                WHERE compra_id = ${req.params.id}
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
  const queryDet = `SELECT * FROM compras_detalles WHERE compra_id = ${req.params.id}`;

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
      var query = `DELETE FROM compras_detalles WHERE compra_id = ${req.params.id};`;

      // ejecutamos la consulta
      conexion.query(query, function (error, results, fields) {
        if (error) {
          console.log(error);
          res.status(500).send({
            error: error,
            message: "Error al realizar la peticion",
          });
        } else {
          // eliminar la compra
          var query = `DELETE FROM compras WHERE id = ${req.params.id};`;

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
                message: "Compra eliminada correctamente",
              });
            }
          });
        }
      });
    }
  });
});

module.exports = router;
