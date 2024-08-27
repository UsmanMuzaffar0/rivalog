import React, { useEffect } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  Image,
  Dimensions,
  Platform,
} from "react-native";
import { useNavigation } from "@react-navigation/native";

import {
  createStackNavigator,
  TransitionPresets,
} from "@react-navigation/stack";
import AsyncStorage from "@react-native-async-storage/async-storage";
import Login from "../components/Auth/Login";
import Registration from "../components/Auth/Registration";
import ForgotPassword from "../components/Auth/ForgotPassword";
import ResetPassword from "../components/Auth/ResetPassword";
import ElectCompanyType from "../components/Auth/ElectCompanyType";
import * as colors from "../common/colors";
import { Style } from "../common/Style";
import { RFPercentage } from "react-native-responsive-fontsize";
import StringsOfLanguages from "../Localization/stringsoflanguages";
import CreateNewPassword from "../components/Auth/CreateNewPassword";

const Stack = createStackNavigator();
export const { width, height } = Dimensions.get("window");

const TransitionScreenOptions = {
  ...TransitionPresets.SlideFromRightIOS, // This is where the transition happens
  headerShown: false,
};

function CustomStackNavigationHeader(HeaderName, router = "", header = true) {
  const navigation = useNavigation();

  return {
    headerShown: header,
    headerTitle: () => (
      <View>
        <Text style={[Style.HeaderTitleTxt, { textAlign: "center" }]}>
          {HeaderName}
        </Text>
      </View>
    ),
    headerTitleAlign: "center",
    headerLeft: () => (
      <View>
        <TouchableOpacity
          onPress={() =>
            router != "" ? navigation.navigate(router) : navigation.goBack()
          }
          style={Style.HeaderImageView}
        >
          {/*Donute Button Image */}
          <Image
            source={require("../assets/images/icn_back.png")}
            style={Style.DrawerMenuImage}
          />
        </TouchableOpacity>
      </View>
    ),
    headerStyle: {
      backgroundColor: colors.White, //Set Header color
      borderBottomColor: "transparent",
      borderBottomWidth: 0,
      height: Platform.OS == "ios" ? RFPercentage(15) : RFPercentage(12),
      // shadowOffset: {
      //     height: 0,
      // },
      shadowColor: "transparent",
      elevation: 0,
    },
    headerHideShadow: true,
    headerRight: () => null,
  };
}

function AuthNavigator() {
  let LangStr = StringsOfLanguages;
  useEffect(() => {
    (async () => {
      let language = await AsyncStorage.getItem("SelectedLanguage");
      if (language) StringsOfLanguages.setLanguage(JSON.parse(language));
      LangStr = StringsOfLanguages;
    })();
  }, []);

  return (
    <View style={{ flex: 1 }}>
      <Stack.Navigator screenOptions={TransitionScreenOptions}>
        <Stack.Screen name="Login" component={Login} />
        <Stack.Screen
          name="Registration"
          component={Registration}
          options={{
            ...CustomStackNavigationHeader(LangStr.SignUP, ""),
            headerShown: false,
          }}
        />
        <Stack.Screen
          name="ForgotPassword"
          component={ForgotPassword}
          options={{
            ...CustomStackNavigationHeader(LangStr.ForgotPasswordTitle, ""),
            headerShown: false,
          }}
        />
        <Stack.Screen
          name="ResetPassword"
          component={ResetPassword}
          options={{
            ...CustomStackNavigationHeader(
              LangStr.ResetPasswordTitle,
              "",
              false
            ),
          }}
        />
        <Stack.Screen
          name="CreateNewPassword"
          component={CreateNewPassword}
          options={{
            ...CustomStackNavigationHeader("CreateNewPassword", "", false),
          }}
        />
        <Stack.Screen
          name="ElectCompanyType"
          component={ElectCompanyType}
          options={{
            ...CustomStackNavigationHeader(LangStr.CompanyTypeTitle, ""),
            headerShown: false,
          }}
        />
      </Stack.Navigator>
    </View>
  );
}

export default AuthNavigator;
