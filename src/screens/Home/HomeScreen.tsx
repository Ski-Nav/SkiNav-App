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
import {
  COLORS,
  FONTS,
  Resort,
  SCREENS,
  SIZES,
} from "../../constants/constants";
import CustomDropdown from "../../components/styled/CustomDropdown/CustomDropdown";
import { getAllResorts } from "../../services/ResortService";
import { ResortContext } from "../../contexts/ResortContext";
import { useNavigation } from "@react-navigation/native";
import { displayError } from "../../helpers/helpers";
import { MaterialIcons } from "@expo/vector-icons";

const HomeScreen = () => {
  const [pulledResorts, setPulledResorts] = useState<Resort[]>();
  const [selectedResort, setSelectedResort] = useState<Resort>();
  const [didPullResorts, setDidPullResorts] = useState(false);

  const { currentResort, setCurrentResort } = useContext(ResortContext);

  const navigation = useNavigation<any>();

  const fetchResorts = () => {
    setDidPullResorts(false);
    getAllResorts()
      .then((resorts) => {
        setPulledResorts(resorts);
        setDidPullResorts(true);
      })
      .catch((error: Error) => {
        displayError(error);
        setDidPullResorts(true);
      });
  };

  const onPressStart = () => {
    if (!selectedResort) {
      Alert.alert("Error", "Please select a valid resort");
      return;
    }
    if (selectedResort && !currentResort) {
      Alert.alert(
        "FATAL ERROR",
        "Current Resort context is not updated. Please report this!"
      );
      return;
    }

    navigation.navigate(SCREENS.NavigationScreen);
  };

  useEffect(() => {
    fetchResorts();
  }, []);

  useEffect(() => {
    setCurrentResort(selectedResort);
  }, [selectedResort]);

  return (
    <MobileSafeView style={styles.container}>
      <View style={{ flex: 2, justifyContent: "center" }}>
        <Text style={{ textAlign: "center" }}>
          <Text style={styles.titleSki}>Ski</Text>
          <Text style={styles.titleNav}>Nav</Text>
        </Text>

        <Text style={styles.subtitle}>Ski more. Stop less.</Text>
        <View style={styles.dropdownContainer}>
          {didPullResorts ? (
            pulledResorts ? (
              <CustomDropdown
                displayProperty={"Name"}
                setSelectedData={setSelectedResort}
                data={pulledResorts}
                defaultText={"Select a Resort"}
              />
            ) : (
              <>
                <MaterialIcons
                  onPress={fetchResorts}
                  name="refresh"
                  size={30}
                  color="white"
                  style={{ alignSelf: "center" }}
                />
              </>
            )
          ) : (
            <ActivityIndicator />
          )}
        </View>
      </View>

      <View style={styles.startButtonContainer}>
        <TouchableOpacity
          disabled={selectedResort == undefined || selectedResort == null}
          onPress={onPressStart}
          style={{ ...styles.startButton, opacity: selectedResort ? 1 : 0 }}
        >
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
    textAlign: "center",
    fontSize: 25,
  },
  dropdownContainer: {
    marginTop: 80,
    width: "100%",
    alignItems: "center",
  },
  startButtonContainer: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
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
    marginHorizontal: 30,
  },
});
