const mysql = require("mysql2/promise"); // Importando o módulo mysql2/promise para usar promessas com MySQL

const pool = mysql.createPool({ // Criando um pool de conexões com o banco de dados MySQL usando as variáveis de ambiente predefinidas no arquivo .env
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_DATABASE,
    port: process.env.DB_PORT,
    waitForConnections: true,
    connectionLimit: 10
});

module.exports = pool; // Exportando o pool de conexões para ser usado em outros arquivos do projeto