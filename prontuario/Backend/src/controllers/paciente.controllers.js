const pool = require('../config/db.config'); // Importando o pool de conexões com o banco de dados MySQL para executar consultas SQL
const { randomUUID } = require ('crypto'); // Importando a função randomUUID do módulo crypto para gerar IDs únicos para os pacientes
const matchedData = require('express-validator').matchedData; // Importando a função matchedData do express-validator para extrair os dados validados das requisições

async function getAllPacientes(req, res) { // Função assíncrona para buscar todos os pacientes no banco de dados com paginação para deixar as consultas mais leves
    try {
        // Obtendo os parâmetros de paginação da query string da requisição, com valores padrão caso não sejam fornecidos
        const pagina = matchedData(req).pagina ?? 1; // Página atual (padrão: 1)
        const limite = matchedData(req).limite ?? 10; // Número de registros por página (padrão: 10)

        // Consultando a quantidade total de pacientes cadastrados.
        const [totalPacientes] = await pool.query('SELECT COUNT(*) AS total FROM paciente'); // Executando uma consulta SQL para contar o total de pacientes cadastrados

        if(totalPacientes[0].total !== 0) { // Verificando se não há pacientes cadastrados

            // Calculando a última página conforme a quantidade total de pacientes e o limite de registros por página
            var ultimaPagina = Math.ceil(totalPacientes[0].total / limite);
        } else {
            res.status(404).json({ erro: 'Nenhum paciente cadastrado.' }); // Retornando uma resposta de erro caso não haja pacientes cadastrados
        }

        if (pagina > ultimaPagina) { // Verificando se a página solicitada é maior que a última página disponível
            res.status(404).json({ erro: 'Página não encontrada.' }); // Retornando uma resposta de erro caso a página solicitada não exista
        }

        // Objeto de paginação para informar ao cliente sobre a quantidade total de pacientes, a página atual, o limite de registros por página e a última página disponível
        const paginacao = {
            pagina: pagina,
            limite: limite,
            total: totalPacientes[0].total,
            totalPaginas: ultimaPagina,
            paginaAnterior: pagina > 1 ? pagina - 1 : null, // Definindo a página anterior como a página atual mais 1, caso a página atual seja menor que a última página
            proximaPagina: pagina < ultimaPagina ? parseInt(pagina) + 1 : null // Definindo a próxima página como a página atual menos 1, caso a página atual seja maior que 1
        };

        // Consultando os pacientes no banco de dados com paginação, ordenando pelo nome do paciente em ordem alfabética
        const [pacientes] = await pool.query('SELECT * FROM paciente ORDER BY nome ASC LIMIT ? OFFSET ?', [limite, (pagina * limite) - limite]);

        const resultados = pacientes[0]; // Obtendo os pacientes encontrados na consulta SQL
        
        const { senha: _, ...pacienteSemSenha } = resultados;

        return res.status(200).json({ pacientes: pacienteSemSenha, dadosPaginacao:paginacao }); // Retornando uma resposta de sucesso com os pacientes encontrados e o objeto de paginação

    } catch (error) {
        console.error({erro: 'Erro ao listar os pacientes:', details: error.message}); // Registrando o erro no console para fins de depuração
        return res.status(500).json({ erro: 'Erro interno do servidor ao listar os pacientes.'});
    }
};

async function getByIdPaciente(req, res) {
     try {
        const { id } = matchedData(req); // Obtendo o ID do paciente a partir dos parâmetros da requisição

        const [resultado] = await pool.query('SELECT * FROM paciente WHERE id = ?', [id]); // Executando uma consulta SQL para buscar o paciente pelo ID

        if (resultado.length === 0) { // Verificando se o paciente foi encontrado
            return res.status(404).json({ erro: 'paciente não encontrado.' }); // Retornando uma resposta de erro caso o paciente não seja encontrado
        }

        const pacientes = resultado[0]; // Obtendo o paciente encontrado na consulta SQL

        const { senha: _, ...pacienteSemSenha } = pacientes;

        return res.status(200).json({ paciente: pacienteSemSenha }); // Retornando uma resposta de sucesso com os dados do paciente encontrado

    } catch (error) {
        console.error({erro: 'Erro ao buscar o paciente:', details: error.message}); // Registrando o erro no console para fins de depuração
        return res.status(500).json({ erro: 'Erro interno do servidor ao buscar o paciente.'});
    }
};

async function getByNumProntuarioPaciente(req, res) {
     try {
        const { num_prontuario } = matchedData(req); // Obtendo o num_prontuario do paciente a partir dos parâmetros da requisição

        const [resultado] = await pool.query('SELECT * FROM paciente WHERE num_prontuario = ?', [num_prontuario]); // Executando uma consulta SQL para buscar o paciente pelo ID

        if (resultado.length === 0) { // Verificando se o paciente foi encontrado
            return res.status(404).json({ erro: 'paciente não encontrado.' }); // Retornando uma resposta de erro caso o paciente não seja encontrado
        }

        const pacientes = resultado[0]; // Obtendo o paciente encontrado na consulta SQL

        const { senha: _, ...pacienteSemSenha } = pacientes;

        return res.status(200).json({ paciente: pacienteSemSenha }); // Retornando uma resposta de sucesso com os dados do paciente encontrado

    } catch (error) {
        console.error({erro: 'Erro ao buscar o paciente:', details: error.message}); // Registrando o erro no console para fins de depuração
        return res.status(500).json({ erro: 'Erro interno do servidor ao buscar o paciente.'});
    }
};

module.exports = { getAllPacientes, getByIdPaciente, getByNumProntuarioPaciente };
