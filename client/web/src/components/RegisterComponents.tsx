import React from "react";
import { UserData } from "../pages/HomePage";

interface RegisterComponentProps {
  userData: UserData;
  userLocation: string | null;
}

const RegisterComponent: React.FC<RegisterComponentProps> = ({
  // userData,
  userLocation,
}) => {
  const handleRegister = () => {
    console.log("Ponto registrado!");
  };

  return (
    <div>
      <h2>Área de Registro de Ponto</h2>
      <p>Data e Hora Atuais: {new Date().toLocaleString()}</p>
      <p>Localização: {userLocation}</p>
      <button onClick={handleRegister}>Registrar Ponto</button>
    </div>
  );
};

export default RegisterComponent;
