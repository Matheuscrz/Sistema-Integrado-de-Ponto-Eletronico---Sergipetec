import React, { useState, useRef } from "react";
import {
  Alert,
  Image,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";
import Icon from "react-native-vector-icons/FontAwesome";
import { ParamListBase, useNavigation } from "@react-navigation/native";
import { StackNavigationProp } from "@react-navigation/stack"; 
import { CheckBox } from "react-native-elements";
import authenticateUser from "../../auth/AuthService";
import styles from "./style";

interface LoginScreenProps {
  navigation: StackNavigationProp<ParamListBase, "Login">;
}

const LoginScreen: React.FC<LoginScreenProps> = () => {
  const navigation = useNavigation();
  const [cpf, setCpf] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [numericCpf, setNumericCpf] = useState<string>("");
  const [showPassword, setShowPassword] = useState<boolean>(false);
  const [isChecked, setIsChecked] = useState(false);
  const passwordRef = useRef<TextInput>(null);

  const handleRecoveryPassword = () => {
    navigation.navigate("Recovery" as never);
  };

  const handleLoginButton = async () => {
    try {
      if (numericCpf.length === 0 && password.length === 0) {
        Alert.alert("Os campos não podem estar vazios");
      } else {
        const response = await authenticateUser(numericCpf, password);

        if (response.token && response.userId) {
          navigation.navigate("Home" as never);
        } else if (response.error) {
          Alert.alert(response.error);
        } else {
          throw new Error("Ocorreu um erro ao fazer a requisição");
        }
      }
    } catch (error: any) {
      Alert.alert("Ocorreu um erro interno: " + error.message);
    }
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

    if (numericValue.length === 11 && passwordRef.current) {
      passwordRef.current.focus();
    }
  };

  const toggleShowPassword = () => {
    setShowPassword(!showPassword);
  };

  const isLoginButtonEnabled =
    isChecked && numericCpf.length > 0 && password.length > 0;

  return (
    <View style={styles.container}>
      <KeyboardAwareScrollView
        keyboardShouldPersistTaps="always"
        contentContainerStyle={{ flex: 1, width: "100%", alignItems: "center" }}
      >
        <Image
          style={styles.logo}
          resizeMode="contain"
          source={require("../../../assets/icon.png")}
        />
        <TextInput
          style={styles.input}
          placeholder="CPF"
          value={cpf}
          placeholderTextColor="#aaaaaa"
          underlineColorAndroid="transparent"
          keyboardType="numeric"
          onChangeText={handleCpfChange}
          maxLength={14}
        />
        <View style={styles.passwordContainer}>
          <TextInput
            style={styles.passwordInput}
            placeholder="Senha"
            placeholderTextColor="#aaaaaa"
            secureTextEntry={!showPassword}
            underlineColorAndroid="transparent"
            autoCapitalize="none"
            value={password}
            onChangeText={(text) => setPassword(text)}
            ref={passwordRef}
          />
          <TouchableOpacity
            style={styles.showPasswordButton}
            onPress={toggleShowPassword}
          >
            <Icon
              name={showPassword ? "eye-slash" : "eye"}
              size={20}
              color="#33d8d1"
            />
          </TouchableOpacity>
        </View>
        <CheckBox
          title="Aceito os termos de uso"
          checked={isChecked}
          onPress={() => setIsChecked(!isChecked)}
          containerStyle={styles.checkboxContainer}
          textStyle={styles.checkboxText}
        />
        <TouchableOpacity
          style={styles.button}
          onPress={handleLoginButton}
          disabled={!isLoginButtonEnabled}
        >
          <Text style={styles.buttonTitle}>Entrar</Text>
        </TouchableOpacity>
        <View style={styles.footerView}>
          <Text style={styles.footerText}>
            Esqueceu a senha?{" "}
            <Text style={styles.footerLink} onPress={handleRecoveryPassword}>
              Alterar Senha
            </Text>
          </Text>
        </View>
      </KeyboardAwareScrollView>
    </View>
  );
};

export default LoginScreen;
