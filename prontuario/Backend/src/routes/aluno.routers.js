const express = require('express'); // Importando o módulo express para criar rotas e gerenciar requisições HTTP

const alunoController = require('../controllers/aluno.controllers'); // Importando o controlador de alunos para lidar com a lógica das rotas
const routes = express.Router(); // Criando uma instância do roteador do Express para definir rotas específicas
const valideErros = require('../middlewares/validate.middlewares'); // Importando o middleware de validação de erros do express-validator para verificar a validade das requisições
const functionUtils = require('../shared/functions.shared'); // Importando o validador de corpo vazio para verificar se o corpo da requisição não está vazio
const validatorUtils = require('../shared/validator.shared'); // Importando os validadores de alunos para validar os dados das requisições
const alunoValidator = require('../validators/aluno.validators'); // Importando o validador de alunos para validar os dados das requisições

routes.get(
    '/alunos',
    functionUtils.bodyVazio,
    validatorUtils.paginacaoValidator,
    valideErros,
    alunoController.getAllAlunos
); // Definindo a rota GET /alunos com validação de parâmetros e tratamento de erros


routes.get(
    '/alunos/login',
    functionUtils.bodyVazio,
    alunoValidator.getLoginAlunoValidator,
    valideErros,
    alunoController.getLoginAluno
); // Definindo a rota GET /alunos/login com validação de parâmetros e tratamento de erros

routes.get(
    '/alunos/paciente/:id',
    functionUtils.bodyVazio,
    valideErros,
    alunoController.getPacientesByAluno
); // Definindo a rota GET /alunos com validação de parâmetros e tratamento de erros

routes.get(
    '/alunos/email/:email',
    functionUtils.bodyVazio,
    alunoValidator.getByEmailAlunoValidator,
    valideErros,
    alunoController.getByEmailAlunos
); // Definindo a rota GET /alunos/email para buscar um aluno específico pelo email

routes.get(
    '/alunos/:id',
    functionUtils.bodyVazio,
    alunoValidator.getByIdAlunoValidator,
    valideErros,
    alunoController.getByIdAlunos
); // Definindo a rota GET /alunos/:id para buscar um aluno específico pelo ID

routes.post(
    '/alunos',
    functionUtils.bodyNaoVazio,
    alunoValidator.postAlunoValidator,
    valideErros,
    alunoController.postAluno
); // Definindo a rota POST /alunos com validação de parâmetros e tratamento de erros


routes.put(
    '/alunos/:id',
    functionUtils.bodyNaoVazio,
    alunoValidator.putAlunoValidator,
    valideErros,
    alunoController.putAluno
); // Definindo a rota PUT /alunos/:id para o aluno atualizar seu registro

routes.put(
    '/alunos/admin/:id',
    functionUtils.bodyNaoVazio,
    alunoValidator.putAlunoByAdminValidator,
    valideErros,
    alunoController.putAlunoByAdmin
); // Definindo a rota PUT /alunos/admin/:id para o administrador atualizar um aluno

routes.put(
    '/alunos/:id/senha',
    functionUtils.bodyNaoVazio,
    alunoValidator.putSenhaAlunoValidator,
    valideErros,
    alunoController.putSenhaAlunos
); // Definindo a rota PUT /alunos/:id/senha para atualizar a senha sem estra logado

routes.delete(
    '/alunos/admin/:id',
    functionUtils.bodyVazio,
    alunoValidator.deleteAlunoValidator,
    valideErros,
    alunoController.deleteAluno
); // Definindo a rota DELETE /alunos/admin/:id para deletar um aluno da tabela do banco de dados

module.exports = routes; // Exportando o roteador para ser usado em outros arquivos, como o arquivo principal do servidor