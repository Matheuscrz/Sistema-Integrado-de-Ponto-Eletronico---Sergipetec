import React, { useState, useRef } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEye, faEyeSlash } from "@fortawesome/free-solid-svg-icons";
import "../styles/LoginPage.css";
import { useNavigate } from "react-router-dom";

const LoginPage: React.FC = () => {
  const [cpf, setCpf] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [isChecked, setIsChecked] = useState(false);
  const [numericCpf, setNumericCpf] = useState("");
  const passwordRef = useRef<HTMLInputElement>(null);
  const navigate = useNavigate();

  const handleLoginButton = () => {
    console.log("login");
  };

  const handleCpfChange = (text: string) => {
    const numericValue = text.replace(/\D/g, "");
    setNumericCpf(numericValue);
    let formattedCpf = "";
    for (let i = 0; i < Math.min(numericValue.length, 11); i++) {
      if (i === 3 || i === 6) {
        formattedCpf += ".";
      } else if (i === 9) {
        formattedCpf += "-";
      }
      formattedCpf += numericValue[i];
    }
    setCpf(formattedCpf);
    console.log(numericCpf);
  };

  const toggleShowPassword = () => {
    setShowPassword(!showPassword);
  };

  const handleChangePassword = () => {
    navigate("/RecuperarSenha");
  };

  const isLoginButtonEnabled =
    isChecked && cpf.length > 0 && password.length > 0;

  return (
    <div className="container">
      <img className="logo" src="https://imgur.com/KtOIztk.png" alt="Logo" />
      <input
        className="input"
        placeholder="CPF"
        value={cpf}
        onChange={(e) => handleCpfChange(e.target.value)}
      />
      <div className="passwordContainer">
        <input
          className="passwordInput"
          placeholder="Senha"
          type={showPassword ? "text" : "password"}
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          ref={passwordRef}
        />
        <button className="showPasswordButton" onClick={toggleShowPassword}>
          <FontAwesomeIcon icon={showPassword ? faEyeSlash : faEye} size="lg" />
        </button>
      </div>
      <div className="checkboxContainer">
        <input
          type="checkbox"
          id="acceptTerms"
          checked={isChecked}
          onChange={() => setIsChecked(!isChecked)}
        />
        <label htmlFor="acceptTerms" className="checkboxText">
          Aceito os termos de uso
        </label>
      </div>
      <button
        className="button"
        onClick={handleLoginButton}
        disabled={!isLoginButtonEnabled}
      >
        Entrar
      </button>
      <div className="footerView">
        <p className="footerText">
          Esqueceu a senha?{" "}
          <span className="footerLink" onClick={handleChangePassword}>
            Alterar Senha
          </span>
        </p>
      </div>
    </div>
  );
};

export default LoginPage;
