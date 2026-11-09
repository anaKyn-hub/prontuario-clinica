const dotenv = require('dotenv'); // Importando o módulo dotenv para acessar variáveis de ambiente do arquivo .env
dotenv.config(); // Carregando as variáveis de ambiente do arquivo .env

const express = require('express'); // Importando o módulo express para criar o servidor web
const cors = require('cors'); // Importando o módulo cors para permitir requisições de diferentes origens
const alunoRoutes = require('./routes/aluno.routers'); // Importando as rotas relacionadas a alunos
const pacienteRoutes = require('./routes/paciente.routers'); // Importando as rotas relacionadas a alunos

const app = express(); // Criando uma instância do servidor web
const PORT = process.env.PORT; // Definindo a porta do servidor web, usando a variável de ambiente PORT ou 3000 como padrão

app.use(cors()); // Usando o middleware cors
app.use(express.json()); // Usando o middleware express.json() para interpretar requisições com corpo em JSON

app.use('/api/', alunoRoutes); // Definindo as rotas
app.use('/api/', pacienteRoutes);

app.listen (PORT, () => { // Iniciando o servidor web na porta definida
    console.log(`Servidor rodando na porta http://localhost:${PORT}`);
});
