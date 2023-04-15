/* 
AppNav.tsx

Security in React Native is very important. You don't want
a user to access parts of your app if they are not
authenticated. That is why I implemented a two stack
architecture for app navigation in this application. If a
user has a valid token, they get access to the AppStack. If
they do not have a valid token, they get access to the AuthStack.
They physically cannot switch stacks unless the user's currentToken
changes. A lot of applications do this, and it is best practice.*/

import { StyleSheet, Text, View } from "react-native";
import React, { useContext } from "react";
import {
  NavigationContainer,
} from "@react-navigation/native";
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { UserContext } from "../contexts/UserContext";
import { SCREENS } from "../constants/constants";
import LoginScreen from "../screens/Login/LoginScreen";
import HomeScreen from "../screens/Home/HomeScreen";

const Stack = createNativeStackNavigator();

const AppNav = () => {
  const { currentToken } = useContext(UserContext);
  return (
    <NavigationContainer>
      {currentToken ? <AppStack /> : <AuthStack />}
    </NavigationContainer>
  );
};

const AuthStack = () => {
  console.log("Loading AuthStack");
  return (
    <Stack.Navigator
      screenOptions={{
        headerShown: false,
      }}
      initialRouteName={SCREENS.Login}
    >
      <Stack.Screen name={SCREENS.Login} component={LoginScreen} />
    </Stack.Navigator>
  );
};

const AppStack = () => {
  console.log("Loading AppStack");
  return (
    <Stack.Navigator
      screenOptions={{
        headerShown: false,
      }}
      initialRouteName={SCREENS.Home}
    >
      <Stack.Screen name={SCREENS.Home} component={HomeScreen} />
    </Stack.Navigator>
  );
};

export default AppNav;

const styles = StyleSheet.create({});
