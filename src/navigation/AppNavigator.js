import React, { useEffect, useState, useContext, useRef } from "react";
import {
  View,
  Text,
  Dimensions,
  TouchableOpacity,
  Image,
  Platform,
  SafeAreaView,
  I18nManager,
  Animated,
  Alert,
  Linking,
  NativeModules,
} from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";

import { CommonActions, useIsFocused } from "@react-navigation/native";

import { createStackNavigator } from "@react-navigation/stack";
import { createDrawerNavigator } from "@react-navigation/drawer";
import { CurvedBottomBar } from "react-native-curved-bottom-bar";
import Api, { url } from "../common/Api";
import Ionicons from "react-native-vector-icons/Ionicons";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { RFPercentage, RFValue } from "react-native-responsive-fontsize";
import { BadgeContext, StatuscodeContext } from "../navigation/AuthContext";
import TabComponent, { locationPermissionCheck } from "./Tab";
import Transport from "../components/Dashboard/Transport/Transport";
import CustomSidebarMenu from "./CustomSidebarMenu";
import Notification from "../components/Dashboard/Notification/Notification";
import ActionBtn from "../components/Dashboard/ActionBtn/ActionBtn";
import Dashboard from "../components/Dashboard/Dashboard/Dashboard";
import Map from "../components/Dashboard/Map";
import Settings from "../components/Dashboard/Settings/Settings";
import stringsoflanguages from "../Localization/stringsoflanguages";
import Language from "../components/Dashboard/Settings/Language";
import UpdateProfile from "../components/Dashboard/Settings/UpdateProfile";
import TrailerList from "../components/Dashboard/Trailer/TrailerList";
import VehicleList from "../components/Dashboard/Vehicle/VehicleList";
import SaveTrailer from "../components/Dashboard/Trailer/SaveTrailer";
import SaveDriver from "../components/Dashboard/Driver/SaveDriver";
import DriverList from "../components/Dashboard/Driver/DriverList";
import SaveVehicle from "../components/Dashboard/Vehicle/SaveVehicle";
import TrailerDetails from "../components/Dashboard/Trailer/TrailerDetails";
import VehicleDetails from "../components/Dashboard/Vehicle/VehicleDetails";
import DriverDetails from "../components/Dashboard/Driver/DriverDetails";
import FreightList from "../components/Dashboard/Freight/FreightList";
import MainFreightTab from "../components/Dashboard/Freight/MainFreightTab";
import FreightSignedList from "../components/Dashboard/Freight/FreightSignedList";
import SaveFreight from "../components/Dashboard/Freight/SaveFreight";
import FreightDetails from "../components/Dashboard/Freight/FreightDetails";
import AddTransport from "../components/Dashboard/Transport/AddTransport";
import ResetPassword from "../components/Auth/ResetPassword";
import DeviceInfo from "react-native-device-info";
import Help from "../components/Dashboard/Help/HelpScreen";

//Preffered Route screens
import PreferredRouteDetails from "../components/Dashboard/PreferredRoute/PreferredRouteDetails";
import SavePreferredRoute from "../components/Dashboard/PreferredRoute/SavePreferredRoute";
import PreferredRouteList from "../components/Dashboard/PreferredRoute/PreferredRouteList";
import BankAccountList from "../components/Dashboard/BankAccount/BankAccountList";
import SaveBankAccount from "../components/Dashboard/BankAccount/SaveBankAccount";

// Freight Owner Stack
import FreightNavigator from "./freightNavigator";

import PushNotification from "react-native-push-notification";
import PushNotificationIOS from "@react-native-community/push-notification-ios";
import messaging from "@react-native-firebase/messaging";

import * as RootNavigation from "./NavigationRef";

import * as colors from "../common/colors";
import * as Fonts from "../common/fonts";

import { Style } from "../common/Style";
import Profile from "../components/Dashboard/Profile/Profile";
import uuid from "react-native-uuid";
import CreateNewPassword from "../components/Auth/CreateNewPassword";
import FreightOwnerInformation from "../components/Dashboard/FreightOwnerInformation";
import FreightInContianer from "../components/Dashboard/FreightInContianer";
import ApplyForSubConract from "../components/Dashboard/SubContract/ApplyForSubContract";
import SubConractList from "../components/Dashboard/SubContract/SubContractList";
import ProfileInitailScreen from "../components/Dashboard/Profile/ProfileInitailScreen";
import ActionButton from "react-native-circular-action-menu";
import { BlurView } from "@react-native-community/blur";
import Tab from "./Tab";

