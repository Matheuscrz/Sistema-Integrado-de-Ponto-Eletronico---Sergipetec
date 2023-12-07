import React from "react";
import LoginForm from "../components/LoginForm";
import "../styles/login.css";

const Login: React.FC = () => {
  return (
    <div className="login-container">
      <LoginForm />
    </div>
  );
};

export default Login;
