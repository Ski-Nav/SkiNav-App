/* 
HomeScreen.tsx

This file contains the home screen for the application
*/

import { SafeAreaView, StyleSheet, View } from "react-native";
import React from "react";
import { COLORS } from "../../constants/constants";
import TitleSection from "./components/TitleSection";
import DescriptionSection from "./components/DescriptionSection";
import LogoutSection from "./components/LogoutSection";

const HomeScreen = () => {
  return (
    <SafeAreaView style={styles.container}>
      <View style={{ flex: 1, justifyContent: "flex-end" }}>
        <TitleSection />
      </View>
      <View
        style={{ marginHorizontal: 30, flex: 2, justifyContent: "flex-start" }}
      >
        <DescriptionSection />
      </View>
      <View style={{ flex: 1, justifyContent: "center" }}>
        <LogoutSection />
      </View>
    </SafeAreaView>
  );
};

export default HomeScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
    alignItems: "center",
    justifyContent: "center",
  },
});
