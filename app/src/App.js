// src/App.js
import React, { Component } from 'react';
import { BrowserRouter as Router, Route, Routes, Navigate } from 'react-router-dom';
import Login from './components/Auth/Login';
import Register from './components/Auth/Register';
import UserProfile from './components/UserProfile';
import UserForm from './components/UserForm';
import UserList from './components/UserList';
import { Box, Container } from '@mui/material';

class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      users: [],
      newUser: { nome: '', email: '', senha: '' },
      isLoggedIn: !!localStorage.getItem('token'), // Verifica se já está logado
    };
  }

   // Método para buscar usuários da API
   fetchUsers = async () => {
    try {
      const res = await fetch("http://localhost:9000/userCreate");
      const data = await res.json();
      this.setState({ users: data });
    } catch (err) {
      console.error("Erro ao buscar usuários:", err);
    }
  };

  // Adiciona um novo usuário
  addUser = async (user) => {
    try {
      const res = await fetch("http://localhost:9000/userCreate", {
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
      const res = await fetch(`http://localhost:9000/userCreate/${user.id}`, {
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
      const res = await fetch(`http://localhost:9000/userCreate/${id}`, {
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

  render() {
    const { isLoggedIn, users } = this.state; 

    return (
      <Router>
        <Routes>
          <Route path="/login" element={<Login onLogin={this.handleLogin} />} />
          <Route path="/register" element={<Register />} />
          <Route path="/userCreate" element={this.state.isLoggedIn ? <UserProfile onLogout={this.handleLogout} /> : <Navigate to="/login" />} />
        </Routes>
        {isLoggedIn && ( // Condicional para mostrar o formulário e lista de usuários apenas se estiver logado
          <Container maxWidth="md">
            <Box mt={4}>
              <UserForm addUser={this.addUser} />
              <UserList users={users} deleteUser={this.deleteUser} />
            </Box>
          </Container>
        )}
        
      </Router>
    );
  }
}

export default App;
