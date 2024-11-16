import React, { useState } from 'react';
import axios from 'axios';
import Button from '@mui/material/Button'; // Importando o Button

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post('http://localhost:5000/api/login', { email, password });
      localStorage.setItem('token', response.data.token); // Salva o token no localStorage
      alert('Login bem-sucedido');
    } catch (error) {
      alert('Erro ao fazer login');
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <input type="email" placeholder="Email" value={email} onChange={(e) => setEmail(e.target.value)} required />
      <input type="password" placeholder="Senha" value={password} onChange={(e) => setPassword(e.target.value)} required />
      <Button type="submit" variant="contained" color="primary">Entrar</Button> {/* Substituindo o botão */}
    </form>
  );
};

export default Login;
