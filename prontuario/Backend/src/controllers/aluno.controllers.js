const pool = require('../config/db.config'); // Importando o pool de conexões com o banco de dados MySQL para executar consultas SQL
const { randomUUID } = require ('crypto'); // Importando a função randomUUID do módulo crypto para gerar IDs únicos para os alunos
const matchedData = require('express-validator').matchedData; // Importando a função matchedData do express-validator para extrair os dados validados das requisições

async function getAllAlunos(req, res) { // Função assíncrona para buscar todos os alunos no banco de dados com paginação para deixar as consultas mais leves
    try {
        // Obtendo os parâmetros de paginação da query string da requisição, com valores padrão caso não sejam fornecidos
        const pagina = matchedData(req).pagina ?? 1; // Página atual (padrão: 1)
        const limite = matchedData(req).limite ?? 10; // Número de registros por página (padrão: 10)

        // Consultando a quantidade total de alunos cadastros.
        const [totalAlunos] = await pool.query('SELECT COUNT(*) AS total FROM aluno'); // Executando uma consulta SQL para contar o total de alunos cadastrados

        if(totalAlunos[0].total !== 0) { // Verificando se não há alunos cadastrados

            // Calculando a última página conforme a quantidade total de alunos e o limite de registros por página
            var ultimaPagina = Math.ceil(totalAlunos[0].total / limite);
        } else {
            res.status(404).json({ erro: 'Nenhum aluno cadastrado.' }); // Retornando uma resposta de erro caso não haja alunos cadastrados
        }

        if (pagina > ultimaPagina) { // Verificando se a página solicitada é maior que a última página disponível
            res.status(404).json({ erro: 'Página não encontrada.' }); // Retornando uma resposta de erro caso a página solicitada não exista
        }

        // Objeto de paginação para informar ao cliente sobre a quantidade total de alunos, a página atual, o limite de registros por página e a última página disponível
        const paginacao = {
            pagina: pagina,
            limite: limite,
            total: totalAlunos[0].total,
            totalPaginas: ultimaPagina,
            paginaAnterior: pagina > 1 ? pagina - 1 : null, // Definindo a página anterior como a página atual mais 1, caso a página atual seja menor que a última página
            proximaPagina: pagina < ultimaPagina ? parseInt(pagina) + 1 : null // Definindo a próxima página como a página atual menos 1, caso a página atual seja maior que 1
        };

        // Consultando os alunos no banco de dados com paginação, ordenando pelo nome do aluno em ordem alfabética
        const [alunos] = await pool.query('SELECT * FROM aluno ORDER BY nome ASC LIMIT ? OFFSET ?', [limite, (pagina * limite) - limite]);

        const resultados = alunos[0]; // Obtendo os alunos encontrados na consulta SQL
        
        const { senha: _, ...alunoSemSenha } = resultados;

        return res.status(200).json({ alunos: alunoSemSenha, dadosPaginacao:paginacao }); // Retornando uma resposta de sucesso com os alunos encontrados e o objeto de paginação

    } catch (error) {
        console.error({erro: 'Erro ao listar os alunos:', details: error.message}); // Registrando o erro no console para fins de depuração
        return res.status(500).json({ erro: 'Erro interno do servidor ao listar os alunos.'});
    }
};

async function getByIdAlunos(req, res) { // Função assíncrona para buscar um aluno específico pelo ID
    try {
        const { id } = matchedData(req); // Obtendo o ID do aluno a partir dos parâmetros da requisição

        const [resultado] = await pool.query('SELECT * FROM aluno WHERE id = ?', [id]); // Executando uma consulta SQL para buscar o aluno pelo ID

        if (resultado.length === 0) { // Verificando se o aluno foi encontrado
            return res.status(404).json({ erro: 'Aluno não encontrado.' }); // Retornando uma resposta de erro caso o aluno não seja encontrado
        }

        const alunos = resultado[0]; // Obtendo o aluno encontrado na consulta SQL

        const { senha: _, ...alunoSemSenha } = alunos;

        return res.status(200).json({ aluno: alunoSemSenha }); // Retornando uma resposta de sucesso com os dados do aluno encontrado

    } catch (error) {
        console.error({erro: 'Erro ao buscar o aluno:', details: error.message}); // Registrando o erro no console para fins de depuração
        return res.status(500).json({ erro: 'Erro interno do servidor ao buscar o aluno.'});
    }
};

