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
  GetPrefferedRouteAction,
  DeletePrefferedRouteAction,
  ActivateDeactivatePreferredRouteAction,
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
import { Colors } from "react-native-paper";

let CARRIER_OPERATOR;
class PreferredRouteList extends React.Component {
  static contextType = AuthContext;
  constructor(props) {
    super(props);
    this.flatListRef = null;
    this.defaultState = {
      loading: true,
      LangStr: StringsOfLanguages,
      PrefferedRouteList: [],

      searchTxt: "",
      OpenOptionDialog: false,
      DeleteConfirmationDialog: false,
      APIAction: 0,

      SelectedPrefferedRouteObj: {},
      PageCount: 20,
      ScrollIndicatorVisible: false,

      offset: 0,
      AddItemVisible: true,

      GetPreffered: true,
      ForDelete: false,
      ForActiveDeactive: false,
    };
    this.state = { ...this.defaultState };
  }

  async componentDidMount() {
    CARRIER_OPERATOR = await AsyncStorage.getItem("CARRIER_OPERATOR");

    this._Reload = this.props.navigation.addListener("focus", async () => {
      CARRIER_OPERATOR = await AsyncStorage.getItem("CARRIER_OPERATOR");

      this.setState({ GetPreffered: true });
      this.FetchPrefferedRoute(false);
    });

    this.FetchPrefferedRoute(false);
  }

  async UNSAFE_componentWillReceiveProps(nextProps) {
    if (this.state.GetPreffered) {
      if (nextProps.GetPrefferedRouteData.GetPreferredRouteSuccess) {
        if (nextProps.GetPrefferedRouteData.data[1] == 200) {
          console.log(nextProps.GetPrefferedRouteData.data[0]);
          this.setState({
            PrefferedRouteList: nextProps.GetPrefferedRouteData.data[0],
            loading: false,
            GetPreffered: false,
          });
        } else if (nextProps.GetPrefferedRouteData.data[1] == 401) {
          const SignOutContext = this.context;
          SignOutContext.signOut();
        } else {
          alert("something went wrong.");
        }
      } else {
        alert("something went wrong.");
      }
    }

    if (this.state.ForDelete) {
      if (nextProps.DeletePrefferedRouteData.DeletePreferredRouteSuccess) {
        if (nextProps.DeletePrefferedRouteData.data[1] == 200) {
          this.setState({
            loading: false,
            ForDelete: false,
            GetPreffered: true,
          });
          this.FetchPrefferedRoute(false);
        } else if (nextProps.DeletePrefferedRouteData.data[1] == 401) {
          const SignOutContext = this.context;
          SignOutContext.signOut();
        } else {
          alert("something went wrong.");
        }
      } else {
        alert("something went wrong.");
      }
    }

    if (this.state.ForActiveDeactive) {
      if (nextProps.ActiveDeactivePreRouteData.activedeactiveprerouteSuccess) {
        if (nextProps.ActiveDeactivePreRouteData.data[1] == 200) {
          console.log(nextProps.ActiveDeactivePreRouteData.data[0], "->>>>>");
          this.setState({
            loading: false,
            ForActiveDeactive: false,
            GetPreffered: true,
          });
          this.FetchPrefferedRoute(false);
        } else if (nextProps.ActiveDeactivePreRouteData.data[1] == 401) {
          const SignOutContext = this.context;
          SignOutContext.signOut();
        } else {
          alert("something went wrong.");
        }
      } else {
        alert("something went wrong.");
      }
    }
  }

  async FetchPrefferedRoute(page) {
    const NetworkStatus = NetChecker();
    if ((await NetworkStatus) == false) {
      alert("network issue ");
      return;
    }

    this.props.GetPrefferedRouteAction({
      searchTxt: this.state.searchTxt,
      pageIndex: 0,
      pageCount: page == false ? 1000 : this.state.PageCount,
    });
  }

  SearchAction(SearchText) {
    this.setState({ searchTxt: SearchText, GetPreffered: true });
    this.FetchPrefferedRoute(false);
  }

  onUpdate() {
    var objSelectedPrefferedRoute = this.state.SelectedPrefferedRouteObj;
    this.setState({ OpenOptionDialog: false, objSelectedPrefferedRoute: {} });
    this.props.navigation.navigate("SavePreferredRoute", {
      Action: 2,
      PrefferedRouteObject: JSON.stringify(objSelectedPrefferedRoute),
    });
  }

  onShowDetails() {
    var objSelectedPrefferedRoute = this.state.SelectedPrefferedRouteObj;
    this.setState({ OpenOptionDialog: false, SelectedPrefferedRouteObj: {} });
    this.props.navigation.navigate("PreferredRouteDetails", {
      PrefferedRouteObject: JSON.stringify(objSelectedPrefferedRoute),
    });
  }

