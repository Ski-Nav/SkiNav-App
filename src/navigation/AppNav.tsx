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
import { SCREENS } from "../constants/constants";
import HomeScreen from "../screens/Home/HomeScreen";
import NavigationScreen from "../screens/Map/MapScreen";

const Stack = createNativeStackNavigator();

const AppNav = () => {
  return (
    <NavigationContainer>
      <SkiStack/>
    </NavigationContainer>
  );
};

const SkiStack = () => {
  console.log("Loading SkiNav");
  return (
    <Stack.Navigator
      screenOptions={{
        headerShown: false,
        gestureEnabled:false,
      }}
      initialRouteName={SCREENS.HomeScreen}
    >
      <Stack.Screen name={SCREENS.HomeScreen} component={HomeScreen} />
      <Stack.Screen name={SCREENS.NavigationScreen} component={NavigationScreen} />
    </Stack.Navigator>
  );
};

export default AppNav;

const styles = StyleSheet.create({});
