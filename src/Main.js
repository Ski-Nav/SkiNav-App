/* 
Main will wrap all of our context providers. More information 
about contexts is documented in the context folder.
*/

import { StyleSheet, Text, TextInput } from "react-native";
import React from "react";
import { ResortProvider } from "./contexts/ResortContext";
import { ScreenProvider } from "./contexts/ScreenContext";
import AppNav from "./navigation/AppNav";

const Main = () => {
  // Disable font scaling
  Text.defaultProps = Text.defaultProps || {};
  Text.defaultProps.allowFontScaling = false;
  TextInput.defaultProps = TextInput.defaultProps || {};
  TextInput.defaultProps.allowFontScaling = false;
  return (
    <ResortProvider>
      <ScreenProvider>
        <AppNav/>
      </ScreenProvider>
    </ResortProvider>
  );
};

export default Main;

const styles = StyleSheet.create({});
