import React, { useEffect } from "react";
import { View, I18nManager, Linking } from "react-native";
import { NavigationContainer, DefaultTheme } from "@react-navigation/native";
// import { createNativeStackNavigator } from '@react-navigation/native-stack';
import {
  createStackNavigator,
  TransitionPresets,
} from "@react-navigation/stack";
import Welcome from "../components/Welcome";
import CodePushStatus from "../components/CodePushStatus";
import AuthNavigator from "./AuthNavigator";
import AppNavigator from "./AppNavigator";
import { AuthContext } from "./AuthContext";
import AsyncStorage from "@react-native-async-storage/async-storage";
import * as colors from "../common/colors";
import Stringsoflanguages from "../Localization/stringsoflanguages";
import rtlDetect from "rtl-detect";
import RNRestart from "react-native-restart";
import * as RootNavigation from "./NavigationRef";
import { useCodePush } from "../common/Component/CodePushProvider";
import { initGeocoding } from "../common/Utils/geocoding";
import { resetRedux, SaveDeviceTokenAction } from "../Redux/actions";
import { useDispatch } from "react-redux";
import { showFailure } from "../common/Utils/flashMessage";
import messaging from "@react-native-firebase/messaging";

export let authCtx;

const Stack = createStackNavigator();
const TransitionScreenOptions = {
  ...TransitionPresets.SlideFromRightIOS, // This is where the transition happens
  headerShown: false,
  // animationEnabled: false
};
const Router = () => {
  const [getstarted, setGetstarted] = React.useState(true);
  const [Token, setToken] = React.useState("");
  const { status: codePushStatus } = useCodePush();
  const dispatch = useDispatch();

  const authContext = React.useMemo(
    () => ({
      signIn: async (
        token,
        SelectedLanguageCode,
        googleApiKey,
        user,
        company
      ) => {
        if (SelectedLanguageCode != null) {
          console.log("SelectedLanguageCode", SelectedLanguageCode);
          const AppLanguage = await AsyncStorage.getItem("SelectedLanguage");
          if (
            SelectedLanguageCode?.toLowerCase() != AppLanguage?.toLowerCase()
          ) {
            // await AsyncStorage.setItem(
            //   "SelectedLanguage",
            //   SelectedLanguageCode
            // );
            Stringsoflanguages.setLanguage(SelectedLanguageCode);
            var isRTLLanguage = rtlDetect.isRtlLang(SelectedLanguageCode);
            if (isRTLLanguage && !I18nManager.isRTL) {
              I18nManager.forceRTL(true);
              RNRestart.Restart();
            } else if (!isRTLLanguage && I18nManager.isRTL) {
              I18nManager.forceRTL(false);
              RNRestart.Restart();
            }
          }
        }
        if (googleApiKey) {
          await AsyncStorage.setItem("GoogleApiKey", googleApiKey);
          initGeocoding(googleApiKey);
        }
        await AsyncStorage.setItem("AccessToken", token);
        if (user) await AsyncStorage.setItem("User", JSON.stringify(user));
        if (user && token) {
          messaging()
            .getToken()
            .then((deviceToken) => {
              dispatch(SaveDeviceTokenAction({ token: deviceToken }));
            });
        }
        if (company) {
          AsyncStorage.setItem(
            "COMPANY_TYPE",
            JSON.stringify(company?.companyType?.companyTypeId)
          );
        }
        setToken(token);
      },
      completeSplash: async () => {
        setGetstarted(false);
      },
      setToken: async (token, googleApiKey) => {
        try {
          await AsyncStorage.setItem("AccessToken", token);
        } catch {}
        // console.log("contexttoken", token, "googleApiKey", googleApiKey);
        setToken(token);
        if (googleApiKey) initGeocoding(googleApiKey);
      },

      signOut: async () => {
        try {
          setToken("");
          dispatch(resetRedux());

          // await AsyncStorage.removeItem("SelectedLanguage");
          await AsyncStorage.removeItem("AccessToken");
          await AsyncStorage.removeItem("GoogleApiKey");
          await AsyncStorage.removeItem("User");
          await AsyncStorage.removeItem("COMPANY_TYPE");

          // CARRIER_OPERATOR
        } catch (e) {}
      },
    }),
    []
  );

  const ironetsTheme = {
    ...DefaultTheme,
    colors: {
      ...DefaultTheme.colors,
      background: colors.White,
    },
  };

  const config = {
    screens: {
      // DrawerNavigator: {
      //   screens:{
      //     DrawerStackNavigator:{
      //       screens:{
      CreateNewPassword: {
        path: "/set-password",
      },
      //       }
      //     }
      //   }
      // },
    },
  };
  const linking = {
    prefixes: ["rivalog://", "https://www.rivalog.com"],
    config,
  };

  useEffect(() => {
    const getUrl = async () => {
      const intialUrl = await Linking.getInitialURL();
      // console.log(
      //   "intialUrl==>>>",
      //   intialUrl,
      //   intialUrl?.includes("set-password")
      // );
      // AsyncStorage.setItem("SECRETKEY", intialUrl);

      if (intialUrl === null) {
        return;
      }

      // if (intialUrl.includes('set-password')) {
      //   alert(intialUrl)
      //   RootNavigation.navigate('CreateNewPassword')
      // }
    };

    getUrl();
  }, []);

  authCtx = authContext;

  return (
    <View style={{ flex: 1 }}>
      <AuthContext.Provider value={authContext}>
        <NavigationContainer
          linking={linking}
          theme={ironetsTheme}
          ref={RootNavigation.navigationRef}
        >
          {/* code push check status 2=downloading, 3=installing, 7=ongoingSync */}
          {codePushStatus === 2 ||
          codePushStatus === 3 ||
          codePushStatus === 7 ? (
            <Stack.Navigator screenOptions={TransitionScreenOptions}>
              <Stack.Screen name="CodePushStatus" component={CodePushStatus} />
            </Stack.Navigator>
          ) : getstarted ? (
            <Stack.Navigator screenOptions={TransitionScreenOptions}>
              <Stack.Screen name="Welcome" component={Welcome} />
            </Stack.Navigator>
          ) : Token == "" || Token == undefined || Token == null ? (
            <AuthNavigator />
          ) : (
            <AppNavigator />
          )}
        </NavigationContainer>
      </AuthContext.Provider>
    </View>
  );
};

export default Router;
