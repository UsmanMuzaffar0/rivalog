import React, { useState } from "react";
import {
  View,
  SafeAreaView,
  Text,
  TouchableOpacity,
  StatusBar,
  NativeModules,
  Platform,
  I18nManager,
  Image,
  FlatList,
  ActivityIndicator,
  Pressable,
} from "react-native";
import { AuthContext } from "../../../navigation/AuthContext";
import { ScrollView } from "react-native-gesture-handler";
import { RFPercentage, RFValue } from "react-native-responsive-fontsize";
import StringsOfLanguages from "../../../Localization/stringsoflanguages";
import { Style, width } from "../../../common/Style";
import * as colors from "../../../common/colors";
import { HeaderWithRefreshOption } from "../../../common/Component/Header";
import Header, { Header2 } from "../../../common/Component/Header";
import AsyncStorage from "@react-native-async-storage/async-storage";
import Button from "../../../common/Component/Button";
import {
  GetVehicleListAction,
  GetTrailerListAction,
  GetUserDetailsAction,
  GetTransportListAction,
  CreateTransporterAction,
  GetTransportTypeList,
} from "../../../Redux/actions";
import { connect } from "react-redux";
import NetChecker from "../../../common/Component/Network";
import Loader from "../../../common/Component/Loader";
import * as Fonts from "../../../common/fonts";
import { TextFieldWithIcon2 } from "../../../common/Component/TextField";
import { DetailsField } from "../../../common/Component/DetailsField";

class AddTransport extends React.Component {
  static contextType = AuthContext;
  constructor(props) {
    super(props);
    this.defaultState = {
      loading: true,
      LangStr: StringsOfLanguages,
      ScrollX: 0,
      CurrentStep: 1, // Total steps : 5
      APIAction: 0,
      isFirstTimeLoaded: true,
      GetVehicleListCall: false,
      VehicleListPageCount: 10,
      VehicleList: [],
      SelectedVehicleObj: {},
      SelectedVehicleID: 0,
      VehicleScrollIndicatorVisible: false,
      VehicleListOffset: 0,
      AddItemVisible: true,
      GetTrailerListCall: false,
      TrailerListPageCount: 10,
      TrailerList: [],
      SelectedTrailerObj: {},
      SelectedTrailerID: 0,
      TrailerScrollIndicatorVisible: false,
      TrailerListOffset: 0,
      TrailerAddItemVisible: true,
      UserData: [],
      GetProfileCall: false,
      TransportList: [],
      IsTransporterAlreadyExists: null,
      CreateTransport: false,
      operator: false,
      tranporterTypeModal: false,
      transporterTypeData: {},
      vehicleTypeModal: false,
      trailerTypeModal: false,
      showDetails: false,
    };
    this.myRef = React.createRef();
    this.state = { ...this.defaultState };
  }

  async componentDidMount() {
    this._Reload = this.props.navigation.addListener("focus", async () => {
      const operator = await AsyncStorage.getItem("CARRIER_OPERATOR");
      console.log("opraqyore==>>", operator);
      if (operator) {
        console.log("Found");
        this.setState({ operator: JSON.parse(operator) });
      }
      // this.setState({...this.defaultState})
      this.FetchVehicleList(true);
    });
    this.props.GetTransportTypeList("", 0, 1000);
  }

  async UNSAFE_componentWillReceiveProps(nextProps) {
    if (this.state.CreateTransport) {
      if (nextProps.CreateTransporterData.createTransporterSuccess) {
        if (nextProps.CreateTransporterData.data[1] == 200) {
          console.log(
            nextProps.CreateTransporterData.data,
            "dataaaaaaaaaaaaaaaaaa"
          );
          this.setState({ loading: false, CreateTransport: false });
          this.props.navigation.navigate("Dashboard");
        } else if (nextProps.CreateTransporterData.data[1] == 401) {
          const SignOutContext = this.context;
          SignOutContext.signOut();
        } else {
          this.setState({ loading: false, CreateTransport: false });
          console.log(nextProps.CreateTransporterData);
          alert(nextProps.CreateTransporterData.data?.[0]?.message);
        }
      }
    }

    if (this.state.GetVehicleListCall == true) {
      if (nextProps.VehicleList.GetVehicleListSuccess) {
        if (nextProps.VehicleList.data[1] == 200) {
          console.log("success vehicle...");
          this.setState({
            VehicleList: await nextProps.VehicleList.data[0],
            VehicleScrollIndicatorVisible: false,
            GetVehicleListCall: false,
          });
          this.FetchTrailerList(false);
        } else if (nextProps.VehicleList.data[1] == 401) {
          const SignOutContext = this.context;
          SignOutContext.signOut();
        } else {
          this.setState({
            VehicleScrollIndicatorVisible: false,
            GetVehicleListCall: false,
          });
          console.log("nextProps.VehicleList");
        }
      }
    }

    if (this.state.GetTrailerListCall == true) {
      if (nextProps.TrailerList.GetTrailerListSuccess) {
        if (nextProps.TrailerList.data[1] == 200) {
          this.setState({
            TrailerList: await nextProps.TrailerList.data[0],
            GetTrailerListCall: false,
            GetProfileCall: true,
          });
          // this.FetchTransporterList(true);
          this.GetProfileInfo();
        } else if (nextProps.TrailerList.data[1] == 401) {
          const SignOutContext = this.context;
          SignOutContext.signOut();
        } else {
          this.setState({ GetTrailerListCall: false });
          console.log("nextProps.TrailerList");
        }
      }
    }

    if (this.state.GetProfileCall == true) {
      if (nextProps.UserData.GetUserDetailsSuccess) {
        if (nextProps.UserData.data[1] == 200) {
          const data = await nextProps.UserData.data[0];

          this.setState({
            UserData: await data,
            GetProfileCall: false,
            loading: false,
          });
        } else if (nextProps.UserData.data[1] == 401) {
          const SignOutContext = this.context;
          SignOutContext.signOut();
        }
      }
    }
  }

  GetProfileInfo() {
    this.props.GetUserDetailsAction();
  }

  onNextStep() {
    if (this.state.CurrentStep == 2 && this.state.SelectedVehicleID == 0) {
      alert("Please select one vehicle.");
      return;
    }

    if (this.state.CurrentStep == 4 && this.state.SelectedTrailerID == 0) {
      alert("Please select one trailer.");
      return;
    }

    if (this.state.CurrentStep == 4 && this.state.SelectedTrailerID > 0) {
      this.checkSelectedTransporterAlreadyExists();
    }

    this.setState({ CurrentStep: this.state.CurrentStep + 1 });
  }

  checkSelectedTransporterAlreadyExists() {
    if (
      this.state.VehicleList.vehicleId == this.state.SelectedVehicleID &&
      this.state.TrailerList.trailerId == this.state.SelectedTrailerID
    )
      this.setState({ IsTransporterAlreadyExists: true });
    else this.setState({ IsTransporterAlreadyExists: false });
  }

  onPreviousStep() {
    if (this.state.CurrentStep == 1) this.props.navigation.goBack();
    else this.setState({ CurrentStep: this.state.CurrentStep - 1 });
  }

  async FetchVehicleList(showLoader) {
    console.log("FETCHHHHHH");
    const NetworkStatus = NetChecker();
    if ((await NetworkStatus) == false) {
      alert("network issue ");
      return;
    }
    this.setState({ GetVehicleListCall: true });
    this.props.GetVehicleListAction("", 0, this.state.VehicleListPageCount);
  }

  async FetchTrailerList(showLoader) {
    const NetworkStatus = NetChecker();
    if ((await NetworkStatus) == false) {
      alert("network issue ");
      return;
    }

    this.setState({ GetTrailerListCall: true, isFirstTimeLoaded: false });

    this.props.GetTrailerListAction("", 0, this.state.TrailerListPageCount);
  }

