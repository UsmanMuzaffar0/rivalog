import React, { useEffect } from "react";
import { View, Text, StatusBar, Image } from "react-native";
import * as colors from "../common/colors";

import { AuthContext } from "../navigation/AuthContext";
import AsyncStorage from "@react-native-async-storage/async-storage";

import { Style } from "../common/Style";
import StringsOfLanguages from "../Localization/stringsoflanguages";
import { RFPercentage } from "react-native-responsive-fontsize";

const Welcome = (props) => {
  const { completeSplash, setToken } = React.useContext(AuthContext);

  useEffect(() => {
    (async () => {
      let SelectedLanguage = await AsyncStorage.getItem("SelectedLanguage");
      if (SelectedLanguage == null) {
        StringsOfLanguages.setLanguage("en");
        // AsyncStorage.setItem("SelectedLanguage", "en");
      }
      let googleApiKey = await AsyncStorage.getItem("GoogleApiKey");
      if (googleApiKey)
        await AsyncStorage.setItem("GoogleApiKey", googleApiKey);

      const accesstoken = await AsyncStorage.getItem("AccessToken");
      setToken(accesstoken, googleApiKey);
      setTimeout(async () => {
        completeSplash();
      }, 1000);
    })();
  }, []);

  return (
    <View style={Style.SplashScreenView}>
      <StatusBar
        translucent
        backgroundColor={colors.WhiteSmoke}
        barStyle={"dark-content"}
        hidden={false}
      />
      <Image
        source={require("../assets/images/logo.png")}
        style={{ height: RFPercentage(37), width: RFPercentage(37) }}
        resizeMode="contain"
      />
      {/* <Text style={Style.SplashScreenTitle}>Rivalog</Text> */}
    </View>
  );
};

export default Welcome;
