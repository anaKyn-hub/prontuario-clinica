// Importa os validadores do express-validator para validar os dados das requisições relacionadas aos alunos
const { body, param, query, checkExact } = require('express-validator');
const {camposOpcionalValidator} = require('../shared/validator.shared');

const pool = require('../config/db.config'); // Importando o pool de conexões com o banco de dados MySQL para executar consultas SQL

const getByIdAlunoValidator = [

    // Valida o ID do aluno recebido na rota
    param('id')
        .trim()
        .isUUID()
        .withMessage('O ID do aluno deve ser um UUID válido.')
        .bail()
        .custom(async (id) => {

            // Verifica se o id já existe no banco de dados
            const [resultado] = await pool.query('SELECT id FROM aluno WHERE id = ?', [id]);

            if (resultado.length <= 0) {
                throw new Error('O id do aluno não está cadastrado.');
            } 

            return true;
        })

];

const getPacientesByAlunoValidator = [

    // Valida o ID do aluno recebido na rota
    param('id')
        .trim()
        .isUUID()
        .withMessage('O ID do aluno deve ser um UUID válido.')

];

const getByEmailAlunoValidator = [
    param('email')
        .trim()
        .isEmail()
        .withMessage('O email do aluno deve ser um endereço de email válido.')
        .bail()
        .normalizeEmail()
]

const getLoginAlunoValidator = [
    query('email')
        .notEmpty()
        .withMessage('O email do aluno é obrigatório.')
        .bail()
        .trim()
        .isLength({ min: 7, max: 255 })
        .withMessage('O email do aluno deve ter entre 7 e 255 caracteres.')
        .bail()
        .isEmail()
        .withMessage('O email do aluno deve ser um endereço de email válido.')
        .bail()
        .normalizeEmail()
        .custom(async (email) => {

            // Verifica se o email já existe no banco de dados
            const [resultado] = await pool.query('SELECT email FROM aluno WHERE email = ?', [email]);

            if (resultado.length <= 0) {
                throw new Error('O email do aluno não está cadastrado.');
            } 

            return true;
        }),

    query('senha')
        .notEmpty()
        .withMessage('A senha do aluno é obrigatória.')
        .bail()
        .trim()
        .isLength({ min: 8, max: 255 })
        .withMessage('A senha do aluno deve ter entre 8 e 255 caracteres.'),

    checkExact([], {
        locations: ['query'],
        message: 'A URL da requisição contém query strings não permitidas.'
    })
]

const postAlunoValidator = [

    body('nome')
        .notEmpty()
        .withMessage('O nome do aluno é obrigatório.')
        .bail()
        .trim()
        .isLength({ min: 3, max: 255})
        .withMessage('O nome do aluno deve ter entre 3 e 255 caracteres.')
        .bail()
        .matches(/^[A-Za-zÀ-ÖØ-öø-ÿ\s]+$/)
        .withMessage('O nome do aluno deve conter apenas letras e espaços.'),

    body('ra')
        .notEmpty()
        .withMessage('O RA do aluno é obrigatório.')
        .bail()
        .trim()
        .isLength({ min: 8, max: 10 })
        .withMessage('O RA do aluno deve ter entre 8 e 10 caracteres.')
        .bail()
        .matches(/^[0-9]+$/)
        .withMessage('O RA do aluno deve conter apenas números.')
        .bail()
        .custom(async (ra) => {

            // Verifica se o RA já existe no banco de dados
            const [resultado] = await pool.query('SELECT ra FROM aluno WHERE ra = ?', [ra]);

            if (resultado.length > 0) {
                throw new Error('O RA do aluno já está cadastrado.');
            } 

            return true;
        }),

    body('email')
        .notEmpty()
        .withMessage('O email do aluno é obrigatório.')
        .bail()
        .trim()
        .isLength({ min: 7, max: 255 })
        .withMessage('O email do aluno deve ter entre 7 e 255 caracteres.')
        .bail()
        .isEmail()
        .withMessage('O email do aluno deve ser um endereço de email válido.')
        .bail()
        .normalizeEmail()
        .custom(async (email) => {

            // Verifica se o email já existe no banco de dados
            const [resultado] = await pool.query('SELECT email FROM aluno WHERE email = ?', [email]);

            if (resultado.length > 0) {
                throw new Error('O email do aluno já está cadastrado.');
            } 

            return true;
        }),

    body('telefone')
        .notEmpty()
        .withMessage('O telefone do aluno é obrigatório.')
        .bail()
        .trim()
        .isLength({ min: 10, max: 12 })
        .withMessage('O telefone do aluno deve ter entre 10 e 12 caracteres.')
        .bail()
        .matches(/^[0-9]+$/)
        .withMessage('O telefone do aluno deve conter apenas números.')
        .bail()
        .custom(async (telefone) => {

            // Verifica se o telefone já existe no banco de dados
            const [resultado] = await pool.query('SELECT telefone FROM aluno WHERE telefone = ?', [telefone]);

            if (resultado.length > 0) {
                throw new Error('O telefone do aluno já está cadastrado.');
            } 

            return true;
        }),

    body('senha')
        .notEmpty()
        .withMessage('A senha do aluno é obrigatória.')
        .bail()
        .trim()
        .isLength({ min: 8, max: 255 })
        .withMessage('A senha do aluno deve ter entre 8 e 255 caracteres.'),

    checkExact([], {
        locations: ['body'],
        message: 'O corpo da requisição contém campos não permitidos.'
    })
]

