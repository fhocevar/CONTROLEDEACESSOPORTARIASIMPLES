import React from 'react';
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom';
import CadastroMoradores from './components/CadastroMoradores';
import CadastroVisitantes from './components/CadastroVisitantes';
import Relatorios from './components/Relatorios';
import Navbar from './components/Navbar';
import Button from '@mui/material/Button'; // Importando o Button do Material-UI

function App() {
  return (
    <Router>
      <Navbar />
      <Switch>
        <Route path="/cadastro-moradores" component={CadastroMoradores} />
        <Route path="/cadastro-visitantes" component={CadastroVisitantes} />
        <Route path="/relatorios" component={Relatorios} />
        <Route path="/" exact>
          <h1>Bem-vindo ao Controle de Acesso</h1>
          <Button variant="contained" color="primary">Iniciar</Button> {/* Exemplo de uso do Button */}
        </Route>
      </Switch>
    </Router>
  );
}

export default App;
