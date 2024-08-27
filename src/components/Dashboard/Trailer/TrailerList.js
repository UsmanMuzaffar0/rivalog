import React, { useState } from "react";
import {
  View,
  SafeAreaView,
  Text,
  TouchableOpacity,
  StatusBar,
  FlatList,
  Dimensions,
  Image,
  ActivityIndicator,
} from "react-native";
import { AuthContext } from "../../../navigation/AuthContext";
import * as colors from "../../../common/colors";
import { HeaderWithRefreshOption } from "../../../common/Component/Header";
import StringsOfLanguages from "../../../Localization/stringsoflanguages";
import { Style } from "../../../common/Style";
import {
  GetTrailerListAction,
  DeleteTrailerAction,
} from "../../../Redux/actions";
import { connect } from "react-redux";
import NetChecker from "../../../common/Component/Network";
import Loader from "../../../common/Component/Loader";

import { RFPercentage, RFValue } from "react-native-responsive-fontsize";
import { ScrollView } from "react-native";

const { width, height } = Dimensions.get("window");
import {
  ListSearchField,
  AddNewItem,
} from "../../../common/Component/ListSearchField";
import ListItemMoreOptions from "../../../common/Component/ListItemMoreOptions";
import DeleteConfirmationModel from "../../../common/Component/DeleteConfirmationModel";
import AsyncStorage from "@react-native-async-storage/async-storage";
let CARRIER_OPERATOR;