const putSenhaAlunoValidator = [

    // Valida o ID do aluno recebido na rota
    param('id')
        .trim()
        .isUUID()
        .withMessage('O ID do aluno deve ser um UUID válido.'),

    body('senha')
        .notEmpty()
        .withMessage('A senha do aluno é obrigatória.')
        .bail()
        .trim()
        .isLength({ min: 8, max: 255 })
        .withMessage('A senha do aluno deve ter entre 8 e 255 caracteres.'),

    checkExact([], {
        locations: ['body'],
        message: 'O corpo da requisição contém campos não permitidos.'
    })
];

const putAlunoValidator = [

    //Valida o ID recebido na rota
    param('id')
        .notEmpty()
        .withMessage('O ID do aluno é obrigatório.')
        .bail()
        .isUUID()
        .withMessage('O ID do aluno deve ser um UUID válido.')
        .bail()
        .custom(async (id) => {

            //verifica se o ID existe no banco de dados
            const [resultado] = await pool.query('SELECT id FROM aluno WHERE id = ?', [id]);

            if (resultado.length === 0) {
                throw new Error('O ID do aluno não foi encontrado.');
            }

            return true;
        }),

    camposOpcionalValidator('nome')
        .isLength({ min: 3, max: 255})
        .withMessage('O nome do aluno deve ter entre 3 e 255 caracteres.')
        .bail()
        .matches(/^[A-Za-zÀ-ÖØ-öø-ÿ\s]+$/)
        .withMessage('O nome do aluno deve conter apenas letras e espaços.'),

    camposOpcionalValidator('email')
        .isLength({ min: 7, max: 255 })
        .withMessage('O email do aluno deve ter entre 7 e 255 caracteres.')
        .bail()
        .isEmail()
        .withMessage('O email do aluno deve ser um endereço de email válido.')
        .bail()
        .normalizeEmail()
        .custom(async (email, { req }) => {

            const [resultado] = await pool.query('SELECT email FROM aluno WHERE email = ? AND id <> ?', [email, req.params.id]);

            if (resultado.length > 0) {
                throw new Error('O email do aluno já está cadastrado.');
            }

            return true;
        }),

    camposOpcionalValidator('telefone')
        .isLength({ min: 10, max: 12 })
        .withMessage('O telefone do aluno deve ter entre 10 e 12 caracteres.')
        .bail()
        .matches(/^[0-9]+$/)
        .withMessage('O telefone do aluno deve conter apenas números.')
        .bail()
        .custom(async (telefone, { req }) => {

            const [resultado] = await pool.query('SELECT telefone FROM aluno WHERE telefone = ? AND id <> ?', [telefone, req.params.id]);

            if (resultado.length > 0) {
                throw new Error('O telefone do aluno já está cadastrado.');
            }

            return true;
        }),

    camposOpcionalValidator('senha')
        .isLength({ min: 8, max: 255 })
        .withMessage('A senha do aluno deve ter entre 8 e 255 caracteres.'),

    checkExact([], {
        locations: ['body'],
        message: 'O corpo da requisição contém campos não permitidos.'
    })

]

const putAlunoByAdminValidator = [
    param('id')
        .notEmpty()
        .withMessage('O ID do aluno é obrigatório.')
        .bail()
        .isUUID()
        .withMessage('O ID do aluno deve ser um UUID válido.')
        .bail()
        .custom(async (id) => {

            //verifica se o ID existe no banco de dados
            const [resultado] = await pool.query('SELECT id FROM aluno WHERE id = ?', [id]);

            if (resultado.length === 0) {
                throw new Error('O ID do aluno não foi encontrado.');
            }

            return true;
        }),
    
    camposOpcionalValidator('id_coordenador')
        .isUUID()
        .withMessage('O ID do coordenador deve ser um UUID válido.')
        .bail()
        .custom(async (id) => {

            //verifica se o ID existe no banco de dados
            const [resultado] = await pool.query('SELECT id FROM coordenador WHERE id = ?', [id]);

            if (resultado.length === 0) {
                throw new Error('O ID do coordenador não foi encontrado.');
            }

            return true;
        }),

    camposOpcionalValidator('id_paciente')
        .isUUID()
        .withMessage('O ID do paciente deve ser um UUID válido.')
        .bail()
        .custom(async (id) => {

            //verifica se o ID existe no banco de dados
            const [resultado] = await pool.query('SELECT id FROM paciente WHERE id = ?', [id]);

            if (resultado.length === 0) {
                throw new Error('O ID do paciente não foi encontrado.');
            }

            return true;
        }),

    camposOpcionalValidator('ra')
        .isLength({ min: 8, max: 10 })
        .withMessage('O RA do aluno deve ter entre 8 e 10 caracteres.')
        .bail()
        .matches(/^[0-9]+$/)
        .withMessage('O RA do aluno deve conter apenas números.')
        .bail()
        .custom(async (ra, { req }) => {

            const [resultado] = await pool.query('SELECT ra FROM aluno WHERE ra = ? AND id <> ?', [ra, req.params.id]);

            if (resultado.length > 0) {
                throw new Error('O RA do aluno já está cadastrado.');
            }

            return true;
        }),

    camposOpcionalValidator('esta_ativo')
        .isBoolean()
        .withMessage('O campo esta_ativo deve ser um valor booleano.'),

    checkExact([], {
        locations: ['body'],
        message: 'O corpo da requisição contém campos não permitidos.'
    })
]

const deleteAlunoValidator = [
    param('id')
        .trim()
        .isUUID()
        .withMessage('O ID do aluno deve ser um UUID válido.')
]

module.exports = { getByEmailAlunoValidator, getByIdAlunoValidator, getPacientesByAlunoValidator, getLoginAlunoValidator, postAlunoValidator, putAlunoValidator, putAlunoByAdminValidator, putSenhaAlunoValidator, deleteAlunoValidator }; // Exporta os validadores para serem usados em outros arquivos, como o arquivo de rotas de alunos