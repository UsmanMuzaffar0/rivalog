import React from "react";
import { SafeAreaView } from "react-native";
import { View, StatusBar, Text } from "react-native";
import * as colors from "../../../common/colors";

const ActionBtn = () => {
  return (
    <View
      style={{ flex: 1, backgroundColor: "white", justifyContent: "center" }}
    >
      <SafeAreaView>
        <StatusBar
          translucent
          backgroundColor={colors.WhiteSmoke}
          barStyle={"dark-content"}
        />
      </SafeAreaView>
    </View>
  );
};

export default ActionBtn;
