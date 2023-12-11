import React from "react";
import "../styles/RecoveryPage.css";

const RecoveryPage: React.FC = () => {
  return (
    <div className="container">
      <div className="logoContainer">
        <img className="logo" src="https://imgur.com/KtOIztk.png" alt="Logo" />
      </div>
      <div className="instructions">
        <p>Para alterar a senha, envie um email com o seguinte conteúdo:</p>
      </div>
      <div className="emailContent">
        <p>Assunto: Alteração de Senha de Ponto</p>
        <p>Corpo do Email:</p>
        <p>Nome Completo: [Seu Nome]</p>
        <p>CPF: [Seu CPF]</p>
        <p>Email Institucional: [Seu Email]</p>
      </div>
      <div className="destinationEmail">
        <p>
          Enviar para:
          <br />
          suporte.sergipetec@sergipetec.org.br
        </p>
      </div>
    </div>
  );
};

export default RecoveryPage;
