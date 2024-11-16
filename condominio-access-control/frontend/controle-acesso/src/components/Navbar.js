import React from 'react';
import { Link } from 'react-router-dom';
import Button from '@mui/material/Button'; // Importando o Button

const Navbar = () => {
  return (
    <nav>
      <ul>
        <li><Link to="/">Home</Link></li>
        <li><Link to="/cadastro-moradores">Cadastro de Moradores</Link></li>
        <li><Link to="/cadastro-visitantes">Cadastro de Visitantes</Link></li>
        <li><Link to="/relatorios">Relatórios</Link></li>
        <li>
          <Button variant="contained" color="secondary" onClick={() => localStorage.removeItem('token')}>Logout</Button> {/* Exemplo de logout */}
        </li>
      </ul>
    </nav>
  );
};

export default Navbar;