  async FetchTransporterList(showLoader) {
    const NetworkStatus = NetChecker();
    if ((await NetworkStatus) == false) {
      alert("network issue ");
      return;
    }

    this.setState({ APIAction: 1 });
    this.props.GetTransportListAction();
  }

  RenderVehicleItem = (data) => {
    return (
      // <View
      //   style={[
      //     Style.TrailerListItemContailer,
      //     {
      //       backgroundColor:
      //         data.vehicleId == this.state.SelectedVehicleID
      //           ? colors.SemiLightGrey
      //           : colors.White,
      //       borderColor:
      //         data.vehicleId == this.state.SelectedVehicleID
      //           ? colors.Blue
      //           : colors.BlueHaze,
      //     },
      //   ]}
      // >
      //   <TouchableOpacity
      //     style={{}}
      //     onPress={() =>
      //       this.setState({
      //         SelectedVehicleObj: data,
      //         SelectedVehicleID: data.vehicleId,
      //         vehicleTypeModal: false,
      //       })
      //     }
      //   >
      //     <View style={{ flexDirection: "row" }}>
      //       <View>
      //         {data?.vehicleType?.vehicleTypeId == 1 ? (
      //           <Image
      //             source={require("../../../assets/images/icn_vehicle_van.png")}
      //             style={[Style.IconImg]}
      //           />
      //         ) : data?.vehicleType?.vehicleTypeId == 2 ? (
      //           <Image
      //             source={require("../../../assets/images/icn_vehicle_truck.png")}
      //             style={[Style.IconImg]}
      //           />
      //         ) : (
      //           <Image
      //             source={require("../../../assets/images/icn_vehicle_long_truck.png")}
      //             style={[Style.IconImg]}
      //           />
      //         )}
      //       </View>
      //       <View
      //         style={{
      //           flex: 1,
      //           justifyContent: "center",
      //           paddingLeft: RFValue(10),
      //         }}
      //       >
      //         <Text style={Style.NameTxt}>
      //           {data.plate == "" ? "TR 01 AB 0001" : data.plate}
      //         </Text>
      //       </View>
      //     </View>
      //     <View
      //       style={{
      //         flexDirection: "row",
      //         flex: 1,
      //         marginVertical: RFValue(10),
      //       }}
      //     >
      //       <View style={{ flex: 1 }}>
      //         <Text
      //           style={[
      //             Style.EmailTxt,
      //             { color: colors.Grey, marginBottom: RFValue(2) },
      //           ]}
      //         >
      //           {this.state.LangStr.VehicleType}
      //         </Text>
      //         <Text style={Style.DropdownItemTxt}>
      //           {data.vehicleType.description}
      //         </Text>
      //       </View>
      //       <View style={{ flex: 1 }}>
      //         <Text
      //           style={[
      //             Style.EmailTxt,
      //             { color: colors.Grey, marginBottom: RFValue(2) },
      //           ]}
      //         >
      //           {this.state.LangStr.Model}
      //         </Text>
      //         <Text style={Style.DropdownItemTxt}>{data.model}</Text>
      //       </View>
      //     </View>
      //   </TouchableOpacity>
      // </View>
      <View style={Style.TrailerListItemContailer}>
        <TouchableOpacity
          style={{
            flexDirection: "row",
            alignItems: "center",
            width: "98%",
            alignSelf: "center",
          }}
          onPress={() =>
            this.setState({
              SelectedVehicleObj: data,
              SelectedVehicleID: data.vehicleId,
              vehicleTypeModal: false,
            })
          }
        >
          <View
            style={{
              width: "25%",
              justifyContent: "center",
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
              }}
            >
              {data.vehicleType.vehicleTypeId == 1 ? (
                <Image
                  source={require("../../../assets/images/icn_vehicle_van.png")}
                  style={[Style.IconImg2]}
                />
              ) : data.vehicleType.vehicleTypeId == 2 ? (
                <Image
                  source={require("../../../assets/images/icn_vehicle_truck.png")}
                  style={[Style.IconImg2]}
                />
              ) : (
                <Image
                  source={require("../../../assets/images/DashboardCarrier/icn_truck.png")}
                  style={[Style.IconImg2]}
                />
              )}
            </View>

            <Text
              numberOfLines={1}
              style={[
                Style.NameTxt,
                {
                  marginTop: 5,
                  width: "90%",
                  textAlign: "center",
                },
              ]}
            >
              {" "}
              {data.plate == "" ? "TR 01 AB 0001" : data.plate}
            </Text>
          </View>
          <View
            style={{
              width: 1,
              height: "80%",
              backgroundColor: "#EBF7F0",
              marginHorizontal: RFValue(10),
            }}
          />

          <View style={{ width: "35%" }}>
            <Text style={[Style.VehicleType, { marginBottom: RFValue(12) }]}>
              {this.state.LangStr.Type}
            </Text>
            <Text style={Style.VehicleType2}>
              {data.vehicleType.description}
            </Text>
          </View>
          <View style={{ width: "35%" }}>
            <Text style={[Style.VehicleType, { marginBottom: RFValue(12) }]}>
              {this.state.LangStr.Model}
            </Text>
            <Text style={Style.VehicleType2}>{data.model}</Text>
          </View>
        </TouchableOpacity>
      </View>
    );
  };

  onLoadMoreItems = () => {
    this.setState(
      {
        VehicleListPageCount: this.state.VehicleListPageCount + 5,
        VehicleScrollIndicatorVisible: true,
      },
      () => {
        this.FetchVehicleList(false);
      }
    );
  };

  onTrailerListLoadMoreItems = () => {
    this.setState(
      {
        TrailerListPageCount: this.state.TrailerListPageCount + 5,
        TrailerScrollIndicatorVisible: true,
      },
      () => {
        this.FetchTrailerList(false);
      }
    );
  };

