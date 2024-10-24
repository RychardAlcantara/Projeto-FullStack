var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
var cors = require("cors");
var indexRouter = require('./routes/index');
const user = require('./routes/user');
const loginRouter = require('./routes/loginRouter')

// Swagger
const swaggerUi = require('swagger-ui-express');
const YAML = require('yamljs');  // Biblioteca para carregar arquivos YAML

var app = express();

// Carregar o arquivo de documentação Swagger
const swaggerDocument = YAML.load('./swagger.yaml');  // Carrega o arquivo swagger.yaml
app.use('/swagger', swaggerUi.serve, swaggerUi.setup(swaggerDocument));  // Define a rota para a UI do Swagger



// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

app.use(cors({ origin: 'http://localhost:3000'}));
app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

//rotas
app.use('/', indexRouter);
app.use('/user', user);
app.use('/auth', loginRouter); // Adicione esta linha para a autenticação

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

module.exports = app;
