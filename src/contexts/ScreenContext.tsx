/* 
ScreenContext.tsx

This file allows us to load the screen whenever we need to from other
components. It also loads the app when the user context is fully
loaded. See UserContext.tsx for more information.
*/

import React, { useState, useEffect, createContext, useContext } from "react";
import ProgressLoader from "rn-progress-loader";
import { ActivityIndicator, SafeAreaView, View, Text } from "react-native";
import { COLORS } from "../constants/constants";
import * as Font from "expo-font";
import { CustomFonts } from "../../assets/fonts";
import { displayError } from "../helpers/helpers";

type ScreenContextType = {
  setLoading: React.Dispatch<React.SetStateAction<boolean>>;
};
export const ScreenContext = createContext<ScreenContextType>({
  setLoading: null,
});

export const ScreenProvider = ({ children }) => {
  const [loading, setLoading] = useState(false);

  const [assetsLoaded, setAssetsLoaded] = useState(false);

  const loadAssets = async () => {
    console.log("Loading assets");
    await Font.loadAsync(CustomFonts)
      .then(() => {
        console.log("Successfully loaded assets.");
        setAssetsLoaded(true);
      })
      .catch((error: Error) => displayError(error));
  };

  useEffect(() => {
    loadAssets();
  }, []);
  return (
    <ScreenContext.Provider value={{ setLoading }}>
      {assetsLoaded ? (
        <>
          <ProgressLoader
            visible={loading}
            isModal={true}
            isHUD={true}
            hudColor={"#000000"}
            color={"#FFFFFF"}
          />

          {children}
        </>
      ) : (
        <View
          style={{
            flex: 1,
            backgroundColor: COLORS.background,
            alignItems: "center",
            justifyContent: "center",
          }}
        ></View>
      )}
    </ScreenContext.Provider>
  );
};
