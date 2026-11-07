const API_URL = "http://localhost:3002";

document.addEventListener("DOMContentLoaded", () => {
    console.log('oi')

    const botao = document.getElementById("cadastrar");

    botao.addEventListener("click", () => {


        // Valor dos campos do Usuario 
        const nome = document.getElementById("fname").value;
        const sobrenome = document.getElementById("lname").value;
        const ra = document.getElementById("ra").value;
        const email = document.getElementById("email").value;
        const telefone = document.getElementById("telefone").value;
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

async function cadastrarAluno(nome, sobrenome, ra, email, telefone, senha, confirmarSenha) {

    const mensagemDiv =
        document.getElementById("mensagem-login");

    try {

        const resposta = await fetch(
            `${API_URL}/`,
            {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({
                    nome,
                    sobrenome,
                    ra, 
                    email, 
                    telefone, 
                    senha, 
                    confirmarSenha
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


