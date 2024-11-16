const mongoose = require('mongoose');

// Definindo o schema para o modelo Morador
const moradorSchema = new mongoose.Schema({
  nome: { 
    type: String, 
    required: true 
  },
  foto: { 
    type: String, 
    required: true // URL da imagem
  },
  dataCadastro: { 
    type: Date, 
    default: Date.now 
  },
}, { timestamps: true }); // Adiciona os campos de data de criação e atualização automaticamente

// Cria o modelo Morador com base no schema
module.exports = mongoose.model('Morador', moradorSchema);
