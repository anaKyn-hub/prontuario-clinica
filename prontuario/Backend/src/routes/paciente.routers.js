const express = require('express'); // Importando o módulo express para criar rotas e gerenciar requisições HTTP

const pacienteController = require('../controllers/paciente.controllers'); // Importando o controlador de pacientes para lidar com a lógica das rotas
const routes = express.Router(); // Criando uma instância do roteador do Express para definir rotas específicas
const valideErros = require('../middlewares/validate.middlewares'); // Importando o middleware de validação de erros do express-validator para verificar a validade das requisições
const functionUtils = require('../shared/functions.shared'); // Importando o validador de corpo vazio para verificar se o corpo da requisição não está vazio
const validatorUtils = require('../shared/validator.shared'); // Importando os validadores de pacientes para validar os dados das requisições
const pacienteValidator = require('../validators/paciente.validators'); // Importando o validador de pacientes para validar os dados das requisições

routes.get(
    '/pacientes',
    functionUtils.bodyVazio,
    validatorUtils.paginacaoValidator,
    valideErros,
    pacienteController.getAllPacientes
);

module.exports = routes;
