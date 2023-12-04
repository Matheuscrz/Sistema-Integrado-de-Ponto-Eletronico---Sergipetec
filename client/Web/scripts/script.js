document.addEventListener("DOMContentLoaded", function () {
  const cpfInput = document.getElementById("cpfInput");
  const passwordInput = document.getElementById("passwordInput");
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
const base = "https";
const IP = "192.168.0.180";
const WEB_PORT = 3443;
const API_PORT = 3444;
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
    const response = await apiConfig.post("/login", {
      cpf: cpf,
      senha: password,
    });
    return response.data;
  } catch (error) {
    console.error("Erro ao autenticar o usuário:", error);
    throw new Error(
      "Ocorreu um erro ao autenticar o usuário. Verifique o console para mais detalhes."
    );
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
    document.getElementById("passwordInput").focus();
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
        document.cookie = `userId=${response.userId}; path=/`;
        document.cookie = `token=${response.token}; path=/`;
        window.location.href = `${baseURL_WEB}/Home`;
      } else {
        alert("Credenciais inválidas. Por favor, tente novamente.");
      }
    }
  } catch (error) {
    alert("Ocorreu um erro interno. Por favor, tente novamente.");
  }
};

const handleChangePassword = async () => {
  try {
    window.location.href = "/RecuperarSenha";
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
