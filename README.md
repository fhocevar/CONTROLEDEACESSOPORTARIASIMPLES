# CONTROLEDEACESSOPORTARIASIMPLES
# API de Gestão de Moradores e Visitantes

Este projeto é uma API RESTful desenvolvida com **Express** para gerenciar informações de **moradores** e **visitantes**. A aplicação permite o cadastro de moradores e visitantes, autenticação de usuários e upload de imagens dos visitantes. A API se conecta ao banco de dados MongoDB para armazenar as informações e também utiliza JWT para autenticação de usuários.

## Funcionalidades

- **Cadastro de Moradores**: Permite o cadastro de moradores com nome e foto.
- **Cadastro de Visitantes**: Permite o cadastro de visitantes com nome, documento e foto.
- **Autenticação de Usuários**: Permite login de usuários e proteção de rotas com JWT.
- **Upload de Imagens**: Utiliza o `multer` para realizar upload de imagens associadas aos visitantes.
- **CRUD de Moradores e Visitantes**: A API fornece endpoints para cadastrar e listar moradores e visitantes.

## Tecnologias Utilizadas

- **Node.js**: Ambiente de execução JavaScript no servidor.
- **Express**: Framework para construção de APIs.
- **MongoDB**: Banco de dados NoSQL para armazenar informações de moradores e visitantes.
- **Mongoose**: Biblioteca para modelar dados e interagir com o MongoDB.
- **JWT (JSON Web Tokens)**: Para autenticação e proteção de rotas.
- **Multer**: Para upload de arquivos (imagens de visitantes).
- **dotenv**: Para configuração de variáveis de ambiente.

## Pré-requisitos

1. **Node.js e npm**: Certifique-se de que o Node.js e o npm estão instalados em sua máquina.
   
   Você pode verificar se o Node.js está instalado com o comando:
   ```bash
   node -v
   ```

2. **MongoDB**: Este projeto utiliza o MongoDB. Você precisa de uma instância do MongoDB rodando. Pode usar o MongoDB local ou uma instância hospedada como o MongoDB Atlas.

3. **Dependências**: Instale as dependências com o comando:
   ```bash
   npm install
   ```

## Estrutura do Projeto

```plaintext
├── controllers
│   ├── authController.js
│   ├── moradorController.js
│   └── visitanteController.js
├── models
│   ├── Morador.js
│   ├── Visitante.js
│   └── User.js
├── routes
│   ├── moradorRoutes.js
│   ├── visitanteRoutes.js
│   └── authRoutes.js
├── uploads/                   # Pasta para armazenar as imagens dos visitantes
├── config
│   └── db.js                  # Conexão com o MongoDB
├── .env                       # Arquivo de variáveis de ambiente
├── server.js                  # Arquivo principal da aplicação
├── package.json
└── README.md
```

## Como Executar

1. **Clone o repositório**:
   ```bash
   git clone <url-do-repositorio>
   ```

2. **Instale as dependências**:
   ```bash
   cd <diretorio-do-projeto>
   npm install
   ```

3. **Configuração do MongoDB**: Crie um arquivo `.env` na raiz do projeto e adicione sua URL do MongoDB:
   ```bash
   MONGODB_URI=<sua-conexao-mongodb>
   JWT_SECRET=<seu-segredo-jwt>
   ```

4. **Inicie o servidor**:
   ```bash
   npm start
   ```

   O servidor rodará na porta `5000` ou na porta especificada pela variável de ambiente `PORT`.

## Endpoints da API

### Autenticação

- **POST** `/api/auth/login`: Realiza o login de um usuário.
  - **Body**: `{ email, password }`
  - **Resposta**: Retorna o token JWT.

- **GET** `/api/auth/profile`: Retorna o perfil do usuário autenticado (rota protegida).
  - **Headers**: `Authorization: Bearer <token>`
  - **Resposta**: Retorna os dados do usuário autenticado.

### Moradores

- **POST** `/api/moradores`: Cadastra um morador.
  - **Body**: `{ nome, foto }`
  - **Resposta**: Retorna o morador cadastrado.

- **GET** `/api/moradores`: Lista todos os moradores.
  - **Resposta**: Retorna um array com todos os moradores.

### Visitantes

- **POST** `/api/visitantes`: Cadastra um visitante e faz upload da imagem.
  - **Body**: `{ nome, documento, imagem (arquivo) }`
  - **Resposta**: Retorna o visitante cadastrado e o caminho da imagem.

- **GET** `/api/visitantes`: Lista todos os visitantes.
  - **Resposta**: Retorna um array com todos os visitantes.

## Como Funciona o Código

### 1. **Conexão com o Banco de Dados**

No arquivo `config/db.js`, a conexão com o MongoDB é configurada usando o `mongoose`. O banco de dados é conectado ao iniciar a aplicação.

```javascript
const mongoose = require('mongoose');
const dotenv = require('dotenv');

dotenv.config();

const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log('MongoDB conectado');
  } catch (error) {
    console.error('Erro ao conectar ao MongoDB:', error.message);
    process.exit(1);
  }
};

module.exports = connectDB;
```

### 2. **Roteamento e Controladores**

O arquivo `server.js` configura as rotas da API, utilizando os controladores definidos nos arquivos em `controllers`.

```javascript
const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const connectDB = require('./config/db');
const moradorRoutes = require('./routes/moradorRoutes');
const visitanteRoutes = require('./routes/visitanteRoutes');
const authRoutes = require('./routes/authRoutes');

dotenv.config();
connectDB();

const app = express();

app.use(cors());
app.use(express.json());

app.use('/api/moradores', moradorRoutes);
app.use('/api/visitantes', visitanteRoutes);
app.use('/api/auth', authRoutes);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Servidor rodando na porta ${PORT}`);
});
```

### 3. **Upload de Imagens com Multer**

No arquivo `routes/visitanteRoutes.js`, a configuração do **multer** permite o upload de imagens dos visitantes.

```javascript
const multer = require('multer');
const path = require('path');
const { Visitor } = require('../models');

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'uploads/');
  },
  filename: (req, file, cb) => {
    cb(null, `${req.body.nome}-${Date.now()}${path.extname(file.originalname)}`);
  }
});
const upload = multer({ storage });

router.post('/', upload.single('imagem'), async (req, res) => {
  try {
    const { nome, documento } = req.body;
    const imagePath = `/uploads/${req.file.filename}`;

    await Visitor.create({ nome, documento, imagePath });
    res.status(201).json({ message: 'Visitante cadastrado com sucesso!', imagePath });
  } catch (error) {
    res.status(500).json({ message: 'Erro ao cadastrar visitante', error });
  }
});
```

### 4. **Autenticação com JWT**

A autenticação é realizada usando o JWT no arquivo `controllers/authController.js`.

```javascript
const jwt = require('jsonwebtoken');
const User = require('../models/User');

exports.login = async (req, res) => {
  const { email, password } = req.body;
  const user = await User.findOne({ email });

  if (!user || !bcrypt.compareSync(password, user.password)) {
    return res.status(400).json({ message: 'Email ou senha inválidos' });
  }

  const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET, { expiresIn: '1h' });
  res.json({ token });
};
```

## Contribuindo

Se você quiser contribuir para este projeto, por favor, crie uma **issue** ou envie um **pull request**.

## Licença

Este projeto está licenciado sob a **MIT License**. Consulte o arquivo [LICENSE](LICENSE) para mais detalhes.

---

Este README fornece uma visão geral da API, como utilizá-la e a estrutura do código.
