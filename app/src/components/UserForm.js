import React, { useState } from 'react';
import { TextField, Button, Box } from '@mui/material';

const UserForm = ({ addUser }) => {
  const [user, setUser] = useState({ nome: '', email: '', senha: '' });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setUser({ ...user, [name]: value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    addUser(user);
    setUser({ nome: '', email: '', senha: '' }); // Limpa o formulário
  };

  return (
    <Box component="form" onSubmit={handleSubmit} mb={4}>
      <TextField
        fullWidth
        label="Nome"
        name="nome"
        value={user.nome}
        onChange={handleChange}
        margin="normal"
        required
      />
      <TextField
        fullWidth
        label="Email"
        name="email"
        type="email"
        value={user.email}
        onChange={handleChange}
        margin="normal"
        required
      />
      <TextField
        fullWidth
        label="Senha"
        name="senha"
        type="password"
        value={user.senha}
        onChange={handleChange}
        margin="normal"
        required
      />
      <Button variant="contained" color="primary" type="submit" fullWidth>
        Cadastrar Usuário
      </Button>
    </Box>
  );
};

export default UserForm;
