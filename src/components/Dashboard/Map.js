import AsyncStorage from "@react-native-async-storage/async-storage";
import React from "react";
import {
  ActivityIndicator,
  Alert,
  AppState,
  Dimensions,
  Image,
  Linking,
  NativeModules,
  Platform,
  StatusBar,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import MapView, {
  AnimatedRegion,
  Marker,
  PROVIDER_GOOGLE,
} from "react-native-maps";
import MapViewDirections from "react-native-maps-directions";
import { Modal } from "react-native-paper";
import { RFPercentage, RFValue } from "react-native-responsive-fontsize";
import { connect } from "react-redux";
import * as colors from "../../common/colors";
import Stringsoflanguages from "../../Localization/stringsoflanguages";
import { getCurrentLoc, locationPermissionCheck } from "../../navigation/Tab";
import {
  CreateTransporterGPSPointAction,
  GetAddressList,
} from "../../Redux/actions";

let clearsetInterval;
let interval;
const { width, height } = Dimensions.get("window");
const { LocationModule } = NativeModules;

class Map extends React.Component {
  watchID = null;
  constructor(props) {
    super(props);
    this.myRef = React.createRef();
    this.state = {
      loading: false,
      LangStr: Stringsoflanguages,
      originCoordinates: {
        latitude: 0,
        longitude: 0,
      },
      destinationCoordinates: {
        latitude: 0,
        longitude: 0,
      },
      currentCoordinates: {
        latitude: 0,
        longitude: 0,
      },
      mapTypeMode: 0,
      hasLocationPermission: true,
      routeCoordinates: [],
      distanceTravelled: 0,
      prevLatLng: {},
      coordinate: new AnimatedRegion({
        latitude: 21.17024,
        longitude: 72.831062,
      }),
      start: true,
      noLocationPermission: false,
      ContainerId1: 0,
      currentLocationLatitude: 0,
      currentLocationLongitude: 0,
      log: "",
      changeRoute: -1,
      Modal: false,
      lang: "",
    };
  }

  async componentDidMount() {
    // let from = this.props.route.params.from

    await this.setState({
      ContainerId1: AsyncStorage.getItem("ContainerId"),
      lang: await AsyncStorage.getItem("SelectedLanguage"),
    });
    this.setState({ noLocationPermission: !(await locationPermissionCheck()) });
    AppState.addEventListener("change", (nextAppState) => {
      if (nextAppState === "background") {
        clearInterval(interval);
      } else {
        this.onStartclick(true);
      }
    });

    this.onStartclick(true);

    this.props.GetAddressList();
    this.latlongset();

    this.setState();
    this._Reload = this.props.navigation.addListener("blur", async () => {
      console.log("first");
      clearInterval(clearsetInterval);
    });
    this._Reload = this.props.navigation.addListener("focus", async () => {
      console.log("second");
      let from = this.props.route.params.from;
      let click = this.props.route.params.location;
      console.log("from == > ", from, click);
      if (from) {
        this.onshowlocationclick(click);
      }
    });

    let from = this.props.route.params.from;
    let click = this.props.route.params.location;
    console.log("from == > ", from, click);
    if (from) {
      this.onshowlocationclick(click);
    }
    this.setState({
      lang: await AsyncStorage.getItem("SelectedLanguage"),
    });
  }

  componentWillUnmount() {
    if (interval) {
      clearInterval(interval);
    }
  }

  async latlongset() {
    const Fromdata = await AsyncStorage.getItem("LocationData");
    const fromData = JSON.parse(Fromdata);
    if (fromData.from.long && fromData.to.long) {
      const {
        from: { lat: fromLat, long: fromLong, address: fromAddress } = {},
        to: { lat: toLat, long: toLong, address: toAddress } = {},
      } = fromData;
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
  }

  async updateLocation() {
    const { currentPos = null } = await getCurrentLoc();
    if (currentPos?.coords) {
      this.setState({
        currentCoordinates: {
          latitude: currentPos.coords.latitude,
          longitude: currentPos.coords.longitude,
        },
      });
    }
  }

  async onStartclick(initialVal = false) {
    let hasLocationPermission = false;
    if (!(await locationPermissionCheck())) {
      Alert.alert(
        "Hold on!",
        "We are not able to track your route because you didn't give permission to access your location. For further process you need to enable location permission from setting.",
        [{ text: "Setting", onPress: () => Linking.openSettings() }]
      );
      return null;
    }
    hasLocationPermission = true;
    if (initialVal) {
      this.updateLocation();
      return null;
    }
    const scheme = Platform.select({
      ios: "maps:0,0?q=",
      android: "geo:0,0?q=",
    });
    const latLng =
      global.color === colors.Blue
        ? `${this.state.destinationCoordinates.latitude}, ${this.state.destinationCoordinates.longitude}`
        : `${this.state.originCoordinates.latitude}, ${this.state.originCoordinates.longitude}`;
    const label = "Custom Label";
    const url = Platform.select({
      ios: `${scheme}${label}@${latLng}`,
      android: `${scheme}${latLng}(${label})`,
    });
    Linking.openURL(url);
  }

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

  onshowlocationclick(type) {
    this.setState({ changeRoute: type, Modal: false });
  }
  render() {
    return this.state.currentCoordinates.latitude != 0 ? (
      <View style={{ flex: 1, backgroundColor: "white" }}>
        <StatusBar
          translucent
          backgroundColor={colors.WhiteSmoke}
          barStyle={"dark-content"}
        />

        <View style={{ flex: 1 }}>
          <MapView
            ref={this.myRef}
            showsUserLocation={true}
            liteMode={false}
            mapType={this.state.mapTypeMode == 0 ? "standard" : "satellite"}
            style={{
              height:
                this.state.originCoordinates.latitude &&
                this.state.originCoordinates.longitude &&
                !this.state.noLocationPermission
                  ? height / 3.4
                  : height,
              width: width,
            }}
            provider={PROVIDER_GOOGLE}
            // initialRegion={{
            //   latitude: this.state.originCoordinates.latitude,
            //   longitude: this.state.originCoordinates.longitude,
            //   latitudeDelta: 0,
            //   longitudeDelta: 0,
            // }}
            region={{
              latitude: this.state.currentCoordinates.latitude,
              longitude: this.state.currentCoordinates.longitude,
              latitudeDelta: 0.005,
              longitudeDelta: 0.005,
            }}
          >
            {console.log(this.state.originCoordinates)}
            {console.log(this.state.destinationCoordinates)}

            <MapViewDirections
              origin={
                this.state.changeRoute == -1
                  ? this.state.originCoordinates
                  : this.state.changeRoute == 0
                  ? this.state.currentCoordinates
                  : this.state.originCoordinates
              }
              destination={
                this.state.changeRoute == -1
                  ? this.state.destinationCoordinates
                  : this.state.changeRoute == 0
                  ? this.state.originCoordinates
                  : this.state.destinationCoordinates
              }
              apikey={"AIzaSyC-8EpLCJPZY9xX9ANxrtQPnqJcLIyhrw4"}
              strokeWidth={3}
              strokeColor="hotpink"
              optimizeWaypoints={true}
              onReady={(result) => {
                this.myRef.current.fitToCoordinates(result.coordinates, {
                  edgePadding: {
                    right: 30,
                    bottom: 300,
                    left: 30,
                    top: 100,
                  },
                });
              }}
            />

            <Marker
              // draggable
              coordinate={
                this.state.changeRoute == -1
                  ? this.state.originCoordinates
                  : this.state.changeRoute == 0
                  ? this.state.currentCoordinates
                  : this.state.originCoordinates
              }
              pinColor={colors.LightGreen}
              onDragEnd={(e) => alert(JSON.stringify(e.nativeEvent.coordinate))}
              title={"current Marker"}
              // description={"This is a description of the marker"}
            />

            {/* {this.state.originCoordinates.latitude ? <Marker
              // draggable
              coordinate={this.state.originCoordinates}
              onDragEnd={(e) => alert(JSON.stringify(e.nativeEvent.coordinate))}
              pinColor="green"
              title={"origin point marker"}
              description={"This is a description of the marker"}
            /> : null} */}
            {console.log(
              "this.state.destinationCoordinates.latitude==>>",
              this.state.destinationCoordinates,
              this.state.changeRoute
            )}
            {this.state.destinationCoordinates.latitude != 0 ? (
              <Marker
                // draggable
                pinColor={colors.Blue}
                coordinate={
                  this.state.changeRoute == -1
                    ? this.state.destinationCoordinates
                    : this.state.changeRoute == 0
                    ? this.state.originCoordinates
                    : this.state.destinationCoordinates
                }
                onDragEnd={(e) =>
                  alert(JSON.stringify(e.nativeEvent.coordinate))
                }
                title={"destination point marker"}
              />
            ) : null}
          </MapView>
          <View
            style={{
              height: height / 25,
              backgroundColor: colors.White,
              marginTop: (height * -35) / height,
            }}
          />
          {this.state.originCoordinates.latitude &&
          this.state.originCoordinates.longitude &&
          !this.state.noLocationPermission ? (
            <View>
              {/* <TouchableOpacity
              style={{
                height: height,
                justifyContent: "flex-end",
                marginBottom: RFPercentage(8),
              }}
              activeOpacity={1}
              onPress={() => this.setState({ Modal: false, changeRoute: -1 })}
            > */}
              <View
                style={{
                  // height: "70%",
                  width: "100%",
                  backgroundColor: "#fff",
                  alignItems: "center",
                  justifyContent: "center",
                  // borderTopEndRadius: RFValue(25),
                  // borderTopStartRadius: RFValue(25),
                }}
              >
                {/* <Text
                  style={{
                    fontSize: 20,
                    fontWeight: "600",
                    marginVertical: 20,
                  }}
                >
                  {Stringsoflanguages.Address}
                </Text> */}
                <View
                  style={{
                    backgroundColor: "#ededed",
                    width: "90%",
                    padding: 10,
                    borderRadius: 10,
                  }}
                >
                  <Text style={{ color: "#a1a1a1" }}>
                    {Stringsoflanguages.Loadingaddress}
                  </Text>
                  <Text style={{ fontWeight: "700" }}>
                    {this.state.originCoordinates.address}
                  </Text>
                  <View
                    style={{
                      flexDirection: "row",
                      alignItems: "center",
                      justifyContent: "flex-end",
                    }}
                  >
                    {/* <TouchableOpacity
                      onPress={() => this.onshowlocationclick(0)}
                      style={{
                        padding: 5,
                        backgroundColor: "#168bf7",
                        borderRadius: 5,
                        paddingHorizontal: 10,
                      }}
                    >
                      <Text style={{ color: "#fff" }}>{Stringsoflanguages.ShowLocation}</Text>
                    </TouchableOpacity> */}
                    <TouchableOpacity
                      // onPress={() => this.MoveToMap(0)}
                      onPress={() =>
                        LocationModule.openMapNavigation(
                          this.state.lang,
                          this.state.originCoordinates.latitude,
                          this.state.originCoordinates.longitude
                        )
                      }
                      style={{
                        padding: 5,
                        backgroundColor: "#088712",
                        borderRadius: 5,
                        marginLeft: RFValue(5),
                        paddingHorizontal: 10,
                      }}
                    >
                      <Text style={{ color: "#fff" }}>
                        {Stringsoflanguages.GetDirection}
                      </Text>
                    </TouchableOpacity>
                  </View>
                </View>
                <View
                  style={{
                    backgroundColor: "#ededed",
                    width: "90%",
                    padding: 10,
                    borderRadius: 10,
                    marginTop: RFValue(20),
                    marginBottom: RFValue(50),
                  }}
                >
                  <Text style={{ color: "#a1a1a1" }}>
                    {Stringsoflanguages.Deliveraddress}
                  </Text>
                  <Text style={{ fontWeight: "700" }}>
                    {this.state.destinationCoordinates.address}
                  </Text>
                  <View
                    style={{
                      flexDirection: "row",
                      alignItems: "center",
                      justifyContent: "flex-end",
                    }}
                  >
                    {/* <TouchableOpacity
                      onPress={() => this.onshowlocationclick(1)}
                      style={{
                        padding: 5,
                        backgroundColor: "#168bf7",
                        borderRadius: 5,
                        paddingHorizontal: 10,
                      }}
                    >
                      <Text style={{ color: "#fff" }}>{Stringsoflanguages.ShowLocation}</Text>
                    </TouchableOpacity> */}
                    <TouchableOpacity
                      // onPress={() => this.MoveToMap(1)}
                      onPress={() =>
                        LocationModule.openMapNavigation(
                          this.state.lang,
                          this.state.destinationCoordinates.latitude,
                          this.state.destinationCoordinates.longitude
                        )
                      }
                      style={{
                        padding: 5,
                        backgroundColor: "#088712",
                        borderRadius: 5,
                        marginLeft: RFValue(5),
                        paddingHorizontal: 10,
                      }}
                    >
                      <Text style={{ color: "#fff" }}>
                        {Stringsoflanguages.GetDirection}
                      </Text>
                    </TouchableOpacity>
                  </View>
                </View>
              </View>
              {/* </TouchableOpacity> */}
            </View>
          ) : undefined}
          <Modal
            visible={this.state.Modal}
            style={{ justifyContent: "flex-end", bottom: RFValue(-30) }}
          >
            <TouchableOpacity
              style={{
                height: height,
                justifyContent: "flex-end",
                marginBottom: RFPercentage(8),
              }}
              activeOpacity={1}
              onPress={() => this.setState({ Modal: false, changeRoute: -1 })}
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
                <Text
                  style={{
                    fontSize: 20,
                    fontWeight: "600",
                    marginVertical: 20,
                  }}
                >
                  {Stringsoflanguages.Address}
                </Text>
                <View
                  style={{
                    backgroundColor: "#ededed",
                    width: "90%",
                    padding: 10,
                    borderRadius: 10,
                  }}
                >
                  <Text style={{ color: "#a1a1a1" }}>
                    {Stringsoflanguages.Loadingaddress}
                  </Text>
                  <Text style={{ fontWeight: "700" }}>
                    {this.state.originCoordinates.address}
                  </Text>
                  <View
                    style={{
                      flexDirection: "row",
                      alignItems: "center",
                      justifyContent: "flex-end",
                    }}
                  >
                    <TouchableOpacity
                      onPress={() => this.onshowlocationclick(0)}
                      style={{
                        padding: 5,
                        backgroundColor: "#168bf7",
                        borderRadius: 5,
                        paddingHorizontal: 10,
                      }}
                    >
                      <Text style={{ color: "#fff" }}>
                        {Stringsoflanguages.ShowLocation}
                      </Text>
                    </TouchableOpacity>
                    <TouchableOpacity
                      // onPress={() => this.MoveToMap(0)}
                      onPress={() =>
                        LocationModule.openMapNavigation(
                          this.state.lang,
                          this.state.originCoordinates.latitude,
                          this.state.originCoordinates.longitude
                        )
                      }
                      style={{
                        padding: 5,
                        backgroundColor: "#088712",
                        borderRadius: 5,
                        marginLeft: RFValue(5),
                        paddingHorizontal: 10,
                      }}
                    >
                      <Text style={{ color: "#fff" }}>
                        {Stringsoflanguages.GetDirection}
                      </Text>
                    </TouchableOpacity>
                  </View>
                </View>
                <View
                  style={{
                    backgroundColor: "#ededed",
                    width: "90%",
                    padding: 10,
                    borderRadius: 10,
                    marginTop: RFValue(20),
                    marginBottom: RFValue(50),
                  }}
                >
                  <Text style={{ color: "#a1a1a1" }}>
                    {Stringsoflanguages.Deliveraddress}
                  </Text>
                  <Text style={{ fontWeight: "700" }}>
                    {this.state.destinationCoordinates.address}
                  </Text>
                  <View
                    style={{
                      flexDirection: "row",
                      alignItems: "center",
                      justifyContent: "flex-end",
                    }}
                  >
                    <TouchableOpacity
                      onPress={() => this.onshowlocationclick(1)}
                      style={{
                        padding: 5,
                        backgroundColor: "#168bf7",
                        borderRadius: 5,
                        paddingHorizontal: 10,
                      }}
                    >
                      <Text style={{ color: "#fff" }}>
                        {Stringsoflanguages.ShowLocation}
                      </Text>
                    </TouchableOpacity>
                    <TouchableOpacity
                      // onPress={() => this.MoveToMap(1)}
                      onPress={() =>
                        LocationModule.openMapNavigation(
                          this.state.lang,
                          this.state.destinationCoordinates.latitude,
                          this.state.destinationCoordinates.longitude
                        )
                      }
                      style={{
                        padding: 5,
                        backgroundColor: "#088712",
                        borderRadius: 5,
                        marginLeft: RFValue(5),
                        paddingHorizontal: 10,
                      }}
                    >
                      <Text style={{ color: "#fff" }}>
                        {Stringsoflanguages.GetDirection}
                      </Text>
                    </TouchableOpacity>
                  </View>
                </View>
              </View>
            </TouchableOpacity>
          </Modal>
          {/* {this.state.originCoordinates.latitude &&
          this.state.originCoordinates.longitude &&
          !this.state.noLocationPermission &&
          global.color !== colors.LightRed ? (
            <View
              style={{
                position: "absolute", //use absolute position to show button on top of the map
                top: "90%", //for center align
                alignSelf: "flex-start", //for align to right
                marginLeft: 20,
              }}
            >
              <TouchableOpacity
                style={{
                  backgroundColor: "#2e7eed",
                  borderRadius: 20,
                  alignItems: "center",
                  justifyContent: "center",
                  marginRight: RFPercentage(1),
                  marginBottom: RFPercentage(1),
                  paddingHorizontal: RFPercentage(1),
                }}
                activeOpacity={1}
                onPress={() => this.MoveToMap(0)}
              ></TouchableOpacity>
              <TouchableOpacity
                style={{
                  backgroundColor: "#2e7eed",
                  borderRadius: 20,
                  alignItems: "center",
                  justifyContent: "center",
                  marginBottom: RFPercentage(1),
                  paddingHorizontal: RFPercentage(1),
                }}
                activeOpacity={1}
                onPress={() => this.MoveToMap(1)}
              ></TouchableOpacity>
              {!this.state.Modal ? (
                <TouchableOpacity
                  style={{
                    height: 40,
                    backgroundColor: "#2e7eed",
                    width: 100,
                    borderRadius: 20,
                    alignItems: "center",
                    justifyContent: "center",
                  }}
                  onPress={() =>
                    this.setState({
                      Modal: true,
                      changeRoute: this.state.changeRoute,
                    })
                  }
                >
                  <Text style={{ color: "#fff", fontWeight: "700" }}>
                    {Stringsoflanguages.Location}
                  </Text>
                </TouchableOpacity>
              ) : undefined}
            </View>
          ) : null} */}

          {/* {!this.state.Modal ? (
            <View
              style={{
                width: RFValue(35),
                height: RFPercentage(10),
                backgroundColor: "white",
                position: "absolute",
                borderRadius: RFPercentage(1),
                bottom: 10,
                right: 10,
                overflow: "hidden",
              }}
            >
              <TouchableOpacity
                onPress={() => this.setState({ mapTypeMode: 0 })}
                style={{
                  flex: 1,
                  padding: 5,
                  backgroundColor:
                    this.state.mapTypeMode == 0 ? "lightgrey" : "white",
                  borderBottomWidth: 0.5,
                  borderBottomColor: "grey",
                }}
              >
                <Image
                  style={{
                    width: "90%",
                    height: "100%",
                    resizeMode: "contain",
                  }}
                  source={require("../../assets/images/icn_standard.png")}
                />
              </TouchableOpacity>
              <TouchableOpacity
                onPress={() => this.setState({ mapTypeMode: 1 })}
                style={{
                  flex: 1,
                  padding: 5,
                  backgroundColor:
                    this.state.mapTypeMode == 1 ? "lightgrey" : "white",
                }}
              >
                <Image
                  style={{
                    width: "100%",
                    height: "100%",
                    resizeMode: "contain",
                  }}
                  source={require("../../assets/images/icn_satellite.png")}
                />
              </TouchableOpacity>
            </View>
          ) : null} */}
        </View>
      </View>
    ) : (
      <View style={{ flex: 1, alignItems: "center", justifyContent: "center" }}>
        <ActivityIndicator size={"large"} color={colors.LimeGreen} />
      </View>
    );
  }
}

const mapStateToProps = (state) => {
  return {
    CreateTransporterGPSPoint: state.CreateTransporterGPSPoint,
    GetAddressData: state.GetAddressData,
  };
};
export default connect(mapStateToProps, {
  CreateTransporterGPSPointAction,
  GetAddressList,
})(Map);