import {
  CreateTransporterGPSPointAction,
  GetTransportListAction,
  UpdateTransporterStatusAction,
} from "../Redux/actions";
import { useDispatch, useSelector } from "react-redux";

const Stack = createStackNavigator();
const TransitionScreenOptions = {
  // ...TransitionPresets.SlideFromRightIOS, // This is where the transition happens
  animationEnabled: false,
  headerShown: false,
};

const Drawer = createDrawerNavigator();
// const Tab = createBottomTabNavigator();
const { width, height } = Dimensions.get("window");

//notification stuff start

//for ios handling while in foreground

PushNotification.configure({
  // (optional) Called when Token is generated (iOS and Android)
  onRegister: function (token) {
    console.log("TOKEN:", token);
  },

  // (required) Called when a remote or local notification is opened or received
  onNotification: function async(notification) {
    if (notification?.userInteraction === true) {
      AsyncStorage.setItem("FromNotification", "true");
      console.log("innnnnnnnnnn>>>", notification);
      Platform.OS == "android" ? RootNavigation?.navigate("Notification") : "";
    }
    // process the notification here

    // required on iOS only
    // notification.finish(PushNotificationIOS.FetchResult.NoData);
  },

  // Android only
  senderID: "780199468217",
  // iOS only
  permissions: {
    alert: true,
    badge: true,
    sound: true,
    critical: false,
  },
  popInitialNotification: true,
  requestPermissions: true,
});

//notification stuff end

function DrawerNavigator({ navigation }) {
  const [code, setcode] = useState("");
  const codeRef = useRef("");
  const CodeContext = React.useMemo(
    () => ({
      settransCode: async (code) => {
        console.log("codeeeeeee", code);
        setcode(code);
        codeRef.current = code;
      },
      getCode: () => {
        return codeRef.current;
      },
    }),
    []
  );

  return (
    <>
      <StatuscodeContext.Provider value={CodeContext}>
        <Drawer.Navigator
          screenOptions={() => ({
            headerShown: true,
            tabBarVisible: true,
            drawerStyle: { width: "75%" },
          })}
          drawerContent={(props) => (
            <CustomSidebarMenu {...props} Code={code} />
          )}
        >
          <Stack.Screen
            name="DrawerStackNavigator"
            component={DrawerStackNavigator}
            options={{
              headerShown: false,
            }}
          />
        </Drawer.Navigator>
      </StatuscodeContext.Provider>
    </>
  );
}

