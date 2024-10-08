var express = require('express');
var router = express.Router();
// importamos la coneccion a la base de datos
var conexion = require('../database');


router.get('/comprasmes', function(req, res, next) {
    var mes = new Date().getMonth() + 1;
    
    var query = 'SELECT SUM(total) AS totales FROM compras WHERE MONTH(fecha) = ' + mes + ';';

    conexion.query(query, function (error, results, fields) {
        if (error) {
            console.log(error);
            res.status(500).send({
                error: error,
                message: 'Error al realizar la peticion'
            });
        } else {
            console.log(results);
            res.status(200).send({
                data: results[0].totales,
                message: 'Total compras del mes'
            });
        }
    });
});

router.get('/comprasanio', function(req, res, next) {
    var anio = new Date().getFullYear();
    
    var query = 'SELECT SUM(total) AS totales FROM compras WHERE YEAR(fecha) = ' + anio + ';';

    conexion.query(query, function (error, results, fields) {
        if (error) {
            console.log(error);
            res.status(500).send({
                error: error,
                message: 'Error al realizar la peticion'
            });
        } else {
            console.log(results);
            res.status(200).send({
                data: results[0].totales,
                message: 'Total compras del año'
            });
        }
    });
});


router.get('/ventasmes', function(req, res, next) {
    var mes = new Date().getMonth() + 1;
    var query = 'SELECT SUM(total - descuento) AS totales FROM ventas WHERE MONTH(fecha) = ' + mes + ';';

    conexion.query(query, function (error, results, fields) {
        if (error) {
            console.log(error);
            res.status(500).send({
                error: error,
                message: 'Error al realizar la peticion'
            });
        } else {
            console.log(results);
            res.status(200).send({
                data: results[0].totales,
                message: 'Total ventas del mes'
            });
        }
    });
});

router.get('/ventasanio', function(req, res, next) {
    var anio = new Date().getFullYear();
    
    var query = 'SELECT SUM(total - descuento) AS totales FROM ventas WHERE YEAR(fecha) = ' + anio + ';';

    conexion.query(query, function (error, results, fields) {
        if (error) {
            console.log(error);
            res.status(500).send({
                error: error,
                message: 'Error al realizar la peticion'
            });
        } else {
            console.log(results);
            res.status(200).send({
                data: results[0].totales,
                message: 'Total ventas del año'
            });
        }
    });
});

// total compras
router.get('/totalcompras', function(req, res, next) {
    var anio =  new Date().getFullYear();

    var queryCompra = `SELECT SUM(total) AS totales, MONTH(fecha) AS mes
                    FROM compras
                    WHERE YEAR(fecha) = ${anio}
                    GROUP BY MONTH(fecha);`;

    conexion.query(queryCompra, function (error, results, fields) {
        if (error) {
            console.log(error);
            res.status(500).send({
                error: error,
                message: 'Error al realizar la peticion'
            });
        } else {
            console.log(results);
            res.status(200).send({
                data: results,
                message: 'Total compras'
            });
        }
    });
});


// total ventas
router.get('/totalventas', function(req, res, next) {
    var anio =  new Date().getFullYear();

    var queryVenta = `SELECT SUM(total - descuento) AS totales, MONTH(fecha) AS mes
                    FROM ventas
                    WHERE YEAR(fecha) = ${anio}
                    GROUP BY MONTH(fecha);`;

    conexion.query(queryVenta, function (error, results, fields) {
        if (error) {
            console.log(error);
            res.status(500).send({
                error: error,
                message: 'Error al realizar la peticion'
            });
        } else {
            console.log(results);
            res.status(200).send({
                data: results,
                message: 'Total ventas'
            });
        }
    });
});

// mas vendidos
router.get('/masvendidos', function(req, res, next) {
    var anio =  new Date().getFullYear();

    var query = `SELECT SUM(vd.cantidad) AS total, pr.nombre AS producto
                        FROM ventas_detalles AS vd, productos as pr, ventas AS v
                        WHERE vd.producto_id = pr.id
                        AND vd.venta_id = v.id
                        AND YEAR(v.fecha) = ${anio}
                        GROUP BY pr.id;`;

    conexion.query(query, function (error, results, fields) {
        if (error) {
            console.log(error);
            res.status(500).send({
                error: error,
                message: 'Error al realizar la peticion'
            });
        } else {
            console.log(results);
            res.status(200).send({
                data: results,
                message: 'Mas vendidos'
            });
        }
    });
});



module.exports = router;