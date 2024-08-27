import { Alert, Linking, PermissionsAndroid, Platform } from "react-native";
import { check, PERMISSIONS, RESULTS, request } from "react-native-permissions";
import StringsOfLanguages from "../../Localization/stringsoflanguages";

export const LocationPermission = async () => {
  let returnResponse = false;

  if (Platform.OS == "android") {
    await PermissionsAndroid.check(
      "android.permission.ACCESS_FINE_LOCATION"
    ).then(async (response) => {
      if (response === true) {
        if (Platform.Version >= 29) {
          await PermissionsAndroid.check(
            "android.permission.ACCESS_BACKGROUND_LOCATION"
          ).then(async (response) => {
            if (response === true) {
              returnResponse = true;
            } else if (response === false) {
              await request(PERMISSIONS.ANDROID.ACCESS_BACKGROUND_LOCATION)
                .then((result) => {
                  switch (result) {
                    case RESULTS.UNAVAILABLE:
                      // alert('This feature is not available (on this device / in this context)');
                      break;
                    case RESULTS.DENIED:
                      Alert.alert("The location permission  is denied.");
                      break;
                    case RESULTS.LIMITED:
                      Alert.alert(
                        "The permission is limited: Location tracking may not work smoothly"
                      );
                      break;
                    case RESULTS.GRANTED:
                      returnResponse = true;
                      break;
                    case RESULTS.BLOCKED:
                      Alert.alert(
                        "Hold on!",
                        "We are not able to track your route because you didn't give permission to access your location. For further process you need to enable location permission from setting.",
                        [
                          {
                            text: "Setting",
                            onPress: () => Linking.openSettings(),
                          },
                        ]
                      );
                      returnResponse = false;

                      break;
                  }
                })
                .catch((e) => {
                  console.log(
                    "PERMISSIONS.ANDROID.ACCESS_BACKGROUND_LOCATION+ERROR============>",
                    e
                  );
                  returnResponse = false;
                });
            }
          });
        } else {
          returnResponse = true;
        }
      } else if (response === false) {
        returnResponse = false;
      }
    });
  } else {
    // PERMISSION.IOS.ALWAYS_IN_USE ( not implemented, why? )
    await request(PERMISSIONS.IOS.LOCATION_WHEN_IN_USE).then(async (result) => {
      switch (result) {
        case RESULTS.UNAVAILABLE:
          // alert('This feature is not available (on this device / in this context)');
          break;
        case RESULTS.DENIED:
          alert(
            "The location permission has not been requested / is denied but requestable"
          );
          returnResponse = false;
          break;
        case RESULTS.LIMITED:
          alert("The permission is limited: some actions are possible");
          returnResponse = false;
          break;
        case RESULTS.GRANTED:
          returnResponse = true;

          break;
        case RESULTS.BLOCKED:
          Alert.alert(
            "Hold on!",
            "We are not able to track your route because you didn't give permission to access your location. For further process you need to enable location permission from setting.",
            [{ text: "Setting", onPress: () => Linking.openSettings() }]
          );
          returnResponse = false;

          break;
      }
    });
  }

  return returnResponse;
};

// RequestLocation
export const requestForLocation = async ({ inUseOnly = true }) => {
  let returnResponse = false;

  const isAndroid = Platform.OS === "android";
  const androidVer = Platform.Version;

  const androidPemrissionType = inUseOnly
    ? PERMISSIONS.ANDROID.ACCESS_FINE_LOCATION
    : androidVer >= 29
    ? PERMISSIONS.ANDROID.ACCESS_BACKGROUND_LOCATION
    : PERMISSIONS.ANDROID.ACCESS_FINE_LOCATION;

  if (isAndroid) {
    await request(androidPemrissionType).then((result) => {
      switch (result) {
        case RESULTS.UNAVAILABLE:
          // alert('This feature is not available (on this device / in this context)');
          break;
        case RESULTS.DENIED:
          alert("The location permission for always allow is denied.");

          break;
        case RESULTS.LIMITED:
          alert(
            "The permission is limited: Location tracking may not work smoothly"
          );
          break;
        case RESULTS.GRANTED:
          console.log("GRANTED");
          returnResponse = true;

          break;
        case RESULTS.BLOCKED:
          Alert.alert(
            "Hold on!",
            "We are not able to track your route because you didn't give permission to access your location. For further process you need to enable location permission from setting.",
            [
              {
                text: "Setting",
                onPress: () => Linking.openSettings(),
              },
            ]
          );
          break;
      }
    });
  } else if (Platform.OS === "ios") {
    // Implement Ios

    var permission;
    permission = inUseOnly
      ? PERMISSIONS.IOS.LOCATION_WHEN_IN_USE
      : parseInt(Platform.Version, 10) < 13
      ? PERMISSIONS.IOS.LOCATION_ALWAYS
      : PERMISSIONS.IOS.LOCATION_WHEN_IN_USE;

    await request(permission).then((result) => {
      switch (result) {
        case RESULTS.UNAVAILABLE:
          // alert('This feature is not available (on this device / in this context)');
          break;
        case RESULTS.DENIED:
          alert("The location permission for always allow is denied.");
          returnResponse = false;
          break;
        case RESULTS.LIMITED:
          alert(
            "The permission is limited: Location tracking may not work smoothly"
          );
          returnResponse = false;
          break;
        case RESULTS.GRANTED:
          returnResponse = true;
          break;
        case RESULTS.BLOCKED:
          Alert.alert(
            "Hold on!",
            "We are not able to track your route because you didn't give permission to access your location. For further process you need to enable location permission from setting.",
            [{ text: "Setting", onPress: () => Linking.openSettings() }]
          );
          break;
      }
    });
  }

  return returnResponse;
};
