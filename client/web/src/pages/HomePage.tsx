import React from "react";
import { useNavigate } from "react-router-dom";
import AuthService from "../service/AuthService";

const HomePage: React.FC = () => {
  const navigate = useNavigate();

  if (!AuthService.isAuthenticated()) {
    navigate("/");
    return null;
  }

  return (
    <div>
      <h1>Bem-vindo à Página Inicial</h1>
      <button onClick={() => AuthService.logout()}>Logout</button>
    </div>
  );
};

export default HomePage;
