import React, { useState } from "react";
import "../styles/LoginForm.css";

const LoginForm: React.FC = () => {
  const [showPassword, setShowPassword] = useState(false);

  const handleShowPassword = () => {
    setShowPassword(!showPassword);
  };

  return (
    <form>
      <div>
        <label htmlFor="cpf">CPF</label>
        <input type="text" id="cpf" />
      </div>
      <div>
        <label htmlFor="password">Senha</label>
        <input type={showPassword ? "text" : "password"} id="password" />
        <span onClick={handleShowPassword}>Mostrar Senha</span>
      </div>
      <div>
        <input type="checkbox" id="acceptTerms" />
        <label htmlFor="acceptTerms">Aceito os termos de uso</label>
      </div>
      <button type="submit">Entrar</button>
      <p>
        Esqueceu a senha? <a href="/alterar-senha">Alterar senha</a>
      </p>
    </form>
  );
};

export default LoginForm;
