
# Meu Projeto Full Stack

Este projeto é uma aplicação Full Stack que integra um front-end em React com um back-end em Node.js, utilizando PostgreSQL como banco de dados. O objetivo é gerenciar usuários, permitindo a realização de operações CRUD (Criar, Ler, Atualizar e Deletar).

## Tecnologias Utilizadas

- **Front-end**: React
- **Back-end**: Node.js, Express.js
- **Banco de Dados**: PostgreSQL
- **Documentação da API**: Swagger

## Funcionalidades

- Listar todos os usuários
- Criar um novo usuário
- Atualizar informações de um usuário existente
- Deletar um usuário
- Consultar um usuário específico pelo ID

## Estrutura do Projeto
```markdown

├── backend              # Código do back-end
│   ├── database.js      # Configuração do banco de dados
│   ├── routes           # Rotas da API
│   ├── app.js           # Configuração do Express
│   └── ...
└── frontend             # Código do front-end
    ├── src              # Código-fonte do React
    └── ...
```

## Como Executar o Projeto

### Pré-requisitos

- Node.js
- PostgreSQL

### Configuração do Banco de Dados

1. Crie um banco de dados no PostgreSQL.
2. Execute o script SQL para criar a tabela `usuarios`:

   ```sql
   CREATE TABLE usuarios (
       id SERIAL PRIMARY KEY,
       nome VARCHAR(100) NOT NULL,
       email VARCHAR(100) NOT NULL UNIQUE,
       senha VARCHAR(100) NOT NULL
   );
   ```

### Executando o Back-end

1. Navegue até a pasta do back-end:
   ```bash
   cd backend
   ```

2. Instale as dependências:
   ```bash
   npm install
   ```

3. Inicie o servidor:
   ```bash
   npm start
   ```

### Executando o Front-end

1. Navegue até a pasta do front-end:
   ```bash
   cd frontend
   ```

2. Instale as dependências:
   ```bash
   npm install
   ```

3. Inicie a aplicação:
   ```bash
   npm start
   ```

## Documentação da API

A documentação da API está disponível no Swagger. Acesse a seguinte URL para visualizar as rotas e testar a API:

```
http://localhost:9000/docs
```

## Contribuições

Sinta-se à vontade para contribuir com melhorias ou correções. Basta fazer um fork do repositório e criar um pull request.

## Licença

Este projeto está licenciado sob a MIT License. Veja o arquivo [LICENSE](LICENSE) para mais detalhes.

## Contato

Para dúvidas ou sugestões, entre em contato:

- **Nome**: Rychard Gabriell Santana de Alcantara
- **Email**: rychardgabriell32@gmail.com
```

Sinta-se à vontade para personalizar qualquer seção conforme necessário! Se precisar de mais alguma coisa, é só avisar.