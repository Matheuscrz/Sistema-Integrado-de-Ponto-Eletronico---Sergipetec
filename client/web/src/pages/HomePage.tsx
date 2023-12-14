import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import AuthService from "../service/AuthService";
import { getUserData } from "../config/ApiConfig";

interface UserData {
  userId: string;
  nome: string;
  setor: string;
  perfil_acesso_id: number;
}

const HomePage: React.FC = () => {
  const navigate = useNavigate();
  const [userData, setUserData] = useState<UserData | null>(null);
  const [userButtons, setUserButtons] = useState<string[]>([]);
  const [userLocation, setUserLocation] = useState<string | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const fetchedUserData: UserData = await getUserData();
        setUserData(fetchedUserData);
        determineUserButtons(fetchedUserData);
        fetchUserLocation();
      } catch (error) {
        console.error("Erro ao obter dados do usuário", error);
      }
    };

    const determineUserButtons = (user: UserData) => {
      const accessButtons: { [key: number]: string[] } = {
        1: [
          "Registro",
          "Frequência",
          "Jornadas",
          "Relatórios",
          "Presenças",
          "Abonos",
          "Configuração",
          "Manutenção",
          "Sair",
        ],
        2: ["Registro", "Frequência", "Relatórios", "Presenças", "Sair"],
      };

      if (user && user.perfil_acesso_id in accessButtons) {
        setUserButtons(accessButtons[user.perfil_acesso_id]);
      } else {
        setUserButtons(["registro", "sair"]);
      }
    };

    const fetchUserLocation = () => {
      if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(
          (position) => {
            const { latitude, longitude } = position.coords;
            setUserLocation(`Latitude: ${latitude}, Longitude: ${longitude}`);
          },
          (error) => {
            console.error("Erro ao obter a localização do usuário", error);
            setUserLocation("Não foi possível obter a localização");
          }
        );
      } else {
        console.error("Geolocalização não suportada pelo navegador");
        setUserLocation("Geolocalização não suportada pelo navegador");
      }
    };

    const checkAuthentication = () => {
      if (AuthService.isAuthenticated()) {
        fetchData();
      } else {
        navigate("/");
      }
    };

    checkAuthentication();
  }, [navigate]);

  const handleSair = () => {
    AuthService.logout();
    navigate("/");
  };

  if (!userData || userButtons.length === 0) {
    return <div>Loading...</div>;
  }

  return (
    <div>
      <p>Localização: {userLocation}</p>
      {userButtons.map((button) => (
        <button
          key={button}
          onClick={button.toLowerCase() === "sair" ? handleSair : undefined}
        >
          {button}
        </button>
      ))}
    </div>
  );
};

export default HomePage;
