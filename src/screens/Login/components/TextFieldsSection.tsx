import { StyleSheet, Text, TextInput, View } from "react-native";
import React from "react";
import { SIZES } from "../../../constants/constants";

type TextFieldsSectionProps = {
    setName: React.Dispatch<React.SetStateAction<string>>,
    setEmail: React.Dispatch<React.SetStateAction<string>>
}
const TextFieldsSection = (props: TextFieldsSectionProps) => {
  return (
    <View>
      <Text style={styles.textInputTitle}>Name</Text>
      <TextInput style={styles.textInputContainer} onChangeText={props.setName} />
      <Text style={styles.textInputTitle}>Email</Text>
      <TextInput style={styles.textInputContainer} onChangeText={props.setEmail} />
    </View>
  );
};

export default TextFieldsSection;

const styles = StyleSheet.create({textInputTitle: {
    fontSize: 26,
    paddingLeft: 10,
    marginTop: 20,
  },
  textInputContainer: {
    width: SIZES.width - 100,
    borderColor: "black",
    borderWidth: 2,
    borderRadius: 7,
    fontSize: 25,
    backgroundColor: "white",
    paddingVertical: 8,
    paddingHorizontal: 10,
    marginTop: 10,
  },});
