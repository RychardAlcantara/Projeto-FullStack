const { Pool } = require('pg');

// Configurações do banco de dados
const pool = new Pool({
  user: 'postgres',     // Nome de usuário do PostgreSQL
  host: 'localhost',       // Endereço do servidor, geralmente 'localhost'
  database: 'postgres',  // Nome do banco de dados
  password: 'nova_senha',   // Senha do usuário
  port: 5432,              // Porta padrão do PostgreSQL
});

// Testando a conexão
pool.connect((err, client, release) => {
  if (err) {
    return console.error('Erro ao conectar ao banco de dados', err.stack);
  }
  console.log('Conexão bem-sucedida ao PostgreSQL');
  release();
});

module.exports = pool;
