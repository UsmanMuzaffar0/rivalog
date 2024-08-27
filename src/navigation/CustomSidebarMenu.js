import React from "react";
import {
  SafeAreaView,
  Text,
  View,
  Image,
  TouchableOpacity,
  StatusBar,
  Platform,
  Linking,
} from "react-native";
import { RFPercentage, RFValue } from "react-native-responsive-fontsize";
import AsyncStorage from "@react-native-async-storage/async-storage";

import * as Fonts from "../common/fonts";
import * as colors from "../common/colors";
import { Style } from "../common/Style";
import stringsoflanguages from "../Localization/stringsoflanguages";
import { AuthContext, StatuscodeContext } from "./AuthContext";
import DeviceInfo from "react-native-device-info";
let userName;
let Email;
let ProfileUrl;
let setCodeC;
class CustomSidebarMenu extends React.Component {
  static contextType = AuthContext;

  constructor(props) {
    super(props);
    this.UpdateUserData = this.UpdateUserData.bind(this);
    this.state = {
      Menu1Ary: [
        stringsoflanguages.Driver,
        stringsoflanguages.Vehicle,
        stringsoflanguages.Trailer,
        stringsoflanguages.MyCard,
        stringsoflanguages.Freight,
        stringsoflanguages.Bill,
        stringsoflanguages.GPS,
        stringsoflanguages.User,
      ],
      Menu2Ary: [stringsoflanguages.Settings, stringsoflanguages.Help],
      LangStr: stringsoflanguages,
      userName: "",
      email: "",
      profile: "",
      CARRIER_OPERATOR: null,
      transporterStatus: "",
      transCode: "",
      selectedMenuIndex: -1,
    };
  }

  //  badgeContext = React.useMemo(
  //   () => ({
  //     setTransCode: async (code) => {
  //       console.log("Codeeeeeeee", code);
  //       // setBadge(badge);
  //     },
  //   }),
  //   []
  //   );

  async componentDidMount() {
    console.log("PropsDrawer", this.props);
    this.focusListener = this.props.navigation.addListener(
      "focus",
      async () => {
        this.state.LangStr.setLanguage(
          await AsyncStorage.getItem("SelectedLanguage")
        );
        const CARRIER_OPERATOR = await AsyncStorage.getItem("CARRIER_OPERATOR");
        let TransStatus = await AsyncStorage.getItem("TransporterStatus");
        let TransCode = await AsyncStorage.getItem("TransporterCode");
        console.log("State00", setCodeC);
        console.log("checking CARRIER_OPERATOR", typeof CARRIER_OPERATOR);
        this.setState({ CARRIER_OPERATOR: JSON.parse(CARRIER_OPERATOR) });
        this.setState({
          LangStr: this.state.LangStr,
          transporterStatus: TransStatus,
          transCode: TransCode,
        });
      }
    );
  }

  UpdateUserData(username, email, profile) {
    userName = username;
    Email = email;
    ProfileUrl = profile;
  }

