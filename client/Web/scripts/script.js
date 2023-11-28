document.addEventListener("DOMContentLoaded", function () {
  const cpfInput = document.getElementById("cpfInput");
  const passwordInput = document.getElementById("passwordInput");
  const showPasswordButton = document.getElementById("showPasswordButton");
  const termsCheckbox = document.getElementById("termsCheckbox");
  const loginButton = document.getElementById("loginButton");
  const footerLink = document.getElementById("footerLink");

  cpfInput.addEventListener("input", handleCpfInput);
  passwordInput.addEventListener("input", handlePasswordInput);
  termsCheckbox.addEventListener("change", handleCheckboxChange);
  loginButton.addEventListener("click", handleLoginButton);
  footerLink.addEventListener("click", handleChangePassword);
});

let numericCpf = "";
let password = "";
let isChecked = false;
const base = "http";
const IP = "192.168.0.241";
const WEB_PORT = 3000;
const API_PORT = 3001;
const BaseURL_API = `${base}://${IP}:${API_PORT}`;
const baseURL_WEB = `${base}://${IP}:${WEB_PORT}`;

const apiConfig = axios.create({
  baseURL: `${BaseURL_API}`,
  validateStatus: function (status) {
    return status >= 200 && status < 500;
  },
});

const authenticateUser = async (cpf, password) => {
  try {
    const json = JSON.stringify({
      cpf: cpf,
      senha: password,
    });
    customConfig = {
      headers: {
        "Content-Type": "application/json",
      },
    };
    const response = await apiConfig.post("/login", json, customConfig);
    return response.data;
  } catch (error) {
    throw new Error("Ocorreu um erro ao autenticar o usuário.");
  }
};

const handleCpfInput = () => {
  const cpfInput = document.getElementById("cpfInput");
  numericCpf = cpfInput.value.replace(/\D/g, "");
  let formattedCpf = "";

  for (let i = 0; i < Math.min(numericCpf.length, 11); i++) {
    if (i === 3 || i === 6) {
      formattedCpf += ".";
    } else if (i === 9) {
      formattedCpf += "-";
    }
    formattedCpf += numericCpf[i];
  }

  cpfInput.value = formattedCpf;

  if (numericCpf.length === 11) {
    passwordInput.focus();
  }

  updateLoginButtonState();
};

const handlePasswordInput = () => {
  password = document.getElementById("passwordInput").value;
  updateLoginButtonState();
};

const handleCheckboxChange = () => {
  isChecked = document.getElementById("termsCheckbox").checked;
  updateLoginButtonState();
};

const updateLoginButtonState = () => {
  const loginButton = document.getElementById("loginButton");
  loginButton.disabled =
    !isChecked || numericCpf.length === 0 || password.length === 0;
};

const handleLoginButton = async () => {
  try {
    if (!isChecked || numericCpf.length === 0 || password.length === 0) {
      alert("Por favor, preencha todos os campos e aceite os termos de uso.");
      return;
    } else {
      const response = await authenticateUser(numericCpf, password);
      if (response.token && response.userId) {
        // Redirecionar para a página desejada após o login bem-sucedido
        window.location.href = `${baseURL_WEB}/Home`;
      } else {
        alert("Credenciais inválidas. Por favor, tente novamente.");
      }
    }
  } catch (error) {
    alert("Ocorreu um erro interno: " + error.message);
  }
};

const handleChangePassword = async () => {
  try {
    window.location.href = `${baseURL_WEB}/RecuperarSenha`;
  } catch (error) {
    console.error("Erro ao alterar a senha:", error);
  }
};

const toggleShowPassword = () => {
  const passwordInput = document.getElementById("passwordInput");
  passwordInput.type = passwordInput.type === "password" ? "text" : "password";
};

const toggleCheckbox = () => {
  isChecked = !isChecked;
  updateLoginButtonState();
};
