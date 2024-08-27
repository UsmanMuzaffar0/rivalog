import {
  OpenOptimizationSettings,
  BatteryOptEnabled,
  RequestDisableOptimization,
} from "react-native-battery-optimization-check";
import { Alert, Platform } from "react-native";
import StringsOfLanguages from "../../Localization/stringsoflanguages";

// returns promise<void>
export const RequestOptimizationCheck = async () => {
  const isAndroid = Platform.OS === "android";
  const androidVer = Platform.Version;

  let isOptEnabled = false;

  BatteryOptEnabled()
    .then((isEnabled) => {
      if (isEnabled) {
        isOptEnabled = true;
        console.log("BatteryOptEnabled=========+>", isEnabled);

        if (androidVer >= 23)
          Alert.alert(
            `${StringsOfLanguages.Information}`,
            `${StringsOfLanguages.BatteryAlertString}`,
            [
              {
                text: `${StringsOfLanguages.Ok}`,
                onPress: () =>
                  // if battery optimization is enabled, request to disable it.

                  RequestDisableOptimization(),
                // : OpenOptimizationSettings(),
              },
            ]
          );
        else {
          // open settings
        }
      }
    })
    .catch((e) => {
      console.log("BatteryOptEnabledError=========+>", e);
    });

  return isOptEnabled;
};

// returns promise<void>
export const checkBatteryOptimization = async () => {
  let isOptEnabled = false;

  await BatteryOptEnabled().then((isEnabled) => {
    if (isEnabled) {
      isOptEnabled = true;
    }
  });

  return isOptEnabled;
};