async function getPacientesByAluno(req, res) { // Função assíncrona para buscar um aluno específico pelo ID
    try {
        const { id } = matchedData(req); // Obtendo o ID do aluno a partir dos parâmetros da requisição

        const [resultado] = await pool.query('SELECT p.* FROM aluno a INNER JOIN paciente p ON a.id_paciente = p.id WHERE a.id = ?;', [id]); // Executando uma consulta SQL para buscar o aluno pelo ID

        if (resultado.length === 0) { // Verificando se o aluno foi encontrado
            return res.status(404).json({ erro: 'Paciente não encontrado.' }); // Retornando uma resposta de erro caso o aluno não seja encontrado
        }

        return res.status(200).json({ paciente: resultado }); // Retornando uma resposta de sucesso com os dados do aluno encontrado

    } catch (error) {
        console.error({erro: 'Erro ao buscar o paciente:', details: error.message}); // Registrando o erro no console para fins de depuração
        return res.status(500).json({ erro: 'Erro interno do servidor ao buscar o paciente desse aluno.'});
    }
};

async function getByEmailAlunos(req, res) { // Função assíncrona para buscar um aluno específico pelo email
    try {
        const { email } = matchedData(req); // Obtendo o email do aluno a partir dos parâmetros da requisição

        const [resultado] = await pool.query('SELECT * FROM aluno WHERE email = ?', [email]); // Executando uma consulta SQL para buscar o aluno pelo email

        if (resultado.length === 0) { // Verificando se o aluno foi encontrado
            return res.status(404).json({ erro: 'Email não encontrado.' }); // Retornando uma resposta de erro caso o aluno não seja encontrado
        }

        const alunos = resultado[0]; // Obtendo o aluno encontrado na consulta SQL

        const { senha: _, ...alunoSemSenha } = alunos;

        return res.status(200).json({ aluno: alunoSemSenha }); // Retornando uma resposta de sucesso com os dados do aluno encontrado

    } catch (error) {
        console.error({erro: 'Erro ao buscar o email:', details: error.message}); // Registrando o erro no console para fins de depuração
        return res.status(500).json({ erro: 'Erro interno do servidor ao buscar o email.'});
    }
};

async function getLoginAluno(req, res) { // Função assíncrona para buscar um aluno específico pelo email
    try {
        const { email, senha } = matchedData(req); // Obtendo o email e senha do aluno a partir dos parâmetros da requisição

        const [resultado] = await pool.query('SELECT * FROM aluno WHERE email = ? AND senha = ?', [email, senha]); // Executando uma consulta SQL para buscar o aluno pelo email e senha

        if (resultado.length === 0) { // Verificando se o aluno foi encontrado
            return res.status(404).json({ erro: 'Credenciais invalidas: Email ou senha incorretos.' }); // Retornando uma resposta de erro caso o aluno não seja encontrado
        }

        const aluno = resultado[0]; // Obtendo o aluno encontrado na consulta SQL

        if(!aluno.esta_ativo) { // Verificando se o aluno está ativo
            return res.status(403).json({ erro: 'Aluno inativo: Contate o administrador para ativar sua conta.' }); // Retornando uma resposta de erro caso o aluno esteja inativo
        }

        const { senha: _, ...alunoSemSenha } = aluno; // Removendo a senha do objeto de usuário para não retornar a senha na resposta

        return res.status(200).json({ aluno: alunoSemSenha}); // Retornando uma resposta de sucesso com os dados do aluno encontrado

    } catch (error) {
        console.error({erro: 'Erro ao realizar o login:', details: error.message}); // Registrando o erro no console para fins de depuração
        return res.status(500).json({ erro: "Falha ao realizar login" });
    }
};

async function putSenhaAlunos(req, res) { // Função assíncrona para buscar um aluno específico pelo ID
    try {
        const { id } = matchedData(req); // Obtendo o ID do aluno a partir dos parâmetros da requisição
        const { senha } = matchedData(req); // Obtendo a senha do aluno a partir dos parâmetros da requisição

        const [resultado] = await pool.query('UPDATE aluno SET senha = ? WHERE id = ?', [senha, id]); // Executando uma consulta SQL para atualizar o aluno

       return res.status(200).json({ message: 'Senha atualizada com sucesso.', id: id });// Retornando uma resposta de sucesso com os dados do aluno encontrado

    } catch (error) {
        console.error({erro: 'Erro ao atualizar a senha do aluno:', details: error.message}); // Registrando o erro no console para fins de depuração
        return res.status(500).json({ erro: 'Erro interno do servidor ao atualizar a senha do aluno.'});
    }
};

