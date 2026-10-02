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
            `${API_URL}/login`,
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
                dados.erro || "USUARIO INATIVO";

            mensagemDiv.style.color = "red";

            return;
        }

        mensagemDiv.textContent =
            `Bem-vindo, ${dados.nome}!`;

        mensagemDiv.style.color = "green";

        setTimeout(() => {

            window.location.href =
                "../home/html/Home.html";

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


