// src/controllers/authController.js
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const pool = require('../../database');

// Função para registrar um usuário
const register = async (req, res) => {
  const { username, password } = req.body;

 // Verificar se o usuário já existe
 try {
  const existingUser = await pool.query('SELECT * FROM users WHERE username = $1', [username]);
  if (existingUser.rows.length > 0) {
    return res.status(400).send('User already exists');
  }

  // Hash a senha antes de armazená-la
  const hashedPassword = await bcrypt.hash(password, 10);
  await pool.query('INSERT INTO users (username, password) VALUES ($1, $2)', [username, hashedPassword]);
  res.status(201).send('User registered');
} catch (err) {
  console.error('Erro ao registrar usuário:', err);
  res.status(500).send('Internal Server Error');
}
};

// Função para login
const login = async (req, res) => {
const { username, password } = req.body;

try {
  const user = await pool.query('SELECT * FROM users WHERE username = $1', [username]);

  if (user.rows.length === 0) {
    return res.status(400).send('User not found');
  }

  const isPasswordValid = await bcrypt.compare(password, user.rows[0].password);
  if (!isPasswordValid) {
    return res.status(400).send('Invalid password');
  }

  // Gerar um token JWT
  const token = jwt.sign({ username: user.rows[0].username }, 'your_jwt_secret', { expiresIn: '1h' });
  res.json({ token });
} catch (err) {
  console.error('Erro ao fazer login:', err);
  res.status(500).send('Internal Server Error');
}
};

module.exports = { register, login };