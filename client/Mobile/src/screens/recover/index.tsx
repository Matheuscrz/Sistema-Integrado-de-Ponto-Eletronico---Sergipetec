import React from "react";
import { Image, Text, View } from "react-native";
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";
import styles from "./style";
import { ParamListBase, useNavigation } from "@react-navigation/native";
import { StackNavigationProp } from "@react-navigation/stack";

interface RecoveryScreenProps {
  navigation: StackNavigationProp<ParamListBase, "Recovery">;
}

const RecoveryScreen: React.FC<RecoveryScreenProps> = () => {
  const navigation = useNavigation();

  return (
    <View style={styles.container}>
      <KeyboardAwareScrollView
        style={{ width: "100%" }}
        keyboardShouldPersistTaps="always"
      >
        <Image
          style={styles.logo}
          resizeMode="contain"
          source={require("../../../assets/icon.png")}
        />
        <Text style={styles.instructions}>
          Para alterar a senha, envie um email com o seguinte conteúdo:
        </Text>
        <Text style={styles.emailContent}>
          Assunto: Alteração de Senha Ponto
        </Text>
        <Text style={styles.emailContent}>Corpo do Email:</Text>
        <Text style={styles.emailContent}>Nome Completo: [Seu Nome]</Text>
        <Text style={styles.emailContent}>CPF: [Seu CPF]</Text>
        <Text style={styles.emailContent}>
          Email Institucional: [Seu Email]
        </Text>
        <Text style={styles.destinationEmail}>
          Enviar para:
          {"\n"}
          suporte.sergipetec@sergipetec.org.br
        </Text>
      </KeyboardAwareScrollView>
    </View>
  );
};

export default RecoveryScreen;
