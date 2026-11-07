const API_URL = "http://localhost:3002";

document.addEventListener("DOMContentLoaded", () => {

    const botao = document.getElementById("cadastrar");

    botao.addEventListener("click", () => {
        
        const nome = document.getElementById("fname").value;
        const sobrenome = document.getElementById("lname").value;
        const ra = document.getElementById("ra").value;
        const email = document.getElementById("email").value;
        const telefone = document.getElementById("telefone").value;
        const senha = document.getElementById("Senha").value;
        const confirmarSenha = document.getElementById("confPassword").value;

        if  ( (nome.lenght > 10) ) {
            "novo invalido "
        
        }  
        else if(sobrenome > 150) {"novo invalido " } 
        else if(email.lenght > 100) {"novo invalido " } 
        else if(ra.lenght > 10) {"novo invalido " } 
        else if(telefone.lenght > 16) {"novo invalido " } 
        else if(senha .lenght > 20) {"novo invalido " } 
        else if(senha != confirmarSenha) {"novo invalido " } 
        else cadastrarAluno(nome, sobrenome, ra, email, telefone, senha, confirmarSenha );

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


