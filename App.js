// App.js
import React from "react";
import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { GestureHandlerRootView } from "react-native-gesture-handler";

import Login from "./screens/Login";
import SignUp from "./screens/SignUp";
import Home from "./screens/Home";
import SellerDashboard from "./screens/seller/SellerDashboard";
import CustomersScreen from "./screens/seller/CustomersScreen";
import DeliveriesScreen from "./screens/seller/DeliveriesScreen";

const Stack = createNativeStackNavigator();

export default function App() {
  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <NavigationContainer>
        <Stack.Navigator
          initialRouteName="Login"
          screenOptions={{ headerShown: false }}
        >
          <Stack.Screen name="Login" component={Login} />
          <Stack.Screen name="SignUp" component={SignUp} />
          <Stack.Screen name="Home" component={Home} />
          <Stack.Screen name="SellerDashboard" component={SellerDashboard} />
          <Stack.Screen name="CustomersList" component={CustomersScreen} />
          <Stack.Screen name="DeliveryHistory" component={DeliveriesScreen} />
        </Stack.Navigator>
      </NavigationContainer>
    </GestureHandlerRootView>
  );
}
