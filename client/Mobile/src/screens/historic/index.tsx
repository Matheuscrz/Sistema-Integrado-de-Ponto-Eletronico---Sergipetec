import React, { useState, useEffect } from "react";
import { View, Text, FlatList, TouchableOpacity, Alert } from "react-native";
import styles from "./style";
import { useNavigation } from "@react-navigation/native";
import { Ionicons } from "@expo/vector-icons";
import { downloadReceipt, getRegisters } from "../../config/ApiConfig";

interface RegisterItem {
  id: number;
  data: string;
  hora: string;
  localizacao: string;
}

interface HistoryScreenProps {}

const HistoryScreen: React.FC<HistoryScreenProps> = () => {
  const navigation = useNavigation();
  const [registers, setRegisters] = useState<RegisterItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

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
  useEffect(() => {
    const fetchHistory = async () => {
      try {
        const userHistory = await getRegisters();

        if (userHistory.status === 200 && userHistory.registers.length > 0) {
          const Registers = userHistory.registers;
          setRegisters(Registers);
        } else if (userHistory.status === 404) {
          setErrorMessage("Nenhum registro encontrado");
        }
      } catch (error) {
        console.error("Erro ao obter histórico de registros", error);
        setErrorMessage("Ocorreu um erro ao obter os registros");
      } finally {
        setLoading(false);
      }
    };

    fetchHistory();
  }, []);

  if (loading) {
    return (
      <View style={styles.container}>
        <Text>Loading...</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <View style={styles.bar}>
        <TouchableOpacity
          onPress={() => navigation.navigate("Home" as never)}
          style={styles.backButton}
        >
          <Ionicons name="ios-arrow-back" size={24} color="white" />
        </TouchableOpacity>
        <Text style={styles.headerText}>Histórico</Text>
      </View>
      {errorMessage ? (
        <View style={styles.errorContainer}>
          <Text style={styles.errorText}>{errorMessage}</Text>
        </View>
      ) : (
        <FlatList
          style={styles.historyList}
          data={registers}
          keyExtractor={(item) => item.id.toString()}
          renderItem={({ item }) => (
            <View style={styles.historyItem}>
              <Text>
                Data:{" "}
                {item.data
                  ? new Date(item.data).toLocaleDateString("pt-BR")
                  : "N/A"}
              </Text>
              <Text>Hora: {item.hora ?? "N/A"}</Text>
              <TouchableOpacity onPress={() => handleDownload(item.id)}>
                <Ionicons name="download" size={24} color="black" />
              </TouchableOpacity>
            </View>
          )}
        />
      )}
    </View>
  );
};

export default HistoryScreen;
