// src/App.js
import React, { Component } from 'react';
import { BrowserRouter as Router, Route, Routes, Navigate } from 'react-router-dom';
import Login from './components/Auth/Login';
import Register from './components/Auth/Register';
import UserProfile from './components/UserProfile';
import UserForm from './components/UserForm';
import UserList from './components/UserList';
import { Box, Button, Container } from '@mui/material';

class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      users: [],
      newUser: { nome: '', email: '', senha: '' },
      isLoggedIn: !!localStorage.getItem('token'), // Verifica se já está logado
      showUsers: false,
    };
  }

   // Método para buscar usuários da API
   fetchUsers = async () => {
    try {
      const res = await fetch("http://localhost:9000/user");
      const data = await res.json();
      this.setState({ users: data });
    } catch (err) {
      console.error("Erro ao buscar usuários:", err);
    }
  };

  // Adiciona um novo usuário
  addUser = async (user) => {
    try {
      const res = await fetch("http://localhost:9000/user", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(user)
      });
      if (res.ok) {
        this.fetchUsers();
      }
    } catch (err) {
      console.error("Erro ao adicionar usuário:", err);
    }
  };

  // Atualiza um usuário
  updateUser = async (user) => {
    try {
      const res = await fetch(`http://localhost:9000/user/${user.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(user)
      });
      if (res.ok) {
        this.fetchUsers();  // Atualiza a lista de usuários após a edição
      }
    } catch (err) {
      console.error("Erro ao atualizar usuário:", err);
    }
  };

  // Deleta um usuário
  deleteUser = async (id) => {
    try {
      const res = await fetch(`http://localhost:9000/user/${id}`, {
        method: "DELETE"
      });
      if (res.ok) {
        this.fetchUsers();
      }
    } catch (err) {
      console.error("Erro ao deletar usuário:", err);
    }
  };

  // Método para efetuar login
  handleLogin = () => {
    localStorage.setItem('token', 'user-token'); // Armazena um token de login
    this.setState({ isLoggedIn: true });
  };

  // Método para efetuar logout
  handleLogout = () => {
    localStorage.removeItem('token'); // Remove o token do localStorage
    this.setState({ isLoggedIn: false });
  };

    // Alterna a exibição da lista de usuários
    toggleUserList = () => {
      this.setState((prevState) => ({ showUsers: !prevState.showUsers }));
    };

  render() {
    const { isLoggedIn, users, showUsers } = this.state; 

    return (
      <Router>
        <Routes>
          <Route path="/login" element={<Login onLogin={this.handleLogin} />} />
          <Route path="/register" element={<Register />} />
          <Route 
            path="/user" 
            element={isLoggedIn ? <UserProfile onLogout={this.handleLogout} /> : <Navigate to="/login" />} 
          />
        </Routes>
        
        {isLoggedIn && ( // Condicional para mostrar o formulário e lista de usuários apenas se estiver logado
          <Container maxWidth="md">
            <Box mt={4}>
              <UserForm addUser={this.addUser} />

              {/* Botão para alternar entre exibir ou ocultar a lista de usuários */}
              <Button 
                variant="contained" 
                color="secondary" 
                onClick={this.toggleUserList} 
                fullWidth
              >
                {showUsers ? 'Ocultar Usuários Cadastrados' : 'Exibir Usuários Cadastrados'}
              </Button>

              {/* Lista de usuários é exibida apenas se showUsers for true */}
              {showUsers && <UserList users={users} deleteUser={this.deleteUser} />}
            </Box>
          </Container>
        )}
      </Router>
    );
  }
}

export default App;
