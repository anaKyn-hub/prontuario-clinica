const API_URL = "http://localhost:3002";

document.addEventListener("DOMContentLoaded", () => {

    const form = document.getElementById("formCadastro");

    form.addEventListener("submit", (event) => {
        event.preventDefault();

        // Valor dos campos do Usuario
        const nome = document.getElementById("fname").value.trim();
        const ra = document.getElementById("ra").value.trim();
        const email = document.getElementById("email").value.trim();
        const telefone = document.getElementById("telefone").value.trim();
        const senha = document.getElementById("password").value;
        const confirmarSenha = document.getElementById("confPassword").value;

        // Mensagens de erro
        const Erronome = document.getElementById("Erronome");
        const Errora = document.getElementById("Errora");
        const Erroemail = document.getElementById("Erroemail");
        const Errotelefone = document.getElementById("Errotelefone");
        const Errosenha = document.getElementById("Errosenha");
        const Erroconfsenha = document.getElementById("Erroconfsenha");

        Erronome.style.display = "none";
        Errora.style.display = "none";
        Erroemail.style.display = "none";
        Errotelefone.style.display = "none";
        Errosenha.style.display = "none";
        Erroconfsenha.style.display = "none";

        if (nome.length > 255) {
            Erronome.style.display = "block";
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
            cadastrarAluno(nome, ra, email, telefone, senha);
        }
    });

});

async function cadastrarAluno(nome, ra, email, telefone, senha) {

    try {

    
        const resposta = await fetch(`${API_URL}/api/alunos`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                nome,
                ra,                                    
                email,
                telefone: telefone.replace(/\D/g, ""),
                senha
            })
        });

        const dados = await resposta.json();

        
        if (!resposta.ok) {

            
            const camposErro = {
                nome: "Erronome",
                ra: "Errora",
                email: "Erroemail",
                telefone: "Errotelefone",
                senha: "Errosenha"
            };

        
            if (dados.errors) {
                dados.errors.forEach((e) => {
                    const el = document.getElementById(camposErro[e.path]);
                    if (el) {
                        el.textContent = e.msg;
                        el.style.display = "block";
                    } else {
                        alert(e.msg);
                    }
                });
            } else {
                alert(dados.erro || "Não foi possível realizar o cadastro.");
            }

            return;
        }

        setTimeout(() => {
            window.location.href = "../login/index.html";
        }, 1000);

    } catch (erro) {
        console.error("Falha no cadastro:", erro);
        alert("Erro de conexão com o servidor.");
    }
}