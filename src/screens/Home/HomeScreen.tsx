import {
  ActivityIndicator,
  Alert,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import React, { useContext, useEffect, useState } from "react";
import MobileSafeView from "../../components/MobileSafeView";
import { COLORS, FONTS, Resort, SCREENS } from "../../constants/constants";
import CustomDropdown from "../../components/styled/CustomDropdown/CustomDropdown";
import { getAllResorts } from "../../services/ResortService";
import { ResortContext } from "../../contexts/ResortContext";
import { useNavigation } from "@react-navigation/native";

const HomeScreen = () => {
  const [pulledResorts, setPulledResorts] = useState<Resort[]>();
  const [selectedResort, setSelectedResort] = useState<Resort>();

  const { currentResort, setCurrentResort } = useContext(ResortContext);

  const navigation = useNavigation<any>();

  const fetchData = () => {
    getAllResorts().then((resorts) => {
      setPulledResorts(resorts);
    });
  };

  const onPressStart = () => {
    if (!selectedResort) {
      Alert.alert("Error", "Please select a valid resort")
      return;
    }
    if(selectedResort && !currentResort){
      Alert.alert("FATAL ERROR", "Current Resort context is not updated. Please report this!")
      return;
    }

    navigation.navigate(SCREENS.NavigationScreen);
  };

  useEffect(() => {
    fetchData();
  }, []);

  useEffect(() => {
    setCurrentResort(selectedResort);
  }, [selectedResort]);

  return (
    <MobileSafeView style={styles.container}>
      <Text style={{ textAlign: "center" }}>
        <Text style={styles.titleSki}>Ski</Text>
        <Text style={styles.titleNav}>Nav</Text>
      </Text>
      <Text style={styles.subtitle}>Ski more. Stop less.</Text>
      <View style={styles.dropdownContainer}>
        {pulledResorts ? (
          <CustomDropdown
            displayProperty={"Name"}
            setSelectedData={setSelectedResort}
            data={pulledResorts}
            defaultText={"Select a Resort"}
          />
        ) : (
          <ActivityIndicator />
        )}
      </View>
      <View style={styles.startButtonContainer}>
        <TouchableOpacity onPress={onPressStart} style={styles.startButton}>
          <Text style={styles.startButtonText}>Start</Text>
        </TouchableOpacity>
      </View>
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
    paddingHorizontal: 30,
  },
  titleSki: {
    color: COLORS.white,
    fontFamily: FONTS.Bold,
    fontSize: 60,
  },
  titleNav: {
    color: COLORS.lightBlue,
    fontFamily: FONTS.Bold,
    fontSize: 60,
  },
  subtitle: {
    color: COLORS.gray,
    fontFamily: FONTS.Medium,
    fontSize: 25,
  },
  dropdownContainer: {
    height: 200,
    justifyContent: "center",
    alignItems: "center",
  },
  startButtonContainer: {
    marginTop: 60,
  },
  startButton: {
    backgroundColor: COLORS.blue,
    borderRadius: 15,
  },
  startButtonText: {
    color: COLORS.white,
    fontFamily: FONTS.Bold,
    fontSize: 30,
    marginVertical: 5,
    marginHorizontal: 30
  },
});
