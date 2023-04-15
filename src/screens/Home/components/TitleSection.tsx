import { StyleSheet, Text, View } from "react-native";
import React from "react";

const TitleSection = () => {
  return (
    <View>
      <Text style={styles.title}>Home</Text>
    </View>
  );
};

export default TitleSection;

const styles = StyleSheet.create({
  title: {
    fontSize: 40,
  },
});
