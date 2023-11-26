import React from "react";
import { NavigationContainer } from "@react-navigation/native";
import StackComponents from "./Stack.routes";

const Routes = () => {
  return (
    <NavigationContainer>
      <StackComponents navigation={undefined} />
    </NavigationContainer>
  );
};
export default Routes;
