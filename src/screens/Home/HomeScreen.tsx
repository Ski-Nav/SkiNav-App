import { StyleSheet, Text, View } from "react-native";
import React from "react";
import MobileSafeView from "../../components/MobileSafeView";
import { COLORS, FONTS } from "../../constants/constants";

const HomeScreen = () => {
  return (
    <MobileSafeView style={styles.container}>
      <Text style={{ textAlign: "center" }}>
        <Text style={styles.titleSki}>Ski</Text>
        <Text style={styles.titleNav}>Nav</Text>
      </Text>
      <Text style={styles.subtitle}>Ski more. Stop less.</Text>
    </MobileSafeView>
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
  titleSki: {
    color: COLORS.white,
    fontFamily: FONTS.Bold,
    fontSize: 60,
  },
  titleNav: {
    color: COLORS.blue,
    fontFamily: FONTS.Bold,
    fontSize: 60,
  },
  subtitle: {
    color: COLORS.gray,
    fontFamily: FONTS.Medium,
    fontSize: 25,
  }
});
