import AsyncStorage from "@react-native-async-storage/async-storage";
import React, { Component } from "react";
import {
  ActivityIndicator,
  Alert,
  AppState,
  Dimensions,
  FlatList,
  Image,
  ImageBackground,
  Linking,
  PermissionsAndroid,
  Platform,
  SafeAreaView,
  StatusBar,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  NativeModules,
  TouchableWithoutFeedback,
} from "react-native";
import { Modal } from "react-native-paper";
import Geolocation from "react-native-geolocation-service";
import { powerSavingOn } from "react-native-power-saving-mode";
import { ScrollView } from "react-native-gesture-handler";
import { check, PERMISSIONS, RESULTS, request } from "react-native-permissions";
import { RFPercentage, RFValue } from "react-native-responsive-fontsize";
import { connect } from "react-redux";
import * as colors from "../../../common/colors";
import { ErrorView } from "../../../common/Component/ErrorView";
import * as FONTS from "../../../common/fonts";
import { height, width } from "../../../common/Style";
import StringsOfLanguages from "../../../Localization/stringsoflanguages";
import {
  AuthContext,
  BadgeContext,
  StatuscodeContext,
} from "../../../navigation/AuthContext";
import {
  activateKeepAwake,
  deactivateKeepAwake,
} from "@sayem314/react-native-keep-awake";
import {
  RequestOptimizationCheck,
  checkBatteryOptimization,
} from "../../../common/Utils/batteryOptimizationDisable";

import CustomSidebarMenu from "../../../navigation/CustomSidebarMenu";
import {
  SetNotificationToken,
  GetDashboardAction,
  GetUserDetailsAction,
} from "../../../Redux/actions/Action";
import { CustomAlert } from "../../../common/Component/CustomAlert";
import { BatteryOptimizer } from "./BatteryOptimizer";
import messaging from "@react-native-firebase/messaging";
// import { CustomAlert } from "../../../common/Component/CustomAlert";
const { LocationModule } = NativeModules;
const windowWidth = Dimensions.get("window").width;
const windowHeight = Dimensions.get("window").height;

let setAuthC;
let setBadgeC;
let setCodeC;
class Dashboard extends Component {
  static contextType = AuthContext;
  constructor(props) {
    super(props);
    this.state = {
      appState: null,
      Loader: true,
      User_Data: "",
      ForDashboard: true,
      ForUser: false,
      Demolist: [],
      LangStr: StringsOfLanguages,
      NotificationCount: 0,
      lang: null,
      Modal: false,
      ModalFreight: false,
      originCoordinates: {
        latitude: 0,
        longitude: 0,
      },
      destinationCoordinates: {
        latitude: 0,
        longitude: 0,
      },
      informationAlert: false,
      showLocationPermissionBanner: false,
      showBatterOptDisableBanner: false,
      showNotificationPermissionBanner: false,
      showTranporterBanner: false,
    };
  }

  async componentDidMount() {
    // let lang = await AsyncStorage.getItem("SelectedLanguage");
    this.setState({ lang: await AsyncStorage.getItem("SelectedLanguage") });

    // For battery Optimazation Check
    await RequestOptimizationCheck();

    // For FcmPermission check
    await this.checkFcmPermissionIOS();

    // this.latlongset();
    // let isOn = await powerSavingOn();

    this.navigateToNotification();

    // APPSTATE LISTENER
    this.appStateSubscription = AppState.addEventListener(
      "change",
      async (nextAppState) => {
        if (nextAppState === "active") {
          if (
            this.state.appState.match(/inactive|background/) &&
            nextAppState === "active"
          ) {
            console.log("App has come to the foreground!");
            this.navigateToNotification();

            // FOR LOCATION PERMISSION "ALWAYS" BANNER
            await this.locationPermissionAlwaysCheck();

            // For battery Optimazation Check
            const optEnabled = await checkBatteryOptimization();
            // showing/hiding Battery optimization Banner
            if (optEnabled)
              this.setState({
                showBatterOptDisableBanner: true,
              });
            else if (this.state.showBatterOptDisableBanner) {
              this.setState({
                showBatterOptDisableBanner: false,
              });
            }

            // For FcmPermission check
            await this.checkFcmPermissionIOS();
          }
        }
        this.setState({ appState: nextAppState });
      }
    );

    this._Reload = this.props.navigation.addListener("focus", async () => {
      this.setState({
        LangStr: StringsOfLanguages,
        ForDashboard: true,
        lang: await AsyncStorage.getItem("SelectedLanguage"),
      });
      await this.props.GetDashboardAction();
      await this.OpenAlertForLocationPermission();
      // this.latlongset();
      console.log("language ===>>===>>>", this.state.lang);
    });
    this.props.GetDashboardAction();

    // this.props.GetRefreshTokenAction();

    // if (this.state.User_Data[0]?.container != null) {
    //   if (this.state.showLocationPermissionBanner) {
    //     if (Platform.OS == "android") {
    //       PermissionsAndroid.check(
    //         "android.permission.ACCESS_FINE_LOCATION"
    //       ).then((response) => {
    //         if (response === true) {
    //           if (Platform.Version >= 29) {
    //             PermissionsAndroid.check(
    //               "android.permission.ACCESS_BACKGROUND_LOCATION"
    //             ).then((response) => {
    //               if (response === true) {
    //                 this.setState({ showLocationPermissionBanner: false });
    //               } else if (response === false) {
    //                 this.setState({ showLocationPermissionBanner: true });

    //                 request(PERMISSIONS.ANDROID.ACCESS_BACKGROUND_LOCATION)
    //                   .then((result) => {
    //                     switch (result) {
    //                       case RESULTS.UNAVAILABLE:
    //                         // alert('This feature is not available (on this device / in this context)');
    //                         break;
    //                       case RESULTS.DENIED:
    //                         Alert.alert("The location permission  is denied.");
    //                         break;
    //                       case RESULTS.LIMITED:
    //                         Alert.alert(
    //                           "The permission is limited: Location tracking may not work smoothly"
    //                         );
    //                         break;
    //                       case RESULTS.GRANTED:
    //                         this.setState({
    //                           showLocationPermissionBanner: false,
    //                         });
    //                         break;
    //                       case RESULTS.BLOCKED:
    //                         Alert.alert(
    //                           "Hold on!",
    //                           "We are not able to track your route because you didn't give permission to access your location. For further process you need to enable location permission from setting.",
    //                           [
    //                             {
    //                               text: "Setting",
    //                               onPress: () => Linking.openSettings(),
    //                             },
    //                           ]
    //                         );
    //                         break;
    //                     }
    //                   })
    //                   .catch((e) => {
    //                     console.log(
    //                       "PERMISSIONS.ANDROID.ACCESS_BACKGROUND_LOCATION+ERROR============>",
    //                       e
    //                     );
    //                   });
    //               }
    //             });
    //           } else {
    //             this.setState({ showLocationPermissionBanner: false });
    //           }
    //           Geolocation.getCurrentPosition(
    //             (position) => {
    //               const initialPosition = position;

    //               this.setState({
    //                 currentCoordinates: {
    //                   latitude: initialPosition.coords.latitude,
    //                   longitude: initialPosition.coords.longitude,
    //                 },
    //               });
    //             },
    //             (error) => console.log("EERRRR: ", error),
    //             {
    //               enableHighAccuracy: true,
    //               timeout: 20000,
    //               maximumAge: 1000,
    //               distanceFilter: 1,
    //             }
    //           );
    //         } else if (response === false) {
    //           console.log("ELSE IF ");
    //           this.setState({ informationAlert: true });
    //           this.setState({ showLocationPermissionBanner: true });
    //         }
    //       });
    //     } else {
    //       // PERMISSION.IOS.ALWAYS_IN_USE ( not implemented, why? )
    //       request(PERMISSIONS.IOS.LOCATION_WHEN_IN_USE).then((result) => {
    //         switch (result) {
    //           case RESULTS.UNAVAILABLE:
    //             // alert('This feature is not available (on this device / in this context)');
    //             break;
    //           case RESULTS.DENIED:
    //             alert(
    //               "The location permission has not been requested / is denied but requestable"
    //             );
    //             this.setState({ showLocationPermissionBanner: true });
    //             break;
    //           case RESULTS.LIMITED:
    //             alert("The permission is limited: some actions are possible");
    //             this.setState({ showLocationPermissionBanner: true });
    //             break;
    //           case RESULTS.GRANTED:
    //             this.setState({ showLocationPermissionBanner: false });
    //             break;
    //           case RESULTS.BLOCKED:
    //             Alert.alert(
    //               "Hold on!",
    //               "We are not able to track your route because you didn't give permission to access your location. For further process you need to enable location permission from setting.",
    //               [{ text: "Setting", onPress: () => Linking.openSettings() }]
    //             );
    //             break;
    //         }
    //       });
    //     }
    //   }
    // }

    if (
      this.state.User_Data[0]?.container != null &&
      this.state.showLocationPermissionBanner
    ) {
      this.handleLocationPermission();
    }
  }

  componentWillUnmount() {
    this.appStateSubscription?.remove();
  }

