import { Platform, StyleSheet, Text, View, StatusBar, ViewStyle } from "react-native";
import React from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import { COLORS, SIZES } from "../constants/constants";

type MobileSafeViewProps = {
  children;
  style?: ViewStyle;
  isBottomViewable?: boolean;
  isTopViewable?: boolean;
  isTopAndBottomNotViewable?: boolean
};
const MobileSafeView = (props: MobileSafeViewProps) => {
   // isTopAndBottomNotViewable is a hacky fix for scrollviews
  if (props.isTopAndBottomNotViewable || props.isBottomViewable || props.isTopViewable) {
    return (
      <View style={[props.style, styles.container]}>
        {!props.isTopViewable && (
          <View style={[styles.topBarContainer]} />
        )}
        <View style={[styles.container]}>{props.children}</View>
        {!props.isBottomViewable && (
          <View style={[styles.bottomBarContainer]} />
        )}
      </View>
    );
  }
  return (
    <SafeAreaView style={[props.style, styles.container]}>
      {props.children}
    </SafeAreaView>
  );
};

export default MobileSafeView;

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  topBarContainer: {
    width: "100%",
    height: SIZES.topBarHeight,
  },
  bottomBarContainer: {
    width: "100%",
    height: SIZES.bottomBarHeight,
  },
  tabBarContainer: {
    width: "100%",
    height: SIZES.tabBarHeight - SIZES.bottomBarHeight,
  }
});