  RenderTrailerItem = (data) => {
    return (
      // <View
      //   style={[
      //     Style.TrailerListItemContailer,
      //     {
      //       backgroundColor:
      //         data.trailerId == this.state.SelectedTrailerID
      //           ? colors.SemiLightGrey
      //           : colors.White,

      //       borderColor:
      //         data.trailerId == this.state.SelectedTrailerID
      //           ? colors.Blue
      //           : colors.BlueHaze,
      //     },
      //   ]}
      // >
      //   <TouchableOpacity
      //     style={{}}
      //     onPress={() =>
      //       this.setState({
      //         SelectedTrailerID: data.trailerId,
      //         SelectedTrailerObj: data,
      //         trailerTypeModal: false,
      //       })
      //     }
      //   >
      //     <View>
      //       <Text style={Style.NameTxt}>{data.plate}</Text>
      //     </View>
      //     <View
      //       style={{
      //         flexDirection: "row",
      //         flex: 1,
      //         marginVertical: RFValue(10),
      //       }}
      //     >
      //       <View style={{ flex: 1 }}>
      //         <Text
      //           style={[
      //             Style.EmailTxt,
      //             { color: colors.Grey, marginBottom: RFValue(2) },
      //           ]}
      //         >
      //           {this.state.LangStr.TrailerType}
      //         </Text>
      //         <Text style={Style.DropdownItemTxt}>
      //           {data.trailerType ? data.trailerType.description : ""}
      //         </Text>
      //       </View>
      //       <View style={{ flex: 1 }}>
      //         <Text
      //           style={[
      //             Style.EmailTxt,
      //             { color: colors.Grey, marginBottom: RFValue(2) },
      //           ]}
      //         >
      //           {this.state.LangStr.FloorType}
      //         </Text>
      //         <Text style={Style.DropdownItemTxt}>
      //           {data.floorType ? data.floorType.description : ""}
      //         </Text>
      //       </View>
      //     </View>
      //     {data.specificationList ? (
      //       <ScrollView
      //         horizontal={true}
      //         showsHorizontalScrollIndicator={false}
      //       >
      //         <View
      //           onStartShouldSetResponder={() => true}
      //           style={{ flexDirection: "row" }}
      //         >
      //           {data.specificationList.map((specificationData, index) => (
      //             <View style={Style.TrailerSpecificationItemContainer}>
      //               <Text style={Style.EmailTxt}>
      //                 {specificationData.description}
      //               </Text>
      //             </View>
      //           ))}
      //         </View>
      //       </ScrollView>
      //     ) : null}
      //   </TouchableOpacity>
      // </View>
      <View style={Style.TrailerListItemContailer}>
        <TouchableOpacity
          style={{
            flexDirection: "row",
            alignItems: "center",
            width: "98%",
            alignSelf: "center",
          }}
          onPress={() =>
            this.setState({
              SelectedTrailerID: data.trailerId,
              SelectedTrailerObj: data,
              trailerTypeModal: false,
            })
          }
        >
          <View
            style={{
              width: "25%",
              justifyContent: "center",
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
              }}
            >
              <Image
                source={require("../../../assets/images/DashboardCarrier/icn_trailer.png")}
                style={[Style.IconImg2]}
              />
            </View>

            <Text
              numberOfLines={1}
              style={[
                Style.NameTxt,
                {
                  fontSize: RFValue(12),
                  marginTop: 5,
                  width: "90%",
                  textAlign: "center",
                },
              ]}
            >
              {" "}
              {this.state.isDevelopmentMode ? "TR 01 AB 0001" : data.plate}
            </Text>
          </View>
          <View
            style={{
              width: 1,
              height: "80%",
              backgroundColor: "#EBF7F0",
              marginHorizontal: RFValue(10),
            }}
          />
          <View style={{ width: "70%" }}>
            <View
              style={{
                flexDirection: "row",
                alignItems: "center",
                marginBottom: RFValue(8),
                // height: RFValue(60),
              }}
            >
              <View style={{ width: "50%" }}>
                <Text style={[Style.VehicleType, { marginBottom: RFValue(8) }]}>
                  {this.state.LangStr.TrailerType}
                </Text>
                <Text style={Style.VehicleType2}>
                  {data.trailerType ? data.trailerType.description : ""}
                </Text>
              </View>
              <View style={{ width: "50%" }}>
                <Text style={[Style.VehicleType, { marginBottom: RFValue(8) }]}>
                  {this.state.LangStr.FloorType}
                </Text>
                <Text style={Style.VehicleType2}>
                  {data.floorType ? data.floorType.description : ""}
                </Text>
              </View>
            </View>
            <Text style={[Style.VehicleType, { marginBottom: RFValue(8) }]}>
              {this.state.LangStr.TrailerSpecifications}
            </Text>
            {data.specificationList ? (
              <ScrollView
                horizontal={true}
                showsHorizontalScrollIndicator={false}
              >
                <View
                  onStartShouldSetResponder={() => true}
                  style={{ flexDirection: "row" }}
                >
                  {data.specificationList.map((specificationData, index) => (
                    <View style={Style.TrailerSpecificationItemContainer}>
                      <Text
                        style={[
                          Style.EmailTxt,
                          { fontSize: RFValue(9), color: "#666666" },
                        ]}
                      >
                        {specificationData.description}
                      </Text>
                    </View>
                  ))}
                </View>
              </ScrollView>
            ) : null}
          </View>
        </TouchableOpacity>
      </View>
    );
  };

  fetchCurrentStepName() {
    switch (this.state.CurrentStep) {
      case 1:
        return this.state.LangStr.SelectTheVehicle;
      case 2:
        return this.state.LangStr.SelectTheVehicle;
      case 3:
        return this.state.LangStr.SelectTheTrailer;
      case 4:
        return this.state.LangStr.SelectTheTrailer;
      case 5:
        return this.state.LangStr.Save;
    }
  }

  OnClickAddNewItem(action) {
    switch (action) {
      case 1: {
        this.props.navigation.navigate("SaveVehicle", { Action: 3 });
        this.setState({ vehicleTypeModal: false });
        break;
      }
      case 2: {
        this.props.navigation.navigate("SaveTrailer", { Action: 3 });
        this.setState({ trailerTypeModal: false });
        break;
      }
    }
  }
  // RenderPlusIcon(action) {
  //   return (
  //     <TouchableOpacity
  //       disabled={!this.state.operator}
  //       onPress={() => {
  //         this.OnClickAddNewItem(action);
  //       }}
  //       style={{
  //         alignItems: "center",
  //         justifyContent: "center",
  //         paddingHorizontal: 20,
  //       }}
  //     >
  //       <Image
  //         style={{
  //           height: RFPercentage(4),
  //           width: RFPercentage(4),
  //           resizeMode: "contain",
  //           backgroundColor: colors.SemiLightGrey,
  //           borderRadius: 20,
  //         }}
  //         source={require("../../../assets/images/icn_add.png")}
  //       />
  //     </TouchableOpacity>
  //   );
  // }

  CreateNewTransporter() {
    this.setState({ loading: true, CreateTransport: true });
    this.props.CreateTransporterAction({
      vehicleId: this.state.SelectedVehicleID,
      trailerId: this.state.SelectedTrailerID,
      transporterTypeId: this.state.transporterTypeData?.transportTypeId,
      driverId: this.state.UserData?.userId,
    });
  }

