function bodyNaoVazio(req, res, next) {

    if (
        !req.body || typeof req.body !== 'object' || Array.isArray(req.body) ||
        Object.keys(req.body).length === 0
    ) {
        return res.status(400).json({
            errors: [
                {
                    msg: 'O corpo da requisição não pode estar vazio.'
                }
            ]
        });
    }

    next();
}

function bodyVazio(req, res, next) {

    if (
        req.body && typeof req.body === 'object' && Object.keys(req.body).length > 0
    ) {
        return res.status(400).json({
            errors: [
                {
                    msg: 'O corpo da requisição deve estar vazio.'
                }
            ]
        });
    }

    next();
}
    
    

module.exports = { bodyNaoVazio, bodyVazio }; // Exporta o validador para ser usado em outros arquivos, como o arquivo de rotas de alunos