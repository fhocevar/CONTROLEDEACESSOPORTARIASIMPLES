const Morador = require('../models/Morador'); // Importa o modelo Morador

exports.cadastrarMorador = async (req, res) => {
  try {
    // Cria um novo objeto Morador usando os dados do corpo da requisição
    const morador = new Morador(req.body);

    // Salva o morador no banco de dados
    await morador.save();

    // Responde com o morador cadastrado e o status 201 (Criado)
    res.status(201).json(morador);
  } catch (error) {
    // Se houver erro, responde com status 400 e a mensagem do erro
    res.status(400).json({ error: error.message });
  }
};
