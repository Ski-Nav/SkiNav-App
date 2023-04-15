/* 
LoginScreen.tsx

This file contains the login screen for the application
*/

import {
  SafeAreaView,
  StyleSheet,
  View,
} from "react-native";
import React, { useState } from "react";
import { COLORS, SIZES } from "../../constants/constants";
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";
import TitleSection from "./components/TitleSection";
import TextFieldsSection from "./components/TextFieldsSection";
import LoginSection from "./components/LoginSection";

const LoginScreen = () => {
  const [name, setName] = useState<string>("");
  const [email, setEmail] = useState<string>("");

  return (
    <SafeAreaView style={styles.container}>
      <KeyboardAwareScrollView
        contentContainerStyle={styles.scrollviewContainer}
      >
        <View style={{ flex: 1, justifyContent: "flex-end" }}>
          <TitleSection/>
        </View>
        <View style={{ flex: 2, justifyContent: "center" }}>
          <TextFieldsSection setName={setName} setEmail={setEmail}/>
        </View>
        <View style={{ flex: 1, justifyContent: "center" }}>
          <LoginSection name={name} email={email}/>
        </View>
      </KeyboardAwareScrollView>
    </SafeAreaView>
  );
};

export default LoginScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
    alignItems: "center",
    justifyContent: "center",
  },
  scrollviewContainer: {
    alignItems: "center",
    justifyContent: "center",
    flex: 1,
    width: SIZES.width,
  }
});
