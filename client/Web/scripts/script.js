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
const API_IP = "192.168.0.241";
const API_PORT = 3001;
const client = "web";
const getMethod = "get";
const postMethod = "post";

const apiConfig = axios.create({
  baseURL: `${base}://${API_IP}:${API_PORT}/${client}`,
  validateStatus: function (status) {
    return status >= 200 && status < 500;
  },
});

const authenticateUser = async (cpf, password) => {
  try {
    const response = await axios.post("URL_DA_SUA_API_DE_LOGIN", {
      cpf: cpf,
      password: password,
    });

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
  // Implementação do formato da senha, se necessário
  // ...

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
      // axios.post('/')
      alert("Login efetuado com sucesso!");
    }
    // const response = await authenticateUser(numericCpf, password);

    // if (response.token && response.userId) {
    //   alert("Login bem-sucedido!");
    //   // Redirecionar ou realizar ações pós-login conforme necessário
    // } else if (response.error) {
    //   alert(response.error);
    // } else {
    //   throw new Error("Ocorreu um erro ao fazer a requisição");
    // }
  } catch (error) {
    alert("Ocorreu um erro interno: " + error.message);
  }
};

const handleChangePassword = async () => {
  await axios
    .get(`${base}://${API_IP}:${API_PORT}/${client}/RecuperarSenha`)
    .then((response) => {
      window.location.href = "RecuperarSenha.html";
    })
    .catch((error) => {
      console.error(error);
    });
};

const toggleShowPassword = () => {
  const passwordInput = document.getElementById("passwordInput");
  passwordInput.type = passwordInput.type === "password" ? "text" : "password";
};
