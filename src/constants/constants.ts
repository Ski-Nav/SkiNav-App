/* 
constants.ts

This file contains constants and types useful in other parts of the app.
*/

import { Dimensions } from "react-native";

export interface User {
  Name: string;
  Email: string;
}

export interface Token {
  User: User;
  Logins: [Date];
}

export const STORAGE = {
  TokenUser: "TokenUser",
  TokenLogins: "TokenLogins",
};

export const SCREENS = {
  Login: "LoginScreen",
  Home: "HomeScreen",
};

export const COLORS = {
    background: "#DDDDDD",
    button: "#3d69ba",
    login: "#A9D0F5"
}

export const SIZES = {
  height: Dimensions.get('window').height,
  width: Dimensions.get('window').width,
}

