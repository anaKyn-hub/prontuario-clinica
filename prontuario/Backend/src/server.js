import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import { pool } from "./db.js";

dotenv.config();

const app = express();
const PORT = process.env.PORT;

// Middlewares
app.use(cors());
app.use(
  express.json());

// CRUD
// Create
// Read
// Update
// Delete

// Criar usuário - CREATE  OK
app.post("/", async (req, res) => {
  try {
    const { registro, nome, sobrenome, email, telefone, senha, esta_ativo } = req.body;

    const [result] = await pool.query(
      "INSERT INTO prontuario_db.aluno (registro, nome, sobrenome, email, telefone, senha, esta_ativo) VALUES ( ?, ?, ?, ?, ?, ?, ?)",
      [registro, nome, sobrenome, email, telefone, senha, esta_ativo]
    );

    

    res.status(201).json({ id: result.insertId, registro, nome, sobrenome, email, telefone, esta_ativo });
  } catch (e) {
    res.status(500).json({ erro: "Falha ao criar usuário" });
  } 
});




// Listar usuários - READ OK
app.get("/", async (req, res) => {
  try {
    const [rows] = await pool.query("SELECT * FROM prontuario_db.aluno");

    res.json(rows);
  } catch (e) {
    res.status(500).json({ erro: "Falha ao listar usuários" });
  }
});



// Metodo para verificar o E-mail antes de trocar a Senha  OK
app.get("/email", async (req, res) => {
  try {
    const { email } = req.query;

    const [rows] = await pool.query(
      "SELECT * FROM prontuario_db.aluno WHERE email = ?",
      [email]
    );

    if (rows.length === 0) {
      return res.status(404).json({
        erro: "Usuário não encontrado"
      });
    }

    res.status(200).json(rows);

  } catch (e) {
    res.status(500).json({
      erro: e.message
    });
  }
});



// metodo para atualizar senha usuario
app.put("/:id/senha", async (req, res) => {
  try {
    const { id } = req.params;
    const { novaSenha } = req.body;

    const [result] = await pool.query(
      "UPDATE prontuario_db.aluno SET senha = ?, data_alteracao = NOW() WHERE id = ?",
      [novaSenha, id]
    );
 
    if (!result.affectedRows)
      return res.status(404).json({ erro: "Usuário não encontrado" });

    res.json({ mensagem: "Senha atualizada com sucesso" });
  } catch (e) {
    res.status(500).json({ erro: "Falha ao atualizar senha" });
  } 
});



// metodo para ativar/desativar usuario
app.put("/:id/status", async (req, res) => {
  try {
    const { id } = req.params;
    const { esta_ativo } = req.body;

    const [result] = await pool.query(
      "UPDATE prontuario_db.aluno SET esta_ativo = ?, data_alteracao = NOW() WHERE id = ?",
      [esta_ativo, id]
    );

    if (!result.affectedRows)
      return res.status(404).json({ erro: "Usuário não encontrado" });

    res.json({ mensagem: "Status atualizado com sucesso" });
  } catch (e) {
    res.status(500).json({ erro: "Falha ao atualizar status" });
  }
});


// metodo para atualizar email
app.put("/:id/email", async (req, res) => {
  try {
    const { id } = req.params;
    const { email } = req.body;

    const [result] = await pool.query(
      "UPDATE prontuario_db.aluno SET email = ?, data_alteracao = NOW() WHERE id = ?",
      [email, id]
    );

    if (!result.affectedRows)
      return res.status(404).json({ erro: "Usuário não encontrado" });

    res.json({ mensagem: "Email atualizado com sucesso" });
  } catch (e) {
    res.status(500).json({ erro: "Falha ao atualizar email" });
  }
});


// metodo para atualizar telefone
app.put("/:id/telefone", async (req, res) => {
  try {
    const { id } = req.params;
    const { telefone } = req.body;

    const [result] = await pool.query(
      "UPDATE prontuario_db.aluno SET telefone = ?, data_alteracao = NOW() WHERE id = ?",
      [telefone, id]
    );

    if (!result.affectedRows)
      return res.status(404).json({ erro: "Usuário não encontrado" });

    res.json({ mensagem: "Telefone atualizado com sucesso" });
  } catch (e) {
    res.status(500).json({ erro: "Falha ao atualizar telefone" });
  }
});


// metodo para login
app.post("/login", async (req, res) => {
  try {
    const { email, senha } = req.body;

    const [rows] = await pool.query(
      "SELECT * FROM prontuario_db.aluno WHERE email = ? AND senha = ? ",
      [email, senha]
    );

    if (rows.length === 0) {
      return res.status(404).json({ erro: "Credenciais invalidas" });
    }

    const usuario = rows[0];

    if (!usuario.esta_ativo) {
      return res.status(403).json({ erro: "Usuário inativo" });
    }

    // Remove a senha do objeto antes de devolver 
    const { senha: _, ...usuarioSemSenha } = usuario;

    res.status(200).json(usuarioSemSenha);
  } catch (e) {
    res.status(500).json({ erro: "Falha ao realizar login" });
  }
});



app.listen(PORT, () => {
  console.log(`Servidor MySQL rodando em http://localhost:${PORT}`);
});
