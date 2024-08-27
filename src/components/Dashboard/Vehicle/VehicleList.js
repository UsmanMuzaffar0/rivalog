import React from "react";
import {
  View,
  SafeAreaView,
  Text,
  TouchableOpacity,
  StatusBar,
  FlatList,
  Image,
  Dimensions,
  ActivityIndicator,
} from "react-native";
import { AuthContext } from "../../../navigation/AuthContext";
import * as colors from "../../../common/colors";
import { HeaderWithRefreshOption } from "../../../common/Component/Header";
import StringsOfLanguages from "../../../Localization/stringsoflanguages";
import { Style } from "../../../common/Style";
import {
  GetVehicleListAction,
  DeleteVehicleAction,
} from "../../../Redux/actions";
import { connect } from "react-redux";
import NetChecker from "../../../common/Component/Network";
import Loader from "../../../common/Component/Loader";
import { RFPercentage, RFValue } from "react-native-responsive-fontsize";
const { width, height } = Dimensions.get("window");
import {
  ListSearchField,
  AddNewItem,
} from "../../../common/Component/ListSearchField";
import ListItemMoreOptions from "../../../common/Component/ListItemMoreOptions";
import DeleteConfirmationModel from "../../../common/Component/DeleteConfirmationModel";
import AsyncStorage from "@react-native-async-storage/async-storage";

let CARRIER_OPERATOR;