function DrawerStackNavigator(props) {
  return (
    <Stack.Navigator screenOptions={TransitionScreenOptions}>
      <Stack.Screen
        name="BottomTab"
        component={BottomTab}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name="Language"
        component={Language}
        options={{
          headerShown: false,
        }}
      />
      <Stack.Screen
        name="UpdateProfile"
        component={UpdateProfile}
        options={{
          headerShown: false,
        }}
      />
      <Stack.Screen
        name="ProfileInitailScreen"
        component={ProfileInitailScreen}
        options={{
          headerShown: false,
        }}
      />
      <Stack.Screen
        name="Settings"
        component={Settings}
        options={{
          headerShown: false,
        }}
      />
      <Stack.Screen
        name="TrailerList"
        component={TrailerList}
        options={{
          headerShown: false,
        }}
      />
      <Stack.Screen
        name="ShowFrieghtInContainer"
        component={FreightInContianer}
        options={{
          headerShown: false,
        }}
      />
      <Stack.Screen
        name="SaveTrailer"
        component={SaveTrailer}
        options={{
          headerShown: false,
        }}
      />
      <Stack.Screen
        name="TrailerDetails"
        component={TrailerDetails}
        options={{
          headerShown: false,
        }}
      />
      <Stack.Screen
        name="SaveDriver"
        component={SaveDriver}
        options={{
          headerShown: false,
        }}
      />
      <Stack.Screen
        name="SaveVehicle"
        component={SaveVehicle}
        options={{
          headerShown: false,
        }}
      />
      <Stack.Screen
        name="VehicleList"
        component={VehicleList}
        options={{
          headerShown: false,
        }}
      />
      <Stack.Screen
        name="VehicleDetails"
        component={VehicleDetails}
        options={{
          headerShown: false,
        }}
      />
      <Stack.Screen
        name="DriverList"
        component={DriverList}
        options={{
          headerShown: false,
        }}
      />
      <Stack.Screen
        name="DriverDetails"
        component={DriverDetails}
        options={{
          headerShown: false,
        }}
      />
      <Stack.Screen
        name="PreferredRouteDetails"
        component={PreferredRouteDetails}
        options={{
          headerShown: false,
        }}
      />
      <Stack.Screen
        name="PreferredRouteList"
        component={PreferredRouteList}
        options={{
          headerShown: false,
        }}
      />
      <Stack.Screen
        name="ApplyForSubContract"
        component={ApplyForSubConract}
        options={{
          headerShown: false,
        }}
      />
      <Stack.Screen
        name="SubContractList"
        component={SubConractList}
        options={{
          headerShown: false,
        }}
      />
      <Stack.Screen
        name="SavePreferredRoute"
        component={SavePreferredRoute}
        options={{
          headerShown: false,
        }}
      />
      <Stack.Screen
        name="FreightList"
        //component={FreightList}
        component={FreightSignedList}
        options={{
          headerShown: false,
        }}
      />
      <Stack.Screen
        name="SaveFreight"
        component={SaveFreight}
        options={{
          headerShown: false,
        }}
      />
      <Stack.Screen
        name="FreightDetails"
        component={FreightDetails}
        options={{
          headerShown: false,
        }}
      />
      <Stack.Screen
        name="AddTransport"
        component={AddTransport}
        options={{
          headerShown: false,
        }}
      />

      <Stack.Screen
        name="BankAccountList"
        component={BankAccountList}
        options={{
          headerShown: false,
        }}
      />
      <Stack.Screen
        name="SaveBankAccount"
        component={SaveBankAccount}
        options={{
          headerShown: false,
        }}
      />
      <Stack.Screen
        name="Notification"
        component={Notification}
        options={{
          headerShown: false,
        }}
      />
      <Stack.Screen
        name="ResetPassword"
        component={ResetPassword}
        options={{
          headerShown: false,
        }}
      />
      <Stack.Screen
        name="HelpScreen"
        component={Help}
        options={{
          headerShown: false,
        }}
      />
      {/* <Stack.Screen
        name="CreateNewPassword"
        component={CreateNewPassword}
        
        options={{
          headerShown: false,
        }}
      /> */}
    </Stack.Navigator>
  );
}

function AppNavigator({ navigation }) {
  const [Type, setType] = useState();
  // const ready = useRef(false);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    (async () => {
      const type = await AsyncStorage.getItem("COMPANY_TYPE");
      console.log("type", type);
      if (type) {
        const company = JSON.parse(type);
        setType(company);
      }
      setReady(true);
    })();
  }, []);

  console.log(ready, Type);

  if (!ready) return null;

  return (
    <Stack.Navigator screenOptions={TransitionScreenOptions}>
      {Type == 1 ? ( // Carrier
        <Stack.Screen name="DrawerNavigator" component={DrawerNavigator} />
      ) : Type == 2 ? ( // freight owner
        <Stack.Screen name="FreightNav" component={FreightNavigator} />
      ) : (
        // temporary if type id is other than above we should show other screen
        <Stack.Screen name="FreightNav" component={FreightNavigator} />
      )}
      {/* <Stack.Screen name="FreightNav" component={FreightNavigator} /> */}
    </Stack.Navigator>
  );
}

function TransportScreen({ navigation }) {
  return (
    <Stack.Navigator screenOptions={TransitionScreenOptions}>
      <Stack.Screen
        name="Transport"
        component={Transport}
        options={{ headerShown: false }}
      />
    </Stack.Navigator>
  );
}

