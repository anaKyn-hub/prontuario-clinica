import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import { pool } from "./db.js";

dotenv.config();

const app = express();
const PORT = process.env.PORT;

app.use(cors());
app.use(express.json());

app.post("/", async (req, res) => {
  try {
    const { registro, nome, sobrenome, email, telefone, senha, esta_ativo = 1 } = req.body;

    const [result] = await pool.query(
      "INSERT INTO prontuario_db.aluno (registro, nome, sobrenome, email, telefone, senha, esta_ativo) VALUES ( ?, ?, ?, ?, ?, ?, ?)",
      [registro, nome, sobrenome, email, telefone || null, senha, esta_ativo]
    );

    res.status(201).json({ id: result.insertId, registro, nome, sobrenome, email, telefone, esta_ativo });
  } catch (e) {
    console.error(e);
    res.status(500).json({ erro: "Falha ao criar usuário" });
  }
});

app.get("/", async (req, res) => {
  try {
    const [rows] = await pool.query("SELECT * FROM prontuario_db.aluno");

    res.json(rows);
  } catch (e) {
    res.status(500).json({ erro: "Falha ao listar usuários" });
  }
});

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

    const { senha: _, ...usuarioSemSenha } = usuario;

    res.status(200).json(usuarioSemSenha);
  } catch (e) {
    res.status(500).json({ erro: "Falha ao realizar login" });
  }
});

app.listen(PORT, () => {
  console.log(`Servidor MySQL rodando em http://localhost:${PORT}`);
});