async function postAluno(req, res) { // Função assíncrona para cadastrar um novo aluno no banco de dados
    try {
        const { nome, ra, email, telefone, senha } = matchedData(req); // Obtendo os dados do aluno a partir do corpo da requisição
        const id = randomUUID();

        const [resultado] = await pool.query('INSERT INTO aluno (id, nome, ra, email, telefone, senha) VALUES (?, ?, ?, ?, ?, ?)', [id, nome, ra, email, telefone, senha]); // Executando uma consulta SQL para inserir um novo aluno no banco de dados

        return res.status(201).json({ message: 'Aluno cadastrado com sucesso.', id: id }); // Retornando uma resposta de sucesso com o ID do aluno cadastrado
    } catch (error) {;
        console.error({erro: 'Erro ao cadastrar o aluno:', details: error.message}); // Registrando o erro no console para fins de depuração
        return res.status(500).json({ erro: 'Erro interno do servidor ao cadastrar o aluno.'})
    }
};

async function putAluno(req, res) { // Função assíncrona para atualizar um aluno existente no banco de dados
    try {
        const { nome, email, telefone, senha } = matchedData(req); // Obtendo os dados do aluno a partir do corpo da requisição
        const id = matchedData(req).id;

        const [resultado] = await pool.query('UPDATE aluno SET nome = COALESCE(?, nome), email = COALESCE(?, email), telefone = COALESCE(?, telefone) , senha = COALESCE(?, senha) WHERE id = ?', [nome, email, telefone, senha, id]); // Executando uma consulta SQL para atualizar o aluno no banco de dados

        return res.status(200).json({ message: 'Aluno atualizado com sucesso.', id: id }); // Retornando uma resposta de sucesso com o ID do aluno atualizado
    } catch (error) {
        console.error({erro: 'Erro ao atualizar o aluno:', details: error.message}); // Registrando o erro no console para fins de depuração
        return res.status(500).json({ erro: 'Erro interno do servidor ao atualizar o aluno.'});
    }
};

async function putAlunoByAdmin(req, res) { // Função assíncrona para atualizar um aluno existente no banco de dados
    try {
        const { id_coordenador, id_paciente, ra, esta_ativo } = matchedData(req); // Obtendo os dados do aluno a partir do corpo da requisição
        const id = matchedData(req).id;
        
        const [resultado] = await pool.query('UPDATE aluno SET id_coordenador = COALESCE(?, id_coordenador), id_paciente = COALESCE(?, id_paciente), ra = COALESCE(?, ra), esta_ativo = COALESCE(?, esta_ativo) WHERE id = ?', [id_coordenador, id_paciente, ra, esta_ativo == true ? 1 : 0, id]); // Executando uma consulta SQL para atualizar o aluno no banco de dados

        return res.status(200).json({ message: 'Aluno atualizado com sucesso.', id: id }); // Retornando uma resposta de sucesso com o ID do aluno atualizado
    } catch (error) {
        console.error({erro: 'Erro ao atualizar o aluno:', details: error.message}); // Registrando o erro no console para fins de depuração
        return res.status(500).json({ erro: 'Erro interno do servidor ao atualizar o aluno.'});
    }
};

async function deleteAluno(req, res) { // Função assíncrona para deletar um aluno existente no banco de dados
    try{
        const { id } = matchedData(req); // Obtendo o ID do aluno a partir dos parâmetros da requisição

        const [resultado] = await pool.query('DELETE FROM aluno WHERE id = ?', [id]); // Executando uma consulta SQL para deletar o aluno no banco de dados

        if (resultado.affectedRows === 0) { // Verificando se o aluno foi deletado
            return res.status(404).json({ erro: 'Aluno não encontrado.' }); // Retornando uma resposta de erro caso o aluno não seja encontrado
        }

        return res.status(200).json({ message: 'Aluno deletado com sucesso.', id: id }); // Retornando uma resposta de sucesso com o ID do aluno deletado

    } catch (error) {
        console.error({erro: 'Erro ao deletar o aluno:', details: error.message}); // Registrando o erro no console para fins de depuração
        return res.status(500).json({ erro: 'Erro interno do servidor ao deletar o aluno.'});
    }
}

module.exports = { getAllAlunos, getByEmailAlunos, getByIdAlunos, getPacientesByAluno, getLoginAluno, postAluno, putAluno, putAlunoByAdmin, putSenhaAlunos, deleteAluno }; // Exportando as funções para serem usadas em outros arquivos, como o arquivo de rotas de alunos