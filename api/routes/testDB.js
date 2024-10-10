const express = require('express');
const pool = require('../database');  // Importe a conexão do banco de dados
var testDBRouter = express.Router();

testDBRouter.get('/', async (req, res) => {
  try {
    const result = await pool.query('SELECT * FROM usuarios');  // Exemplo de consulta
    res.json(result.rows);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Erro no servidor');
  }
});

testDBRouter.get('/:id', async (req, res) => {
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

  testDBRouter.post('/', async (req, res) => {
    const { nome, email, senha } = req.body;
    try {
      const result = await pool.query(
        'INSERT INTO usuarios (nome, email, senha) VALUES ($1, $2, $3) RETURNING id',
        [nome, email, senha]
      );
      res.json({ message: 'Usuário criado com sucesso', id: result.rows[0].id });
    } catch (err) {
      console.error(err.message);
      res.status(500).send('Erro no servidor');
    }
  });

// Rota para atualizar um usuário existente
testDBRouter.put('/:id', async (req, res) => {
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


testDBRouter.delete('/:id', async (req, res) => {
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

module.exports = testDBRouter;
