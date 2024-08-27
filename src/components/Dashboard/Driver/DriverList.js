import React from "react";
import {
  ActivityIndicator,
  FlatList,
  Image,
  Platform,
  SafeAreaView,
  StatusBar,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { AuthContext } from "../../../navigation/AuthContext";
import { RFValue } from "react-native-responsive-fontsize";
import { connect } from "react-redux";
import * as colors from "../../../common/colors";
import * as Fonts from "../../../common/fonts";
import DeleteConfirmationModel from "../../../common/Component/DeleteConfirmationModel";
import { HeaderWithRefreshOption } from "../../../common/Component/Header";
import ListItemMoreOptions from "../../../common/Component/ListItemMoreOptions";
import {
  AddNewItem,
  ListSearchField,
} from "../../../common/Component/ListSearchField";
import Loader from "../../../common/Component/Loader";
import NetChecker from "../../../common/Component/Network";
import { Style } from "../../../common/Style";
import StringsOfLanguages from "../../../Localization/stringsoflanguages";
import {
  DeleteDriverAction,
  GetDriverListAction,
} from "../../../Redux/actions";
import AsyncStorage from "@react-native-async-storage/async-storage";
let CARRIER_OPERATOR;
class DriverList extends React.Component {
  static contextType = AuthContext;
  constructor(props) {
    super(props);
    this.flatListRef = null;
    this.defaultState = {
      loading: false,
      LangStr: StringsOfLanguages,
      DriverList: [],
      searchTxt: "",
      OpenOptionDialog: false,
      DeleteConfirmationDialog: false,
      APIAction: 0,
      SelectedDriverObj: {},
      PageCount: 20,
      ScrollIndicatorVisible: false,
      offset: 0,
      AddItemVisible: true,
      ForDelete: false,
    };
    this.state = { ...this.defaultState };
  }

  async componentDidMount() {
    CARRIER_OPERATOR = await AsyncStorage.getItem("CARRIER_OPERATOR");
    this._Reload = this.props.navigation.addListener("focus", async () => {
      CARRIER_OPERATOR = await AsyncStorage.getItem("CARRIER_OPERATOR");

      if (this.props.route.params) {
        if (this.props.route.params.NeedtoReload) {
          this.setState({ ...this.defaultState });
          this.FetchDriverList(false);
        }
      }
    });

    this.FetchDriverList(false);
  }

  async UNSAFE_componentWillReceiveProps(nextProps) {
    if (this.state.APIAction == 1) {
      // console.log(nextProps.DeleteDriver);
      if (nextProps.DeleteDriver.DeleteDriverSuccess) {
        if (nextProps.DeleteDriver.data[1] == 200) {
          this.setState({ loading: false, SelectedDriverObj: 0 });
          this.FetchDriverList(false);
        } else if (nextProps.DeleteDriver.data[1] == 401) {
          const SignOutContext = this.context;
          SignOutContext.signOut();
        } else {
          this.setState({ loading: false, APIAction: 0 });
          console.log(nextProps.DeleteDriver.data[0]);
          alert(nextProps.DeleteDriver.data[0].message);
          console.log("nextProps.DeleteDriver");
        }
      }
    } else {
      if (nextProps.DriverList.GetDriverListSuccess) {
        this.setState({ loading: false });
        if (nextProps.DriverList.data[1] == 200) {
          this.setState({
            DriverList: await nextProps.DriverList.data[0],
            ScrollIndicatorVisible: false,
          });
        } else if (nextProps.DriverList.data[1] == 401) {
          const SignOutContext = this.context;
          SignOutContext.signOut();
        } else {
          this.setState({ loading: false, ScrollIndicatorVisible: false });
          console.log("nextProps.VehicleList");
        }
      }
    }
  }

  async FetchDriverList(isSearchAction) {
    const NetworkStatus = NetChecker();
    if ((await NetworkStatus) == false) {
      alert("network issue ");
      return;
    }

    this.setState({ APIAction: 0 });
    if (!isSearchAction) this.setState({ loading: true });
    this.props.GetDriverListAction(
      this.state.searchTxt,
      0,
      this.state.PageCount
    );
  }

  SearchAction(SearchText) {
    this.setState({ searchTxt: SearchText });
    this.FetchDriverList(true);
  }

  onUpdate() {
    var objSelectedDriver = this.state.SelectedDriverObj;
    this.setState({ OpenOptionDialog: false, objSelectedDriver: {} });
    this.props.navigation.navigate("SaveDriver", {
      Action: 2,
      DriverObject: JSON.stringify(objSelectedDriver),
    });
  }

  onShowDetails() {
    var objSelectedDriver = this.state.SelectedDriverObj;
    this.setState({ OpenOptionDialog: false, SelectedDriverObj: {} });
    this.props.navigation.navigate("DriverDetails", {
      DriverObject: JSON.stringify(objSelectedDriver),
    });
  }

  RenderItem = (data, index) => {
    return (
      <View style={[Style.TrailerListItemContailer]}>
        <TouchableOpacity
          style={{
            flexDirection: "row",
            alignItems: "center",
            width: "98%",
            alignSelf: "center",
          }}
          onPress={() => {
            this.setState({ OpenOptionDialog: true, SelectedDriverObj: data });
            this.flatListRef.scrollToIndex({
              animated: true,
              index: index,
            });
          }}
        >
          <View
            style={{
              width: "20%",
              justifyContent: "center",
              alignItems: "center",
            }}
          >
            <View
              style={{
                backgroundColor: "#ebf7f0",
                height: RFValue(46),
                width: RFValue(46),
                justifyContent: "center",
                alignItems: "center",
                borderRadius: RFValue(23),
              }}
            >
              <Image
                source={require("../../../assets/images/DrivarIcon2.png")}
                style={[Style.IconImg]}
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

          <View style={{ width: "80%" }}>
            <View
              style={{
                flexDirection: "row",
                marginTop: RFValue(6),
              }}
            >
              <View
                style={{
                  width: "45%",
                  flexDirection: "row",
                }}
              >
                <Text
                  style={[
                    {
                      color: "#000000",
                      marginRight: RFValue(8),
                      fontSize:
                        Platform.OS === "android" ? RFValue(14) : RFValue(12),
                      fontFamily: Fonts.LexendRegular,
                    },
                  ]}
                >
                  {this.state.LangStr.Name + ":"}
                </Text>
                <Text
                  style={{
                    color: "#A0A0A0",
                    fontSize:
                      Platform.OS === "android" ? RFValue(14) : RFValue(12),
                  }}
                >
                  {data?.name?.length > 6
                    ? data?.name.substring(0, 6) + "..."
                    : data?.surname}
                </Text>
              </View>
              <View style={{ width: "60%", flexDirection: "row" }}>
                <Text
                  style={{
                    color: "#000000",
                    fontSize:
                      Platform.OS === "android" ? RFValue(14) : RFValue(12),
                    marginRight: RFValue(8),
                    fontFamily: Fonts.LexendRegular,
                  }}
                >
                  {this.state.LangStr.Surname + ":"}
                </Text>
                <Text
                  style={{
                    color: "#A0A0A0",
                    fontSize:
                      Platform.OS === "android" ? RFValue(14) : RFValue(12),
                  }}
                >
                  {data?.surname?.length > 6
                    ? data?.surname?.substring(0, 6) + "..."
                    : data?.surname}
                </Text>
              </View>
            </View>
            {data.initialPassword ? (
              <View
                style={{
                  flex: 1,
                  marginVertical: RFValue(10),
                  flexDirection: "row",
                  marginVertical: RFValue(12),
                }}
              >
                <Text
                  style={{
                    color: "#000000",
                    marginRight: RFValue(10),
                    fontSize:
                      Platform.OS === "android" ? RFValue(14) : RFValue(12),
                    fontFamily: Fonts.LexendRegular,
                  }}
                >
                  {this.state.LangStr.InitialPassword} :
                </Text>
                <Text
                  style={{
                    color: "#A0A0A0",
                    fontSize:
                      Platform.OS === "android" ? RFValue(14) : RFValue(12),
                  }}
                >
                  {data.initialPassword}
                </Text>
              </View>
            ) : undefined}

            <View
              style={{
                flexDirection: "row",
              }}
            >
              <Image
                source={require("../../../assets/images/call.png")}
                style={{ width: 18, height: 18 }}
              />
              <Text>:</Text>
              <Text
                style={{
                  color: "#A0A0A0",
                  fontSize:
                    Platform.OS === "android" ? RFValue(14) : RFValue(12),
                  marginLeft: RFValue(10),
                }}
              >
                +
                {data?.countryCode?.toString()?.includes("+")
                  ? data.countryCode.toString().split("+")[1]
                  : data?.countryCode
                  ? data.countryCode
                  : ""}
                {data?.mobile != null ? data.mobile : "XXXXXXXXXX"}
              </Text>
            </View>
          </View>

          {/* <View
            style={{
              flexDirection: "row",

              flex: 1,
              marginTop: RFValue(10),
            }}
          >
            <View style={{ flex: 1 }}>
              <Text
                style={[
                  Style.EmailTxt,
                  { color: colors.Grey, marginBottom: RFValue(2) },
                ]}
              >
                {this.state.LangStr.Name}
              </Text>
              <Text style={Style.DropdownItemTxt}>{data.name}</Text>
            </View>
            <View style={{ flex: 1 }}>
              <Text style={[Style.EmailTxt, { color: colors.Grey }]}>
                {this.state.LangStr.Surname}
              </Text>
              <Text style={Style.DropdownItemTxt}>{data.surname}</Text>
            </View>
          </View> */}
          {/* {data.initialPassword ? (
            <View
              style={{
                flex: 1,
                marginVertical: RFValue(5),
                flexDirection: "row",
              }}
            >
              <Text
                style={[
                  Style.EmailTxt,
                  { color: colors.Grey, marginBottom: RFValue(2) },
                ]}
              >
                {this.state.LangStr.InitialPassword} :
              </Text>
              <Text style={Style.DropdownItemTxt}> {data.initialPassword}</Text>
            </View>
          ) : undefined} */}
          {/* <View
            style={{
              flexDirection: "row",
              marginTop: data.initialPassword ? RFValue(0) : RFValue(10),
            }}
          >
            <View>
              <Image
                source={require("../../../assets/images/icn_phone_number.png")}
                style={[Style.IconImg]}
              />
            </View>
            <View
              style={{
                flex: 1,
                justifyContent: "center",
                paddingLeft: RFValue(5),
              }}
            >
              <Text style={Style.DropdownItemTxt}>
                +
                {data?.countryCode?.toString()?.includes("+")
                  ? data.countryCode.toString().split("+")[1]
                  : data?.countryCode
                  ? data.countryCode
                  : ""}
                {data?.mobile != null ? data.mobile : "XXXXXXXXXX"}
              </Text>
            </View>
          </View> */}
        </TouchableOpacity>
      </View>
    );
  };

  onLoadMoreItems = () => {
    if (this.state.searchTxt == "") {
      this.setState(
        {
          PageCount: this.state.PageCount + 20,
          ScrollIndicatorVisible: true,
        },
        () => {
          this.FetchDriverList(true);
        }
      );
    }
  };

  onDelete() {
    var intSelectedDriverID = this.state.SelectedDriverObj.userId;
    this.setState({
      OpenOptionDialog: false,
      DeleteConfirmationDialog: false,
      loading: true,
      APIAction: 1,
      APIAction: 1,
    });
    this.props.DeleteDriverAction(intSelectedDriverID);
  }

  render() {
    return (
      <SafeAreaView style={[Style.mainView]}>
        <StatusBar
          animated={false}
          backgroundColor={colors.WhiteSmoke}
          barStyle={"dark-content"}
        />
        <HeaderWithRefreshOption
          Title={this.state.LangStr.Driver}
          BackAction={() => this.props.navigation.goBack()}
          onRefresh={() => {
            this.setState({ searchTxt: "", PageCount: 20 });
            this.FetchDriverList(false);
          }}
        />
        {this.state.DriverList.length > 0 ? (
          <View style={Style.listSearchComponentContainerView}>
            <ListSearchField
              searchText={this.state.searchTxt}
              onChangeSearchText={(text) => this.SearchAction(text)}
              onClearSearchText={() => this.SearchAction("")}
              navigation={this.props.navigation}
            />
          </View>
        ) : undefined}
        <View style={Style.listComponentContainerView}>
          {this.state.DriverList.length == 0 && this.state.loading == false ? (
            <Text style={Style.NoDataTxt}>
              {this.state.LangStr.NoDriverCreated}
            </Text>
          ) : (
            <FlatList
              ref={(ref) => (this.flatListRef = ref)}
              data={this.state.DriverList}
              contentContainerStyle={{ paddingBottom: 30 }}
              keyExtractor={(item, index) => index.toString()}
              renderItem={({ item, index }) => this.RenderItem(item, index)}
              ListFooterComponent={
                this.state.ScrollIndicatorVisible ? (
                  <ActivityIndicator size="small" color={colors.LimeGreen} />
                ) : null
              }
              onEndReached={() => this.onLoadMoreItems}
              onEndThreshold={0}
              showsVerticalScrollIndicator={false}
              onScroll={(event) => {
                let currentOffset = event.nativeEvent.contentOffset.y;
                this.setState({
                  AddItemVisible:
                    currentOffset <= this.state.offset || currentOffset <= 0,
                });
                this.setState({ offset: currentOffset });
              }}
              bounces={false}
            />
          )}
          {console.log("Carrieer:>>>>", CARRIER_OPERATOR)}
          {/* {CARRIER_OPERATOR ? ( */}
            <AddNewItem
              // Visible={this.state.AddItemVisible}
              Visible={true}
              onAddItem={() =>
                this.props.navigation.navigate("SaveDriver", { Action: 1 })
              }
            />
          {/* ) : undefined} */}
        </View>

        <ListItemMoreOptions
          carrierOperator={CARRIER_OPERATOR}
          isVisible={this.state.OpenOptionDialog}
          OnFetchDetails={() => this.onShowDetails()}
          onUpdate={() => this.onUpdate()} // 1=Insert, 2=Update
          onDelete={() =>
            this.setState({
              OpenOptionDialog: false,
              DeleteConfirmationDialog: true,
            })
          }
          onClose={() =>
            this.setState({ OpenOptionDialog: false, SelectedTrailerObj: {} })
          }
        />
        <DeleteConfirmationModel
          isVisible={this.state.DeleteConfirmationDialog}
          onDelete={() => this.onDelete()}
          onCancel={() => this.setState({ DeleteConfirmationDialog: false })}
        />
        <Loader visible={this.state.loading} />
      </SafeAreaView>
    );
  }
}

const mapStateToProps = (state) => {
  return {
    DriverList: state.DriverList,
    DeleteDriver: state.DeleteDriver,
  };
};
export default connect(mapStateToProps, {
  GetDriverListAction,
  DeleteDriverAction,
})(DriverList);
