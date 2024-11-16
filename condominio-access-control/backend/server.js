const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const connectDB = require('./config/db');
const moradorRoutes = require('./routes/moradorRoutes');
const visitanteRoutes = require('./routes/visitanteRoutes');

dotenv.config();
connectDB();

const app = express();

app.use(cors());
app.use(express.json());

app.use('/api/moradores', moradorRoutes);
app.use('/api/visitantes', visitanteRoutes);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Servidor rodando na porta ${PORT}`);
});
