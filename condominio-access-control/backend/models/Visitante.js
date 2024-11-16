const mongoose = require('mongoose');

// Definindo o schema para o modelo Visitante
const visitanteSchema = new mongoose.Schema({
  nome: { 
    type: String, 
    required: true 
  },
  dataVisita: { 
    type: Date, 
    default: Date.now 
  },
}, { timestamps: true }); // Adiciona os campos de data de criação e atualização automaticamente

// Cria o modelo Visitante com base no schema
module.exports = mongoose.model('Visitante', visitanteSchema);
