/* 
constants.ts

This file contains constants and types useful in other parts of the app.
*/

import { Dimensions } from "react-native";
import { CustomFonts } from "../../assets/fonts";

export type Resort = {
  Name: string;
};

export type ResortMap = {};

export type Node = {};

export type Edge = {};

export const SCREENS = {
  HomeScreen: "HomeScreen",
  NavigationScreen: "NavigationScreen",
};

export const COLORS = {
  background: "#222222",
  black: "#000000"
};

export const SIZES = {
  height: Dimensions.get("window").height,
  width: Dimensions.get("window").width,
};

export const FONTS = {
  Bold: CustomFonts.Bold,
  ExtraLight: CustomFonts.ExtraLight,
  Light: CustomFonts.Light,
  Medium: CustomFonts.Medium,
  Regular: CustomFonts.Regular,
  SemiBold: CustomFonts.SemiBold,
};
