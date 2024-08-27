import React, { useEffect } from "react";
import { LogBox } from "react-native";
import CodePush, { SyncStatusChangedCallback } from "react-native-code-push";
import Router from "./src/navigation/Router";
import { Provider } from "react-redux";
import reducers from "./src/Redux/reducers";
import { createStore, applyMiddleware } from "redux";
import createSagaMiddleware from "redux-saga";
import rootSaga from "./src/Redux/saga";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import CodePushProvider from "./src/common/Component/CodePushProvider";
import { Provider as PaperProvider } from "react-native-paper";
import FlashMessage from "react-native-flash-message";
import { paperLightTheme } from "./src/common/freightColor";
import { exitOnStatusCode } from "./src/Redux/middlewares/exitMiddleware";
import messaging from "@react-native-firebase/messaging";
import DeviceLanguage from "./src/common/Component/DeviceLanguage";
import AsyncStorage from "@react-native-async-storage/async-storage";
import StringsOfLanguages from "./src/Localization/stringsoflanguages";

LogBox.ignoreLogs(["Animated: `useNativeDriver`"]);
const sagaMiddleware = createSagaMiddleware();
const customMiddleware = [exitOnStatusCode, sagaMiddleware];
const store = createStore(reducers, applyMiddleware(...customMiddleware));
sagaMiddleware.run(rootSaga);

let CodePushOptions = {
  checkFrequency: CodePush.CheckFrequency.ON_APP_START,
  mandatoryInstallMode: CodePush.InstallMode.IMMEDIATE,
  updateDialog: {
    appendReleaseDescription: true,
    title: "A new update is available",
  },
};

//
messaging()
  .getToken()
  .then((deviceToken) => {
    console.log(deviceToken, "deviceToken");
  });

let App = () => {
  
  useEffect(async () => {
    const setLang = async (langCode) => {
      await AsyncStorage.setItem("SelectedLanguage", langCode);
      StringsOfLanguages.setLanguage(langCode);
    };
    // Check if language is stored in AsyncStorage
    AsyncStorage.getItem("SelectedLanguage").then(async (selectedLanguage) => {
      if (!selectedLanguage) {
        // If not stored, get the device's local language
        const deviceLanguage = await DeviceLanguage();
        if (
          ["en", "ru", "ar", "tr", "it", "gr"].includes(
            deviceLanguage.toLowerCase()
          )
        ) {
          setLang(deviceLanguage.toLowerCase());
        } else {
          setLang("en"); // Default to English if not a supported language
        }
      }
    });
  }, []);
  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <Provider store={store}>
        <PaperProvider theme={paperLightTheme}>
          <CodePushProvider>
            <Router />
          </CodePushProvider>
        </PaperProvider>
      </Provider>
      <FlashMessage position="center" />
    </GestureHandlerRootView>
  );
};

App = CodePush(CodePushOptions)(App);

export default App;