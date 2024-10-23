import React, { useEffect, useState } from 'react';
import { Box, Button, TextField, Typography } from '@mui/material';
import { useNavigate } from 'react-router-dom';

const Login = ({ onLogin }) => {
  const [username, setUsername] = useState('');
  const [senha, setSenha] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    // Verifica se já está logado
    const token = localStorage.getItem('token');
    if (token) {
      navigate('/user'); // Redireciona se já estiver logado
    }
  }, [navigate]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await fetch('http://localhost:9000/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, password: senha }), // Certifique-se de que 'password' está correto
      });

      if (!res.ok) {
        throw new Error('Login falhou'); // Lança um erro se a resposta não for ok
      }

      const data = await res.json();
      localStorage.setItem('token', data.token); // Armazena o token no localStorage
      onLogin(); // Chama a função onLogin
      navigate('/user'); // Redireciona após o login bem-sucedido
    } catch (error) {
      console.error('Erro no login:', error); // Log do erro
      alert('Login falhou. Tente novamente.'); // Mensagem de erro
    }
  };

  const handleRegisterRedirect = () => {
    navigate('/register'); // Redireciona para a página de registro
  };

  return (
    <Box 
        sx={{ 
          display: 'flex', 
          flexDirection: 'column', 
          alignItems: 'center', 
          justifyContent: 'center', 
          height: '100vh', // Altura total da viewport
          backgroundColor: '#f5f5f5', // Cor de fundo opcional
        }}
      >
        <Typography variant="h4" mb={2}>Bem-vindo de volta!</Typography>
        <Box component="form" onSubmit={handleSubmit} sx={{ width: '300px' }}>
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
            Login
          </Button>
          <Button
            variant="outlined"
            fullWidth
            onClick={handleRegisterRedirect}
            sx={{ mt: 2 }} // Margem superior
          >
            Não tem uma conta? Registre-se
          </Button>
        </Box>
      </Box>
    );
};

export default Login;