function CustomTabNavigationHeader(navigation, badge) {
  return {
    headerShown: true,
    headerTitle: () => <Text style={Style.HeaderTitleTxt}>Rivalog</Text>,
    headerTitleAlign: "center",
    headerLeft: () => (
      <View>
        <TouchableOpacity
          onPress={() => navigation.toggleDrawer()}
          style={Style.HeaderMenuView}
        >
          {/*Donute Button Image */}
          <Image
            source={require("../assets/images/icn_menu2.png")}
            style={Style.HeaderMenuImage}
          />
        </TouchableOpacity>
      </View>
    ),
    headerRight: () => (
      <TouchableOpacity
        onPress={() => navigation.navigate("Notification")}
        style={[Style.HeaderImageView]}
      >
        <View style={[Style.HeaderProfileView, { right: RFValue(15) }]}>
          <Image
            source={require("../assets/images/NotificationBell.png")}
            style={[Style.DrawerMenuImage2]}
          />
        </View>
        {badge != 0 ? (
          <View
            style={{
              alignItems: "center",
              justifyContent: "center",
              height: RFPercentage(2.5),
              width: RFPercentage(2.5),
              borderRadius: RFPercentage(2.5),
              backgroundColor: colors.Red,
              position: "absolute",
              top: RFPercentage(1),
              right: RFPercentage(3),
            }}
          >
            <Text
              style={{
                fontFamily: Fonts.Bold,
                fontSize: RFValue(8),
                color: colors.White,
              }}
            >
              {badge}
            </Text>
          </View>
        ) : undefined}
      </TouchableOpacity>
    ),

    headerStyle: {
      backgroundColor: colors.WhiteSmoke, //Set Header color
      // borderBottomColor: colors.LightGrey,
      borderBottomWidth: 0,
      height: DeviceInfo.hasNotch()
        ? Platform.OS == "ios"
          ? RFPercentage(14)
          : RFPercentage(12)
        : Platform.OS == "ios"
        ? RFPercentage(11.5)
        : RFPercentage(14),

      // backgroundColor: 'red',
    },
  };
}

export function CustomStackNavigationHeader(
  HeaderName,
  navigation,
  router = ""
) {
  return {
    headerShown: true,
    headerTitle: () => <Text style={Style.HeaderTitleTxt}>{HeaderName}</Text>,
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
      shadowColor: "transparent",
      elevation: 0,
    },
  };
}

