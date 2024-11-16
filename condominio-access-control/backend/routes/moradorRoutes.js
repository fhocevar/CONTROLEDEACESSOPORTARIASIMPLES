const express = require('express');
const { cadastrarMorador } = require('../controllers/moradorController');

const router = express.Router();

router.post('/', cadastrarMorador);

module.exports = router;
