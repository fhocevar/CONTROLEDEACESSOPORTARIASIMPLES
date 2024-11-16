const express = require('express');
   const { login, protect } = require('../controllers/authController');
   const router = express.Router();

   router.post('/login', login);
   router.get('/profile', protect, (req, res) => {
     res.json({ message: 'Bem-vindo ao perfil', user: req.user });
   });

   module.exports = router;