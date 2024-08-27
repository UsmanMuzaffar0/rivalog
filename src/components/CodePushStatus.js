import React, { useEffect } from "react";
import { View, Text, StyleSheet, Image } from "react-native";
import { ActivityIndicator, ProgressBar } from "react-native-paper";
import { useCodePush } from "../common/Component/CodePushProvider";
import * as colors from "../common/colors";
import { TextLarge, TextMed } from "../common/Component/Text";
import { GapV } from "../common/Component/gap";
import { RFPercentage } from "react-native-responsive-fontsize";

const CodePushStatus = (props) => {
  const { progress: codePushProgress, status: codePushStatus } = useCodePush();
  return (
    <View style={styles.container}>
      <Image
        source={require("../assets/images/logo.png")}
        style={{ height: RFPercentage(37), width: RFPercentage(37) }}
        resizeMode="contain"
      />
      <GapV />
      <TextLarge>{"New Update is available"}</TextLarge>
      <GapV small />
      <TextMed>{`Downloading Update`}</TextMed>
      <ProgressBar
        progress={codePushProgress}
        style={styles.progress}
        color={colors.BlueHaze}
      />
      <GapV />

      {/* <ActivityIndicator size={"large"} /> */}
    </View>
  );
};

export default CodePushStatus;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.TransperantBlack,
    alignItems: "center",
    justifyContent: "center",
  },

  progress: {
    height: RFPercentage(2),
    width: RFPercentage(40),
    borderRadius: RFPercentage(1),
  },
});
