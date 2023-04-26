import { StyleSheet, Text, Keyboard, TextInput, View, TouchableWithoutFeedback } from "react-native";
import React, { useContext, useEffect, useState } from "react";
import MapView from "react-native-maps";
import { COLORS, FONTS, ResortMap, SIZES } from "../../constants/constants";
import { ScreenContext } from "../../contexts/ScreenContext";
import { getResortMap } from "../../services/ResortService";
import { ResortContext } from "../../contexts/ResortContext";
import { displayError } from "../../helpers/helpers";
import { SafeAreaView } from "react-native-safe-area-context";

const NavigationScreen = () => {
  const [currentMap, setCurrentMap] = useState<ResortMap>();
  const { setLoading } = useContext(ScreenContext);
  const [isRouting, setIsRouting] = useState(false);

  const { currentResort } = useContext(ResortContext);

  const fetchMap = () => {
    getResortMap(currentResort)
      .then((map) => {
        setCurrentMap(map);
        setLoading(false);
      })
      .catch((error: Error) => {
        displayError(error);
        setLoading(false);
      });
  };
  useEffect(() => {
    // On initial render, it will try to get the ski resort information
    setLoading(true);
    fetchMap();
  }, []);
  return (
    <TouchableWithoutFeedback onPress={Keyboard.dismiss} accessible={false}>
      <View style={styles.container}>
        <View style={styles.locationSearchContainer}>
          <TextInput
            style={styles.locationSearchInput}
            placeholderTextColor={COLORS.gray}
            placeholder={"From..."}
          ></TextInput>
          <TextInput
            style={styles.locationSearchInput}
            placeholderTextColor={COLORS.gray}
            placeholder={"To..."}
          ></TextInput>
        </View>
        <MapView
          followsUserLocation={true}
          showsUserLocation={true}
          style={styles.map}
        />
      </View>
    </TouchableWithoutFeedback>
  );
};

export default NavigationScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  map: {
    width: "100%",
    height: "100%",
  },
  locationSearchContainer: {
    position: "absolute",
    top: SIZES.topBarHeight + 10,
    zIndex: 10,
    left: 30,
    right: 30,
  },
  locationSearchInput: {
    backgroundColor: COLORS.white,
    paddingHorizontal: 15,
    paddingVertical: 13,
    borderRadius: 20,
    fontFamily: FONTS.Medium,
    width: "100%",
    fontSize: 17,
    marginTop: 20,
    shadowColor: COLORS.black,
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 1,
    shadowRadius: 3.84,
    elevation: 5,
  }
});
