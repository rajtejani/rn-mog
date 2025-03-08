import React from "react";
import { NavigationContainer } from "@react-navigation/native";
import { createStackNavigator } from "@react-navigation/stack";
import { SafeAreaProvider } from "react-native-safe-area-context";
import BottomTabNavigator from "./navigation/BottomTabNavigator";
import { AppProvider } from "@/Context/AppContext";
import { SplashScreen } from "./Screens/SplashScreen";

const Stack = createStackNavigator();

export default function App() {
  return (
    <SafeAreaProvider>
      <AppProvider>
        <NavigationContainer>
          <Stack.Navigator
            initialRouteName="Splash"
            screenOptions={{ headerShown: false }}
          >
            <Stack.Screen name="Splash" component={SplashScreen} />
            <Stack.Screen name="Main" component={BottomTabNavigator} />
          </Stack.Navigator>
        </NavigationContainer>
      </AppProvider>
    </SafeAreaProvider>
  );
}
