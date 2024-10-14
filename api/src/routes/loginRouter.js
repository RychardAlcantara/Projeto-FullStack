// src/routes/loginRouter.js
const express = require('express');
const { register, login } = require('../controller/authController');

const loginRouter = express.Router();

// Rota para registrar um usuário
loginRouter.post('/register', register);

// Rota para login
loginRouter.post('/login', login);

// Rota de teste
loginRouter.get('/', (req, res) => {
  res.json({ message: "API funcionando corretamente!" });
});

module.exports = loginRouter;
