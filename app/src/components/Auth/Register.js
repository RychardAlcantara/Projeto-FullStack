import React, { useState } from 'react';
import { Button, TextField, Box } from '@mui/material';
import { useNavigate } from 'react-router-dom';

const Register = () => {
  const [username, setUsername] = useState('');
  const [senha, setSenha] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();

    const res = await fetch('http://localhost:9000/auth/register', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ username, password: senha }),
    });

    if (res.ok) {
      alert('Usuário registrado com sucesso!');
      navigate('/login'); // Redireciona para a página de login após o registro
    } else {
      alert('Falha no registro. Tente novamente.');
    }
  };

  return (
    <Box component="form" onSubmit={handleSubmit} mt={2}>
      <TextField
        label="Nome de Usuário"
        value={username}
        onChange={(e) => setUsername(e.target.value)}
        required
        fullWidth
        margin="normal"
      />
      <TextField
        label="Senha"
        type="password"
        value={senha}
        onChange={(e) => setSenha(e.target.value)}
        required
        fullWidth
        margin="normal"
      />
      <Button type="submit" variant="contained" fullWidth>
        Registrar
      </Button>
    </Box>
  );
};

export default Register;