  render() {
    const SignOutContext = this.context;
    return (
      <StatuscodeContext.Consumer>
        {({ settransCode }) => {
          setCodeC = settransCode;
          return (
            <SafeAreaView style={Style.mainView}>
              <StatusBar
                translucent
                backgroundColor={colors.White}
                barStyle={"dark-content"}
              />
              <View>
                <TouchableOpacity
                  style={[
                    Style.InlineViewContainer,
                    {
                      marginHorizontal: RFValue(20),
                      marginVertical: RFValue(10),
                      marginTop: Platform.OS == "ios" ? 20 : 35,
                      paddingTop: Platform.OS == "ios" ? 10 : 45,
                    },
                  ]}
                  onPress={() => {
                    this.props.navigation.navigate("UpdateProfile");
                  }}
                  disabled={true}
                >
                  <View>
                    <View style={[Style.HeaderProfileView]}>
                      {ProfileUrl && ProfileUrl != "" ? (
                        <Image
                          style={[Style.HeaderProfileImg]}
                          source={{ uri: ProfileUrl }}
                        />
                      ) : (
                        <Image
                          style={[Style.HeaderProfileImg]}
                          source={require("../assets/images/avatar.png")}
                        />
                      )}
                    </View>
                  </View>
                  <View style={Style.NameEmailView}>
                    <Text style={[Style.NameTxt]}>
                      {userName && userName != ""
                        ? userName
                        : stringsoflanguages.Name}
                    </Text>
                    <View
                      style={{
                        backgroundColor: colors.LimeGreen,
                        borderRadius: 25,
                        paddingVertical: 3,
                        paddingHorizontal: 10,
                        marginTop: RFValue(3),
                        fontFamily: Fonts.LexendRegular,

                        alignSelf: "flex-start",
                      }}
                    >
                      <Text
                        style={[
                          Style.EmailTxt,

                          {
                            fontSize: RFValue(10),
                            textAlign: "center",
                            color:
                              this.props.Code == "NOT_WORKING"
                                ? colors.LightRed
                                : this.props.Code == "FREIGHT_CARRYING"
                                ? colors.White
                                : colors.White,
                          },
                        ]}
                      >
                        {/* {Email && Email != "" ? Email : stringsoflanguages.Email} */}
                        {/* {this.state.transporterStatus} */}

                        {this.props.Code
                          ? this.props.Code == "NOT_WORKING"
                            ? stringsoflanguages.LoadedAndOnRoad
                            : this.props.Code == "FREIGHT_CARRYING"
                            ? stringsoflanguages.PassiveMode
                            : stringsoflanguages.LookingForFreight
                          : ""}
                      </Text>
                    </View>
                  </View>
                </TouchableOpacity>
              </View>
              <View style={Style.divider} />
              <View style={{ flex: 1 }}>
                <TouchableOpacity
                  activeOpacity={1}
                  onPress={() => {
                    this.setState({ selectedMenuIndex: 0 });
                    this.props.navigation.navigate("DriverList");
                  }}
                  style={[
                    Style.DrawerSubView,
                    {
                      marginTop: RFValue(14),
                      backgroundColor:
                        this.state.selectedMenuIndex === 0 ? "#34b26730" : null,
                    },
                  ]}
                >
                  <Image
                    style={[
                      Style.DrawerMenuImg2,
                      {
                        tintColor:
                          this.state.selectedMenuIndex === 0
                            ? colors.LightGreen
                            : null,
                      },
                    ]}
                    source={require("../assets/images/DriverIcon5.png")}
                  />
                  <Text
                    style={[
                      Style.DrawerText,
                      {
                        color:
                          this.state.selectedMenuIndex === 0
                            ? colors.LightGreen
                            : colors.Black,
                      },
                    ]}
                  >
                    {stringsoflanguages.Driver}
                  </Text>
                </TouchableOpacity>

                <TouchableOpacity
                  activeOpacity={1}
                  onPress={() => {
                    this.setState({ selectedMenuIndex: 1 });
                    this.props.navigation.navigate("VehicleList");
                  }}
                  style={[
                    Style.DrawerSubView,
                    {
                      backgroundColor:
                        this.state.selectedMenuIndex === 1 ? "#34b26730" : null,
                    },
                  ]}
                >
                  <Image
                    style={[
                      Style.DrawerMenuImg2,
                      {
                        tintColor:
                          this.state.selectedMenuIndex === 1
                            ? colors.LightGreen
                            : null,
                      },
                    ]}
                    source={require("../assets/images/LightDruck.png")}
                  />
                  <Text
                    style={[
                      Style.DrawerText,
                      {
                        color:
                          this.state.selectedMenuIndex === 1
                            ? colors.LightGreen
                            : colors.Black,
                      },
                    ]}
                  >
                    {stringsoflanguages.Vehicle}
                  </Text>
                </TouchableOpacity>

                <TouchableOpacity
                  activeOpacity={1}
                  onPress={() => {
                    this.setState({ selectedMenuIndex: 2 });
                    this.props.navigation.navigate("TrailerList");
                  }}
                  style={[
                    Style.DrawerSubView,
                    {
                      backgroundColor:
                        this.state.selectedMenuIndex === 2 ? "#34b26730" : null,
                    },
                  ]}
                >
                  <Image
                    style={[
                      Style.DrawerMenuImg2,
                      {
                        tintColor:
                          this.state.selectedMenuIndex === 2
                            ? colors.LightGreen
                            : null,
                      },
                    ]}
                    source={require("../assets/images/LoadDruck.png")}
                  />
                  <Text
                    style={[
                      Style.DrawerText,
                      {
                        color:
                          this.state.selectedMenuIndex === 2
                            ? colors.LightGreen
                            : colors.Black,
                      },
                    ]}
                  >
                    {stringsoflanguages.Trailer}
                  </Text>
                </TouchableOpacity>

                <TouchableOpacity
                  activeOpacity={1}
                  onPress={() => {
                    this.setState({ selectedMenuIndex: 3 });
                    this.props.navigation.navigate("BankAccountList");
                  }}
                  style={[
                    Style.DrawerSubView,
                    {
                      backgroundColor:
                        this.state.selectedMenuIndex === 3 ? "#34b26730" : null,
                    },
                  ]}
                >
                  <Image
                    style={[
                      Style.DrawerMenuImg2,
                      {
                        tintColor:
                          this.state.selectedMenuIndex === 3
                            ? colors.LightGreen
                            : null,
                      },
                    ]}
                    source={require("../assets/images/Bank.png")}
                  />
                  <Text
                    style={[
                      Style.DrawerText,
                      {
                        color:
                          this.state.selectedMenuIndex === 3
                            ? colors.LightGreen
                            : colors.Black,
                      },
                    ]}
                  >
                    {stringsoflanguages.BankAccountTitle}
                  </Text>
                </TouchableOpacity>

                <TouchableOpacity
                  activeOpacity={1}
                  onPress={() => {
                    this.setState({ selectedMenuIndex: 4 });
                    this.props.navigation.navigate("PreferredRouteList", {
                      Data: 1,
                    });
                  }}
                  style={[
                    Style.DrawerSubView,
                    {
                      backgroundColor:
                        this.state.selectedMenuIndex === 4 ? "#34b26730" : null,
                    },
                  ]}
                >
                  <Image
                    style={[
                      Style.DrawerMenuImg2,
                      {
                        tintColor:
                          this.state.selectedMenuIndex === 4
                            ? colors.LightGreen
                            : null,
                      },
                    ]}
                    source={require("../assets/images/Road2.png")}
                  />
                  <Text
                    style={[
                      Style.DrawerText,
                      {
                        color:
                          this.state.selectedMenuIndex === 4
                            ? colors.LightGreen
                            : colors.Black,
                      },
                    ]}
                  >
                    {stringsoflanguages.PreferredRoute}
                  </Text>
                </TouchableOpacity>

                <TouchableOpacity
                  activeOpacity={1}
                  onPress={() => {
                    this.setState({ selectedMenuIndex: 5 });
                    this.props.navigation.navigate("SubContractList");
                  }}
                  style={[
                    Style.DrawerSubView,
                    {
                      backgroundColor:
                        this.state.selectedMenuIndex === 5 ? "#34b26730" : null,
                    },
                  ]}
                >
                  <Image
                    style={[
                      Style.DrawerMenuImg2,
                      {
                        tintColor:
                          this.state.selectedMenuIndex === 5
                            ? colors.LightGreen
                            : null,
                      },
                    ]}
                    source={require("../assets/images/LoadDruck.png")}
                  />
                  <Text
                    style={[
                      Style.DrawerText,
                      {
                        color:
                          this.state.selectedMenuIndex === 5
                            ? colors.LightGreen
                            : colors.Black,
                      },
                    ]}
                  >
                    {stringsoflanguages.SubContract}
                  </Text>
                </TouchableOpacity>

                <View style={[Style.divider]}></View>

                <View
                  style={[
                    Style.CustomMenuListView,
                    Style.CustomMenuBottomListView,
                  ]}
                >
                  <TouchableOpacity
                    onPress={() => this.props.navigation.navigate("HelpScreen")}
                    style={Style.MenuListItem}
                  >
                    <Image
                      style={Style.MenuFlatListImg}
                      source={require("../assets/images/Vector2.png")}
                    />
                    <Text
                      style={[
                        Style.MenuListItemTxt,
                        { fontFamily: Fonts.LexendRegular },
                      ]}
                    >
                      {stringsoflanguages.Help}{" "}
                      <Text
                        style={[
                          {
                            fontFamily: Fonts.LexendRegular,
                            color: colors.Grey,
                            fontSize: RFPercentage(1.5),
                          },
                        ]}
                      >
                        {"2.7.0"}
                      </Text>
                    </Text>
                  </TouchableOpacity>

                  <TouchableOpacity
                    style={Style.MenuListItem}
                    onPress={() => {
                      AsyncStorage.removeItem("AccessToken");
                      AsyncStorage.removeItem("LocationData");
                      SignOutContext.signOut();
                    }}
                  >
                    <Image
                      style={[Style.MenuFlatListImg, { tintColor: colors.Red }]}
                      source={require("../assets/images/logout1.png")}
                    />
                    <Text
                      style={[
                        Style.MenuListItemTxt,
                        { color: colors.Red, fontFamily: Fonts.LexendRegular },
                      ]}
                    >
                      {stringsoflanguages.Logout}
                    </Text>
                  </TouchableOpacity>

                  {/* <Text>{`CODE PUSH UPDATE 6`}</Text> */}
                </View>
              </View>
            </SafeAreaView>
          );
        }}
      </StatuscodeContext.Consumer>
    );
  }
}

export default CustomSidebarMenu;
