

const API_URL = "http://localhost:3000";



const email = document.getElementById("EMAIL").value;
const senha = document.getElementById("SENHA").value;
const botao = document.getElementById("BOTAO").value;





// -----------------------------------------------------------------
// Exemplo 2: Login (POST "/login") usando um formulário
// -----------------------------------------------------------------
async function fazerLogin(EMAIL, SENHA) {
  const mensagemDiv = document.getElementById("mensagem-login"); 

  try {
    const resposta = await fetch(`${API_URL}/login`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ EMAIL, SENHA }),
    });

    const dados = await resposta.json();

    if (!resposta.ok) {
      mensagemDiv.textContent = dados.erro || "Erro ao fazer login";
      mensagemDiv.style.color = "red";
      return;
    }

    mensagemDiv.textContent = `Bem-vindo, ${dados.nome}!`;
    mensagemDiv.style.color = "green";
  } catch (erro) {
    console.error("Falha no login:", erro);
    mensagemDiv.textContent = "Erro de conexão com o servidor.";
    mensagemDiv.style.color = "red";
  }
}



// -----------------------------------------------------------------
// Disparando as funções quando a página carregar
// -----------------------------------------------------------------
document.addEventListener("DOMContentLoaded", () => {
  listarAlunos();

  // Exemplo: se você tiver um formulário de login no HTML
  const formLogin = document.getElementById("form-login");
  if (formLogin) {
    formLogin.addEventListener("submit", (event) => {
      event.preventDefault();
      const email = document.getElementById("email").value;
      const senha = document.getElementById("senha").value;
      fazerLogin(email, senha);
    });
  }
});