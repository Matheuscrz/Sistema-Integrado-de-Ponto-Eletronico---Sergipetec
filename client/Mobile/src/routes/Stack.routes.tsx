import React, { useEffect, useState } from "react";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import LoginScreen from "../screens/auth";
import { checkAuthentication } from "../auth/AuthUtils";
import HomeScreen from "../screens/Home";
import RecoveryScreen from "../screens/recover";
import HistoryScreen from "../screens/historic";

const Stack = createNativeStackNavigator();

interface StackRoutesProps {
  navigation: any;
}
const StackComponents: React.FC<StackRoutesProps> = ({ navigation }) => {
  const [isLoading, setIsLoading] = useState(true);
  useEffect(() => {
    const checkAuth = async () => {
      const isAuthenticated = await checkAuthentication();
      setIsLoading(false);
      if (!isAuthenticated) {
        navigation.navigate("Login");
      }
    };
    checkAuth();
  }, [navigation]);
  if (isLoading) {
    return null;
  }
  return (
    <Stack.Navigator>
      <Stack.Screen
        name="Login"
        component={LoginScreen}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name="Home"
        component={HomeScreen}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name="Recovery"
        component={RecoveryScreen}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name="Historic"
        component={HistoryScreen}
        options={{ headerShown: false }}
      />
    </Stack.Navigator>
  );
};
export default StackComponents;
