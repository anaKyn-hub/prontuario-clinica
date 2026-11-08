const { body, query } = require('express-validator');

const paginacaoValidator = [

    // Valida o número da página quando ele for enviado.
    query('pagina')
        .optional() // O parâmetro é opcional
        .isInt({ min: 1 })
        .withMessage('O número da página deve ser um inteiro positivo.')
        .toInt(), // Converte o valor para inteiro

    // Valida o limite de registros por página quando ele for enviado.
    query('limite')
        .optional() // O parâmetro é opcional
        .isInt({ min: 5 })
        .withMessage('O limite de registros por página deve ser um inteiro positivo maior que 4.')
        .toInt(), // Converte o valor para inteiro

];

function camposOpcionalValidator(campo) {
    return body(campo)
        .trim()
        .customSanitizer((value) => {
            return value === '' ? null : value; // Se o valor da senha vier vazio ele retorna null, caso contrário ele retorna o valor da senha
        })
        .optional({values: 'null'})
}

module.exports = { paginacaoValidator, camposOpcionalValidator }; // Exporta o validador para ser usado em outros arquivos, como o arquivo de rotas de alunos