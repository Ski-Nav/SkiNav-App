import { Alert, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import React, { useContext } from "react";
import { COLORS, Token } from "../../../constants/constants";
import { ScreenContext } from "../../../contexts/ScreenContext";
import { UserContext } from "../../../contexts/UserContext";
import { displayError } from "../../../helpers/helpers";
import { login } from "../../../services/AuthService";
import AsyncStorage from "@react-native-async-storage/async-storage";

type LoginSectionProps = {
  name: string;
  email: string;
};
const LoginSection = (props: LoginSectionProps) => {
  const { setCurrentToken } = useContext(UserContext);
  const { setLoading } = useContext(ScreenContext);

  const onDeleteToken = async () => {
    setLoading(true);
    AsyncStorage.clear()
      .then(() => {
        setLoading(false);
        Alert.alert("Success", "Cleared token from device");
      })
      .catch((error: Error) => {
        setLoading(false);
        Alert.alert("Error", "Token has already been deleted");
      });
  };

  const onClickLogin = () => {
    // Input checks. We can do more here (such as regex
    // expressions or external libraries). For now, we'll
    // just have empty checks.
    if (props.name === "" || props.email === "") {
      Alert.alert("Input error", "Make sure all fields are visible");
      return;
    }
    setLoading(true);
    login(props.name, props.email)
      .then((token: Token) => {
        setLoading(false);
        setCurrentToken(token);
      })
      .catch((error: Error) => {
        setLoading(false);
        displayError(error);
      });
  };
  
  return (
    <View>
      <TouchableOpacity onPress={onClickLogin} style={styles.buttonContainer}>
        <Text style={styles.buttonText}>Login</Text>
      </TouchableOpacity>
      <TouchableOpacity onPress={onDeleteToken}>
        <Text style={styles.deleteTokenText}>
          Delete storage token (demonstration)
        </Text>
      </TouchableOpacity>
    </View>
  );
};

export default LoginSection;

const styles = StyleSheet.create({
  buttonContainer: {
    alignSelf: "center",
    backgroundColor: COLORS.button,
    paddingVertical: 15,
    paddingHorizontal: 50,
    borderRadius: 8,
  },
  buttonText: {
    color: "white",
    fontSize: 30,
  },
  deleteTokenText: {
    marginTop: 10,
    textAlign: "center",
  },
});
