import React, { useEffect, useState } from 'react';
import axios from 'axios';
import Button from '@mui/material/Button'; // Importando o Button

const Relatorios = () => {
  const [relatorios, setRelatorios] = useState([]);

  useEffect(() => {
    const fetchRelatorios = async () => {
      try {
        const response = await axios.get('/api/relatorios');
        setRelatorios(response.data);
      } catch (error) {
        console.error('Erro ao buscar relatórios:', error);
      }
    };

    fetchRelatorios();
  }, []);

  return (
    <div>
      <h2>Relatórios de Acesso</h2>
      <ul>
        {relatorios.map((relatorio) => (
          <li key={relatorio.id}>{relatorio.nome} - {relatorio.data}</li>
        ))}
      </ul>
      <Button variant="contained" color="secondary">Gerar Relatório</Button> {/* Exemplo de botão adicional */}
    </div>
  );
};

export default Relatorios;
