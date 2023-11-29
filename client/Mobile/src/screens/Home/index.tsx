import React, { useState, useEffect } from "react";
import { Alert, Text, TouchableOpacity, View, Modal } from "react-native";
import styles from "./style";
import { ParamListBase } from "@react-navigation/native";
import { StackNavigationProp } from "@react-navigation/stack";
import {
  requestForegroundPermissionsAsync,
  watchPositionAsync,
  LocationObject,
  LocationAccuracy,
  LocationSubscription,
} from "expo-location";
import MapView, { Marker } from "react-native-maps";
import {
  downloadReceipt,
  getUserData,
  registerPoint,
} from "../../config/ApiConfig";
import { format } from "date-fns";
import { Ionicons } from "@expo/vector-icons";
import MenuModal from "../menu";
import { getRegisterId } from "../../config/StorageManager";

interface HomeScreenProps {
  navigation: StackNavigationProp<ParamListBase, "Home">;
}

const HomeScreen: React.FC<HomeScreenProps> = ({ navigation }) => {
  const [date, setDate] = useState("");
  const [time, setTime] = useState("");
  const [location, setLocation] = useState<LocationObject | null>(null);
  const [user, setUser] = useState("");
  const [sector, setSector] = useState("");
  const [shouldDownloadReceipt, setShouldDownloadReceipt] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  let locationSubscription: LocationSubscription | null = null;

  const getCurrentDate = () => {
    const currentDate = new Date();
    const formattedDate = format(currentDate, "dd/MM/yyyy");
    const formattedTime = format(currentDate, "HH:mm:ss");
    setDate(formattedDate);
    setTime(formattedTime);
  };

  const fetchUserData = async () => {
    try {
      const userData: any = await getUserData();
      setUser(userData.nome);
      setSector(userData.setor);
    } catch (error) {
      console.error("Erro ao obter dados do usuário", error);
    }
  };

  const convertStringToDate = (data: string) => {
    const partes = data.split("/");
    const dia = parseInt(partes[0], 10);
    const mes = parseInt(partes[1], 10) - 1;
    const ano = parseInt(partes[2], 10);
    return new Date(ano, mes, dia);
  };
  const handleOpenMenu = () => {
    setIsMenuOpen(true);
  };

  const handleCloseMenu = () => {
    setIsMenuOpen(false);
  };
  const handleNavigate = (screen: string) => {
    navigation.navigate(screen);
    setIsMenuOpen(false);
  };
  const handleDownload = async (id: number) => {
    try {
      const downloadResult = await downloadReceipt(id);
      if (downloadResult.status === 200) {
        Alert.alert("Download concluído com sucesso!");
      } else {
        Alert.alert("Erro no download:", downloadResult.message);
      }
    } catch (error: any) {
      console.error(error);
      Alert.alert("Erro ao baixar o comprovante:", error.message);
    }
  };

  const handleRegister = () => {
    if (!location) {
      Alert.alert(
        "Localização não disponível",
        "Por favor, aguarde enquanto obtemos a sua localização."
      );
      return;
    }
    Alert.alert("Confirmação", "Deseja registrar seu ponto?", [
      {
        text: "Cancelar",
        style: "cancel",
      },
      {
        text: "Registrar",
        onPress: async () => {
          try {
            const locationString = locationToString(location);
            const dateObj = convertStringToDate(date);
            const response = await registerPoint(dateObj, time, locationString);
            if (response.status === 200) {
              Alert.alert(
                "Registro bem-sucedido",
                "Seu ponto foi registrado com sucesso.",
                [
                  {
                    text: "Baixar comprovante",
                    onPress: () => {
                      Alert.alert(
                        "Confirmação",
                        "Deseja baixar o comprovante?",
                        [
                          {
                            text: "Cancelar",
                            style: "cancel",
                          },
                          {
                            text: "Baixar",
                            onPress: () =>
                              handleDownload(response.data.registroId),
                          },
                        ]
                      );
                    },
                  },
                  {
                    text: "Sair",
                  },
                ]
              );
            } else if (response.status === 400) {
              Alert.alert("Limite máximo de registros diários atingido.");
            } else {
              throw new Error("Erro ao registrar ponto");
            }
          } catch (error: any) {
            if (error.response) {
              if (error.response.status === 400) {
                Alert.alert("Limite máximo de registros diários atingido.");
              } else {
                Alert.alert("Erro ao fazer requisição");
              }
            } else if (error.request) {
              Alert.alert("Erro ao fazer requisição");
            } else {
              Alert.alert(
                "Erro",
                "Ocorreu um erro ao registrar o ponto. Por favor, tente novamente."
              );
            }
          }
        },
      },
    ]);
  };

  const locationToString = (location: LocationObject | null) => {
    if (location && location.coords) {
      const { latitude, longitude } = location.coords;
      return `${latitude},${longitude}`;
    }
    return "";
  };

  const startLocationUpdates = async () => {
    try {
      const subscription = await watchPositionAsync(
        {
          accuracy: LocationAccuracy.Highest,
          timeInterval: 10000,
          distanceInterval: 10,
        },
        (response) => {
          setLocation(response);
        }
      );
      locationSubscription = subscription;
    } catch (error) {
      console.error("Erro ao iniciar atualizações de localização", error);
    }
  };

  useEffect(() => {
    fetchUserData();
    const interval = setInterval(() => {
      getCurrentDate();
    }, 1000);

    return () => {
      clearInterval(interval);
    };
  }, []);

  useEffect(() => {
    const requestPermissionsAndStartUpdates = async () => {
      const { granted } = await requestForegroundPermissionsAsync();
      if (granted) {
        startLocationUpdates();
      } else {
        Alert.alert(
          "Permissão de Localização",
          "Você precisa conceder permissão de localização para usar este aplicativo.",
          [{ text: "OK" }]
        );
      }
    };
    requestPermissionsAndStartUpdates();
    return () => {
      if (locationSubscription !== null) {
        locationSubscription.remove();
      }
    };
  }, []);

  useEffect(() => {
    const fetchDownloadReceipt = async () => {
      if (shouldDownloadReceipt) {
        const registerId = await getRegisterId();
        if (registerId) {
          handleDownload(parseInt(registerId));
        }
      }
    };

    fetchDownloadReceipt();
  }, [shouldDownloadReceipt]);

  return (
    <View style={styles.container}>
      <View style={styles.bar}>
        <TouchableOpacity onPress={handleOpenMenu} style={styles.menuButton}>
          <Text>
            <Ionicons name="ios-menu" size={24} color="black" />{" "}
          </Text>
        </TouchableOpacity>
        <Modal visible={isMenuOpen} animationType="slide">
          <MenuModal onClose={handleCloseMenu} onNavigate={handleNavigate} />
        </Modal>
        <View style={styles.userInfo}>
          <Text style={styles.userName}>{user}</Text>
          <Text style={styles.userSector}>{sector}</Text>
        </View>
      </View>
      <View style={styles.mapContainer}>
        {location && (
          <MapView
            style={styles.map}
            initialRegion={{
              latitude: location.coords.latitude,
              longitude: location.coords.longitude,
              latitudeDelta: 0.005,
              longitudeDelta: 0.005,
            }}
          >
            <Marker
              coordinate={{
                latitude: location.coords.latitude,
                longitude: location.coords.longitude,
              }}
            />
          </MapView>
        )}
      </View>
      <View style={styles.infoContainer}>
        <View style={styles.infoBox}>
          <Text style={styles.dateTime}> Data: {date}</Text>
          <Text style={styles.dateTime}>Hora:{time}</Text>
          <Text style={styles.infoText}>{user}</Text>
          <Text style={styles.infoText}>{sector}</Text>
        </View>
        <TouchableOpacity
          style={styles.registerButton}
          onPress={handleRegister}
        >
          <Text style={styles.registerButtonText}>Registrar</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

export default HomeScreen;