class VehicleList extends React.Component {
  static contextType = AuthContext;
  constructor(props) {
    super(props);
    this.flatListRef = null;
    this.defaultState = {
      isDevelopmentMode: false,
      loading: false,
      LangStr: StringsOfLanguages,
      VehicleList: [],
      searchTxt: "",
      OpenOptionDialog: false,
      DeleteConfirmationDialog: false,
      APIAction: 0,
      SelectedVehicleObj: {},
      PageCount: 20,
      ScrollIndicatorVisible: false,
      offset: 0,
      AddItemVisible: true,
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
          this.FetchVehicleList(false);
        }
      }
    });
    this.FetchVehicleList(false);
  }

  async UNSAFE_componentWillReceiveProps(nextProps) {
    if (this.state.APIAction == 1) {
      if (nextProps.DeleteVehicle.DeleteVehicleSuccess) {
        if (nextProps.DeleteVehicle.data[1] == 200) {
          this.setState({ loading: false, SelectedVehicleObj: 0 });
          this.FetchVehicleList(false);
        } else if (nextProps.DeleteVehicle.data[1] == 401) {
          const SignOutContext = this.context;
          SignOutContext.signOut();
        } else {
          this.setState({ loading: false, APIAction: 0 });
          alert((await nextProps.DeleteVehicle.data[0]).message);
          console.log("nextProps.DeleteVehicle");
        }
      }
    } else {
      if (nextProps.VehicleList.GetVehicleListSuccess) {
        this.setState({ loading: false });
        if (nextProps.VehicleList.data[1] == 200) {
          this.setState({
            VehicleList: await nextProps.VehicleList.data[0],
            ScrollIndicatorVisible: false,
          });
        } else if (nextProps.VehicleList.data[1] == 401) {
          const SignOutContext = this.context;
          SignOutContext.signOut();
        } else {
          this.setState({ loading: false, ScrollIndicatorVisible: false });
          console.log("nextProps.VehicleList");
        }
      }
    }
  }

  async FetchVehicleList(isSearchAction) {
    const NetworkStatus = NetChecker();
    if ((await NetworkStatus) == false) {
      alert("network issue ");
      return;
    }

    this.setState({ APIAction: 0 });
    if (!isSearchAction) this.setState({ loading: true });
    this.props.GetVehicleListAction(
      this.state.searchTxt,
      0,
      this.state.PageCount
    );
  }

  SearchAction(SearchText) {
    this.setState({ searchTxt: SearchText });
    this.FetchVehicleList(true);
  }

  RenderItem = (data, index) => {
    return (
      <View style={Style.TrailerListItemContailer}>
        <TouchableOpacity
          style={{
            flexDirection: "row",
            alignItems: "center",
            width: "98%",
            alignSelf: "center",
          }}
          onPress={() => {
            this.setState({ OpenOptionDialog: true, SelectedVehicleObj: data });
            this.flatListRef.scrollToIndex({
              animated: true,
              index: index,
            });
          }}
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

  onUpdate() {
    var objSelectedVehicle = this.state.SelectedVehicleObj;
    this.setState({ OpenOptionDialog: false, SelectedVehicleObj: {} });
    this.props.navigation.navigate("SaveVehicle", {
      Action: 2,
      VehicleObject: JSON.stringify(objSelectedVehicle),
    });
  }

  onShowDetails() {
    var objSelectedVehicle = this.state.SelectedVehicleObj;
    this.setState({ OpenOptionDialog: false, SelectedVehicleObj: {} });
    this.props.navigation.navigate("VehicleDetails", {
      VehicleObject: JSON.stringify(objSelectedVehicle),
    });
  }

  onDelete() {
    var intSelectedVehicleID = this.state.SelectedVehicleObj.vehicleId;
    this.setState({
      OpenOptionDialog: false,
      DeleteConfirmationDialog: false,
      loading: true,
      APIAction: 1,
    });
    this.props.DeleteVehicleAction(intSelectedVehicleID);
  }

  onLoadMoreItems = () => {
    if (this.state.searchTxt == "") {
      this.setState(
        {
          PageCount: this.state.PageCount + 20,
          ScrollIndicatorVisible: true,
        },
        () => {
          this.FetchVehicleList(true);
        }
      );
    }
  };

  render() {
    return (
      <SafeAreaView style={Style.mainView}>
        <StatusBar
          animated={false}
          backgroundColor={colors.WhiteSmoke}
          barStyle={"dark-content"}
        />

        <HeaderWithRefreshOption
          Title={this.state.LangStr.Vehicle}
          BackAction={() => this.props.navigation.goBack()}
          onRefresh={() => {
            this.setState({ searchTxt: "", PageCount: 20 });
            this.FetchVehicleList(false);
          }}
        />
        {this.state.VehicleList.length > 0 ? (
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
          {this.state.VehicleList.length == 0 && this.state.loading == false ? (
            <Text style={Style.NoDataTxt}>
              {this.state.LangStr.No_data_found}
            </Text>
          ) : (
            <FlatList
              ref={(ref) => (this.flatListRef = ref)}
              data={this.state.VehicleList}
              keyExtractor={(item, index) => index.toString()}
              contentContainerStyle={{ paddingBottom: 30 }}
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

          {/* 1=Insert, 2=Update */}
          {console.log(CARRIER_OPERATOR, "676767")}
          {/* {CARRIER_OPERATOR ? ( */}
            <AddNewItem
            Visible={true}
              // Visible={this.state.AddItemVisible}
              onAddItem={() =>
                this.props.navigation.navigate("SaveVehicle", { Action: 1 })
              }
            />
          {/* ) : undefined} */}
        </View>

        <ListItemMoreOptions
          carrierOperator={CARRIER_OPERATOR}
          isVisible={this.state.OpenOptionDialog}
          OnFetchDetails={() => this.onShowDetails()}
          onUpdate={() => this.onUpdate()} // 1=Insert, 2=Update
          showUpdateOption={true}
          onDelete={() =>
            this.setState({
              OpenOptionDialog: false,
              DeleteConfirmationDialog: true,
            })
          }
          onClose={() =>
            this.setState({ OpenOptionDialog: false, objSelectedVehicle: {} })
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
    VehicleList: state.VehicleList,
    DeleteVehicle: state.DeleteVehicle,
  };
};
export default connect(mapStateToProps, {
  GetVehicleListAction,
  DeleteVehicleAction,
})(VehicleList);