class TrailerList extends React.Component {
  static contextType = AuthContext;
  constructor(props) {
    super(props);
    this.flatListRef = null;
    this.defaultState = {
      isDevelopmentMode: false,
      loading: true,
      LangStr: StringsOfLanguages,
      TrailerList: [],
      searchTxt: "",
      OpenOptionDialog: false,
      DeleteConfirmationDialog: false,
      APIAction: 0,
      SelectedTrailerObj: {},
      PageCount: 8,
      PageIndex: 0,
      ScrollIndicatorVisible: false,
      offset: 0,
      AddItemVisible: true,
      paginationLoader: false,
      stopCallingApi: false,
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
          this.FetchTrailerList(false);
        }
      }
    });
    this.FetchTrailerList(false);
  }

  async UNSAFE_componentWillReceiveProps(nextProps) {
    if (this.state.APIAction == 1) {
      if (nextProps.DeleteTrailer.DeleteTrailerSuccess) {
        if (nextProps.DeleteTrailer.data[1] == 200) {
          this.setState({ loading: false, SelectedTrailerObj: 0 });
          this.FetchTrailerList(false);
        } else if (nextProps.DeleteTrailer.data[1] == 401) {
          const SignOutContext = this.context;
          SignOutContext.signOut();
        } else {
          this.setState({ loading: false, APIAction: 0 });
          alert((await nextProps.DeleteTrailer.data[0]).message);
          console.log("nextProps.DeleteTrailer");
        }
      }
    } else {
      if (nextProps.TrailerList.GetTrailerListSuccess) {
        console.log();
        if (nextProps.TrailerList.data[1] == 200) {
          const data = await nextProps.TrailerList.data[0];
          if (this.state.TrailerList.length == 0) {
            console.log(data, "opopopopop");
            this.setState({ TrailerList: data });
          } else {
            if (data.length > 0) {
              console.log(data, "dataaaaaa");

              data.map((data) => this.state.TrailerList.push(data));
              console.log(this.state.TrailerList, "909090909");
            }
          }
          this.setState({
            ScrollIndicatorVisible: false,
            loading: false,
            paginationLoader: false,
          });
        } else if (nextProps.TrailerList.data[1] == 401) {
          const SignOutContext = this.context;
          SignOutContext.signOut();
        } else {
          this.setState({ loading: false, ScrollIndicatorVisible: false });
          console.log("nextProps.TrailerList");
        }
      }
    }
  }

  async FetchTrailerList(isSearchAction) {
    const NetworkStatus = NetChecker();
    if ((await NetworkStatus) == false) {
      alert("network issue ");
      return;
    }
    this.setState({ APIAction: 0, TrailerList: [] });
    this.props.GetTrailerListAction(
      this.state.searchTxt,
      this.state.PageIndex,
      this.state.PageCount
    );
  }

  SearchAction(SearchText) {
    this.setState({ searchTxt: SearchText });
    this.FetchTrailerList(true);
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
            this.setState({ OpenOptionDialog: true, SelectedTrailerObj: data });
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

  onUpdate() {
    var objSelectedTrailer = this.state.SelectedTrailerObj;
    this.setState({ OpenOptionDialog: false, SelectedTrailerObj: {} });
    this.props.navigation.navigate("SaveTrailer", {
      Action: 2,
      TrailerObject: JSON.stringify(objSelectedTrailer),
    });
  }

  onShowDetails() {
    var objSelectedTrailer = this.state.SelectedTrailerObj;
    console.log(">>>", objSelectedTrailer);
    this.setState({ OpenOptionDialog: false, SelectedTrailerObj: {} });
    this.props.navigation.navigate("TrailerDetails", {
      TrailerObject: JSON.stringify(objSelectedTrailer),
    });
  }

  onDelete() {
    var intSelectedTrailerID = this.state.SelectedTrailerObj.trailerId;
    this.setState({
      OpenOptionDialog: false,
      DeleteConfirmationDialog: false,
      loading: true,
      APIAction: 1,
    });
    this.props.DeleteTrailerAction(intSelectedTrailerID);
  }

  onLoadMoreItems = () => {
    if (
      this.state.stopCallingApi == false &&
      this.state.TrailerList.length > 0
    ) {
      console.log("load more .......");
      this.setState({
        PageIndex: this.state.PageIndex + 1,
        paginationLoader: true,
      });
      this.FetchTrailerList(false);
    }
  };

  isCloseToBottom({ layoutMeasurement, contentOffset, contentSize }) {
    return (
      layoutMeasurement.height + contentOffset.y >= contentSize.height - 20
    );
  }

  render() {
    return (
      <SafeAreaView style={Style.mainView}>
        <StatusBar
          animated={false}
          backgroundColor={colors.WhiteSmoke}
          barStyle={"dark-content"}
        />
        <HeaderWithRefreshOption
          Title={this.state.LangStr.Trailer}
          BackAction={() => this.props.navigation.goBack()}
          onRefresh={() => {
            this.setState({ searchTxt: "", PageCount: 20 });
            this.FetchTrailerList(false);
          }}
        />

        <View style={Style.listSearchComponentContainerView}>
          <ListSearchField
            searchText={this.state.searchTxt}
            onChangeSearchText={(text) => this.SearchAction(text)}
            onClearSearchText={() => this.SearchAction("")}
            navigation={this.props.navigation}
          />
        </View>

        <View style={Style.listComponentContainerView}>
          <FlatList
            ref={(ref) => (this.flatListRef = ref)}
            data={this.state.TrailerList}
            keyExtractor={(item, index) => index.toString()}
            contentContainerStyle={{ paddingBottom: 30 }}
            renderItem={({ item, index }) => this.RenderItem(item, index)}
            ListFooterComponent={
              this.state.ScrollIndicatorVisible ? (
                <ActivityIndicator size="small" color={colors.LimeGreen} />
              ) : null
            }
            ListEmptyComponent={() => (
              <Text style={Style.NoDataTxt}>
                {this.state.LangStr.No_data_found}
              </Text>
            )}
            // onMomentumScrollEnd={({ nativeEvent }) => console.log(nativeEvent, 'nativeEventssss...')}
            onMomentumScrollEnd={({ nativeEvent }) => {
              // if (this.isCloseToBottom(nativeEvent)) {
              //   this.state.paginationLoader == false
              //     ? this.onLoadMoreItems()
              //     : "";
              // }
            }}
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

          {this.state.paginationLoader ? (
            <ActivityIndicator size={"small"} color={colors.LimeGreen} />
          ) : undefined}

          {/* 1=Insert, 2=Update */}
          {/* {CARRIER_OPERATOR ? ( */}
            <AddNewItem
              // Visible={this.state.AddItemVisible}
              Visible={true}
              onAddItem={() =>
                this.props.navigation.navigate("SaveTrailer", { Action: 1 })
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
    TrailerList: state.TrailerList,
    DeleteTrailer: state.DeleteTrailer,
  };
};
export default connect(mapStateToProps, {
  GetTrailerListAction,
  DeleteTrailerAction,
})(TrailerList);
