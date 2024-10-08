var express = require("express");
var router = express.Router();
const bcrypt = require("bcrypt");
var conexion = require('../database');

/* GET users listing. */
router.get('/', function(req, res, next) {
  // creamos la consulta
  var query = 'SELECT * FROM usuarios;';
  // ejecutamos la consulta
  conexion.query(query, function (error, results, fields) {
    if (error) {
      console.log(error);
      res.status(500).send({
        error: error,
        message: 'Error al realizar la peticion'
      })
    } else {
      console.log(results);
      res.status(200).send({
        data: results,
        message: 'Listando usuarios'
      });
    }    
  });
});

router.post('/store', async function (req, res, next) {
 
  const { nombres, apellidos, correo, password } = req.body;

  const hashedPassword = await bcrypt.hash(password, 10);
 
  const query = `INSERT INTO usuarios (nombres,apellidos, correo, password) 
              VALUES ("${nombres}", "${apellidos}", "${correo}", "${hashedPassword}");`;
 
  conexion.query(query, function (error, results, fields) {
    if (error) {
      console.log(error);
      res.status(500).send({
        error: error,
        message: 'Error en la consulta',
      });
    } else {
      console.log(results);
      res.status(200).send({
        data: results,
        message: 'Usuario registrado',
      });
    }
  });
});

router.put('/update/:id', async function (req, res, next) {
 
  const { nombres, apellidos, correo, password } = req.body;

  const hashedPassword = await bcrypt.hash(password, 10);
 
  const query = `UPDATE usuarios 
                SET nombres = "${nombres}", apellidos = "${apellidos}", correo = "${correo}", password = "${hashedPassword}"
                WHERE id = ${req.params.id};`;
 
  conexion.query(query, function (error, results, fields) {
    if (error) {
      console.log(error);
      res.status(500).send({
        error: error,
        message: 'Error en la consulta',
      });
    } else {
      console.log(results);
      res.status(200).send({
        data: results,
        message: 'Usuario registrado',
      });
    }
  });
});

module.exports = router;
