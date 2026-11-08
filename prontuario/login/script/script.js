const API_URL = "http://localhost:3002";

document.addEventListener("DOMContentLoaded", () => {

    const botao = document.getElementById("BOTAO");

    botao.addEventListener("click", () => {

        const email = document.getElementById("EMAIL").value;
        const senha = document.getElementById("SENHA").value;

        fazerLogin(email, senha);

    });

});

async function fazerLogin(email, senha) {

    const mensagemDiv =
        document.getElementById("mensagem-login");

    try {

        const resposta = await fetch(
            `${API_URL}/api/alunos/login`,
            {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({
                    email,
                    senha
                })
            }
        );

        const dados = await resposta.json();

        if (!resposta.ok) {

            mensagemDiv.textContent =
                dados.errors
                    ? dados.errors.map((e) => e.msg).join(" ")
                    : (dados.erro || "Não foi possível realizar o login.");

            mensagemDiv.style.color = "red";

            return;
        }

        mensagemDiv.textContent =
            `Bem-vindo, ${dados.aluno.nome}!`;

        mensagemDiv.style.color = "green";

        setTimeout(() => {

            window.location.href =
                "../home/html/tela_inicial.html";

        }, 1000);

    } catch (erro) {

        console.error(
            "Falha no login:",
            erro
        );

        mensagemDiv.textContent =
            "Erro de conexão com o servidor.";

        mensagemDiv.style.color =
            "red";
    }
}