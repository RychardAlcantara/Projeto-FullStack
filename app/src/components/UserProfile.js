import React from 'react';
import { AppBar, Box, Toolbar, Typography, Button, Paper } from '@mui/material';
import LogoutButton from './LogoutButton'; // Importe o componente de Logout

const UserProfile = ({ onLogout }) => {
    return (
      <Box sx={{ flexGrow: 1 }}>
        <AppBar position="static" color="default" elevation={3}>
          <Toolbar sx={{ justifyContent: 'space-between' }}>
            {/* Título Centralizado */}
            <Typography variant="h6" sx={{ flexGrow: 1, textAlign: 'center' }}>
              Bem-vindo ao sistema
            </Typography>

            {/* Botão de Logout à Direita */}
            <LogoutButton onLogout={onLogout} />
          </Toolbar>
        </AppBar>

        {/* Seção de conteúdo adicional abaixo do cabeçalho */}
        
      </Box>
    );
};

export default UserProfile;
