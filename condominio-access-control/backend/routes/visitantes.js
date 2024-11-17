const express = require('express');
const multer = require('multer');
const path = require('path');
const { Visitor } = require('../models'); // Importa o modelo Visitor do banco de dados

const router = express.Router();

// Configuração do multer para salvar as imagens
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'uploads/'); // Diretório onde as imagens serão salvas
  },
  filename: (req, file, cb) => {
    cb(null, `${req.body.nome}-${Date.now()}${path.extname(file.originalname)}`);
  }
});
const upload = multer({ storage });

// Endpoint para cadastrar o visitante e salvar a imagem
router.post('/', upload.single('imagem'), async (req, res) => {
  try {
    const { nome, documento } = req.body;
    const imagePath = `/uploads/${req.file.filename}`;

    // Salvar no banco de dados o caminho da imagem
    await Visitor.create({ nome, documento, imagePath });
    res.status(201).json({ message: 'Visitante cadastrado com sucesso!', imagePath });
  } catch (error) {
    res.status(500).json({ message: 'Erro ao cadastrar visitante', error });
  }
});

module.exports = router;