  render() {
    const { SelectedTrailerObj, SelectedVehicleObj } = this.state;

    return (
      <SafeAreaView style={[Style.mainView, { marginTop: RFValue(20) }]}>
        <Header2
          Title={this.state.LangStr.CreateTransporter}
          BackButton={true}
          BackAction={() => this.props.navigation.goBack()}
        />
        <View style={Style.mainView}>
          <View
            style={{
              backgroundColor: "lightgrey",
              flexDirection: "row",
              // marginTop:
              //   Platform.OS == "android"
              //     ? StatusBar.currentHeight + RFValue(15)
              //     : RFValue(15),
            }}
          >
            {
              // this.state.operator ?
              this.state.CurrentStep == 2 || this.state.CurrentStep == 4 ? (
                <TouchableOpacity
                  disabled={!this.state.operator}
                  onPress={() => this.OnClickAddNewItem()}
                  style={{
                    alignItems: "center",
                    justifyContent: "center",
                    paddingHorizontal: 20,
                  }}
                >
                  <Image
                    style={{
                      height: RFPercentage(4),
                      width: RFPercentage(4),
                      resizeMode: "contain",
                      backgroundColor: "white",
                      borderRadius: 20,
                    }}
                    source={require("../../../assets/images/icn_add.png")}
                  />
                </TouchableOpacity>
              ) : null
              // : null
            }
          </View>

          {/* <View
            style={{
              borderBottomColor: "lightgrey",
              borderBottomWidth: 1,
              paddingVertical: 5,
            }}
          >
            <View
              style={{
                height: RFValue(40),
                flexDirection: "row",
                marginHorizontal: 20,
              }}
            >
              <View style={{ flexDirection: "row", width: (width - 70) / 4 }}>
                <View
                  style={{
                    borderWidth: 1,
                    backgroundColor:
                      this.state.CurrentStep >= 1 ? colors.Blue : "white",
                    borderColor: colors.Blue,
                    borderRadius: 15,
                    height: 30,
                    width: 30,
                    alignSelf: "center",
                    alignItems: "center",
                    justifyContent: "center",
                  }}
                >
                  <Text
                    style={{
                      color:
                        this.state.CurrentStep >= 1 ? "white" : colors.Blue,
                      fontSize: 15,
                    }}
                  >
                    1
                  </Text>
                </View>
                <View
                  style={{
                    height: 1,
                    backgroundColor:
                      this.state.CurrentStep >= 2 ? colors.Blue : "lightgrey",
                    width: "100%",
                    alignSelf: "center",
                    justifyContent: "center",
                  }}
                ></View>
              </View>
              <View style={{ flexDirection: "row", width: (width - 70) / 4 }}>
                <View
                  style={{
                    borderWidth: 1,
                    backgroundColor:
                      this.state.CurrentStep >= 2 ? colors.Blue : "white",
                    borderRadius: 15,
                    height: 30,
                    borderColor: colors.Blue,
                    width: 30,
                    alignSelf: "center",
                    alignItems: "center",
                    justifyContent: "center",
                  }}
                >
                  <Text
                    style={{
                      color:
                        this.state.CurrentStep >= 2 ? "white" : colors.Blue,
                      fontSize: 15,
                    }}
                  >
                    2
                  </Text>
                </View>
                <View
                  style={{
                    height: 1,
                    backgroundColor:
                      this.state.CurrentStep >= 3 ? colors.Blue : "lightgrey",
                    width: "100%",
                    borderColor: colors.Blue,
                    alignSelf: "center",
                    justifyContent: "center",
                  }}
                ></View>
              </View>
              <View style={{ flexDirection: "row", width: (width - 70) / 4 }}>
                <View
                  style={{
                    borderWidth: 1,
                    backgroundColor:
                      this.state.CurrentStep >= 3 ? colors.Blue : "white",
                    borderRadius: 15,
                    height: 30,
                    width: 30,
                    alignSelf: "center",
                    borderColor: colors.Blue,
                    alignItems: "center",
                    justifyContent: "center",
                  }}
                >
                  <Text
                    style={{
                      color:
                        this.state.CurrentStep >= 3 ? "white" : colors.Blue,
                      fontSize: 15,
                    }}
                  >
                    3
                  </Text>
                </View>
                <View
                  style={{
                    height: 1,
                    backgroundColor:
                      this.state.CurrentStep >= 4 ? colors.Blue : "lightgrey",
                    width: "100%",
                    alignSelf: "center",
                    justifyContent: "center",
                  }}
                ></View>
              </View>
              <View style={{ flexDirection: "row", width: (width - 70) / 4 }}>
                <View
                  style={{
                    borderWidth: 1,
                    backgroundColor:
                      this.state.CurrentStep >= 4 ? colors.Blue : "white",
                    borderRadius: 15,
                    height: 30,
                    width: 30,
                    borderColor: colors.Blue,
                    alignSelf: "center",
                    alignItems: "center",
                    justifyContent: "center",
                  }}
                >
                  <Text
                    style={{
                      color:
                        this.state.CurrentStep >= 4 ? "white" : colors.Blue,
                      fontSize: 15,
                    }}
                  >
                    4
                  </Text>
                </View>
                <View
                  style={{
                    height: 1,
                    backgroundColor:
                      this.state.CurrentStep >= 5 ? colors.Blue : "lightgrey",
                    width: "100%",
                    alignSelf: "center",
                    justifyContent: "center",
                  }}
                ></View>
              </View>
              <View
                style={{
                  borderWidth: 1,
                  backgroundColor:
                    this.state.CurrentStep >= 5 ? colors.Blue : "white",
                  borderRadius: 15,
                  borderColor: colors.Blue,
                  height: 30,
                  width: 30,
                  alignSelf: "center",
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                <Text
                  style={{
                    color: this.state.CurrentStep >= 5 ? "white" : colors.Blue,
                    fontSize: 15,
                  }}
                >
                  5
                </Text>
              </View>
            </View>
          </View> */}
          <View
            style={[
              Style.componentContainerView,
              { marginBottom: 0, marginTop: 20 },
            ]}
          >
            {!this.state.showDetails ? (
              <>
                <TextFieldWithIcon2
                  name={this.state.LangStr.TransportType}
                  editable={false}
                  value={this.state.transporterTypeData?.description}
                  placeholder={this.state.LangStr.SelectTransportType}
                  backgroundColor={colors.silverLight}
                  onPress={() => this.setState({ tranporterTypeModal: true })}
                  styles={{ justifyContent: "space-between", zIndex: 1 }}
                  onClick={() => this.setState({ tranporterTypeModal: false })}
                  cModal={this.state.tranporterTypeModal}
                  modalData={
                    (this.props.TransportTypeList?.data &&
                      this.props.TransportTypeList?.data[0]) ||
                    []
                  }
                  showValue={["description"]}
                  setCity={(e) => {
                    // setSelectedTransportId(e.transportTypeId);
                    this.setState({ transporterTypeData: e });
                  }}
                />
                <TextFieldWithIcon2
                  name={this.state.LangStr.VehicleType}
                  editable={false}
                  value={
                    this.state.SelectedVehicleObj?.plate == ""
                      ? "TR 01 AB 0001"
                      : this.state.SelectedVehicleObj?.plate
                  }
                  placeholder={this.state.LangStr.SelectVehicleType}
                  backgroundColor={colors.silverLight}
                  onPress={() => this.setState({ vehicleTypeModal: true })}
                  styles={{ justifyContent: "space-between", zIndex: 1 }}
                  onClick={() => this.setState({ vehicleTypeModal: false })}
                  cModal={this.state.vehicleTypeModal}
                  modalData={this.state.VehicleList}
                  renderItems={({ item }) => this.RenderVehicleItem(item)}
                  showValue={["description"]}
                  // rightIcon={this.RenderPlusIcon(1)}
                />
                <TextFieldWithIcon2
                  name={this.state.LangStr.Trailer_Type}
                  editable={false}
                  value={this.state.SelectedTrailerObj?.plate}
                  placeholder={this.state.LangStr.SelectTrailerType}
                  backgroundColor={colors.silverLight}
                  onPress={() => this.setState({ trailerTypeModal: true })}
                  styles={{ justifyContent: "space-between", zIndex: 1 }}
                  onClick={() => this.setState({ trailerTypeModal: false })}
                  cModal={this.state.trailerTypeModal}
                  modalData={this.state.TrailerList}
                  renderItems={({ item }) => this.RenderTrailerItem(item)}
                  showValue={["description"]}
                  // rightIcon={this.RenderPlusIcon(2)}
                />
              </>
            ) : (
              <View style={{ flex: 1 }}>
                {/* {this.state.CurrentStep == 1 ? (
                <View
                  style={{
                    justifyContent: "center",
                    flex: 1,
                    alignItems: "center",
                    marginBottom: RFValue(70),
                  }}
                >
                  <Image
                    style={{
                      height: RFPercentage(30),
                      width: RFPercentage(30),
                      resizeMode: "contain",
                    }}
                    source={require("../../../assets/images/icn_Vehicle.png")}
                  />
                  <Text
                    style={{
                      textAlign: "center",
                      fontFamily: Fonts.Regular,
                      fontSize: RFValue(15),
                    }}
                  >
                    {this.state.LangStr.PleaseSelectTheTruckYouDrive}
                  </Text>
                </View>
              ) : this.state.CurrentStep == 2 ? (
                <View style={{ flex: 1 }}>
                  {this.state.VehicleList.length > 0 ? (
                    <FlatList
                      data={this.state.VehicleList}
                      keyExtractor={(item, index) => index.toString()}
                      renderItem={({ item }) => this.RenderVehicleItem(item)}
                      ListFooterComponent={
                        this.state.VehicleScrollIndicatorVisible ? (
                          <ActivityIndicator size="small" color={colors.Blue} />
                        ) : null
                      }
                      onEndReached={() => this.onLoadMoreItems}
                      onEndThreshold={0}
                      showsVerticalScrollIndicator={false}
                      onScroll={(event) => {
                        let currentOffset = event.nativeEvent.contentOffset.y;
                        this.setState({
                          AddItemVisible:
                            currentOffset <= this.state.VehicleListOffset ||
                            currentOffset <= 0,
                        });
                        this.setState({ VehicleListOffset: currentOffset });
                      }}
                      bounces={false}
                    />
                  ) : (
                    <View
                      style={{
                        justifyContent: "center",
                        alignItems: "center",
                        flex: 1,
                      }}
                    >
                      <Text style={{ textAlign: "center" }}>
                        {this.state.LangStr.NoVehicleDataFound}
                      </Text>
                    </View>
                  )}
                </View>
              ) : this.state.CurrentStep == 3 ? (
                <View
                  style={{
                    justifyContent: "center",
                    flex: 1,
                    alignItems: "center",
                    marginBottom: RFValue(70),
                  }}
                >
                  <Image
                    style={{
                      height: RFPercentage(30),
                      width: RFPercentage(30),
                      resizeMode: "contain",
                    }}
                    source={require("../../../assets/images/icn_Trailer.png")}
                  />
                  <Text
                    style={{
                      textAlign: "center",
                      fontFamily: Fonts.Regular,
                      fontSize: RFValue(15),
                    }}
                  >
                    {this.state.LangStr.PleaseSelectTheTrailerYouDrive}
                  </Text>
                </View>
              ) : this.state.CurrentStep == 4 ? (
                <View style={{ flex: 1 }}>
                  {this.state.TrailerList.length > 0 ? (
                    <FlatList
                      data={this.state.TrailerList}
                      keyExtractor={(item, index) => index.toString()}
                      renderItem={({ item }) => this.RenderTrailerItem(item)}
                      ListFooterComponent={
                        this.state.TrailerScrollIndicatorVisible ? (
                          <ActivityIndicator size="small" color={colors.Blue} />
                        ) : null
                      }
                      onEndReached={() => this.onTrailerListLoadMoreItems}
                      onEndThreshold={0}
                      showsVerticalScrollIndicator={false}
                      onScroll={(event) => {
                        let currentOffset = event.nativeEvent.contentOffset.y;
                        this.setState({
                          AddItemVisible:
                            currentOffset <= this.state.offset ||
                            currentOffset <= 0,
                        });
                        this.setState({ TrailerListOffset: currentOffset });
                      }}
                      bounces={false}
                    />
                  ) : (
                    <View
                      style={{
                        justifyContent: "center",
                        alignItems: "center",
                        flex: 1,
                      }}
                    >
                      <Text style={{ textAlign: "center" }}>
                        {this.state.LangStr.NoTrailerDataFound}
                      </Text>
                    </View>
                  )}
                </View>
              ) : this.state.CurrentStep == 5 ? ( */}
                <ScrollView
                  contentContainerStyle={{ flexGrow: 1 }}
                  showsVerticalScrollIndicator={false}
                >
                  {
                    this.state.IsTransporterAlreadyExists ? (
                      <View>
                        <Text style={Style.NameTxt}>
                          Transporter already exists.
                        </Text>
                      </View>
                    ) : (
                      <View>
                        <View>
                          <Text
                            style={{
                              fontFamily: Fonts.LexendRegular,
                              fontSize: RFValue(14),
                            }}
                          >
                            {this.state.LangStr.UserDetails}
                          </Text>
                          <View style={[Style.TrailerListItemContailer]}>
                            <TouchableOpacity
                              activeOpacity={1}
                              style={{
                                flexDirection: "row",
                                alignItems: "center",
                                width: "98%",
                                alignSelf: "center",
                              }}
                            >
                              <View
                                style={{
                                  width: "20%",
                                  justifyContent: "center",
                                  alignItems: "center",
                                  marginVertical: RFValue(20),
                                }}
                              >
                                <View
                                  style={{
                                    backgroundColor: "#ebf7f0",
                                    height: RFValue(44),
                                    width: RFValue(44),
                                    justifyContent: "center",
                                    alignItems: "center",
                                    borderRadius: RFValue(22),
                                  }}
                                >
                                  <Image
                                    source={require("../../../assets/images/profileIcon.png")}
                                    style={[
                                      Style.IconImg,
                                      {
                                        width: RFPercentage(4),
                                        height: RFPercentage(4),
                                      },
                                    ]}
                                  />
                                </View>
                              </View>
                              <View
                                style={{
                                  width: 1,
                                  height: "80%",
                                  backgroundColor: "#EBF7F0",
                                  marginHorizontal: RFValue(10),
                                }}
                              />
                              <View style={{ width: "90%" }}>
                                <View
                                  style={{
                                    width: "100%",
                                    flexDirection: "row",
                                    marginVertical: RFValue(10),
                                    alignItems: "center",
                                  }}
                                >
                                  <Text
                                    style={{
                                      fontFamily: Fonts.LexendRegular,
                                      fontSize:
                                        Platform.OS === "ios"
                                          ? RFValue(13)
                                          : RFValue(14),
                                    }}
                                  >
                                    {this.state.LangStr.Name}
                                    {":"}
                                  </Text>
                                  <Text
                                    numberOfLines={1}
                                    style={{
                                      color: "#A0A0A0",
                                      marginLeft: RFValue(10),
                                      fontSize:
                                        Platform.OS === "ios"
                                          ? RFValue(13)
                                          : RFValue(14),
                                      width: "55%",
                                    }}
                                  >
                                    {this.state.UserData.name}{" "}
                                    {this.state.UserData.surname}
                                  </Text>
                                </View>

                                <View
                                  style={{
                                    width: "100%",
                                    flexDirection: "row",
                                    marginBottom: RFValue(10),
                                    alignItems: "center",
                                  }}
                                >
                                  <Text
                                    style={{
                                      fontSize:
                                        Platform.OS === "ios"
                                          ? RFValue(13)
                                          : RFValue(14),
                                      fontFamily: Fonts.LexendRegular,
                                    }}
                                  >
                                    {this.state.LangStr.Email}
                                    {":"}
                                  </Text>

                                  <Text
                                    numberOfLines={1}
                                    style={{
                                      color: "#A0A0A0",
                                      marginLeft: RFValue(10),
                                      fontSize:
                                        Platform.OS === "ios"
                                          ? RFValue(13)
                                          : RFValue(14),
                                      width: "55%",
                                    }}
                                  >
                                    {this.state.UserData.email}
                                  </Text>
                                </View>
                                <View
                                  style={{
                                    flexDirection: "row",
                                    alignItems: "center",
                                  }}
                                >
                                  <Text
                                    style={{
                                      fontSize: RFValue(15),
                                      fontSize:
                                        Platform.OS === "ios"
                                          ? RFValue(13)
                                          : RFValue(14),
                                      fontFamily: Fonts.LexendRegular,
                                    }}
                                  >
                                    {this.state.LangStr.MobileNo}
                                    {":"}
                                  </Text>
                                  <Text
                                    style={{
                                      color: "#A0A0A0",
                                      fontSize:
                                        Platform.OS === "ios"
                                          ? RFValue(13)
                                          : RFValue(14),
                                      marginLeft: RFValue(5),
                                    }}
                                  >
                                    {this.state.UserData.mobile}
                                  </Text>
                                </View>
                              </View>
                            </TouchableOpacity>
                          </View>
                        </View>
                        <View style={{ marginTop: RFValue(20) }}>
                          <Text
                            style={{
                              fontFamily: Fonts.LexendRegular,
                              fontSize: RFValue(14),
                              marginBottom: RFValue(10),
                            }}
                          >
                            {this.state.LangStr.TransportDetails}
                          </Text>
                          <DetailsField
                            name={StringsOfLanguages.TransportType}
                            value={this.state.transporterTypeData?.description}
                            icon={require("../../../assets/images/DashboardCarrier/office.png")}
                          />
                        </View>
                        <View>
                          <Text
                            style={{
                              fontFamily: Fonts.LexendRegular,
                              fontSize: RFValue(14),
                            }}
                          >
                            {this.state.LangStr.VehicleDetails}
                          </Text>
                          <View style={[Style.TrailerListItemContailer]}>
                            <TouchableOpacity
                              activeOpacity={1}
                              style={{
                                flexDirection: "row",
                                alignItems: "center",
                                width: "98%",
                                alignSelf: "center",
                              }}
                            >
                              <View
                                style={{
                                  width: "20%",
                                  justifyContent: "center",
                                  alignItems: "center",
                                  marginVertical: RFValue(20),
                                }}
                              >
                                <View
                                  style={{
                                    backgroundColor: "#ebf7f0",
                                    height: RFValue(44),
                                    width: RFValue(44),
                                    justifyContent: "center",
                                    alignItems: "center",
                                    borderRadius: RFValue(22),
                                  }}
                                >
                                  <Image
                                    source={require("../../../assets/images/DashboardCarrier/icn_trailer.png")}
                                    style={[
                                      Style.IconImg,
                                      {
                                        width: RFPercentage(4),
                                        height: RFPercentage(4),
                                      },
                                    ]}
                                  />
                                </View>
                              </View>
                              <View
                                style={{
                                  width: 1,
                                  height: "80%",
                                  backgroundColor: "#EBF7F0",
                                  marginHorizontal: RFValue(10),
                                }}
                              />
                              <View style={{ width: "90%" }}>
                                <View
                                  style={{
                                    width: "100%",
                                    flexDirection: "row",
                                    marginVertical: RFValue(10),
                                    alignItems: "center",
                                  }}
                                >
                                  <Text
                                    style={{
                                      fontFamily: Fonts.LexendRegular,
                                      fontSize:
                                        Platform.OS === "ios"
                                          ? RFValue(13)
                                          : RFValue(14),
                                    }}
                                  >
                                    {this.state.LangStr.Vehicle}
                                    {":"}
                                  </Text>
                                  <Text
                                    numberOfLines={1}
                                    style={{
                                      color: "#A0A0A0",
                                      marginLeft: RFValue(10),
                                      fontSize:
                                        Platform.OS === "ios"
                                          ? RFValue(13)
                                          : RFValue(14),
                                      width: "55%",
                                    }}
                                  >
                                    {SelectedVehicleObj?.plate == ""
                                      ? "-"
                                      : SelectedVehicleObj?.plate}
                                  </Text>
                                </View>

                                <View
                                  style={{
                                    width: "100%",
                                    flexDirection: "row",
                                    marginBottom: RFValue(10),
                                    alignItems: "center",
                                  }}
                                >
                                  <Text
                                    style={{
                                      fontSize:
                                        Platform.OS === "ios"
                                          ? RFValue(13)
                                          : RFValue(14),
                                      fontFamily: Fonts.LexendRegular,
                                    }}
                                  >
                                    {this.state.LangStr.VehicleType}
                                    {":"}
                                  </Text>

                                  <Text
                                    numberOfLines={1}
                                    style={{
                                      color: "#A0A0A0",
                                      marginLeft: RFValue(10),
                                      fontSize:
                                        Platform.OS === "ios"
                                          ? RFValue(13)
                                          : RFValue(14),
                                      width: "55%",
                                    }}
                                  >
                                    {
                                      SelectedVehicleObj?.vehicleType
                                        ?.description
                                    }
                                  </Text>
                                </View>
                                <View
                                  style={{
                                    flexDirection: "row",
                                    alignItems: "center",
                                  }}
                                >
                                  <Text
                                    style={{
                                      fontSize: RFValue(15),
                                      fontSize:
                                        Platform.OS === "ios"
                                          ? RFValue(13)
                                          : RFValue(14),
                                      fontFamily: Fonts.LexendRegular,
                                    }}
                                  >
                                    {this.state.LangStr.Model}
                                    {":"}
                                  </Text>
                                  <Text
                                    style={{
                                      color: "#A0A0A0",
                                      fontSize:
                                        Platform.OS === "ios"
                                          ? RFValue(13)
                                          : RFValue(14),
                                      marginLeft: RFValue(5),
                                    }}
                                  >
                                    {SelectedVehicleObj?.model}
                                  </Text>
                                </View>
                              </View>
                            </TouchableOpacity>
                          </View>
                        </View>
                        <View>
                          <Text
                            style={{
                              fontFamily: Fonts.LexendRegular,
                              fontSize: RFValue(14),
                              marginTop: RFValue(10),
                            }}
                          >
                            {this.state.LangStr.TrailerDetails}
                          </Text>
                          <View style={[Style.TrailerListItemContailer]}>
                            <TouchableOpacity
                              activeOpacity={1}
                              style={{
                                flexDirection: "row",
                                alignItems: "center",
                                width: "98%",
                                alignSelf: "center",
                              }}
                            >
                              <View
                                style={{
                                  width: "20%",
                                  justifyContent: "center",
                                  alignItems: "center",
                                  marginVertical: RFValue(20),
                                }}
                              >
                                <View
                                  style={{
                                    backgroundColor: "#ebf7f0",
                                    height: RFValue(44),
                                    width: RFValue(44),
                                    justifyContent: "center",
                                    alignItems: "center",
                                    borderRadius: RFValue(22),
                                  }}
                                >
                                  <Image
                                    source={require("../../../assets/images/TrailerTruck.png")}
                                    style={[
                                      Style.IconImg,
                                      {
                                        width: RFPercentage(5),
                                        height: RFPercentage(5),
                                      },
                                    ]}
                                  />
                                </View>
                              </View>
                              <View
                                style={{
                                  width: 1,
                                  height: "80%",
                                  backgroundColor: "#EBF7F0",
                                  marginHorizontal: RFValue(10),
                                }}
                              />
                              <View style={{ width: "90%" }}>
                                <View
                                  style={{
                                    width: "100%",
                                    flexDirection: "row",
                                    marginVertical: RFValue(10),
                                    alignItems: "center",
                                  }}
                                >
                                  <Text
                                    style={{
                                      fontFamily: Fonts.LexendRegular,
                                      fontSize:
                                        Platform.OS === "ios"
                                          ? RFValue(13)
                                          : RFValue(14),
                                    }}
                                  >
                                    {this.state.LangStr.Trailer}
                                    {":"}
                                  </Text>
                                  <Text
                                    numberOfLines={1}
                                    style={{
                                      color: "#A0A0A0",
                                      marginLeft: RFValue(10),
                                      fontSize:
                                        Platform.OS === "ios"
                                          ? RFValue(13)
                                          : RFValue(14),
                                      width: "55%",
                                    }}
                                  >
                                    {SelectedTrailerObj.plate}
                                  </Text>
                                </View>

                                <View
                                  style={{
                                    width: "100%",
                                    flexDirection: "row",
                                    marginBottom: RFValue(10),
                                    alignItems: "center",
                                  }}
                                >
                                  <Text
                                    style={{
                                      fontSize:
                                        Platform.OS === "ios"
                                          ? RFValue(13)
                                          : RFValue(14),
                                      fontFamily: Fonts.LexendRegular,
                                    }}
                                  >
                                    {this.state.LangStr.TrailerType}
                                    {":"}
                                  </Text>

                                  <Text
                                    numberOfLines={1}
                                    style={{
                                      color: "#A0A0A0",
                                      marginLeft: RFValue(10),
                                      fontSize:
                                        Platform.OS === "ios"
                                          ? RFValue(13)
                                          : RFValue(14),
                                      width: "55%",
                                    }}
                                  >
                                    {SelectedTrailerObj.trailerType
                                      ? SelectedTrailerObj.trailerType
                                          .description
                                      : ""}
                                  </Text>
                                </View>
                                <View
                                  style={{
                                    flexDirection: "row",
                                    alignItems: "center",
                                  }}
                                >
                                  <Text
                                    style={{
                                      fontSize: RFValue(15),
                                      fontSize:
                                        Platform.OS === "ios"
                                          ? RFValue(13)
                                          : RFValue(14),
                                      fontFamily: Fonts.LexendRegular,
                                    }}
                                  >
                                    {this.state.LangStr.FloorType}
                                    {":"}
                                  </Text>
                                  <Text
                                    style={{
                                      color: "#A0A0A0",
                                      fontSize:
                                        Platform.OS === "ios"
                                          ? RFValue(13)
                                          : RFValue(14),
                                      marginLeft: RFValue(5),
                                    }}
                                  >
                                    {SelectedTrailerObj.floorType
                                      ? SelectedTrailerObj.floorType.description
                                      : ""}
                                  </Text>
                                </View>
                                {SelectedTrailerObj.specificationList ? (
                                  <ScrollView
                                    horizontal={true}
                                    showsHorizontalScrollIndicator={false}
                                  >
                                    <View
                                      onStartShouldSetResponder={() => true}
                                      style={Style.MarginVerticalStyle}
                                    >
                                      {SelectedTrailerObj.specificationList.map(
                                        (specificationData, index) => (
                                          <View
                                            style={
                                              Style.TrailerSpecificationItemContainer
                                            }
                                          >
                                            <Text style={Style.EmailTxt}>
                                              {specificationData.description}
                                            </Text>
                                          </View>
                                        )
                                      )}
                                    </View>
                                  </ScrollView>
                                ) : null}
                              </View>
                            </TouchableOpacity>
                          </View>
                        </View>
                      </View>
                    )
                    // <View>
                    //   {/* <View
                    //     style={[
                    //       Style.TrailerListItemContailer,
                    //       {
                    //         borderColor: colors.BlueHaze,
                    //       },
                    //     ]}
                    //   >
                    //     {/* User data */}
                    //     <View style={{ marginBottom: 10 }}>
                    //       <Text
                    //         style={[
                    //           Style.NameTxt,
                    //           {
                    //             backgroundColor: "lightgrey",
                    //             paddingLeft: 5,
                    //             marginBottom: 8,
                    //           },
                    //         ]}
                    //       >
                    //         {this.state.LangStr.UserDetails}
                    //       </Text>
                    //       <View style={Style.MarginVerticalStyle}>
                    //         <Text
                    //           style={[
                    //             Style.EmailTxt,
                    //             {
                    //               color: colors.Grey,
                    //               marginBottom: RFValue(2),
                    //               flex: 1,
                    //             },
                    //           ]}
                    //         >
                    //           {this.state.LangStr.Name}
                    //         </Text>
                    //         <Text style={[Style.DropdownItemTxt, { flex: 2 }]}>
                    //           {this.state.UserData.name}{" "}
                    //           {this.state.UserData.surname}
                    //         </Text>
                    //       </View>
                    //       <View style={Style.MarginVerticalStyle}>
                    //         <Text
                    //           style={[
                    //             Style.EmailTxt,
                    //             {
                    //               color: colors.Grey,
                    //               marginBottom: RFValue(2),
                    //               flex: 1,
                    //             },
                    //           ]}
                    //         >
                    //           {this.state.LangStr.Email}
                    //         </Text>
                    //         <Text style={[Style.DropdownItemTxt, { flex: 2 }]}>
                    //           {this.state.UserData.email}
                    //         </Text>
                    //       </View>
                    //       <View style={Style.MarginVerticalStyle}>
                    //         <Text
                    //           style={[
                    //             Style.EmailTxt,
                    //             {
                    //               color: colors.Grey,
                    //               marginBottom: RFValue(2),
                    //               flex: 1,
                    //             },
                    //           ]}
                    //         >
                    //           {this.state.LangStr.MobileNo}
                    //         </Text>
                    //         <Text
                    //           style={[Style.DropdownItemTxt, { flex: 2 }]}
                    //         ></Text>
                    //       </View>
                    //     </View>
                    //     {/* Transporter Data */}
                    //     <View style={{ marginBottom: 10 }}>
                    //       <Text
                    //         style={[
                    //           Style.NameTxt,
                    //           {
                    //             backgroundColor: "lightgrey",
                    //             paddingLeft: 5,
                    //             marginBottom: 8,
                    //           },
                    //         ]}
                    //       >
                    //         {this.state.LangStr.TransportDetails}:
                    //       </Text>

                    //       <View style={Style.MarginVerticalStyle}>
                    //         <Text
                    //           style={[
                    //             Style.EmailTxt,
                    //             {
                    //               color: colors.Grey,
                    //               marginBottom: RFValue(2),
                    //               flex: 1,
                    //             },
                    //           ]}
                    //         >
                    //           {this.state.LangStr.TransportType}
                    //         </Text>
                    //         <Text style={[Style.DropdownItemTxt, { flex: 2 }]}>
                    //           {this.state.transporterTypeData?.description}
                    //         </Text>
                    //       </View>
                    //     </View>
                    //     {/* vehical data */}
                    //     <View style={{ marginBottom: 10 }}>
                    //       <Text
                    //         style={[
                    //           Style.NameTxt,
                    //           {
                    //             backgroundColor: "lightgrey",
                    //             paddingLeft: 5,
                    //             marginBottom: 8,
                    //           },
                    //         ]}
                    //       >
                    //         {this.state.LangStr.VehicleDetails}
                    //       </Text>
                    //       <View style={Style.MarginVerticalStyle}>
                    //         <Text
                    //           style={[
                    //             Style.EmailTxt,
                    //             {
                    //               color: colors.Grey,
                    //               marginBottom: RFValue(2),
                    //               flex: 1,
                    //             },
                    //           ]}
                    //         >
                    //           Vehicle
                    //         </Text>
                    //         <View style={{ flex: 2, flexDirection: "row" }}>
                    //           {SelectedVehicleObj?.vehicleType?.vehicleTypeId ==
                    //           1 ? (
                    //             <Image
                    //               source={require("../../../assets/images/icn_vehicle_van.png")}
                    //               style={[Style.IconImg]}
                    //             />
                    //           ) : SelectedVehicleObj?.vehicleType
                    //               ?.vehicleTypeId == 2 ? (
                    //             <Image
                    //               source={require("../../../assets/images/icn_vehicle_truck.png")}
                    //               style={[Style.IconImg]}
                    //             />
                    //           ) : (
                    //             <Image
                    //               source={require("../../../assets/images/icn_vehicle_long_truck.png")}
                    //               style={[Style.IconImg]}
                    //             />
                    //           )}

                    //           <Text style={[Style.NameTxt, { marginLeft: 8 }]}>
                    //             {SelectedVehicleObj?.plate == ""
                    //               ? "-"
                    //               : SelectedVehicleObj?.plate}
                    //           </Text>
                    //         </View>
                    //       </View>
                    //       <View style={Style.MarginVerticalStyle}>
                    //         <Text
                    //           style={[
                    //             Style.EmailTxt,
                    //             {
                    //               color: colors.Grey,
                    //               marginBottom: RFValue(2),
                    //               flex: 1,
                    //             },
                    //           ]}
                    //         >
                    //           {this.state.LangStr.VehicleType}
                    //         </Text>
                    //         <Text style={[Style.DropdownItemTxt, { flex: 2 }]}>
                    //           {SelectedVehicleObj?.vehicleType?.description}
                    //         </Text>
                    //       </View>
                    //       <View style={Style.MarginVerticalStyle}>
                    //         <Text
                    //           style={[
                    //             Style.EmailTxt,
                    //             {
                    //               color: colors.Grey,
                    //               marginBottom: RFValue(2),
                    //               flex: 1,
                    //             },
                    //           ]}
                    //         >
                    //           {this.state.LangStr.Model}
                    //         </Text>
                    //         <Text style={[Style.DropdownItemTxt, { flex: 2 }]}>
                    //           {SelectedVehicleObj?.model}
                    //         </Text>
                    //       </View>
                    //     </View>

                    //     {/* trailer data */}
                    //     <View style={{ marginBottom: 10 }}>
                    //       <Text
                    //         style={[
                    //           Style.NameTxt,
                    //           {
                    //             backgroundColor: "lightgrey",
                    //             paddingLeft: 5,
                    //             marginBottom: 8,
                    //           },
                    //         ]}
                    //       >
                    //         {this.state.LangStr.TrailerDetails}
                    //       </Text>
                    //       <View style={Style.MarginVerticalStyle}>
                    //         <Text
                    //           style={[
                    //             Style.EmailTxt,
                    //             {
                    //               color: colors.Grey,
                    //               marginBottom: RFValue(2),
                    //               flex: 1,
                    //             },
                    //           ]}
                    //         >
                    //           Trailer
                    //         </Text>
                    //         <Text style={[Style.NameTxt, { flex: 2 }]}>
                    //           {SelectedTrailerObj.plate}
                    //         </Text>
                    //       </View>
                    //       <View style={Style.MarginVerticalStyle}>
                    //         <Text
                    //           style={[
                    //             Style.EmailTxt,
                    //             {
                    //               color: colors.Grey,
                    //               marginBottom: RFValue(2),
                    //               flex: 1,
                    //             },
                    //           ]}
                    //         >
                    //           {this.state.LangStr.TrailerType}
                    //         </Text>
                    //         <Text style={[Style.DropdownItemTxt, { flex: 2 }]}>
                    //           {SelectedTrailerObj.trailerType
                    //             ? SelectedTrailerObj.trailerType.description
                    //             : ""}
                    //         </Text>
                    //       </View>
                    //       <View style={Style.MarginVerticalStyle}>
                    //         <Text
                    //           style={[
                    //             Style.EmailTxt,
                    //             {
                    //               color: colors.Grey,
                    //               marginBottom: RFValue(2),
                    //               flex: 1,
                    //             },
                    //           ]}
                    //         >
                    //           {this.state.LangStr.FloorType}
                    //         </Text>
                    //         <Text style={[Style.DropdownItemTxt, { flex: 2 }]}>
                    //           {SelectedTrailerObj.floorType
                    //             ? SelectedTrailerObj.floorType.description
                    //             : ""}
                    //         </Text>
                    //       </View>
                    //       {SelectedTrailerObj.specificationList ? (
                    //         <ScrollView
                    //           horizontal={true}
                    //           showsHorizontalScrollIndicator={false}
                    //         >
                    //           <View
                    //             onStartShouldSetResponder={() => true}
                    //             style={Style.MarginVerticalStyle}
                    //           >
                    //             {SelectedTrailerObj.specificationList.map(
                    //               (specificationData, index) => (
                    //                 <View
                    //                   style={
                    //                     Style.TrailerSpecificationItemContainer
                    //                   }
                    //                 >
                    //                   <Text style={Style.EmailTxt}>
                    //                     {specificationData.description}
                    //                   </Text>
                    //                 </View>
                    //               )
                    //             )}
                    //           </View>
                    //         </ScrollView>
                    //       ) : null}
                    //     </View>
                    //   </View>
                    //   <View style={Style.SignInbtnView}>
                    //     <TouchableOpacity
                    //       onPress={() => {
                    //         this.CreateNewTransporter();
                    //       }}
                    //       style={Style.signInBtn}
                    //     >
                    //       <Text
                    //         style={[
                    //           Style.signinBtnTxt,
                    //           { color: colors.White },
                    //         ]}
                    //       >
                    //         {this.state.LangStr.Save}
                    //       </Text>
                    //     </TouchableOpacity>
                    //   </View> */}
                    // </View>
                  }

                  {/* <TouchableOpacity
                    onPress={() => this.onPreviousStep()}
                    style={{
                      height: RFValue(40),
                      width: RFValue(40),
                      borderRadius: RFValue(20),
                      backgroundColor: colors.Blue,
                      marginVertical: 20,
                      alignItems: "center",
                      justifyContent: "center",
                    }}
                  >
                    <Image
                      style={{
                        height: RFPercentage(2),
                        width: RFPercentage(2),
                        resizeMode: "contain",
                        tintColor: colors.White,
                      }}
                      source={require("../../../assets/images/icn_previous.png")}
                    />
                  </TouchableOpacity> */}
                </ScrollView>
                {/* ) : null} */}
              </View>
            )}

            {/* ----- Next/Prev Footer button ------ */}
            {/* {this.state.AddItemVisible ? ( */}
            {/* {this.state.CurrentStep != 5 ? (
              <View>
                <TouchableOpacity
                  onPress={() => this.onPreviousStep()}
                  style={{
                    height: RFValue(40),
                    width: RFValue(40),
                    borderRadius: RFValue(20),
                    backgroundColor: colors.Blue,
                    position: "absolute",
                    left: 0,
                    bottom: 20,
                    alignItems: "center",
                    justifyContent: "center",
                  }}
                >
                  <Image
                    style={{
                      height: RFPercentage(2),
                      width: RFPercentage(2),
                      resizeMode: "contain",
                      tintColor: colors.White,
                    }}
                    source={require("../../../assets/images/icn_previous.png")}
                  />
                </TouchableOpacity>

                <TouchableOpacity
                  onPress={() => this.onNextStep()}
                  style={{
                    height: RFValue(40),
                    width: RFValue(40),
                    borderRadius: RFValue(20),
                    backgroundColor: colors.Blue,
                    position: "absolute",
                    right: 0,
                    bottom: 20,
                    alignItems: "center",
                    justifyContent: "center",
                  }}
                >
                  <Image
                    style={{
                      height: RFPercentage(2),
                      width: RFPercentage(2),
                      resizeMode: "contain",
                      tintColor: colors.White,
                    }}
                    source={require("../../../assets/images/icn_next.png")}
                  />
                </TouchableOpacity>
              </View>
            ) : null} */}
            {/* ) : null} */}
          </View>
          <Button
            loader={false}
            onPress={() => {
              if (!this.state.showDetails) {
                this.setState({ showDetails: true });
              } else {
                this.CreateNewTransporter();
              }
            }}
            activeOpacity={1}
            disabled={
              this.state.SelectedTrailerObj?.plate &&
              this.state.SelectedVehicleObj?.plate &&
              this.state.transporterTypeData?.description
                ? false
                : true
            }
            style={[
              {
                marginBottom: RFValue(20),
                backgroundColor:
                  this.state.SelectedTrailerObj?.plate &&
                  this.state.SelectedVehicleObj?.plate &&
                  this.state.transporterTypeData?.description
                    ? "#34B267"
                    : colors.LightGrey,
              },
            ]}
            name={
              !this.state.showDetails === true
                ? this.state.LangStr?.showDetail
                : StringsOfLanguages.Save
            }
          />
        </View>
        <Loader visible={this.state.loading} />
      </SafeAreaView>
    );
  }
}

const mapStateToProps = (state) => {
  return {
    VehicleList: state.VehicleList,
    TrailerList: state.TrailerList,
    UserData: state.UserData,
    TransportList: state.TransportList,
    CreateTransporterData: state.CreateTransporterData,
    TransportTypeList: state.TransportTypeList,
  };
};
export default connect(mapStateToProps, {
  GetVehicleListAction,
  GetTrailerListAction,
  GetUserDetailsAction,
  GetTransportListAction,
  CreateTransporterAction,
  GetTransportTypeList,
})(AddTransport);