function BottomTab({ navigation }) {
  const [Langstr, setLangstr] = useState(stringsoflanguages);
  const [floatMenuActive, setFloatMenuActive] = useState(false);
  const [isFloatClicked, setFloatIsClicked] = useState(false);
  const [UIDForTransportList, setUIDForTransportList] = useState("");
  const [UIDForStatusUpdate, setUIDForStatusUpdate] = useState("");
  const [buttonColor, setButtonColor] = useState(colors.Grey);
  const isFocused = useIsFocused();

  const UpdateTransporterStatusData = useSelector(
    (state) => state.UpdateTransporterStatusData
  );
  const dispatch = useDispatch();

  dispatch(UpdateTransporterStatusAction());

  const _renderIcon = (routeName, selectedTab, iconColor) => {
    let icon = "";

    switch (routeName) {
      case "Dashboard":
        icon = require("../assets/images/bottomHome.png");

        break;
      case "FreightList":
        icon = require("../assets/images/BottomTruck.png");
        break;
      // case "ActionBtn":
      //   icon = require("../assets/images/Frame46.png");
      //   break;
      case "Setting":
        icon = require("../assets/images/icn_setting.png");
        break;
      case "ProfileInit":
        icon = require("../assets/images/profile2.png");
    }
    return (
      <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
        <Image
          source={icon}
          style={{ width: 25, height: 25, tintColor: iconColor }}
        />
      </View>
    );
  };
  const renderTabBar = ({ routeName, selectedTab, navigate }) => {
    const iconColor = selectedTab === routeName ? colors.LimeGreen : "#c9c9c9";
    return (
      <TouchableOpacity
        onPress={() => navigate(routeName)}
        //style={styles.tabbarItem}
      >
        {_renderIcon(routeName, selectedTab, iconColor)}
      </TouchableOpacity>
    );
  };
  useEffect(() => {
    setLangstr(stringsoflanguages);
  }, [isFocused]);

  const [badge, setBadge] = React.useState(0);
  let badgeVar = 0;

  const badgeContext = React.useMemo(
    () => ({
      setbadgeCount: async (badge) => {
        console.log("badgeeeeee", badge);
        setBadge(badge);
      },
    }),
    []
  );
  messaging().onMessage(async (remoteMessage) => {
    console.log("onMessage", remoteMessage);
    const badgeCount = remoteMessage?.data?.badge || 0;
    // PushNotification.setApplicationIconBadgeNumber(badgeCount);
    setBadge(badge + 1);
    // RootNavigation?.navigate('Notification')
  });

  useEffect(() => {
    PushNotificationIOS.addEventListener("notification", (notification) => {
      console.log("onNotification>>>", notification);
      // Increment the badge count by 1
      badgeVar = badgeVar + 1;
      setBadge(badgeVar);
      PushNotificationIOS.getApplicationIconBadgeNumber((badgeCount) => {
        // const newBadgeCount = badgeCount + 1;
        PushNotificationIOS.setApplicationIconBadgeNumber(badgeVar);
      });
    });

    return () => {};
  }, []);

  return (
    <BadgeContext.Provider value={badgeContext}>
      <CurvedBottomBar.Navigator
        type="UP"
        height={RFValue(50)}
        circleWidth={50}
        bgColor="white"
        shadowStyle={{
          shadowColor: "black",
          shadowOffset: { width: 0, height: 1 },
          shadowOpacity: 0.2,
          shadowRadius: 2,
        }}
        initialRouteName="Dashboard"
        borderTopLeftRight
        renderCircle={({ selectedTab, navigate }) => <Tab />}
        tabBar={renderTabBar}
        screenOptions={{
          headerShown: false,
        }}
      >
        <CurvedBottomBar.Screen
          name="Dashboard"
          component={Dashboard}
          position="LEFT"
          options={{
            // tabBarButton: (props) => (
            //   <TabComponent
            //     label={stringsoflanguages.Home}
            //     {...props}
            //     navigation={navigation}
            //   />
            // ),

            ...CustomTabNavigationHeader(navigation, badge),
            headerShown: true,
          }}
        />

        <CurvedBottomBar.Screen
          name="FreightList"
          component={MainFreightTab}
          position="LEFT"
          options={{
            // tabBarButton: (props) => (
            //   <TabComponent
            //     label={stringsoflanguages.Transport}
            //     {...props}
            //     navigation={navigation}
            //   />
            // ),
            ...CustomTabNavigationHeader(navigation, badge),
            headerShown: true,
          }}
        />
        {/* <CurvedBottomBar.Screen
          name="ActionBtn"
          component={ActionBtn}
          options={{
            // tabBarButton: (props) => (
            //   <TabComponent
            //     label={"status"}
            //     {...props}
            //     navigation={navigation}
            //   />
            // ),
            ...CustomTabNavigationHeader(navigation, badge),
          }}
        /> */}
        <CurvedBottomBar.Screen
          name="Setting"
          component={Settings}
          position="RIGHT"
          options={{
            // tabBarButton: (props) => (
            //   <TabComponent
            //     label={stringsoflanguages.Settings}
            //     {...props}
            //     navigation={navigation}
            //   />
            // ),
            ...CustomTabNavigationHeader(navigation, badge),
          }}
        />
        <CurvedBottomBar.Screen
          name="ProfileInit"
          component={ProfileInitailScreen}
          position="RIGHT"
          options={{
            // tabBarButton: (props) => (
            //   <TabComponent
            //     label={stringsoflanguages.Profile}
            //     {...props}
            //     navigation={navigation}
            //   />
            // ),
            ...CustomTabNavigationHeader(navigation, badge),
          }}
        />
        <CurvedBottomBar.Screen
          name="Profile"
          component={Profile}
          options={{
            // tabBarButton: (props) =>
            //   <TabComponent
            //     label={stringsoflanguages.Profile}
            //     {...props}
            //     navigation={navigation}
            //   />
            // ),
            ...CustomTabNavigationHeader(navigation, badge),
          }}
        />
      </CurvedBottomBar.Navigator>
    </BadgeContext.Provider>
  );
}

export default AppNavigator;
