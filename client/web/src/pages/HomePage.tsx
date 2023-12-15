import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import AuthService from "../service/AuthService";
import { getUserData } from "../config/ApiConfig";
import "../styles/HomePage.css";
import {
  FaRegAddressCard,
  FaCalendarAlt,
  FaCalendarCheck,
  FaSignOutAlt,
  FaClipboardList,
  FaUsers,
  FaHandHolding,
  FaCog,
  FaTools,
} from "react-icons/fa";
import {
  AllowancesComponent,
  FrequencyComponent,
  JourneysComponent,
  MaintenanceComponent,
  PresenceComponent,
  RegisterComponent,
  ReportsComponent,
  SettingsComponent,
} from "../components";

export interface UserData {
  userId: string;
  nome: string;
  setor: string;
  perfil_acesso_id: number;
}

const HomePage: React.FC = () => {
  const navigate = useNavigate();
  const [userData, setUserData] = useState<UserData | null>(null);
  const [userLocation, setUserLocation] = useState<string | null>(null);
  const [selectedMenuItem, setSelectedMenuItem] = useState<string>("Registro");

  useEffect(() => {
    const fetchData = async () => {
      try {
        const fetchedUserData: UserData = await getUserData();
        setUserData(fetchedUserData);
        fetchUserLocation();
      } catch (error) {
        console.error("Erro ao obter dados do usuário", error);
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

  const handleMenuClick = (menuItem: string) => {
    setSelectedMenuItem(menuItem);
  };

  return (
    <div style={{ display: "flex" }}>
      <div className="menu-container">
        <div
          className={`menu-item ${
            selectedMenuItem === "Registro" ? "active" : ""
          }`}
        >
          <FaRegAddressCard
            size={30}
            title="Registro de Ponto"
            onClick={() => handleMenuClick("Registro")}
          />
        </div>
        <div
          className={`menu-item ${
            selectedMenuItem === "Frequência" ? "active" : ""
          }`}
        >
          <FaCalendarAlt
            size={30}
            title="Frequência"
            onClick={() => handleMenuClick("Frequência")}
          />
        </div>
        <div
          className={`menu-item ${
            selectedMenuItem === "Jornadas" ? "active" : ""
          }`}
        >
          <FaCalendarCheck
            size={30}
            title="Jornadas"
            onClick={() => handleMenuClick("Jornadas")}
          />
        </div>
        <div
          className={`menu-item ${
            selectedMenuItem === "Relatórios" ? "active" : ""
          }`}
        >
          <FaClipboardList
            size={30}
            title="Relatórios"
            onClick={() => handleMenuClick("Relatórios")}
          />
        </div>
        <div
          className={`menu-item ${
            selectedMenuItem === "Presenças" ? "active" : ""
          }`}
        >
          <FaUsers
            size={30}
            title="Presenças"
            onClick={() => handleMenuClick("Presenças")}
          />
        </div>
        <div
          className={`menu-item ${
            selectedMenuItem === "Abonos" ? "active" : ""
          }`}
        >
          <FaHandHolding
            size={30}
            title="Abonos"
            onClick={() => handleMenuClick("Abonos")}
          />
        </div>
        <div
          className={`menu-item ${
            selectedMenuItem === "Configuração" ? "active" : ""
          }`}
        >
          <FaCog
            size={30}
            title="Configuração"
            onClick={() => handleMenuClick("Configuração")}
          />
        </div>
        <div
          className={`menu-item ${
            selectedMenuItem === "Manutenção" ? "active" : ""
          }`}
        >
          <FaTools
            size={30}
            title="Manutenção"
            onClick={() => handleMenuClick("Manutenção")}
          />
        </div>
        <div className="menu-item" onClick={handleSair}>
          <FaSignOutAlt size={30} title="Sair" style={{ cursor: "pointer" }} />
        </div>
      </div>

      <div className="main-content">
        {selectedMenuItem === "Registro" && userData && (
          <RegisterComponent userData={userData} userLocation={userLocation} />
        )}
        {selectedMenuItem === "Frequência" && <FrequencyComponent />}
        {selectedMenuItem === "Jornadas" && <JourneysComponent />}
        {selectedMenuItem === "Relatórios" && <ReportsComponent />}
        {selectedMenuItem === "Presenças" && <PresenceComponent />}
        {selectedMenuItem === "Abonos" && <AllowancesComponent />}
        {selectedMenuItem === "Configuração" && <SettingsComponent />}
        {selectedMenuItem === "Manutenção" && <MaintenanceComponent />}
      </div>
    </div>
  );
};

export default HomePage;
