import React from "react";
import { View, Text, TouchableOpacity } from "react-native";
import styles from "./style";
import { removeItem } from "../../config/StorageManager";

interface MenuModalProps {
  onClose: () => void;
  onNavigate: (screen: string) => void;
}

const MenuModal: React.FC<MenuModalProps> = ({ onClose, onNavigate }) => {
  const onLogoff = async () => {
    try {
      await removeItem("userData");
      await removeItem("userToken");
    } catch (e) {
      console.error("Erro ao limpar dados do usuário e token:", e);
    }
    onNavigate("Login");
  };
  return (
    <View style={styles.container}>
      <TouchableOpacity onPress={onClose} style={styles.closeButton}>
        <Text style={styles.closeButtonText}>Fechar Menu</Text>
      </TouchableOpacity>

      <TouchableOpacity
        onPress={() => onNavigate("Historic")}
        style={styles.menuItem}
      >
        <Text style={styles.menuItemText}>Histórico</Text>
      </TouchableOpacity>

      <TouchableOpacity onPress={onLogoff} style={styles.logoffButton}>
        <Text style={styles.logoffButtonText}>Sair</Text>
      </TouchableOpacity>
    </View>
  );
};

export default MenuModal;
