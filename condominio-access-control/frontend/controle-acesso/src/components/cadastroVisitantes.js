import React, { useState } from 'react';
import axios from 'axios';
import Button from '@mui/material/Button'; // Importando o Button

const CadastroVisitantes = () => {
  const [nome, setNome] = useState('');
  const [documento, setDocumento] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    try {
      await axios.post('/api/visitantes', { nome, documento });
      alert('Visitante cadastrado com sucesso!');
    } catch (error) {
      console.error('Erro ao cadastrar visitante:', error);
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <input
        type="text"
        placeholder="Nome"
        value={nome}
        onChange={(e) => setNome(e.target.value)}
        required
      />
      <input
        type="text"
        placeholder="Documento"
        value={documento}
        onChange={(e) => setDocumento(e.target.value)}
        required
      />
      <Button type="submit" variant="contained" color="primary">Cadastrar Visitante</Button> {/* Substituindo o botão */}
    </form>
  );
};

export default CadastroVisitantes;
