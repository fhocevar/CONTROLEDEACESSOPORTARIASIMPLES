import React, { useState } from 'react';
import axios from 'axios';
import Button from '@mui/material/Button'; // Importando o Button

const CadastroMoradores = () => {
  const [nome, setNome] = useState('');
  const [cpf, setCpf] = useState('');
  const [imagem, setImagem] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    const formData = new FormData();
    formData.append('nome', nome);
    formData.append('cpf', cpf);
    formData.append('imagem', imagem);

    try {
      await axios.post('/api/moradores', formData);
      alert('Morador cadastrado com sucesso!');
    } catch (error) {
      console.error('Erro ao cadastrar morador:', error);
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
        placeholder="CPF"
        value={cpf}
        onChange={(e) => setCpf(e.target.value)}
        required
      />
      <input
        type="file"
        onChange={(e) => setImagem(e.target.files[0])}
        required
      />
      <Button type="submit" variant="contained" color="primary">Cadastrar Morador</Button> {/* Substituindo o botão */}
    </form>
  );
};

export default CadastroMoradores;
