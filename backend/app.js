var express = require('express');
var cors = require('cors');

var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');

var jwt = require('jsonwebtoken');

var indexRouter = require('./routes/index');
var usersRouter = require('./routes/users');
var productosRouter = require('./routes/productos');
var clientesRouter = require('./routes/clientes');
var proveedoresRouter = require('./routes/proveedores');
var comprasRouter = require('./routes/compras');
var ventasRouter = require('./routes/ventas');
var homeRouter = require('./routes/home');
var authRouter = require('./routes/auth');

var app = express();

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use(cors());

app.use('/', indexRouter);
app.use('/users', verificarToken, usersRouter);
app.use('/productos', verificarToken, productosRouter);
app.use('/clientes', verificarToken, clientesRouter);
app.use('/proveedores', verificarToken, proveedoresRouter);
app.use('/compras', verificarToken, comprasRouter);
app.use('/ventas', verificarToken, ventasRouter);
app.use('/home', verificarToken, homeRouter);

app.use('/auth', authRouter);

app.get('/protegido', verificarToken, (req, res) => {
    res.status(200).send({ 
        message: 'Acceso permitido',
        usuario: req.user.usuario
    });
});


function verificarToken(req, res, next) {
    const authHeader = req.headers['authorization'];
    if(authHeader) {
        const token = authHeader.split(' ')[1];

        jwt.verify(token, 'secretkey', (err, user) => {
            if(err) {
                return res.status(403).send({
                    message: 'Token invalido'
                });
            } else {
                req.user = user;
                next();
            }
        })
    } else {
        res.status(401).send({
            message: 'No hay token'
        })
    }
}


module.exports = app;