  ActiveDeactiveRoute() {
    this.setState({
      loading: true,
      ForActiveDeactive: true,
      OpenOptionDialog: false,
    });
    this.props.ActivateDeactivatePreferredRouteAction({
      ID: this.state.SelectedPrefferedRouteObj.preferredRouteId,
      type: this.state.SelectedPrefferedRouteObj.active == "Y" ? 1 : 0,
    });
  }

  RenderItem = (data, index) => {
    // console.log(data.active, '---------');
    return (
      //   <View
      //     style={[
      //       Style.TrailerListItemContailer,
      //       {
      //         flexDirection: "row",
      //         paddingLeft: 0,
      //         paddingVertical: 0,
      //         overflow: "hidden",
      //       },
      //     ]}
      //   >
      //     <View
      //       style={{
      //         width: RFPercentage(0.5),
      //         backgroundColor:
      //           data.active == "Y" ? colors.LightGreen : colors.LightRed,
      //         borderTopLeftRadius: RFValue(10),
      //         borderBottomLeftRadius: RFValue(10),
      //       }}
      //     ></View>
      //     <TouchableOpacity
      //       style={{
      //         width: "98%",
      //         paddingLeft: RFValue(10),
      //         paddingVertical: RFValue(10),
      //       }}
      //       onPress={() => {
      //         this.setState({
      //           OpenOptionDialog: true,
      //           SelectedPrefferedRouteObj: data,
      //         });
      //         this.flatListRef.scrollToIndex({
      //           animated: true,
      //           index: index,
      //         });
      //       }}
      //     >
      //       <View
      //         style={{
      //           flexDirection: "row",
      //           flex: 1,
      //           marginVertical: RFValue(10),
      //         }}
      //       >
      //         <View style={{ flex: 1 }}>
      //           <Text
      //             style={[
      //               Style.EmailTxt,
      //               { color: colors.Grey, marginBottom: RFValue(2) },
      //             ]}
      //           >
      //             {this.state.LangStr.FromLocation}
      //           </Text>
      //           <View
      //             style={{
      //               flexDirection: "row",
      //               alignItems: "center",
      //               width: "95%",
      //             }}
      //           >
      //             <Image
      //               style={{
      //                 height: RFPercentage(2),
      //                 width: RFPercentage(2),
      //                 resizeMode: "contain",
      //                 marginRight: RFValue(5),
      //               }}
      //               source={require("../../../assets/images/icn_navigation2.png")}
      //             />
      //             <Text numberOfLines={1} style={Style.DropdownItemTxt}>
      //               {(data.fromCity?.name ? data.fromCity?.name + ", " : "") +
      //                 data.fromCountry?.name}
      //             </Text>
      //           </View>
      //         </View>
      //         <View style={{ flex: 1 }}>
      //           <Text
      //             style={[
      //               Style.EmailTxt,
      //               { color: colors.Grey, marginBottom: RFValue(2) },
      //             ]}
      //           >
      //             {this.state.LangStr.ToLocation}
      //           </Text>
      //           <View
      //             style={{
      //               flexDirection: "row",
      //               alignItems: "center",
      //               width: "95%",
      //             }}
      //           >
      //             <Image
      //               style={{
      //                 height: RFPercentage(2),
      //                 width: RFPercentage(2),
      //                 resizeMode: "contain",
      //                 marginRight: RFValue(5),
      //               }}
      //               source={require("../../../assets/images/icn_location.png")}
      //             />

      //             <Text numberOfLines={1} style={Style.DropdownItemTxt}>
      //               {(data.toCity?.name ? data.toCity?.name + ", " : "") +
      //                 data.toCountry?.name}
      //             </Text>
      //           </View>
      //         </View>
      //       </View>
      //     </TouchableOpacity>
      //   </View>
      <View style={[Style.TrailerListItemContailer]}>
        <TouchableOpacity
          style={{
            flexDirection: "row",
            alignItems: "center",
            paddingLeft: RFValue(5),
            width: "98%",
            alignSelf: "center",
          }}
          onPress={() => {
            this.setState({
              OpenOptionDialog: true,
              SelectedPrefferedRouteObj: data,
            });
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
                borderRadius: 23,
              }}
            >
              <Image
                source={require("../../../assets/images/Road1.png")}
                style={{ width: 20, height: 20 }}
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

          <View
            style={{
              width: "80%",
              marginHorizontal: 10,
            }}
          >
            <View>
              <Text style={[Style.EmailTxt, { marginBottom: RFValue(2) }]}>
                {this.state.LangStr.FromLocation + " :"}
              </Text>
              <View
                style={{
                  flexDirection: "row",
                  alignItems: "center",
                  width: "95%",
                }}
              >
                <Image
                  style={{
                    height: RFPercentage(1.5),
                    width: RFPercentage(1.5),
                    resizeMode: "contain",
                    marginRight: RFValue(5),
                  }}
                  source={require("../../../assets/images/BlueArrow.png")}
                />
                <Text
                  numberOfLines={1}
                  style={[Style.DropdownItemTxt, { color: colors.Grey }]}
                >
                  {(data.fromCity?.name ? data.fromCity?.name + ", " : "") +
                    data.fromCountry?.name}
                </Text>
              </View>
            </View>
            <View style={{ marginTop: 10 }}>
              <Text
                style={[
                  Style.EmailTxt,
                  { color: colors.Black, marginBottom: RFValue(2) },
                ]}
              >
                {this.state.LangStr.ToLocation + " :"}
              </Text>
              <View
                style={{
                  flexDirection: "row",
                  alignItems: "center",
                  width: "95%",
                }}
              >
                <Image
                  style={{
                    height: RFPercentage(2),
                    width: RFPercentage(2),
                    resizeMode: "contain",
                    marginRight: RFValue(5),
                  }}
                  source={require("../../../assets/images/RedLocation.png")}
                />

                <Text
                  numberOfLines={1}
                  style={[Style.DropdownItemTxt, { color: colors.Grey }]}
                >
                  {(data.toCity?.name ? data.toCity?.name + ", " : "") +
                    data.toCountry?.name}
                </Text>
              </View>
            </View>
          </View>
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
    var intSelectedPrefferedRouteID =
      this.state.SelectedPrefferedRouteObj.preferredRouteId;
    this.setState({
      OpenOptionDialog: false,
      DeleteConfirmationDialog: false,
      loading: true,
      ForDelete: 1,
    });
    console.log("---", this.state.SelectedPrefferedRouteObj);
    console.log("=====", intSelectedPrefferedRouteID);
    this.props.DeletePrefferedRouteAction(intSelectedPrefferedRouteID);
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
          Title={this.state.LangStr.PreferredRoute}
          BackAction={() => this.props.navigation.goBack()}
          onRefresh={() => {
            this.setState({
              searchTxt: "",
              PageCount: 20,
              GetPreffered: true,
              loading: true,
            });
            this.FetchPrefferedRoute(false);
          }}
        />
        <View style={[Style.listSearchComponentContainerView]}>
          {/* {this.state.PrefferedRouteList.length > 0 ? (
            <ListSearchField
              searchText={this.state.searchTxt}
              onChangeSearchText={(text) => this.SearchAction(text)}
              onClearSearchText={() => this.SearchAction("")}
              navigation={this.props.navigation}
            />
          ) : undefined} */}
        </View>
        <View style={Style.listComponentContainerView}>
          {this.state.PrefferedRouteList.length == 0 &&
          this.state.loading == false ? (
            <Text style={Style.NoDataTxt}>
              {this.state.LangStr.No_data_found}
            </Text>
          ) : (
            <FlatList
              ref={(ref) => (this.flatListRef = ref)}
              data={this.state.PrefferedRouteList}
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
          {/* {CARRIER_OPERATOR ? ( */}
            <AddNewItem
              // Visible={this.state.AddItemVisible}
              Visible={true}
              onAddItem={() =>
                this.props.navigation.navigate("SavePreferredRoute", {
                  Action: 1,
                })
              }
            />
          {/* ) : undefined} */}
        </View>

        <ListItemMoreOptions
          isVisible={this.state.OpenOptionDialog}
          carrierOperator={CARRIER_OPERATOR}
          OnFetchDetails={() => this.onShowDetails()}
          OnActiveDeactive={() => this.ActiveDeactiveRoute()}
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
          showActiveDeactiveOption={true}
          activeOrdeactive={
            this.state.SelectedPrefferedRouteObj.active == "Y"
              ? this.state.LangStr.Deactive
              : this.state.LangStr.Activate
          }
          activedeactiveStatus={this.state.SelectedPrefferedRouteObj.active}
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
    GetPrefferedRouteData: state.GetPrefferedRouteData,
    DeletePrefferedRouteData: state.DeletePrefferedRouteData,
    ActiveDeactivePreRouteData: state.ActiveDeactivePreRouteData,
  };
};
export default connect(mapStateToProps, {
  GetPrefferedRouteAction,
  DeletePrefferedRouteAction,
  ActivateDeactivatePreferredRouteAction,
})(PreferredRouteList);
