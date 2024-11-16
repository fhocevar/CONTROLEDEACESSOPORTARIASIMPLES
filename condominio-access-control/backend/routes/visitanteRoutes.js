const express = require('express');
const { cadastrarVisitante } = require('../controllers/visitanteController'); // Importa o controlador

const router = express.Router();

// Rota para cadastrar visitante
router.post('/', cadastrarVisitante); // Chama a função de controlador para cadastrar o visitante

module.exports = router;
