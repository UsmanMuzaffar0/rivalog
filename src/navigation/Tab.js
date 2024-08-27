import AsyncStorage from "@react-native-async-storage/async-storage";
import { BlurView } from "@react-native-community/blur";
import { CommonActions, useNavigation } from "@react-navigation/native";
import React, { useContext, useEffect, useState } from "react";
import {
  Alert,
  Dimensions,
  I18nManager,
  Image,
  Linking,
  PermissionsAndroid,
  Platform,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import ActionButton from "react-native-circular-action-menu";
import Geolocation from "react-native-geolocation-service";
import { check, PERMISSIONS, RESULTS } from "react-native-permissions";
import { RFPercentage, RFValue } from "react-native-responsive-fontsize";
import uuid from "react-native-uuid";
import { connect, useDispatch, useSelector } from "react-redux";
import * as colors from "../common/colors";
import { Style } from "../common/Style";
import { StatuscodeContext } from "../navigation/AuthContext";
import stringsoflanguages from "../Localization/stringsoflanguages";

import { NativeModules } from "react-native";
import Api, { url } from "../common/Api";
import {
  CreateTransporterGPSPointAction,
  GetTransportListAction,
  UpdateTransporterStatusAction,
} from "../Redux/actions";
// import BackgroundGeolocation from "@mauron85/react-native-background-geolocation";

const { width } = Dimensions.get("window");
const { LocationModule } = NativeModules;
let DashboardData;
let iosLocInterval;
export const locationPermissionCheck = async () => {
  if (Platform.OS == "android") {
    const permissionResult = await PermissionsAndroid.check(
      "android.permission.ACCESS_FINE_LOCATION"
    );
    if (permissionResult === true) {
      return true;
    } else if (permissionResult === false) {
      return false;
    }
  } else {
    const permissionResult = await check(PERMISSIONS.IOS.LOCATION_WHEN_IN_USE);
    switch (permissionResult) {
      case RESULTS.UNAVAILABLE:
      case RESULTS.DENIED:
      case RESULTS.LIMITED:
      case RESULTS.BLOCKED:
        return false;
      case RESULTS.GRANTED:
        return true;
    }
  }
};

export const getCurrentLoc = async () => {
  const opt = {
    enableHighAccuracy: true,
    timeout: 20000,
    maximumAge: 1000,
    distanceFilter: 1,
  };
  const getCurrentPosition = () =>
    new Promise((resolve, error) =>
      Geolocation.getCurrentPosition(resolve, error, opt)
    );

  try {
    const Data = await getCurrentPosition();
    const currentPos = Data?.coords ? Data : null;
    return { currentPos };
  } catch (error) {
    return { currentPos: null, error };
  }
};

const transportAlert = (props) => {
  Alert.alert(
    "Transporter Alert !",
    "you did not select truck and trailer. do you want to select?",
    [
      {
        text: "Cancel",
        onPress: () => console.log("Cancel Pressed"),
        style: "cancel",
      },
      {
        text: "OK",
        onPress: () => {
          props.navigation.navigate("AddTransport");
        },
      },
    ]
  );
};

const stopiosSendLocationUpdates = () => {
  if (iosLocInterval) {
    clearInterval(iosLocInterval);
    // BackgroundGeolocation.stop();
  }
};

const updateLocCall = async () => {
  const { currentPos } = await getCurrentLoc();
  if (!!(currentPos?.coords?.latitude && currentPos?.coords?.longitude)) {
    const { latitude, longitude } = currentPos.coords;
    let GPSPoint = {
      latitude,
      longitude,
    };
    fetch(`${url}transporter-management/points`, {
      method: "POST",
      headers: {
        Accept: "application/json",
        Authorization: "Bearer " + (await AsyncStorage.getItem("AccessToken")),
        "Content-Type": "application/json",
      },
      body: JSON.stringify(GPSPoint),
    })
      .then(async (response) => {
        console.log("CreateTransporterGPSPoint response: ", response.status);
      })
      .catch((error) => console.log("GPS error", error));
  }
};

const iosSendLocationUpdates = (interval = 1000 * 60) => {
  // BackgroundGeolocation.configure({
  //   // desiredAccuracy: BackgroundGeolocation.HIGH_ACCURACY,
  //   stationaryRadius: 50,
  //   distanceFilter: 50,
  //   startOnBoot: true,
  //   stopOnTerminate: false,
  //   // locationProvider: BackgroundGeolocation.ACTIVITY_PROVIDER,
  //   stopOnStillActivity: false,
  //   startForeground: true,
  // });
  // BackgroundGeolocation.start();
  stopiosSendLocationUpdates();
  updateLocCall();
  // BackgroundGeolocation.on("start", () => {
  //   iosLocInterval = setInterval(() => {
  //     console.log("Location test");
  //     updateLocCall();
  //   }, interval); //interval);
  // });
};

const Tab = (props) => {
  const {
    label,
    accessibilityState,
    onPress,
    TransportList,
    DashboardReducer,
  } = props;
  const StatusContext = useContext(StatuscodeContext);
  const { getCode, settransCode } = StatusContext;
  let statusCode = getCode();

  DashboardData = useSelector((state) => state.Dashboard);

  const navigation = useNavigation();

  // const focused = accessibilityState.selected;
  const [floatMenuActive, setFloatMenuActive] = useState(false);
  const [locationAPICall, setLocationAPICall] = useState(false);
  const [isFloatClicked, setFloatIsClicked] = useState(false);
  const [isFloatClicked1, setFloatIsClicked1] = useState(false);
  const [getTransportClicked, setgetTransportClicked] = useState(false);
  const [buttonColor, setButtonColor] = useState(colors.Grey);
  const [selectedbuttonColor, setselectedButtonColor] = useState(
    colors.LightGreen
  );
  const [ForAPI, setForAPI] = useState(true);
  const [UID, setUID] = useState("");
  const [UIDForStatusUpdate, setUIDForStatusUpdate] = useState("");
  const [UIDForTransportList, setUIDForTransportList] = useState("");
  const [LangStr, setLangStr] = useState(stringsoflanguages);

  const locationInterval =
    global.color === colors.Blue
      ? 60 * 1000
      : global.color === colors.LightGreen
      ? 60 * 60 * 1000
      : 0;

  const dispatch = useDispatch();
  let color = "black";
  let fontFamily = "Poppins-Regular";
  // if (focused) {
  //   color = "black";
  //   fontFamily = "Poppins-Medium";
  // }

  const setGlobalInterval = async () => {
    LocationModule.stopService();
    const accessToken = await AsyncStorage.getItem("AccessToken");

    LocationModule.createLocationEvent(
      Platform.OS == "android"
        ? locationInterval
        : (locationInterval / 1000).toString(),
      accessToken
    );
  };

  useEffect(() => {
    DashboardAPI();
  }, []);

  useEffect(() => {
    // Is this neccessary??
    const unsubscribe = navigation.addListener("focus", async () => {
      stringsoflanguages.setLanguage(
        await AsyncStorage.getItem("SelectedLanguage")
      );
      setLangStr(stringsoflanguages);
    });

    return unsubscribe;
  }, [navigation]);

  const DashboardAPI = async () => {
    if (ForAPI) {
      const token = await AsyncStorage.getItem("AccessToken");
      // console.log("\nCALLING FOR DASBORAD API", token);

      fetch(`${url}dashboard-management/carrier/mobile/items`, {
        method: "GET",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      }).then(async (response) => {
        let res = await response.json();
        setForAPI(false);
        if (res?.transporterStatus !== null) {
          const initialColor =
            res?.transporterStatus?.code == "NOT_WORKING"
              ? colors.LightRed
              : res?.transporterStatus?.code == "FREIGHT_CARRYING"
              ? colors.Blue
              : res?.transporterStatus?.code == "LOOKING_FOR_FREIGHT"
              ? colors.LightGreen
              : colors.LightGrey;
          setButtonColor(initialColor);
          global.color = initialColor;
          const locationInterval =
            global.color === colors.Blue
              ? 60 * 1000
              : global.color === colors.LightGreen
              ? 60 * 60 * 1000
              : 0;
          if (
            res?.transporterStatus.code == "FREIGHT_CARRYING" ||
            res?.transporterStatus.code == "LOOKING_FOR_FREIGHT"
          ) {
            LocationModule.stopService();
            LocationModule.createLocationEvent(
              Platform.OS == "android"
                ? locationInterval
                : (locationInterval / 1000).toString(),
              token
            );
          } else {
            LocationModule.stopService();
          }
        }
      });
    }
  };

  const startInterval = () => {
    setFloatIsClicked1(true);
    setGlobalInterval();

    setTimeout(() => {
      navigation.dispatch(
        CommonActions.reset({
          index: 0,
          routes: [
            {
              name: "Dashboard",
            },
          ],
        })
      );
    }, 1000);
  };

  useEffect(() => {
    console.log("CHECKING INSIDE==>", TransportList);
    if (
      TransportList?.GetTransportListSuccess &&
      getTransportClicked &&
      UIDForTransportList == TransportList.data[2]
    ) {
      if (TransportList.data[1] == 200) {
        setUIDForTransportList("");
        setgetTransportClicked(false);
        startInterval();
      } else {
        setUIDForTransportList("");
        setgetTransportClicked(false);
        transportAlert(props);
      }
    }
  }, [TransportList]);

  const onActionItemClick = async (color) => {
    setButtonColor(color);
    setFloatMenuActive(false);
    setFloatIsClicked(true);
    if (
      [colors.LightGreen, colors.Blue].indexOf(color) >= 0 &&
      !(await locationPermissionCheck())
    ) {
      Alert.alert(
        "Hold on!",
        "We are not able to track your route because you didn't give permission to access your location. For further process you need to enable location permission from setting.",
        [{ text: "Setting", onPress: () => Linking.openSettings() }]
      );
      return null;
    }
    if ([colors.LightGreen, colors.Blue].indexOf(color) === -1) {
      setButtonColor(color); // Corrected the stateChange
    }
    global.color = color;
    const varUIDStatusUpdate = uuid.v4();
    setUIDForStatusUpdate(varUIDStatusUpdate);
    console.log("CALL FOR UPDATE TRANSPORTER");
    const response = await Api.UpdateTransporterStatus({
      status:
        color == colors.LightGreen
          ? "LOOKING_FOR_FREIGHT"
          : color == colors.Blue
          ? "FREIGHT_CARRYING"
          : "NOT_WORKING",
      uid: varUIDStatusUpdate,
      color,
    });

    if (response?.status === 200) {
      settransCode(
        color == colors.LightGreen
          ? "LOOKING_FOR_FREIGHT"
          : color == colors.Blue
          ? "FREIGHT_CARRYING"
          : "NOT_WORKING"
      );
      setButtonColor(response.color);
      global.color = response.color;
      console.log(
        "response=====",
        response,
        [colors.LightGreen, colors.Blue].indexOf(response.color) >= 0,
        response.color
      );
      if ([colors.LightGreen, colors.Blue].indexOf(response.color) >= 0) {
        setFloatIsClicked(false);
        setUIDForStatusUpdate("");
        setgetTransportClicked(true);
        const varUIDForTransportList = uuid.v4();
        console.log("varUIDForTransportList==>", varUIDForTransportList);
        setUIDForTransportList(varUIDForTransportList);
        dispatch(props.GetTransportListAction(varUIDForTransportList));
      } else {
        console.log("else");
        if (Platform.OS === "android") {
          LocationModule.stopService();
        } else {
          LocationModule.stopService();
        }
        setFloatIsClicked(false);
        setUIDForStatusUpdate("");
        setTimeout(() => {
          navigation.dispatch(
            CommonActions.reset({
              index: 0,
              routes: [
                {
                  name: "Dashboard",
                },
              ],
            })
          );
        }, 1000);
      }
    } else {
      transportAlert(props);
      setFloatIsClicked(false);
      setUIDForStatusUpdate("");
    }
  };

  return (
    <View
      style={{
        // justifyContent: "flex-start",
        bottom: Platform.OS == "android" ? RFPercentage(6) : RFPercentage(3.5),
        left: RFValue(-10),
        zIndex: 1,
        transform: [{ scaleX: I18nManager.isRTL ? -1 : 1 }],
      }}
    >
      <ActionButton
        onOverlayPress={() => setFloatMenuActive(false)}
        backdrop={
          <BlurView style={Style.BlurView} blurType="light" blurAmount={10} />
        }
        active={floatMenuActive}
        radius={RFValue(92)}
        // radius={110}
        itemSize={45}
        icon={
          <Image
            source={require("../assets/images/Frame46.png")}
            style={[Style.CloseIconImg]}
          />
        }
        onPress={() => {
          setFloatMenuActive(!floatMenuActive);
        }}
        size={RFValue(40)}
      >
        <ActionButton.Item
          // buttonColor={colors.Blue}
          btnNumber={1}
          size={RFPercentage(8)}
          title="New Task"
          startDegree={0}
          endDegree={0}
          onPress={() => {
            onActionItemClick(colors.Blue);
          }}
        >
          <Image
            source={require("../assets/images/BlueFrame.png")}
            style={Style.Image}
          />
          {/* <Text style={{ position: "absolute", bottom: -RFPercentage(3) }}>
            {LangStr.PassiveMode}
          </Text> */}
        </ActionButton.Item>
        <ActionButton.Item
          // buttonColor={colors.LightGreen}
          btnNumber={2}
          size={RFPercentage(8)}
          title="New Task"
          startDegree={0}
          endDegree={0}
          onPress={() => {
            onActionItemClick(colors.LightGreen);
          }}
        >
          <Image
            source={require("../assets/images/FrameGreen.png")}
            style={Style.Image}
          />
          {/* <Text style={{ position: "absolute", bottom: -RFPercentage(3) }}>
            {LangStr.LookingForFreight}
          </Text> */}
        </ActionButton.Item>
        <ActionButton.Item
          // buttonColor={colors.LightRed}
          btnNumber={3}
          size={RFPercentage(8)}
          title="New Task"
          startDegree={0}
          endDegree={0}
          onPress={() => onActionItemClick(colors.LightRed)}
        >
          <Image
            source={require("../assets/images/RedFrame.png")}
            style={Style.Image}
          />
          {/* <Text style={{ position: "absolute", bottom: -RFPercentage(3) }}>
            {LangStr.LoadedAndOnRoad}
          </Text> */}
        </ActionButton.Item>
      </ActionButton>
    </View>
  );
};

const styles = StyleSheet.create({
  actionButtonIcon: {
    fontSize: 15,
    height: 20,
    color: "white",
  },
  actionBtnContainer: {
    justifyContent: "center",
    alignItems: "center",
  },
  actionBtnText: {
    textAlign: "center",
    color: colors.White,
  },
  actionBtnImage: {
    height: RFPercentage(3),
    width: RFPercentage(3),
    resizeMode: "contain",
    tintColor: colors.White,
    marginBottom: RFPercentage(5),
  },
});

const mapStateToProps = (state) => {
  return {
    TransportList: state.TransportList,
    UpdateTransporterStatusData: state.UpdateTransporterStatusData,
    CreateTransporterGPSPoint: state.CreateTransporterGPSPoint,
    DashboardReducer: state.Dashboard,
  };
};
export default connect(mapStateToProps, {
  GetTransportListAction,
  UpdateTransporterStatusAction,
  CreateTransporterGPSPointAction,
})(Tab);
