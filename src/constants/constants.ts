/* 
constants.ts

This file contains constants and types useful in other parts of the app.
*/

import { Dimensions, Platform } from "react-native";
import { CustomFonts } from "../../assets/fonts";

export const API_URL = "http://ec2-18-222-140-238.us-east-2.compute.amazonaws.com:3000/api/v1/"


export const SCREENS = {
  HomeScreen: "HomeScreen",
  NavigationScreen: "NavigationScreen",
};

export const COLORS = {
  background: "#222222",
  black: "#000000",
  gray: "#b7b7b7",
  white: "#ffffff",
  lightBlue: "#a4c2f4",
  blue: "#455f8a",
  red: "#AA3212",
  lightRed: "#FA9B86"
};

export const SIZES = {
  height: Dimensions.get("window").height,
  width: Dimensions.get("window").width,
  tabBarHeight: 50 + (Platform.OS === "ios" ? 24 : 0),
  topBarHeight: Platform.OS === "ios" ? 44 : 24,
  bottomBarHeight: Platform.OS === "ios" ? 24 : 0,
};

export const FONTS = {
  Bold: "Bold",
  ExtraLight: "ExtraLight",
  Light: "Light",
  Medium: "Medium",
  Regular: "Regular",
  SemiBold: "SemiBold",
};
