const Visitante = require('../models/Visitante'); // Importa o modelo Visitante

exports.cadastrarVisitante = async (req, res) => {
  try {
    // Cria um novo objeto Visitante usando os dados do corpo da requisição
    const visitante = new Visitante(req.body);

    // Salva o visitante no banco de dados
    await visitante.save();

    // Responde com o visitante cadastrado e o status 201 (Criado)
    res.status(201).json(visitante);
  } catch (error) {
    // Se houver erro, responde com status 400 e a mensagem do erro
    res.status(400).json({ error: error.message });
  }
};
