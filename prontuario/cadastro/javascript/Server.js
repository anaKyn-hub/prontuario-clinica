const API_URL = "http://localhost:3002";

document.addEventListener("DOMContentLoaded", () => {

    const form = document.getElementById("formCadastro");

    form.addEventListener("submit", (event) => {
        event.preventDefault();

        // Valor dos campos do Usuario
        const nome = document.getElementById("fname").value.trim();
        const sobrenome = document.getElementById("lname").value.trim();
        const ra = document.getElementById("ra").value.trim();
        const email = document.getElementById("email").value.trim();
        const telefone = document.getElementById("telefone").value.trim();
        const senha = document.getElementById("password").value;
        const confirmarSenha = document.getElementById("confPassword").value;

        // Mensagens de erro
        const Erronome = document.getElementById("Erronome");
        const Errosobrenome = document.getElementById("Errosobrenome");
        const Errora = document.getElementById("Errora");
        const Erroemail = document.getElementById("Erroemail");
        const Errotelefone = document.getElementById("Errotelefone");
        const Errosenha = document.getElementById("Errosenha");
        const Erroconfsenha = document.getElementById("Erroconfsenha");

        Erronome.style.display = "none";
        Errosobrenome.style.display = "none";
        Errora.style.display = "none";
        Erroemail.style.display = "none";
        Errotelefone.style.display = "none";
        Errosenha.style.display = "none";
        Erroconfsenha.style.display = "none";

        if (nome.length > 10) {
            Erronome.style.display = "block";
        } else if (sobrenome.length > 150) {
            Errosobrenome.style.display = "block";
        } else if (email.length > 100) {
            Erroemail.style.display = "block";
        } else if (ra.length > 10) {
            Errora.style.display = "block";
        } else if (telefone.length > 16) {
            Errotelefone.style.display = "block";
        } else if (senha.length > 20) {
            Errosenha.style.display = "block";
        } else if (senha !== confirmarSenha) {
            Erroconfsenha.style.display = "block";
        } else {
            cadastrarAluno(nome, sobrenome, ra, email, telefone, senha);
        }
    });

});

async function cadastrarAluno(nome, sobrenome, ra, email, telefone, senha) {

    const mensagemDiv = document.getElementById("mensagem-login");

    try {

        const resposta = await fetch(`${API_URL}/`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                registro: ra,
                nome,
                sobrenome,
                email,
                telefone,
                senha,
                esta_ativo: 1
            })
        });

        const dados = await resposta.json();


        setTimeout(() => {
            window.location.href = "/prontuario/home/html/tela_inicial.html";
        }, 1000);

    } catch (erro) {
        console.error("Falha no cadastro:", erro);
        mensagemDiv.textContent = "Erro de conexão com o servidor.";
        mensagemDiv.style.color = "red";
    }
}