  // FOR checking iOS Notifications Permission
  async checkFcmPermissionIOS() {
    const authStatus = await messaging().requestPermission();
    const enabled =
      authStatus === messaging.AuthorizationStatus.AUTHORIZED ||
      authStatus === messaging.AuthorizationStatus.PROVISIONAL;
    console.log("messaging().requestPermission--->>>", authStatus, enabled);
    if (enabled) {
      messaging()
        .getToken()
        .then((fcmtoken) => {
          // console.log("fcmtoken--", fcmtoken);
          if (this.state.showNotificationPermissionBanner == true) {
            this.props.SetNotificationToken({
              token: fcmtoken,
            });
            this.setState({
              showNotificationPermissionBanner: false,
            });
          }
        })
        .catch((err) => {
          console.log("err", err);
        });
    } else {
      if (this.state.showNotificationPermissionBanner == false) {
        this.setState({
          showNotificationPermissionBanner: true,
        });
      }
    }
  }

  requestFcmPermission() {
    // Show an alert to the user explaining how to enable the permission in Settings
    Alert.alert(
      "Messaging Permission Required",
      "Please enable messaging permission from Settings",
      [
        {
          text: "Cancel",
          style: "cancel",
        },
        {
          text: "Open Settings",
          onPress: () => {
            Linking.openSettings();
          },
        },
      ]
    );
  }

