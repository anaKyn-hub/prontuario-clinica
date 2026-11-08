const { validationResult } = require('express-validator'); // Importando a função validationResult do express-validator para verificar os resultados da validação

// Esse middleware é responsável por verificar se há erros de validação nas requisições. Ele deve ser usado após os validadores específicos de cada rota.
//Se houver erros, ele retorna uma resposta com status 400 (Bad Request) e um objeto JSON contendo os erros. Caso contrário, ele chama a função next() para passar o controle para o próximo middleware ou rota.

function validate(req, res, next) {
    const errors = validationResult(req); // Obtendo os resultados da validação a partir do objeto de requisição

    if (!errors.isEmpty()) { // Verificando se há erros de validação
        return res.status(400).json({ errors: errors.array() }); // Retornando uma resposta com status 400 e os erros de validação em formato JSON
    }

    next(); // Chamando a função next() para passar o controle para o controller, caso não haja erros de validação
}

module.exports = validate; // Exportando o middleware de validação para ser usado em outros arquivos do projeto