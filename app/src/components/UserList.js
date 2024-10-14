import React, { useState } from 'react';
import { List, ListItem, ListItemText, ListItemSecondaryAction, IconButton, Dialog, DialogActions, DialogContent, DialogTitle, TextField, Button } from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import EditIcon from '@mui/icons-material/Edit';

const UserList = ({ users, deleteUser, updateUser }) => {
  const [open, setOpen] = useState(false);
  const [currentUser, setCurrentUser] = useState({ id: '', nome: '', email: '' });

  // Abre o modal com os dados do usuário a ser editado
  const handleEditClick = (user) => {
    setCurrentUser(user);
    setOpen(true);
  };

  // Fecha o modal
  const handleClose = () => {
    setOpen(false);
  };

  // Atualiza o estado conforme o usuário edita os campos
  const handleChange = (e) => {
    const { name, value } = e.target;
    setCurrentUser({ ...currentUser, [name]: value });
  };

  // Submete a edição
  const handleSubmit = () => {
    updateUser(currentUser);  // Chama a função para atualizar o usuário
    setOpen(false);  // Fecha o modal após a submissão
  };

  return (
    <>
      <List>
        {users.map((user) => (
          <ListItem key={user.id}>
            <ListItemText primary={user.nome} secondary={user.email} />
            <ListItemSecondaryAction>
              <IconButton edge="end" aria-label="edit" onClick={() => handleEditClick(user)}>
                <EditIcon />
              </IconButton>
              <IconButton edge="end" aria-label="delete" onClick={() => deleteUser(user.id)}>
                <DeleteIcon />
              </IconButton>
            </ListItemSecondaryAction>
          </ListItem>
        ))}
      </List>

      {/* Modal de Edição */}
      <Dialog open={open} onClose={handleClose}>
        <DialogTitle>Editar Usuário</DialogTitle>
        <DialogContent>
          <TextField
            margin="dense"
            label="Nome"
            name="nome"
            value={currentUser.nome}
            onChange={handleChange}
            fullWidth
          />
          <TextField
            margin="dense"
            label="Email"
            name="email"
            value={currentUser.email}
            onChange={handleChange}
            fullWidth
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose} color="primary">
            Cancelar
          </Button>
          <Button onClick={handleSubmit} color="primary">
            Salvar
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
};

export default UserList;
