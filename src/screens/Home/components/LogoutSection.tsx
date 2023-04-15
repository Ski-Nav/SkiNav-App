import { Alert, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import React, { useContext } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { ScreenContext } from "../../../contexts/ScreenContext";
import { UserContext } from "../../../contexts/UserContext";
import { displayError } from "../../../helpers/helpers";
import { logout } from "../../../services/AuthService";
import { COLORS } from "../../../constants/constants";

const LogoutSection = () => {
  const { currentToken, setCurrentToken } = useContext(UserContext);
  const { setLoading } = useContext(ScreenContext);
  const onDeleteToken = async () => {
    setLoading(true);
    AsyncStorage.clear()
      .then(() => {
        setLoading(false);
        setCurrentToken(undefined);
        Alert.alert("Success", "Cleared token from device");
      })
      .catch((error: Error) => {
        setLoading(false);
        Alert.alert("Error", "Token has already been deleted");
      });
  };

  const onClickLogout = () => {
    setLoading(true);
    logout()
      .then(() => {
        setLoading(false);
        setCurrentToken(undefined);
      })
      .catch((error: Error) => {
        setLoading(false);
        displayError(error);
      });
  };
  return (
    <View>
      <TouchableOpacity onPress={onClickLogout} style={styles.buttonContainer}>
        <Text style={styles.buttonText}>Logout</Text>
      </TouchableOpacity>
      <TouchableOpacity onPress={onDeleteToken}>
        <Text style={styles.deleteTokenText}>
          Delete storage token (demonstration)
        </Text>
      </TouchableOpacity>
    </View>
  );
};

export default LogoutSection;

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
