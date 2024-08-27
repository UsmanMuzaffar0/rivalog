import React from "react";
import {
  View,
  ActivityIndicator,
  Dimensions,
  StatusBar,
  Platform,
} from "react-native";
import * as colors from "../colors";
const { width, height } = Dimensions.get("window");
const Loader = ({ visible }) => {
  return visible ? (
    <View
      style={{
        position: "absolute",
        height: Platform.OS == "ios" ? height : "100%",
        width: width,
        flex: 1,
        zIndex: 99,
      }}
    >
      {/* <StatusBar
                    // translucent
                    backgroundColor={colors.TransperantBlack}
                    barStyle={'dark-content'}
                /> */}
      <ActivityIndicator
        size={"large"}
        visible={visible}
        style={{
          position: "absolute",
          backgroundColor: colors.TransperantBlack,
          left: 0,
          right: 0,
          top: 0,
          bottom: 0,
          alignItems: "center",
          justifyContent: "center",
        }}
        color={colors.LimeGreen}
      />
    </View>
  ) : null;
};

export default Loader;
