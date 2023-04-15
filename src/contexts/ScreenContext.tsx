/* 
ScreenContext.tsx

This file allows us to load the screen whenever we need to from other
components. It also loads the app when the user context is fully
loaded. See UserContext.tsx for more information.
*/

import React, { useState, useEffect, createContext, useContext } from "react";
import ProgressLoader from "rn-progress-loader";
import { ActivityIndicator, SafeAreaView, View, Text } from "react-native";
import { UserContext } from "./UserContext";
import { COLORS } from "../constants/constants";

type ScreenContextType = {
  setLoading: React.Dispatch<React.SetStateAction<boolean>>;
};
export const ScreenContext = createContext<ScreenContextType>({
  setLoading: null,
});

export const ScreenProvider = ({ children }) => {
  const [loading, setLoading] = useState(false);
  const { isUserContextLoaded } = useContext(UserContext);

  return (
    <ScreenContext.Provider value={{ setLoading }}>
      {isUserContextLoaded ? (
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
        <SafeAreaView
          style={{
            flex: 1,
            alignItems: "center",
            justifyContent: "center",
            backgroundColor: COLORS.background
          }}
        >
          <ActivityIndicator size="small" />
        </SafeAreaView>
      )}
    </ScreenContext.Provider>
  );
};