  // For requesting 'ALWAYS' permission for location android OS >= 10
  async OpenAlertForLocationPermission() {
    const isAndroid = Platform.OS === "android";
    const androidVer = Platform.Version;

    if (isAndroid) {
      request(
        androidVer >= 29
          ? PERMISSIONS.ANDROID.ACCESS_BACKGROUND_LOCATION
          : PERMISSIONS.ANDROID.ACCESS_FINE_LOCATION
      ).then((result) => {
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
            this.setState({ showLocationPermissionBanner: false });
            Geolocation.getCurrentPosition(
              (position) => {
                const initialPosition = position;

                this.setState({
                  currentCoordinates: {
                    latitude: initialPosition.coords.latitude,
                    longitude: initialPosition.coords.longitude,
                  },
                });
              },
              (error) => console.log("EERRRR: ", error),
              {
                enableHighAccuracy: true,
                timeout: 20000,
                maximumAge: 1000,
                distanceFilter: 1,
              }
            );
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
      permission =
        parseInt(Platform.Version, 10) < 13
          ? PERMISSIONS.IOS.LOCATION_ALWAYS
          : PERMISSIONS.IOS.LOCATION_WHEN_IN_USE;

      request(permission).then((result) => {
        switch (result) {
          case RESULTS.UNAVAILABLE:
            // alert('This feature is not available (on this device / in this context)');
            break;
          case RESULTS.DENIED:
            alert("The location permission for always allow is denied.");
            this.setState({ showLocationPermissionBanner: true });
            break;
          case RESULTS.LIMITED:
            alert(
              "The permission is limited: Location tracking may not work smoothly"
            );
            this.setState({ showLocationPermissionBanner: true });
            break;
          case RESULTS.GRANTED:
            this.setState({ showLocationPermissionBanner: false });
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
  }

  locationPermissionAlwaysCheck = () => {
    if (Platform.OS == "android") {
      PermissionsAndroid.check("android.permission.ACCESS_FINE_LOCATION").then(
        (response) => {
          if (response === true) {
            if (Platform.Version >= 29) {
              PermissionsAndroid.check(
                "android.permission.ACCESS_BACKGROUND_LOCATION"
              ).then((response) => {
                if (
                  response === true &&
                  this.state.showLocationPermissionBanner === true
                ) {
                  this.setState({ showLocationPermissionBanner: false });
                } else if (
                  response === false &&
                  this.state.showLocationPermissionBanner === false
                ) {
                  this.setState({ showLocationPermissionBanner: true });
                }
              });
            } else if (this.state.showLocationPermissionBanner === true) {
              this.setState({ showLocationPermissionBanner: false });
            }
          } else if (
            response === false &&
            this.state.showLocationPermissionBanner === false
          ) {
            this.setState({ showLocationPermissionBanner: true });
          }
        }
      );
    } else if (Platform.OS === "ios") {
      var permission;
      permission =
        parseInt(Platform.Version, 10) < 13
          ? PERMISSIONS.IOS.LOCATION_ALWAYS
          : PERMISSIONS.IOS.LOCATION_WHEN_IN_USE;

      check(permission).then((result) => {
        switch (result) {
          case RESULTS.UNAVAILABLE:
            break;
          case RESULTS.DENIED:
            this.setState({ showLocationPermissionBanner: true });
            break;
          case RESULTS.LIMITED:
            this.setState({ showLocationPermissionBanner: true });
            break;
          case RESULTS.GRANTED:
            this.setState({ showLocationPermissionBanner: false });
            break;
          case RESULTS.BLOCKED:
            this.setState({ showLocationPermissionBanner: true });
            break;
        }
      });
    }
  };

  async navigateToNotification() {
    // if (Platform.OS === 'ios') {
    (await AsyncStorage.getItem("FromNotification")) === "true"
      ? [
          this.props.navigation.navigate("Notification"),
          AsyncStorage.setItem("FromNotification", "false"),
        ]
      : (await AsyncStorage.getItem("FromNotification")) === "false"
      ? ""
      : AsyncStorage.setItem("FromNotification", "false");
    // }
  }

  Notificationdatacount() {
    setBadgeC.setbadgeCount(this.state.NotificationCount);
  }

  // async latlongset() {
  //   const Fromdata = await AsyncStorage.getItem("LocationData");
  //   const fromData = JSON.parse(Fromdata);
  //   if (fromData.from.long && fromData.to.long) {
  //     const {
  //       from: { lat: fromLat, long: fromLong, address: fromAddress } = {},
  //       to: { lat: toLat, long: toLong, address: toAddress } = {},
  //     } = fromData;
  //     console.log("from loacation log", fromLat);
  //     this.setState({
  //       originCoordinates: {
  //         latitude: fromLat,
  //         longitude: fromLong,
  //         address: fromAddress,
  //       },
  //       destinationCoordinates: {
  //         latitude: toLat,
  //         longitude: toLong,
  //         address: toAddress,
  //       },
  //     });
  //   }
  // }

  MoveToMap(type) {
    const scheme = Platform.select({
      ios: "maps:0,0?q=",
      android: "geo:0,0?q=",
    });

    const latLng =
      type == 1
        ? `${this.state.destinationCoordinates.latitude}, ${this.state.destinationCoordinates.longitude}`
        : `${this.state.originCoordinates.latitude}, ${this.state.originCoordinates.longitude}`;
    const label =
      type == 1 ? "route to delivery location" : "route to loading location";
    const url = Platform.select({
      ios: `${scheme}${label}@${latLng}`,
      android: `${scheme}${latLng}(${label})`,
    });
    Linking.openURL(url);
  }

  async UNSAFE_componentWillReceiveProps(nextProps) {
    if (this.state.ForUser) {
      if (nextProps.UserData.GetUserDetailsSuccess) {
        const data = await nextProps.UserData.data[0];
        if (nextProps.UserData.data[1] == 200) {
          new CustomSidebarMenu().UpdateUserData(
            await data.name,
            data.email,
            data.image
          );
          this.setState({ ForUser: false, Loader: false });
        }
      }
    }
    // if (nextProps.GetRefreshToken.Getrefreshtokensuccess) {
    //   console.log("hardik1111151515151", nextProps.GetRefreshToken);
    //   if (nextProps.GetRefreshToken.data[1] == 200) {
    //     console.log("hardik", nextProps.GetRefreshToken.data[0].token);
    //     let token = nextProps.GetRefreshToken.data[0].token;
    //     // await AsyncStorage.setItem("AccessToken", token);
    //     console.log("new token", token);
    //   }
    //   if (nextProps.GetRefreshToken.data[1] == 200) {
    // console.log(Response 401)
    // setAuthC.signOut()
    //   }
    //   this.props.GetDashboardAction();
    //   this.props.GetUserDetailsAction();
    // }
    if (this.state.ForDashboard) {
      if (nextProps.Dashboard.GetDashboardSuccess) {
        if (nextProps.Dashboard.data[1] == 200) {
          // console.log(
          //   "nextProps?.Dashboard?.data[0] :",
          //   nextProps?.Dashboard?.data
          // );
          setCodeC.settransCode(
            nextProps?.Dashboard?.data[0]?.transporterStatus?.code
          );
          console.log(
            "Transporter",
            nextProps?.Dashboard?.data[0]?.transporterStatus?.code
          );
          AsyncStorage.setItem(
            "TransporterStatus",
            nextProps?.Dashboard?.data[0]?.transporterStatus?.description
          );
          AsyncStorage.setItem(
            "TransporterCode",
            nextProps?.Dashboard?.data[0]?.transporterStatus?.code
          );
          this.setState(
            {
              User_Data: nextProps?.Dashboard?.data,
              Demolist: nextProps?.Dashboard?.data[0]?.preferredRouteList,
              NotificationCount:
                nextProps?.Dashboard?.data[0]?.unreadNotificationCount,
              ForDashboard: false,
              // Loader: false,
              ForUser: true,
            },
            () => {
              this.Notificationdatacount();
            }
          );

          this.props.GetUserDetailsAction();
          new CustomSidebarMenu().UpdateUserData(
            nextProps?.Dashboard?.data[0].driver.name,
            nextProps?.Dashboard?.data[0].driver.username,
            nextProps?.Dashboard?.data[0].driver.image
          );

          const addressText = (address) => {
            const {
              addressText,
              town,
              city: { originalName: cityName = "" },
              country: { name: countryName = "" },
              postCode,
            } = address;

            return `${addressText ? `${addressText}, ` : ""} ${
              town ? `${town}, ` : ""
            } ${cityName ? `${cityName}, ` : ""} ${
              countryName ? `${countryName} - ` : ""
            } ${postCode ? `${postCode}` : ""} `;
          };

          var fromData = {
            lat: nextProps?.Dashboard?.data[0].container?.fromAddress.latitude,
            long: nextProps?.Dashboard?.data[0].container?.fromAddress
              .longitude,
            address: addressText(
              nextProps?.Dashboard?.data[0].container?.fromAddress
            ),
          };
          var toData = {
            lat: nextProps?.Dashboard?.data[0].container?.toAddress.latitude,
            long: nextProps?.Dashboard?.data[0].container?.toAddress.longitude,
            address: addressText(
              nextProps?.Dashboard?.data[0].container?.toAddress
            ),
          };

          var LocationData = {
            from: fromData,
            to: toData,
          };
          console.log(LocationData, "loccccc");
          AsyncStorage.setItem("LocationData", JSON.stringify(LocationData));
          if (LocationData.from.long && LocationData.to.long) {
            const {
              from: { lat: fromLat, long: fromLong, address: fromAddress } = {},
              to: { lat: toLat, long: toLong, address: toAddress } = {},
            } = LocationData;
            console.log("from loacation log", fromLat);
            this.setState({
              originCoordinates: {
                latitude: fromLat,
                longitude: fromLong,
                address: fromAddress,
              },
              destinationCoordinates: {
                latitude: toLat,
                longitude: toLong,
                address: toAddress,
              },
            });
          }

          AsyncStorage.setItem(
            "Uname",
            nextProps?.Dashboard?.data[0].driver.name
          );
          AsyncStorage.setItem(
            "Uemail",
            nextProps?.Dashboard?.data[0].driver.username
          );
          nextProps?.Dashboard?.data[0]?.container &&
            AsyncStorage.setItem(
              "ContainerId",
              nextProps?.Dashboard?.data[0].container.containerId.toString()
            );
        } else if (nextProps.Dashboard.data[1] == 401) {
          console.log("Response 401");

          // RefreshToken()
          // this.props.GetRefreshTokenAction();
          setAuthC.signOut();
        } else {
          console.log("Something went wrong.");
        }
      } else {
        console.log("Something went wronggg.");
      }
    }
  }

  changeKeepAwake(shouldBeAwake) {
    //To keep screen awake using function Calling
    if (shouldBeAwake) {
      //Make the Screen On for infinite time
      activateKeepAwake();
    } else {
      //Calling the deactivate function to Deactive Keep awake
      deactivateKeepAwake();
    }
  }

  handleLocationPermission = () => {
    if (Platform.OS == "android") {
      PermissionsAndroid.check("android.permission.ACCESS_FINE_LOCATION").then(
        (response) => {
          if (response === true) {
            if (Platform.Version >= 29) {
              PermissionsAndroid.check(
                "android.permission.ACCESS_BACKGROUND_LOCATION"
              ).then((response) => {
                if (response === true) {
                  this.setState({ showLocationPermissionBanner: false });
                } else if (response === false) {
                  this.setState({ showLocationPermissionBanner: true });

                  request(PERMISSIONS.ANDROID.ACCESS_BACKGROUND_LOCATION)
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
                          this.setState({
                            showLocationPermissionBanner: false,
                          });
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
                    })
                    .catch((e) => {
                      console.log(
                        "PERMISSIONS.ANDROID.ACCESS_BACKGROUND_LOCATION+ERROR============>",
                        e
                      );
                    });
                }
              });
            } else {
              this.setState({ showLocationPermissionBanner: false });
            }
            Geolocation.getCurrentPosition(
              (position) => {
                const initialPosition = position;

                this.setState({
                  currentCoordinates: {
                    latitude: initialPosition.coords.latitude,
                    longitude: initialPosition.coords.longitude,
                  },
                });
              },
              (error) => console.log("EERRRR: ", error),
              {
                enableHighAccuracy: true,
                timeout: 20000,
                maximumAge: 1000,
                distanceFilter: 1,
              }
            );
          } else if (response === false) {
            console.log("ELSE IF ");
            this.setState({ informationAlert: true });
            this.setState({ showLocationPermissionBanner: true });
          }
        }
      );
    } else {
      // PERMISSION.IOS.ALWAYS_IN_USE ( not implemented, why? )
      request(PERMISSIONS.IOS.LOCATION_WHEN_IN_USE).then((result) => {
        switch (result) {
          case RESULTS.UNAVAILABLE:
            // alert('This feature is not available (on this device / in this context)');
            break;
          case RESULTS.DENIED:
            alert(
              "The location permission has not been requested / is denied but requestable"
            );
            this.setState({ showLocationPermissionBanner: true });
            break;
          case RESULTS.LIMITED:
            alert("The permission is limited: some actions are possible");
            this.setState({ showLocationPermissionBanner: true });
            break;
          case RESULTS.GRANTED:
            this.setState({ showLocationPermissionBanner: false });
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
  };

  render() {
    return (
      <AuthContext.Consumer>
        {(authContext) => {
          setAuthC = authContext;
          return (
            <BadgeContext.Consumer>
              {(badgeContext) => {
                setBadgeC = badgeContext;

                return (
                  <StatuscodeContext.Consumer>
                    {(ContextValue) => {
                      setCodeC = ContextValue;
                      return (
                        <View
                          style={{
                            flex: 1,
                            backgroundColor: colors.WhiteSmoke,
                          }}
                        >
                          <ScrollView
                            bounces={false}
                            showsVerticalScrollIndicator={false}
                            showsHorizontalScrollIndicator={false}
                          >
                            <StatusBar
                              translucent
                              backgroundColor={colors.WhiteSmoke}
                              barStyle={"dark-content"}
                            />
                            <ScrollView
                              showsVerticalScrollIndicator={false}
                              showsHorizontalScrollIndicator={false}
                              bounces={false}
                            >
                              <View
                                style={{
                                  // width: windowWidth,
                                  alignItems: "center",
                                  flexDirection: "row",
                                  marginTop: width / 30,
                                  marginLeft: "5%",
                                }}
                              >
                                {this.state.User_Data[0]?.driver?.image &&
                                this.state.User_Data[0]?.driver?.image != "" ? (
                                  <Image
                                    style={{
                                      height: RFValue(50),
                                      width: RFValue(50),
                                      backgroundColor: "#dbdbdb",
                                      borderRadius: 100,
                                      marginRight: RFValue(10),
                                    }}
                                    source={{
                                      uri: this.state.User_Data[0]?.driver
                                        ?.image,
                                    }}
                                  />
                                ) : (
                                  <Image
                                    style={{
                                      height: RFValue(50),
                                      width: RFValue(50),
                                      backgroundColor: "#dbdbdb",
                                      borderRadius: 100,
                                      marginHorizontal: RFValue(10),
                                      // marginTop: RFValue(10),
                                    }}
                                    source={require("../../../assets/images/avatar.png")}
                                  />
                                )}
                                <View>
                                  <View
                                    style={{
                                      flexDirection: "row",
                                    }}
                                  >
                                    {this.state.User_Data[0]?.driver?.name ? (
                                      <Text
                                        style={{
                                          fontSize: RFValue(13),
                                          fontFamily: FONTS.SemiBold,
                                          color: "#000",
                                          alignSelf: "flex-start",
                                        }}
                                      >
                                        {this.state.User_Data[0]?.driver?.name
                                          .length > 10
                                          ? this.state.User_Data[0]?.driver?.name.substring(
                                              0,
                                              10
                                            ) + ".."
                                          : this.state.User_Data[0]?.driver
                                              ?.name}
                                      </Text>
                                    ) : (
                                      <Text
                                        style={{
                                          fontSize: RFValue(13),
                                          fontFamily: FONTS.Medium,
                                          color: "#000",
                                        }}
                                      >
                                        {this.state.LangStr.Driver_Name}
                                      </Text>
                                    )}
                                    <Text
                                      style={{
                                        fontSize: RFValue(13),
                                        fontFamily: FONTS.SemiBold,
                                        color: "#000",
                                        alignSelf: "flex-start",
                                      }}
                                    >
                                      {"  "}{this.state.User_Data[0]?.driver?.surname
                                        .length > 10
                                        ? this.state.User_Data[0]?.driver?.surname.substring(
                                            0,
                                            10
                                          ) + ".."
                                        : this.state.User_Data[0]?.driver
                                            ?.surname}
                                    </Text>
                                  </View>
                                  <View
                                    style={{
                                      backgroundColor: colors.LimeGreen,
                                      borderRadius: 25,
                                      paddingHorizontal: 10,
                                      paddingVertical: 5,
                                      marginTop: 3,
                                      width: "100%",
                                    }}
                                  >
                                    <Text
                                      style={{
                                        fontSize: RFValue(10),
                                        fontFamily: FONTS.Medium,
                                        color: colors.White,
                                        textAlign: "center",
                                        // color:
                                        //   this.state.User_Data[0]
                                        //     ?.transporterStatus != null
                                        //     ? this.state.User_Data[0]
                                        //         ?.transporterStatus?.code ==
                                        //       "NOT_WORKING"
                                        //       ? colors.LightRed
                                        //       : this.state.User_Data[0]
                                        //           ?.transporterStatus?.code ==
                                        //         "FREIGHT_CARRYING"
                                        //       ? colors.Blue
                                        //       : colors.LightGreen
                                        //     : "#000",
                                      }}
                                    >
                                      {this.state.User_Data[0]
                                        ?.transporterStatus?.code
                                        ? this.state.User_Data[0]
                                            ?.transporterStatus?.code ==
                                          "NOT_WORKING"
                                          ? this.state.LangStr.LoadedAndOnRoad
                                          : this.state.User_Data[0]
                                              ?.transporterStatus?.code ==
                                            "FREIGHT_CARRYING"
                                          ? this.state.LangStr.PassiveMode
                                          : this.state.LangStr.LookingForFreight
                                        : ""}
                                      {/* {this.state.User_Data[0]
                                      ?.transporterStatus != null
                                      ? this.state.User_Data[0]
                                          ?.transporterStatus.description
                                      : this.state.User_Data[0]?.driver?.email
                                      ? this.state.User_Data[0]?.driver?.email
                                      : this.state.LangStr.Driver_email} */}
                                    </Text>
                                  </View>
                                </View>
                              </View>

                              {/* LOCATION PERMISSION BANNER */}
                              {/* {this.state.showLocationPermissionBanner ? (
                                <TouchableOpacity
                                  onPress={this.OpenAlertForLocationPermission}
                                >
                                  <ImageBackground
                                    resizeMode={"cover"}
                                    style={{
                                      paddingHorizontal: RFValue(10),
                                      paddingVertical: RFValue(15),
                                      width: windowWidth - 20,
                                      borderRadius: 10,
                                      borderWidth: 0.5,
                                      borderColor: "#2F80ED",
                                      alignSelf: "center",
                                      marginTop: RFValue(8),
                                      overflow: "hidden",
                                    }}
                                    source={require("../../../assets/images/Frame_red.png")}
                                  >
                                    <View
                                      style={{
                                        flexDirection: "row",
                                        flex: 1,
                                        justifyContent: "space-between",
                                      }}
                                    >
                                      <View
                                        style={{
                                          marginRight: RFValue(10),
                                          width: "60%",
                                        }}
                                      >
                                        <Text
                                          style={{
                                            color: "white",
                                            fontWeight: "700",
                                          }}
                                        >
                                          {
                                            this.state.LangStr
                                              ?.LocationPermissionAlways
                                          }
                                        </Text>

                                        <Text
                                          style={{
                                            color: "white",
                                            fontWeight: "bold",
                                            fontSize: RFValue(16),
                                            marginVertical: RFValue(2),
                                          }}
                                        >
                                          {this.state.LangStr
                                            ?.LocationSettings + "->"}
                                        </Text>
                                      </View>

                                      <Image
                                        style={{
                                          height: RFValue(60),
                                          width: RFValue(100),
                                        }}
                                        resizeMode="contain"
                                        source={require("../../../assets/images/Art_tracking.png")}
                                      />
                                    </View>
                                  </ImageBackground>
                                </TouchableOpacity>
                              ) : null} */}

                              {this.state.showLocationPermissionBanner ? (
                                <View
                                  style={{
                                    backgroundColor: "#f6e9e8",
                                    width: "90%",
                                    alignSelf: "center",
                                    borderRadius: RFValue(10),
                                    marginTop: RFValue(20),
                                    shadowColor: "black",
                                    shadowOffset: { width: 0, height: 1 },
                                    shadowOpacity: 0.1,
                                    shadowRadius: 2,
                                    elevation: 3,
                                    borderWidth: 1,
                                    borderColor: colors.Red,
                                  }}
                                >
                                  <View style={{ flexDirection: "row" }}>
                                    <View
                                      style={{
                                        width: "70%",
                                        paddingHorizontal: RFValue(20),
                                        paddingVertical: RFValue(10),
                                      }}
                                    >
                                      <Text
                                        style={{
                                          fontFamily: FONTS.LexendRegular,
                                          fontSize: RFValue(14),
                                        }}
                                      >
                                        {StringsOfLanguages.LocationAccessTile}
                                      </Text>
                                      <TouchableOpacity
                                        onPress={
                                          this.OpenAlertForLocationPermission
                                        }
                                        activeOpacity={1}
                                        style={{
                                          marginTop: RFValue(12),
                                          backgroundColor: "#EE1B24",
                                          width: "65%",
                                          alignItems: "center",
                                          justifyContent: "center",
                                          paddingVertical: RFValue(4),
                                          borderRadius: RFValue(30),
                                        }}
                                      >
                                        <Text
                                          style={{
                                            color: colors.White,
                                            fontSize: RFValue(10),
                                            fontFamily: FONTS.LexendSemiBold,
                                            paddingBottom: RFValue(3),
                                          }}
                                        >
                                          {StringsOfLanguages.LocationSetting}
                                        </Text>
                                      </TouchableOpacity>
                                    </View>
                                    <View
                                      style={{
                                        paddingVertical: RFValue(10),
                                        width: "70%",
                                      }}
                                    >
                                      <Image
                                        style={{
                                          height: RFValue(80),
                                          width: RFValue(100),
                                        }}
                                        resizeMode="contain"
                                        source={require("../../../assets/images/onlineTaxi.png")}
                                      />
                                    </View>
                                  </View>
                                </View>
                              ) : null}

                              {/* BACKGROUND ACTIVITY PERMISSION BANNER */}
                              {/* {this.state.showBatterOptDisableBanner ? (
                                <TouchableOpacity
                                  onPress={() => {
                                    RequestOptimizationCheck();
                                  }}
                                >
                                  <ImageBackground
                                    resizeMode={"cover"}
                                    style={{
                                      paddingHorizontal: RFValue(10),
                                      paddingVertical: RFValue(15),
                                      width: windowWidth - 20,
                                      borderRadius: 10,
                                      borderWidth: 0.5,
                                      borderColor: "#2F80ED",
                                      alignSelf: "center",
                                      marginTop: RFValue(8),
                                      overflow: "hidden",
                                    }}
                                    source={require("../../../assets/images/Frame_red.png")}
                                  >
                                    <View
                                      style={{
                                        flexDirection: "row",
                                        flex: 1,
                                        justifyContent: "space-between",
                                      }}
                                    >
                                      <View
                                        style={{
                                          marginRight: RFValue(10),
                                          width: "80%",
                                        }}
                                      >
                                        <Text
                                          style={{
                                            color: "white",
                                            fontWeight: "700",
                                          }}
                                        >
                                          {
                                            this.state.LangStr
                                              ?.BatteryOptDisableReq
                                          }
                                        </Text>

                                        <Text
                                          style={{
                                            color: "white",
                                            fontWeight: "bold",
                                            fontSize: RFValue(16),
                                            marginVertical: RFValue(2),
                                          }}
                                        >
                                          {this.state.LangStr
                                            ?.DisableBatteryOptimization + "->"}
                                        </Text>
                                      </View>

                                      <Image
                                        style={{
                                          height: RFValue(60),
                                          width: RFValue(60),
                                        }}
                                        resizeMode="contain"
                                        source={require("../../../assets/images/spam.png")}
                                      />
                                    </View>
                                  </ImageBackground>
                                </TouchableOpacity>
                              ) : null} */}
                              {this.state.showBatterOptDisableBanner ? (
                                <View
                                  style={{
                                    backgroundColor: "#f6e9e8",
                                    width: "90%",
                                    alignSelf: "center",
                                    borderRadius: RFValue(10),
                                    marginTop: RFValue(20),
                                    paddingHorizontal: RFValue(10),
                                    shadowColor: "black",
                                    shadowOffset: { width: 0, height: 1 },
                                    shadowOpacity: 0.1,
                                    shadowRadius: 2,
                                    elevation: 3,
                                    borderWidth: 1,
                                    borderColor: colors.Red,
                                  }}
                                >
                                  <View style={{ flexDirection: "row" }}>
                                    <View
                                      style={{
                                        width: "70%",
                                        paddingHorizontal: RFValue(20),
                                        paddingVertical: RFValue(10),
                                      }}
                                    >
                                      <Text
                                        style={{
                                          fontFamily: FONTS.LexendRegular,
                                          fontSize: RFValue(14),
                                        }}
                                      >
                                        {
                                          StringsOfLanguages.BattreyOptimizationTile
                                        }
                                      </Text>
                                      <TouchableOpacity
                                        onPress={() => {
                                          RequestOptimizationCheck();
                                        }}
                                        activeOpacity={1}
                                        style={{
                                          marginTop: RFValue(12),
                                          backgroundColor: "#EE1B24",
                                          width: "65%",
                                          alignItems: "center",
                                          justifyContent: "center",
                                          paddingVertical: RFValue(4),
                                          borderRadius: RFValue(30),
                                        }}
                                      >
                                        <Text
                                          style={{
                                            color: colors.White,
                                            fontSize: RFValue(10),
                                            fontFamily: FONTS.LexendSemiBold,
                                            paddingBottom: RFValue(3),
                                          }}
                                        >
                                          {StringsOfLanguages.DisableBattery}
                                        </Text>
                                      </TouchableOpacity>
                                    </View>
                                    <View
                                      style={{
                                        paddingVertical: RFValue(10),
                                        width: "70%",
                                      }}
                                    >
                                      <Image
                                        style={{
                                          height: RFValue(80),
                                          width: RFValue(100),
                                        }}
                                        resizeMode="contain"
                                        source={require("../../../assets/images/batteryOptimization.png")}
                                      />
                                    </View>
                                  </View>
                                </View>
                              ) : null}

                              {/* FCM PERMISSION BANNER */}
                              {this.state.showNotificationPermissionBanner ? (
                                <View
                                  style={{
                                    backgroundColor: "#f6e9e8",
                                    width: "90%",
                                    alignSelf: "center",
                                    borderRadius: RFValue(10),
                                    marginTop: RFValue(20),
                                    paddingHorizontal: RFValue(10),
                                    shadowColor: "black",
                                    shadowOffset: { width: 0, height: 1 },
                                    shadowOpacity: 0.1,
                                    shadowRadius: 2,
                                    elevation: 3,
                                    borderWidth: 1,
                                    borderColor: colors.Red,
                                  }}
                                >
                                  <View style={{ flexDirection: "row" }}>
                                    <View
                                      style={{
                                        width: "70%",
                                        paddingHorizontal: RFValue(20),
                                        paddingVertical: RFValue(10),
                                      }}
                                    >
                                      <Text
                                        style={{
                                          fontFamily: FONTS.LexendRegular,
                                          fontSize: RFValue(14),
                                        }}
                                      >
                                        {
                                          StringsOfLanguages.ReqMessagingPermission
                                        }
                                      </Text>

                                      <TouchableOpacity
                                        onPress={this.requestFcmPermission}
                                        activeOpacity={1}
                                        style={{
                                          marginTop: RFValue(12),
                                          backgroundColor: "#EE1B24",
                                          width: "65%",
                                          alignItems: "center",
                                          justifyContent: "center",
                                          paddingVertical: RFValue(4),
                                          borderRadius: RFValue(30),
                                        }}
                                      >
                                        <Text
                                          style={{
                                            color: colors.White,
                                            fontSize: RFValue(10),
                                            fontFamily: FONTS.LexendSemiBold,
                                            paddingBottom: RFValue(3),
                                          }}
                                        >
                                          {StringsOfLanguages.OpenSetting}
                                        </Text>
                                      </TouchableOpacity>
                                    </View>
                                    <View
                                      style={{
                                        paddingVertical: RFValue(20),
                                        width: "70%",
                                      }}
                                    >
                                      <Image
                                        style={{
                                          height: RFValue(60),
                                          width: RFValue(80),
                                        }}
                                        resizeMode="contain"
                                        source={require("../../../assets/images/SettingtileIcon.png")}
                                      />
                                    </View>
                                  </View>
                                </View>
                              ) : null}

                              {/* TRANSPORTER BANNER */}
                              {/* {this.props.Dashboard?.data &&
                              this.props.Dashboard?.data[0]
                                ?.transporterStatus === null ? (
                                <TouchableOpacity
                                  onPress={() =>
                                    this.props.navigation.navigate(
                                      "AddTransport"
                                    )
                                  }
                                >
                                  <ImageBackground
                                    resizeMode={"cover"}
                                    style={{
                                      paddingHorizontal: RFValue(10),
                                      paddingVertical: RFValue(15),
                                      width: windowWidth - 20,
                                      borderRadius: 10,
                                      borderWidth: 0.5,
                                      borderColor: "#2F80ED",
                                      alignSelf: "center",
                                      marginTop: RFValue(8),
                                      overflow: "hidden",
                                    }}
                                    source={require("../../../assets/images/Frame_red.png")}
                                  >
                                    <View
                                      style={{
                                        flexDirection: "row",
                                        flex: 1,
                                        justifyContent: "space-between",
                                      }}
                                    >
                                      <View
                                        style={{
                                          marginRight: RFValue(10),
                                          width: "60%",
                                        }}
                                      >
                                        <Text
                                          style={{
                                            color: "white",
                                            fontWeight: "700",
                                          }}
                                        >
                                          {
                                            this.state.LangStr
                                              .Select_truck_trailer
                                          }
                                        </Text>

                                        <Text
                                          style={{
                                            color: "white",
                                            fontWeight: "bold",
                                            fontSize: RFValue(16),
                                            marginVertical: RFValue(2),
                                          }}
                                        >
                                          {this.state.LangStr
                                            .SelectTransporter + "->"}
                                        </Text>
                                      </View>

                                      <View
                                        style={{
                                          backgroundColor: "white",
                                          padding: 10,
                                          borderRadius: 10,
                                        }}
                                      >
                                        <Image
                                          style={{
                                            height: RFValue(30),
                                            width: RFValue(30),
                                            alignItems: "center",
                                            justifyContent: "center",
                                          }}
                                          source={require("../../../assets/images/icn_truck1.png")}
                                        />
                                      </View>
                                    </View>
                                  </ImageBackground>
                                </TouchableOpacity>
                              ) : null} */}

                              <View
                                style={{
                                  // flexDirection: "row",
                                  // justifyContent: "space-around",
                                  marginTop: width / 10,
                                }}
                              >
                                <TouchableOpacity
                                  style={{
                                    height: width / 5,
                                    width: "90%",
                                    alignSelf: "center",
                                    alignItems: "center",
                                    borderRadius: 10,
                                    backgroundColor: colors.White,
                                    borderWidth: 1,
                                    borderColor: "#34b26770",
                                    flexDirection: "row",
                                    justifyContent: "space-between",
                                    paddingHorizontal: 10,
                                  }}
                                  onPress={() =>
                                    this.props.navigation.navigate(
                                      "VehicleList"
                                    )
                                  }
                                >
                                  <View
                                    style={{
                                      flexDirection: "row",
                                      alignItems: "center",
                                    }}
                                  >
                                    <View
                                      style={{
                                        backgroundColor: "#34b26730",
                                        height: RFValue(50),
                                        width: RFValue(50),
                                        justifyContent: "center",
                                        alignItems: "center",
                                        borderRadius: 110,
                                        marginRight: 15,
                                      }}
                                    >
                                      <Image
                                        style={{
                                          height: RFValue(12),
                                          width: RFValue(35),
                                        }}
                                        source={require("../../../assets/images/DashboardCarrier/icn_truck.png")}
                                      />
                                    </View>
                                    <Text
                                      numberOfLines={1}
                                      style={{
                                        color: colors.Black,
                                        fontWeight: "700",
                                        width: "70%",
                                        marginVertical: RFValue(2),
                                        opacity: this.state.User_Data[0]
                                          ?.vehicle?.plate
                                          ? 1
                                          : 0.5,
                                      }}
                                    >
                                      {this.state.User_Data[0]?.vehicle?.plate
                                        ? this.state.User_Data[0]?.vehicle
                                            ?.plate
                                        : this.state.LangStr.Vehicle_Plate}
                                    </Text>
                                  </View>
                                  <Image
                                    style={{
                                      height: RFValue(25),
                                      width: RFValue(25),
                                    }}
                                    source={require("../../../assets/images/DashboardCarrier/icn_rightArrowBG.png")}
                                  />
                                </TouchableOpacity>
                                <TouchableOpacity
                                  style={{
                                    height: width / 5,
                                    width: "90%",
                                    alignSelf: "center",
                                    alignItems: "center",
                                    borderRadius: 10,
                                    backgroundColor: colors.White,
                                    borderWidth: 1,
                                    borderColor: "#34b26770",
                                    flexDirection: "row",
                                    marginTop: 10,
                                    justifyContent: "space-between",
                                    paddingHorizontal: 10,
                                  }}
                                  onPress={() =>
                                    this.props.navigation.navigate(
                                      "TrailerList"
                                    )
                                  }
                                >
                                  <View
                                    style={{
                                      flexDirection: "row",
                                      alignItems: "center",
                                    }}
                                  >
                                    <View
                                      style={{
                                        backgroundColor: "#34b26730",
                                        height: RFValue(50),
                                        width: RFValue(50),
                                        justifyContent: "center",
                                        alignItems: "center",
                                        borderRadius: 110,
                                        marginRight: 15,
                                      }}
                                    >
                                      <Image
                                        style={{
                                          height: RFValue(30),
                                          width: RFValue(30),
                                        }}
                                        source={require("../../../assets/images/DashboardCarrier/icn_trailer.png")}
                                      />
                                    </View>
                                    <Text
                                      numberOfLines={1}
                                      style={{
                                        color: colors.Black,
                                        fontWeight: "700",
                                        marginVertical: RFValue(2),
                                        width: "70%",
                                        opacity: this.state.User_Data[0]
                                          ?.trailer?.plate
                                          ? 1
                                          : 0.5,
                                      }}
                                    >
                                      {this.state.User_Data[0]?.trailer?.plate
                                        ? this.state.User_Data[0]?.trailer
                                            ?.plate
                                        : this.state.LangStr.Trailer_plate}
                                    </Text>
                                  </View>
                                  <Image
                                    style={{
                                      height: RFValue(25),
                                      width: RFValue(25),
                                    }}
                                    source={require("../../../assets/images/DashboardCarrier/icn_rightArrowBG.png")}
                                  />
                                </TouchableOpacity>
                              </View>
                              <Text
                                style={{
                                  fontSize: RFValue(14),
                                  fontFamily: FONTS.LexendRegular,
                                  marginLeft: "5%",
                                  marginTop: RFValue(20),
                                  marginBottom: RFPercentage(0.5),
                                  alignSelf: "flex-start",
                                }}
                              >
                                {this.state.LangStr.PreferredRoutes}
                              </Text>
                              <View
                                style={{ width: "95%", alignSelf: "center" }}
                              >
                                {this.state.Demolist &&
                                this.state.Demolist.length > 0 ? (
                                  <FlatList
                                    horizontal={true}
                                    showsVerticalScrollIndicator={false}
                                    showsHorizontalScrollIndicator={false}
                                    data={this.state.Demolist}
                                    keyExtractor={(item, index) => {
                                      index + item?.id;
                                    }}
                                    renderItem={({ item, index }) => {
                                      return (
                                        <>
                                          <View
                                            style={{
                                              margin: RFValue(8),
                                              marginTop: RFValue(5),
                                              height: RFValue(70),
                                              width: RFValue(150),
                                              backgroundColor: colors.White,
                                              borderRadius: RFValue(8),
                                              justifyContent: "center",
                                              flexDirection: "row",
                                              elevation: 0.2,
                                              shadowColor: "#171717",
                                              shadowOffset: {
                                                width: -2,
                                                height: 4,
                                              },
                                              shadowOpacity: 0.2,
                                              shadowRadius: 3,
                                            }}
                                          >
                                            <View
                                              style={{
                                                justifyContent: "space-evenly",
                                                width: "80%",
                                              }}
                                            >
                                              <View
                                                style={{
                                                  flexDirection: "row",
                                                  alignItems: "center",
                                                }}
                                              >
                                                <Image
                                                  resizeMode="contain"
                                                  style={{
                                                    height: RFValue(12),
                                                    width: RFValue(12),
                                                    marginRight: 5,
                                                  }}
                                                  source={require("../../../assets/images/DashboardCarrier/icn_navigation.png")}
                                                />
                                                <Text
                                                  style={{
                                                    fontSize: RFValue(12),
                                                    fontFamily: FONTS.Medium,
                                                    color: "#000",
                                                    width: "80%",
                                                  }}
                                                  numberOfLines={1}
                                                >
                                                  {item.fromCity?.name
                                                    ? item.fromCity?.name + ", "
                                                    : ""}
                                                  {/* ,{" "} */}
                                                  {item.fromCountry?.name}
                                                </Text>
                                              </View>
                                              <View
                                                style={{
                                                  flexDirection: "row",
                                                  alignItems: "center",
                                                }}
                                              >
                                                <Image
                                                  resizeMode="contain"
                                                  style={{
                                                    height: RFValue(12),
                                                    width: RFValue(12),
                                                    marginRight: 5,
                                                  }}
                                                  source={require("../../../assets/images/DashboardCarrier/icn_location.png")}
                                                />
                                                <Text
                                                  style={{
                                                    fontSize: RFValue(12),
                                                    color: "#000",
                                                    fontFamily: FONTS.Medium,
                                                    width: "80%",
                                                  }}
                                                  numberOfLines={1}
                                                >
                                                  {item.toCity?.name
                                                    ? item.toCity?.name + ", "
                                                    : ""}
                                                  {/* ,{" "} */}
                                                  {item.toCountry?.name}
                                                </Text>
                                              </View>
                                            </View>
                                            <Image
                                              resizeMode="contain"
                                              style={{
                                                height: "100%",
                                                width: RFValue(15),
                                              }}
                                              source={require("../../../assets/images/DashboardCarrier/icn_arrow_reverse.png")}
                                            />
                                          </View>
                                        </>
                                      );
                                    }}
                                  />
                                ) : this.state.Loader == false ? (
                                  <ErrorView
                                    title={this.state.LangStr.missingRoute}
                                  />
                                ) : undefined}
                              </View>

                              <Text
                                style={{
                                  fontSize: RFValue(14),
                                  fontFamily: FONTS.LexendRegular,
                                  marginLeft: "5%",
                                  marginTop: RFValue(10),
                                  marginBottom: RFPercentage(0.5),
                                  alignSelf: "flex-start",
                                }}
                              >
                                {this.state.LangStr.Your_freight}
                              </Text>
                              {this.state.User_Data[0]?.container != null ? (
                                <TouchableWithoutFeedback
                                  onPress={() => this.setState({ Modal: true })}
                                >
                                  <View
                                    style={{
                                      height: RFValue(150),
                                      width: "90%",
                                      borderRadius: 10,
                                      backgroundColor: colors.White,
                                      borderWidth: 1,
                                      borderColor: "#34b26770",
                                      paddingHorizontal: "5%",
                                      alignSelf: "center",
                                      marginTop: RFValue(8),
                                      marginBottom: RFValue(120),
                                    }}
                                  >
                                    <View
                                      style={{
                                        flexDirection: "row",
                                        justifyContent: "space-between",
                                        alignItems: "center",
                                        height: RFValue(75),
                                        borderBottomWidth: 1,
                                        borderBottomColor: "#34b26720",
                                      }}
                                    >
                                      <View>
                                        <Text
                                          style={{
                                            fontSize: RFValue(15),
                                            fontFamily: FONTS.SemiBold,
                                            color: colors.Black,
                                          }}
                                        >
                                          {
                                            this.state.User_Data[0]?.container
                                              ?.description
                                          }
                                        </Text>
                                        <View
                                          style={{
                                            borderRadius: 20,
                                            backgroundColor: colors.LimeGreen,
                                            padding: 5,
                                            paddingHorizontal: 10,
                                            alignSelf: "flex-start",
                                            marginTop: 5,
                                          }}
                                        >
                                          <Text
                                            style={{
                                              fontSize: RFValue(12),
                                              fontFamily: FONTS.SemiBold,
                                              color: colors.White,
                                            }}
                                          >
                                            {new Intl.NumberFormat(
                                              this.state.lang + "-IN"
                                            ).format(
                                              this.state.User_Data[0]?.container
                                                ?.price
                                            )}{" "}
                                            {
                                              this.state.User_Data[0]?.container
                                                ?.priceCurrency?.currencyCode
                                            }
                                          </Text>
                                        </View>
                                      </View>

                                      <Image
                                        resizeMode="contain"
                                        style={{
                                          height: RFValue(70),
                                          width: RFValue(70),
                                        }}
                                        source={require("../../../assets/images/DashboardCarrier/icn_truck_freight.png")}
                                      />
                                    </View>
                                    <View
                                      style={{
                                        height: RFValue(75),
                                        width: "100%",
                                        justifyContent: "space-between",
                                        alignItems: "center",
                                        flexDirection: "row",
                                      }}
                                    >
                                      <View style={{ width: "60%" }}>
                                        <View
                                          style={{
                                            alignItems: "center",
                                            flexDirection: "row",
                                            marginBottom: RFValue(5),
                                          }}
                                        >
                                          <Image
                                            resizeMode="contain"
                                            style={{
                                              height: RFValue(14),
                                              width: RFValue(14),
                                            }}
                                            source={require("../../../assets/images/DashboardCarrier/icn_arrow_freight.png")}
                                          />
                                          {this.state.User_Data[0]?.container
                                            ?.fromAddress ? (
                                            <Text
                                              style={{
                                                color: "#000",
                                                marginLeft: 5,
                                                fontSize: RFValue(13),
                                                fontFamily: FONTS.Medium,
                                              }}
                                              numberOfLines={1}
                                            >
                                              {this.state.User_Data[0]
                                                ?.container?.fromAddress?.city
                                                .name +
                                                ", " +
                                                this.state.User_Data[0]
                                                  ?.container?.fromAddress
                                                  .country.name}
                                            </Text>
                                          ) : (
                                            <Text
                                              style={{
                                                color: colors.Grey,
                                                marginLeft: 5,
                                                fontSize: RFValue(13),
                                                fontFamily: FONTS.Medium,
                                              }}
                                            >
                                              {this.state.LangStr.From_Location}
                                            </Text>
                                          )}
                                        </View>
                                        <View
                                          style={{
                                            alignItems: "center",
                                            flexDirection: "row",
                                          }}
                                        >
                                          <Image
                                            resizeMode="contain"
                                            style={{
                                              height: RFValue(14),
                                              width: RFValue(14),
                                            }}
                                            source={require("../../../assets/images/DashboardCarrier/icn_calender_freight.png")}
                                          />
                                          {this.state.User_Data[0]?.container
                                            ?.plannedDepartureDate ? (
                                            <Text
                                              style={{
                                                marginLeft: 5,
                                                color: "#000",
                                                fontSize: RFValue(13),
                                                fontFamily: FONTS.Medium,
                                              }}
                                            >
                                              {
                                                new Date(
                                                  this.state.User_Data[0]?.container?.plannedDepartureDate
                                                )
                                                  .toLocaleString(
                                                    this.state.lang + "-IN"
                                                  )
                                                  .split(" ")[0]
                                                  .split(",")[0]
                                              }
                                            </Text>
                                          ) : (
                                            <Text
                                              style={{
                                                marginLeft: 10,
                                                color: colors.Grey,
                                                fontSize: RFValue(13),
                                                fontFamily: FONTS.Medium,
                                              }}
                                              numberOfLines={1}
                                            >
                                              {
                                                this.state.LangStr
                                                  .Departure_Date
                                              }
                                            </Text>
                                          )}
                                        </View>
                                      </View>
                                      <View style={{ width: "40%" }}>
                                        <View
                                          style={{
                                            alignItems: "center",
                                            flexDirection: "row",
                                            marginBottom: RFValue(5),
                                          }}
                                        >
                                          <Image
                                            resizeMode="contain"
                                            style={{
                                              height: RFValue(14),
                                              width: RFValue(14),
                                            }}
                                            source={require("../../../assets/images/DashboardCarrier/icn_location_freight.png")}
                                          />
                                          {this.state.User_Data[0]?.container
                                            ?.toAddress ? (
                                            <Text
                                              style={{
                                                color: "#000",
                                                marginLeft: 5,
                                                fontSize: RFValue(13),
                                                fontFamily: FONTS.Medium,
                                              }}
                                              numberOfLines={1}
                                            >
                                              {this.state.User_Data[0]
                                                ?.container?.toAddress?.city
                                                .name +
                                                ", " +
                                                this.state.User_Data[0]
                                                  ?.container?.toAddress
                                                  ?.country.name}
                                            </Text>
                                          ) : (
                                            <Text
                                              style={{
                                                color: colors.Grey,
                                                marginLeft: 5,
                                                fontSize: RFValue(13),
                                                fontFamily: FONTS.Medium,
                                              }}
                                              numberOfLines={1}
                                            >
                                              {this.state.LangStr.To_Location}
                                            </Text>
                                          )}
                                        </View>

                                        <View
                                          style={{
                                            alignItems: "center",
                                            flexDirection: "row",
                                          }}
                                        >
                                          <Image
                                            resizeMode="contain"
                                            style={{
                                              height: RFValue(14),
                                              width: RFValue(14),
                                            }}
                                            source={require("../../../assets/images/DashboardCarrier/icn_calender_freight.png")}
                                          />
                                          {this.state.User_Data[0]?.container
                                            ?.plannedArrivalDate ? (
                                            <Text
                                              style={{
                                                marginLeft: 10,
                                                color: "#000",
                                                fontSize: RFValue(13),
                                                fontFamily: FONTS.Medium,
                                              }}
                                            >
                                              {
                                                new Date(
                                                  this.state.User_Data[0]?.container?.plannedArrivalDate
                                                )
                                                  .toLocaleString(
                                                    this.state.lang + "-IN"
                                                  )
                                                  .split(" ")[0]
                                                  .split(",")[0]
                                              }
                                            </Text>
                                          ) : (
                                            <Text
                                              style={{
                                                marginLeft: 5,
                                                color: colors.Grey,
                                                fontSize: RFValue(13),
                                                fontFamily: FONTS.Medium,
                                              }}
                                            >
                                              {this.state.LangStr.Arrival_Date}
                                            </Text>
                                          )}
                                        </View>
                                      </View>
                                    </View>
                                  </View>
                                </TouchableWithoutFeedback>
                              ) : this.state.Loader == false ? (
                                <View
                                  style={{
                                    backgroundColor: "#f6e9e8",
                                    width: "90%",
                                    alignSelf: "center",
                                    borderRadius: RFValue(10),
                                    height: RFValue(100),
                                    marginTop: RFValue(20),
                                    paddingHorizontal: RFValue(10),
                                    shadowColor: "black",
                                    shadowOffset: { width: 0, height: 1 },
                                    shadowOpacity: 0.1,
                                    shadowRadius: 2,
                                    elevation: 3,
                                    borderWidth: 1,
                                    borderColor: colors.Red,
                                    marginBottom: RFValue(100),
                                  }}
                                >
                                  <View style={{ flexDirection: "row" }}>
                                    <View
                                      style={{
                                        width: "70%",
                                        paddingHorizontal: RFValue(10),
                                        paddingVertical: RFValue(30),
                                      }}
                                    >
                                      <Text
                                        style={{
                                          fontFamily: FONTS.LexendRegular,
                                          fontSize: RFValue(14),
                                        }}
                                      >
                                        {StringsOfLanguages.missingFreight}
                                      </Text>

                                      <TouchableOpacity
                                        onPress={() =>
                                          this.props.navigation.navigate(
                                            "AddTransport"
                                          )
                                        }
                                        activeOpacity={6}
                                        style={{
                                          marginTop: RFValue(12),
                                          backgroundColor: "#EE1B24",
                                          width: "65%",
                                          alignItems: "center",
                                          justifyContent: "center",
                                          paddingVertical: RFValue(4),
                                          borderRadius: RFValue(30),
                                        }}
                                      >
                                        <Text
                                          style={{
                                            color: colors.White,
                                            fontSize: RFValue(10),
                                            fontFamily: FONTS.LexendSemiBold,
                                            paddingBottom: RFValue(3),
                                          }}
                                        >
                                          {StringsOfLanguages.CreateApplication}
                                        </Text>
                                      </TouchableOpacity>
                                    </View>
                                    <View
                                      style={{
                                        paddingVertical: RFValue(20),
                                        width: "70%",
                                      }}
                                    >
                                      <Image
                                        style={{
                                          height: RFValue(60),
                                          width: RFValue(80),
                                        }}
                                        resizeMode="contain"
                                        source={require("../../../assets/images/MissingTruck.png")}
                                      />
                                    </View>
                                  </View>
                                </View>
                              ) : undefined}
                            </ScrollView>
                          </ScrollView>
                          <Modal
                            visible={this.state.Modal}
                            style={{
                              justifyContent: "flex-end",
                            }}
                          >
                            <TouchableOpacity
                              style={{
                                height: windowHeight,
                                justifyContent: "flex-end",
                                marginBottom:
                                  Platform.OS === "android"
                                    ? RFPercentage(14)
                                    : RFPercentage(10),
                              }}
                              activeOpacity={1}
                              onPress={() => this.setState({ Modal: false })}
                            >
                              <View
                                style={{
                                  // height: "70%",
                                  width: "100%",
                                  backgroundColor: "#fff",
                                  alignItems: "center",
                                  justifyContent: "center",
                                  borderTopEndRadius: RFValue(25),
                                  borderTopStartRadius: RFValue(25),
                                }}
                              >
                                <View
                                  style={{
                                    alignSelf: "center",
                                    height: RFValue(6),
                                    width: "15%",
                                    backgroundColor: colors.LightGrey,
                                    borderRadius: RFValue(10),
                                    marginTop: 5,
                                  }}
                                />
                                <Image
                                  resizeMode="contain"
                                  style={{
                                    height: RFValue(12),
                                    width: RFValue(12),
                                    alignSelf: "flex-end",
                                    marginRight: RFValue(12),
                                    marginTop: RFValue(10),
                                  }}
                                  source={require("../../../assets/images/DashboardCarrier/icn_close.png")}
                                />

                                <Text
                                  style={{
                                    fontSize: RFValue(16),
                                    fontFamily: FONTS.SemiBold,
                                    color: colors.Black,
                                    marginBottom: 20,
                                  }}
                                >
                                  {StringsOfLanguages.Address}
                                </Text>
                                <View
                                  style={{
                                    backgroundColor: "#34B26820",
                                    width: "90%",
                                    flexDirection: "row",
                                    alignItems: "center",
                                    justifyContent: "space-between",
                                    padding: 20,
                                    borderRadius: 10,
                                  }}
                                >
                                  <View style={{ width: "60%" }}>
                                    <Text
                                      style={{
                                        color: colors.Black,
                                        fontSize: RFValue(12),
                                        fontFamily: FONTS.SemiBold,
                                      }}
                                    >
                                      {StringsOfLanguages.Loadingaddress}
                                    </Text>
                                    <Text
                                      style={{
                                        fontSize: RFValue(12),
                                        fontFamily: FONTS.SemiBold,
                                        color: "#a0a0a0",
                                      }}
                                      numberOfLines={3}
                                    >
                                      {this.state.originCoordinates.address}
                                    </Text>
                                  </View>
                                  <View
                                    style={{
                                      flexDirection: "row",
                                      alignItems: "center",
                                      width: "40%",
                                      justifyContent: "flex-end",
                                    }}
                                  >
                                    {/* <TouchableOpacity
                                    onPress={() => {
                                      this.props.navigation.navigate("Map", {
                                        from: "home",
                                        location: 0,
                                      }),
                                        this.setState({ Modal: false });
                                    }}
                                    style={{
                                      padding: 5,
                                      backgroundColor: "#168bf7",
                                      borderRadius: 5,
                                      paddingHorizontal: 10,
                                    }}
                                  >
                                    <Text style={{ color: "#fff" }}>
                                      {StringsOfLanguages.ShowLocation}
                                    </Text>
                                  </TouchableOpacity> */}
                                    <TouchableOpacity
                                      // onPress={() => this.MoveToMap(0)}
                                      onPress={() => {
                                        activateKeepAwake(),
                                          Platform.OS == "android"
                                            ? LocationModule.openMapNavigation(
                                                this.state.lang,
                                                this.state.originCoordinates
                                                  .latitude,
                                                this.state.originCoordinates
                                                  .longitude
                                              )
                                            : LocationModule.requestRoute(
                                                this.state.originCoordinates
                                                  .latitude,
                                                this.state.originCoordinates
                                                  .longitude,
                                                this.state.lang
                                              );
                                      }}
                                      style={{
                                        padding: 5,
                                        backgroundColor: colors.LimeGreen,
                                        borderRadius: RFValue(20),
                                        marginLeft: RFValue(5),
                                        paddingHorizontal: 10,
                                      }}
                                    >
                                      <Text
                                        numberOfLines={2}
                                        style={{
                                          color: "#fff",
                                          fontSize: RFValue(12),
                                          fontFamily: FONTS.SemiBold,
                                        }}
                                      >
                                        {StringsOfLanguages.GetDirection}
                                      </Text>
                                    </TouchableOpacity>
                                  </View>
                                </View>

                                <View
                                  style={{
                                    backgroundColor: "#34B26820",
                                    width: "90%",
                                    flexDirection: "row",
                                    alignItems: "center",
                                    justifyContent: "space-between",
                                    padding: 20,
                                    borderRadius: 10,
                                    marginTop: RFValue(15),
                                    marginBottom: RFValue(10),
                                  }}
                                >
                                  <View style={{ width: "60%" }}>
                                    <Text
                                      style={{
                                        color: colors.Black,
                                        fontSize: RFValue(12),
                                        fontFamily: FONTS.SemiBold,
                                      }}
                                    >
                                      {StringsOfLanguages.Deliveraddress}
                                    </Text>
                                    <Text
                                      style={{
                                        fontSize: RFValue(12),
                                        fontFamily: FONTS.SemiBold,
                                        color: "#a1a1a1",
                                      }}
                                      numberOfLines={3}
                                    >
                                      {
                                        this.state.destinationCoordinates
                                          .address
                                      }
                                    </Text>
                                  </View>

                                  <View
                                    style={{
                                      flexDirection: "row",
                                      alignItems: "center",
                                      justifyContent: "flex-end",
                                      width: "40%",
                                    }}
                                  >
                                    {/* <TouchableOpacity
                                    onPress={() => {
                                      this.props.navigation.navigate("Map", {
                                        from: "home",
                                        location: 1,
                                      }),
                                        this.setState({ Modal: false });
                                    }}
                                    style={{
                                      padding: 5,
                                      backgroundColor: "#168bf7",
                                      borderRadius: 5,
                                      paddingHorizontal: 10,
                                    }}
                                  >
                                    <Text style={{ color: "#fff" }}>
                                      {StringsOfLanguages.ShowLocation}
                                    </Text>
                                  </TouchableOpacity> */}
                                    <TouchableOpacity
                                      // onPress={() => this.MoveToMap(1)}
                                      onPress={() => {
                                        activateKeepAwake(),
                                          Platform.OS == "android"
                                            ? LocationModule.openMapNavigation(
                                                this.state.lang,
                                                this.state
                                                  .destinationCoordinates
                                                  .latitude,
                                                this.state
                                                  .destinationCoordinates
                                                  .longitude
                                              )
                                            : LocationModule.requestRoute(
                                                this.state
                                                  .destinationCoordinates
                                                  .latitude,
                                                this.state
                                                  .destinationCoordinates
                                                  .longitude,
                                                this.state.lang
                                              );
                                      }}
                                      style={{
                                        padding: 5,
                                        backgroundColor: colors.LimeGreen,
                                        borderRadius: RFValue(20),
                                        marginLeft: RFValue(5),
                                        paddingHorizontal: 10,
                                      }}
                                    >
                                      <Text
                                        style={{
                                          color: "#fff",
                                          fontSize: RFValue(12),
                                          fontFamily: FONTS.SemiBold,
                                        }}
                                      >
                                        {StringsOfLanguages.GetDirection}
                                      </Text>
                                    </TouchableOpacity>
                                  </View>
                                </View>
                                <TouchableOpacity
                                  onPress={() =>
                                    this.props.navigation.navigate(
                                      "ShowFrieghtInContainer",
                                      {
                                        containerId:
                                          this.state.User_Data[0]?.container
                                            ?.containerId,
                                      }
                                    )
                                  }
                                  style={{
                                    padding: RFValue(8),
                                    borderColor: colors.LimeGreen,
                                    borderWidth: 1,
                                    borderRadius: RFValue(20),
                                    marginLeft: RFValue(5),
                                    paddingHorizontal: RFValue(30),
                                    marginTop: RFValue(10),
                                    marginBottom: RFValue(50),
                                  }}
                                >
                                  <Text
                                    style={{
                                      color: colors.Black,
                                      fontSize: RFValue(13),
                                      fontFamily: FONTS.SemiBold,
                                    }}
                                  >
                                    {StringsOfLanguages.showFreightInContainer}
                                  </Text>
                                </TouchableOpacity>
                              </View>
                            </TouchableOpacity>
                          </Modal>
                          {this.state.Loader ? (
                            <ActivityIndicator
                              color={colors.LimeGreen}
                              size={"large"}
                              style={{
                                position: "absolute",
                                top: windowHeight / 3,
                                left: windowWidth / 2.2,
                              }}
                            />
                          ) : // </View>
                          undefined}
                          {this.state.informationAlert && (
                            <CustomAlert
                              title={`${StringsOfLanguages.Information}`}
                              message={`${StringsOfLanguages.LocationString}`}
                              buttonText={`${StringsOfLanguages.Ok}`}
                              ButtonClick={() => {
                                this.setState({ informationAlert: false });
                                request(
                                  PERMISSIONS.ANDROID.ACCESS_FINE_LOCATION
                                ).then(async (result) => {
                                  switch (result) {
                                    case RESULTS.UNAVAILABLE:
                                      // alert('This feature is not available (on this device / in this context)');
                                      break;
                                    case RESULTS.DENIED:
                                      // alert(
                                      //   "The location permission has not been requested / is denied but requestable"
                                      // );
                                      Alert.alert(
                                        "Hold on!",
                                        "We are not able to track your route because you didn't give permission to access your location. For further process you need to enable location permission from setting.",
                                        [
                                          {
                                            text: "Setting",
                                            onPress: () =>
                                              Linking.openSettings(),
                                          },
                                        ]
                                      );
                                      break;
                                    case RESULTS.LIMITED:
                                      alert(
                                        "The permission is limited: some actions are possible"
                                      );
                                      break;
                                    case RESULTS.GRANTED:
                                      Geolocation.getCurrentPosition(
                                        (position) => {
                                          const initialPosition = position;

                                          this.setState({
                                            currentCoordinates: {
                                              latitude:
                                                initialPosition.coords.latitude,
                                              longitude:
                                                initialPosition.coords
                                                  .longitude,
                                            },
                                          });
                                        },
                                        (error) =>
                                          console.log("EERRRR: ", error),
                                        {
                                          enableHighAccuracy: true,
                                          timeout: 20000,
                                          maximumAge: 1000,
                                          distanceFilter: 1,
                                        }
                                      );
                                      await this.OpenAlertForLocationPermission();

                                      break;
                                    case RESULTS.BLOCKED:
                                      Alert.alert(
                                        "Hold on!",
                                        "We are not able to track your route because you didn't give permission to access your location. For further process you need to enable location permission from setting.",
                                        [
                                          {
                                            text: "Setting",
                                            onPress: () =>
                                              Linking.openSettings(),
                                          },
                                        ]
                                      );
                                      break;
                                  }
                                });
                              }}
                            />
                          )}
                        </View>
                      );
                    }}
                  </StatuscodeContext.Consumer>
                );
              }}
            </BadgeContext.Consumer>
          );
        }}
      </AuthContext.Consumer>
    );
  }
}
const mapStateToProps = (state) => {
  return {
    Dashboard: state.Dashboard,
    UserData: state.UserData,
    // GetRefreshToken: state.GetRefreshToken,
  };
};
export default connect(mapStateToProps, {
  GetDashboardAction,
  GetUserDetailsAction,
  SetNotificationToken,
  // GetRefreshTokenAction,
})(Dashboard);

const Styles = StyleSheet.create({
  Image: {
    height: RFValue(107),
    width: RFValue(136),
    margin: RFValue(10),
  },
});
