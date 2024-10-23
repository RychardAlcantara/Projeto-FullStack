require('dotenv').config();
const express = require('express');
const pool = require('../../database');  // Importe a conexão do banco de dados
const nodemailer = require('nodemailer'); // Para enviar o e-mail de ativação
const crypto = require('crypto'); // Para gerar o token de ativação
var user = express.Router();

const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.EMAIL_USER,  // Seu e-mail pessoal
    pass: process.env.EMAIL_PASS,  // Senha de aplicativo gerada
  }
});

// Função para enviar o e-mail de ativação
const sendActivationEmail = (user, token) => {
  const activationLink = `http://localhost:9000/user/activate/${token}`;

  const mailOptions = {
    from: process.env.EMAIL_USER,
    to: user.email,
    subject: 'Ative sua conta',
    html: `
      <!DOCTYPE html>
    <html lang="pt-BR">
    <head>
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>Ative sua conta</title>
      <style>
        body {
          font-family: Arial, sans-serif;
          margin: 0;
          padding: 0;
          background-color: #f4f4f4;
        }
        .container {
          max-width: 600px;
          margin: 0 auto;
          background: #ffffff;
          padding: 20px;
          border-radius: 8px;
          box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
        }
        h1 {
          color: #4faba8;
          text-align: center;
        }
        p {
          font-size: 16px;
          line-height: 1.5;
          color: #333;
        }
        a {
          display: inline-block;
          margin: 20px 0;
          padding: 10px 20px;
          background-color: #4faba8;
          color: #fff;
          text-decoration: none;
          border-radius: 5px;
          text-align: center;
        }
        a:hover {
          background-color: #4faba8;
        }
        .banner {
          width: 100%;
          height: auto;
          border-radius: 8px 8px 0 0;
        }
      </style>
    </head>
    <body>
      <div class="container">
        <img src="https://static.vecteezy.com/ti/vetor-gratis/p1/701690-fundo-banner-poligonal-abstrato-gratis-vetor.jpg" alt="Banner de Ativação" class="banner">
        <h1>Ativação de Conta</h1>
        <p>Obrigado por se registrar. Para ativar sua conta, por favor, clique no link abaixo:</p>
        <a href="${activationLink}">Ativar Conta</a>
        <p>Se você não se registrou, pode ignorar este e-mail.</p>
      </div>
    </body>
    </html>
    `
  };

  transporter.sendMail(mailOptions, (error, info) => {
    if (error) {
      console.log('Erro ao enviar e-mail:', error);
    } else {
      console.log('E-mail enviado:', info.response);
    }
  });
};

user.get('/', async (req, res) => {
  try {
    const result = await pool.query('SELECT * FROM usuarios');  // Exemplo de consulta
    res.json(result.rows);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Erro no servidor');
  }
});

user.get('/:id', async (req, res) => {
    const { id } = req.params; // Obtém o ID da requisição
    try {
      // Consulta SQL correta
      const result = await pool.query('SELECT * FROM usuarios WHERE id = $1', [id]);
      
      if (result.rows.length === 0) {
        return res.status(404).send('Usuário não encontrado');
      }
      
      res.json(result.rows[0]); // Retorna o primeiro usuário encontrado
    } catch (err) {
      console.error(err.message); // Log do erro no console
      res.status(500).send('Erro no servidor'); // Resposta de erro ao cliente
    }
  });

// Rota para ativar a conta do usuário
user.get('/activate/:token', async (req, res) => {
  const { token } = req.params;

  try {
    // Verifica se o token corresponde a algum usuário no banco de dados
    const result = await pool.query('SELECT * FROM usuarios WHERE token = $1', [token]);

    if (result.rows.length === 0) {
      return res.status(400).send('Token de ativação inválido.');
    }

    // Ativa a conta do usuário e remove o token
    await pool.query('UPDATE usuarios SET is_active = true, token = NULL WHERE token = $1', [token]);

    res.send(`<!DOCTYPE html>
      <html lang="pt-BR">
      <head>
          <meta charset="UTF-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
          <title>Conta Ativada</title>
          <style>
              body {
                  font-family: Arial, sans-serif;
                  display: flex;
                  justify-content: center;
                  align-items: center;
                  height: 100vh;
                  background-color: #f4f4f4;
                  color: #333;
                  text-align: center;
              }
              .container {
                  background: #fff;
                  padding: 20px;
                  border-radius: 8px;
                  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
              }
              h1 {
                  color: #4CAF50;
              }
              p {
                  margin: 10px 0;
              }
              a {
                  display: inline-block;
                  margin-top: 20px;
                  padding: 10px 20px;
                  background-color: #4CAF50;
                  color: #fff;
                  text-decoration: none;
                  border-radius: 5px;
              }
              a:hover {
                  background-color: #45a049;
              }
          </style>
      </head>
      <body>
          <div class="container">
              <h1>Conta Ativada com Sucesso!</h1>
              <p>Obrigado por ativar sua conta. Agora você pode fazer login.</p>
              <a href="http://localhost:3000/">Ir para Login</a>
          </div>
      </body>
      </html>`);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Erro no servidor');
  }
});


  // Rota para criar um novo usuário
user.post('/', async (req, res) => {
  const { nome, email, senha } = req.body;

  // Gera um token de ativação único
  const token = crypto.randomBytes(20).toString('hex');

  try {
    // Insere o novo usuário no banco de dados, incluindo o token de ativação
    const result = await pool.query(
      'INSERT INTO usuarios (nome, email, senha, token, is_active) VALUES ($1, $2, $3, $4, $5) RETURNING id',
      [nome, email, senha, token, false]
    );

    const newUser = { nome, email }; // Simples objeto para enviar o e-mail

    // Envia o e-mail de ativação
    sendActivationEmail(newUser, token);

    res.json({ message: 'Usuário criado com sucesso! Verifique seu e-mail para ativar a conta.', id: result.rows[0].id });
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Erro no servidor');
  }
});

// Rota para atualizar um usuário existente
user.put('/:id', async (req, res) => {
    const { id } = req.params;
    const { nome, email, senha } = req.body;

    const fields = [];
    const values = [];
    
    // Verifique quais campos foram fornecidos e construa a consulta dinamicamente
    if (nome) {
        fields.push('nome = $' + (fields.length + 1));
        values.push(nome);
    }
    if (email) {
        fields.push('email = $' + (fields.length + 1));
        values.push(email);
    }
    if (senha) {
        fields.push('senha = $' + (fields.length + 1));
        values.push(senha);
    }
    
    // Se nenhum campo foi enviado, retorne um erro
    if (fields.length === 0) {
        return res.status(400).send('Nenhum dado para atualizar');
    }

    try {
        // Construa a consulta SQL
        const query = 'UPDATE usuarios SET ' + fields.join(', ') + ' WHERE id = $' + (fields.length + 1);
        values.push(id); // Adicione o ID no final dos valores

        const result = await pool.query(query, values);

        if (result.rowCount === 0) {
            return res.status(404).send('Usuário não encontrado');
        }
        res.json({ message: 'Usuário atualizado com sucesso' });
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Erro no servidor');
    }
});


user.delete('/:id', async (req, res) => {
  const { id } = req.params;
  try {
    const result = await pool.query('DELETE FROM usuarios WHERE id = $1', [id]);
    if (result.rowCount === 0) {
      return res.status(404).send('Usuário não encontrado');
    }
    res.json({ message: 'Usuário deletado com sucesso' });
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Erro no servidor');
  }
});

module.exports = user;
