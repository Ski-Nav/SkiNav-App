import { ScrollView, StyleSheet, Text, View } from "react-native";
import React, { useContext } from "react";
import { UserContext } from "../../../contexts/UserContext";
import { COLORS } from "../../../constants/constants";
import moment from "moment";

const DescriptionSection = () => {
  const { currentToken, setCurrentToken } = useContext(UserContext);

  return (
    <View>
      <Text style={styles.description}>
        Hello {currentToken.User.Name}, you have logged in{" "}
        {currentToken.Logins.length} time
        {currentToken.Logins.length !== 1 && <Text>s</Text>}.
      </Text>
      <ScrollView
        style={styles.scrollviewContainer}
        contentContainerStyle={styles.scrollviewContent}
        showsVerticalScrollIndicator={true}
        indicatorStyle="black"
      >
        {currentToken &&
          currentToken.Logins.map((date) => (
            <View
              style={styles.loginContainer}
              key={"Login " + date.toString()}
            >
              <Text style={styles.loginText}>
                Logged in at: {moment(date).format('MMMM Do YYYY, h:mm:ss a')}
              </Text>
            </View>
          ))}
      </ScrollView>
    </View>
  );
};

export default DescriptionSection;

const styles = StyleSheet.create({
  description: {
    fontSize: 26,
    marginTop: 20,
    marginBottom: 10,
  },
  scrollviewContainer: {
    borderWidth: 2,
    borderColor: "black",
    backgroundColor: "white",
  },
  scrollviewContent: {
    alignItems: "center",
    paddingHorizontal: 20,
  },
  loginContainer: {
    borderRadius: 90,
    borderWidth: 2,
    borderColor: "black",
    backgroundColor: COLORS.login,
    width: "100%",
    paddingHorizontal: 25,
    paddingVertical: 5,
    marginVertical: 10,
    justifyContent: "center",
  },
  loginText: {
    fontSize: 17,
  },
});
