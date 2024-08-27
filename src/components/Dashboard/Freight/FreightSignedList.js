import React, { useState } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";
import {
  View,
  SafeAreaView,
  Text,
  TouchableOpacity,
  StatusBar,
  FlatList,
  Dimensions,
  Modal,
  ActivityIndicator,
  Image,
  TouchableWithoutFeedback,
  Alert,
} from "react-native";
import { AuthContext } from "../../../navigation/AuthContext";
import * as colors from "../../../common/colors";
import StringsOfLanguages from "../../../Localization/stringsoflanguages";
import { Style } from "../../../common/Style";
import * as FONTS from "../../../common/fonts";

import {
  GetFreightSignedListAction,
  SaveDeviceTokenAction,
  CreateTransportApplicationAction,
  DeleteTransportApplicationAction,
  GetContainerProposalAction,
  GetSelectedContainerProposalAction,
} from "../../../Redux/actions";
import { connect } from "react-redux";
import NetChecker from "../../../common/Component/Network";
import { RFPercentage, RFValue } from "react-native-responsive-fontsize";
import * as Fonts from "../../../common/fonts";
import * as Api from "../../../common/Api";
const { width, height } = Dimensions.get("window");
import {
  ListSearchField,
  AddNewItem,
} from "../../../common/Component/ListSearchField";
import ListItemMoreOptions2 from "../../../common/Component/ListItemMoreOptions2";
import DeleteConfirmationModel from "../../../common/Component/DeleteConfirmationModel";
import WarningModal from "../../../common/Component/WarningModal";
import messaging from "@react-native-firebase/messaging";
import LinearGradient from "react-native-linear-gradient";
import FilterForm from "./FilterForm";
import IMAGES from "../../../common/Image";
import CreateApplicationForm from "./CreateApplicationForm";
import { showSucces } from "../../../common/Utils/flashMessage";

class FreightSignedList extends React.Component {
  static contextType = AuthContext;
  constructor(props) {
    super(props);
    this.flatListRef = null;
    this.defaultState = {
      refreshing: false,
      loading: false,
      LangStr: StringsOfLanguages,
      FreightList: [],
      searchTxt: "",
      OpenOptionDialog: false,
      DeleteConfirmationDialog: false,
      APIAction: 0,
      SelectedFreightObj: {},
      PageCount: 20,
      ScrollIndicatorVisible: false,
      offset: 0,
      AddItemVisible: true,
      SaveDeviceTokenCall: false,
      WarningConfirmationDialog: false,
      showFilter: false,
      showForm: false,
      hasData: false,
      selectedContainer: null,
      lang: null,
    };
    this.state = { ...this.defaultState };
  }

  async componentDidMount() {
    this.setState({ lang: await AsyncStorage.getItem("SelectedLanguage") });

    this._Reload = this.props.navigation.addListener("focus", async () => {
      // this.onAddDeviceToken();
      this.setState({ lang: await AsyncStorage.getItem("SelectedLanguage") });
      if (this.props.route.params) {
        if (this.props.route.params.NeedtoReload) {
          this.setState({ ...this.defaultState });
          this.FetchFreightList(true);
        }
      }
    });
    this.FetchFreightList(false);
    // this.onAddDeviceToken();
  }

  async UNSAFE_componentWillReceiveProps(nextProps) {
    console.log(this.state.SelectedFreightObj.containerId);
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
    }
    if (this.state.APIAction == 2) {
      if (
        nextProps.CreateTransportApplication.CreateTransportApplicationSuccess
      ) {
        if (nextProps.CreateTransportApplication.data[1] == 200) {
          this.setState(
            {
              loading: false,
              APIAction: 0,
              SelectedFreightObj: {},
              OpenOptionDialog: false,
            },
            () => this.FetchFreightList(true)
          );
          alert("Application successfully created.");
          console.log("success");
        } else if (
          nextProps.CreateTransportApplication.data[0].code === "Error_215"
        ) {
          this.setState(
            {
              WarningConfirmationDialog: true,
              loading: false,
              APIAction: 0,
              OpenOptionDialog: false,
            },
            () => this.FetchFreightList(true)
          );
        } else if (nextProps.CreateTransportApplication.data[1] == 401) {
          const SignOutContext = this.context;
          SignOutContext.signOut();
        } else {
          this.setState(
            {
              loading: false,
              APIAction: 0,
              SelectedFreightObj: {},
              OpenOptionDialog: false,
            },
            () => this.FetchFreightList(true)
          );
          // alert('....')
          alert((await nextProps.CreateTransportApplication.data[0]).message);
        }
      }
    }
    if (this.state.APIAction == 3) {
      if (
        nextProps.DeleteTransportApplication.DeleteTransportApplicationSuccess
      ) {
        if (nextProps.DeleteTransportApplication.data[1] == 200) {
          this.setState(
            {
              loading: false,
              APIAction: 0,
              SelectedFreightObj: {},
              OpenOptionDialog: false,
            },
            () => this.FetchFreightList(true)
          );
        } else if (nextProps.DeleteTransportApplication.data[1] == 401) {
          const SignOutContext = this.context;
          SignOutContext.signOut();
        } else {
          this.setState(
            {
              loading: false,
              APIAction: 0,
              SelectedFreightObj: {},
              OpenOptionDialog: false,
            },
            () => this.FetchFreightList(true)
          );
          alert((await nextProps.DeleteTransportApplication.data[0]).message);
          console.log("success");
        }
      }
    } else {
      if (nextProps.FreightList.GetFreightSignedListSuccess) {
        this.setState({ loading: false });
        if (nextProps.FreightList.data[1] == 200) {
          // console.log(
          //   JSON.stringify(await nextProps.FreightList.data[0], null, 2)
          // );
          this.setState({
            FreightList: await nextProps.FreightList.data[0],
            ScrollIndicatorVisible: false,
          });
        } else if (nextProps.FreightList.data[1] == 401) {
          const SignOutContext = this.context;
          SignOutContext.signOut();
        } else {
          this.setState({ loading: false, ScrollIndicatorVisible: false });
          console.log("nextProps.FreightList");
        }
      }
    }
  }

  async FetchFreightList(isSearchAction, searchTxt = "") {
    const NetworkStatus = await NetChecker();
    if (NetworkStatus == false) {
      alert("Network Issue ");
      return;
    }
    if (!searchTxt) searchTxt = this?.state?.searchTxt;

    console.log(searchTxt, "searchTxt");

    this.setState({ APIAction: 0 });
    if (!isSearchAction) this.setState({ loading: true });
    await this.props.GetFreightSignedListAction(
      searchTxt,
      0,
      this.state.PageCount
    );
  }

  async onAddDeviceToken() {
    this.setState({ SaveDeviceTokenCall: true });
    messaging()
      .getToken()
      .then((deviceToken) => {
        console.log(deviceToken, "deviceToken");
        this.props.SaveDeviceTokenAction({
          token: deviceToken,
        });
      });
  }

  hideModal() {
    this.setState({ showForm: false });
  }

  showModal(type) {
    console.log("Update Modal", type);
    if (type == 1) {
      this.setState({ showForm: true, OpenOptionDialog: false });
    } else {
      this.setState({ showForm: true, OpenOptionDialog: false });
    }
  }

  async CreateTransportApplication() {
    const NetworkStatus = await NetChecker();
    if (NetworkStatus == false) {
      alert("network issue.");
      return;
    }
    this.setState({ APIAction: 2, loading: true });
    this.props.CreateTransportApplicationAction({
      containerId: this.state.SelectedFreightObj.containerId,
    });
  }

  async DeleteTransportApplication() {
    const NetworkStatus = await NetChecker();
    if (NetworkStatus == false) {
      alert("network issue.");
      return;
    }
    this.setState({ APIAction: 3, loading: true });
    this.props.DeleteTransportApplicationAction({
      containerId: this.state.SelectedFreightObj.containerId,
    });
  }

  async DeleteProposalApplication() {
    try {
      const NetworkStatus = await NetChecker();
      if (NetworkStatus == false) {
        alert("network issue.");
        return;
      }

      let res = await Api.DeleteContainerProposal(
        this.props.GetContainerProposal.data[0].containerProposalId
      );
      console.log("res", JSON.stringify(res, null, 2));
      if (res?.[1] === 200) {
        this.setState({
          OpenOptionDialog: false,
        });
        showSucces({
          description: StringsOfLanguages.ContainerProposalDeletedSuccess,
        });
      } else {
        if (res?.[0]?.code == "Error_215") {
        } else Alert.alert("Error", res[0]?.message);
      }
    } catch (e) {
      console.error(e);
    }
  }

  RenderItem2 = (data, index) => {
    const TextSubtext = (title, subtitle) => {
      return (
        <View style={{ flex: 1 }}>
          <Text style={Style.freightCardText}>{title}</Text>
          <Text style={Style.freightCardSubText}>{subtitle}</Text>
        </View>
      );
    };

    const Locationtext = (icon, location) => {
      return (
        <View style={{ flex: 1, flexDirection: "row" }}>
          <Image
            style={{
              height: RFPercentage(1.8),
              width: RFPercentage(1.8),
              resizeMode: "contain",
              overflow: "hidden",
            }}
            source={icon}
          />
          <Text style={Style.freightCardSubText}>{location}</Text>
        </View>
      );
    };

    return (
      <View>
        <TouchableOpacity
          activeOpacity={4}
          // onPress={() => this.setState({ Modal: true })}
          onPress={async () => {
            console.log("first", data.containerId);
            await this.props.GetContainerProposalAction(
              data.containerId,
              0,
              20
            );

            this.flatListRef.scrollToIndex({
              animated: true,
              index: index,
            });
            await this.props.GetSelectedContainerProposalAction(
              data.containerId
            );

            this.setState({
              OpenOptionDialog: true,
              SelectedFreightObj: data,
            });
          }}
        >
          <View
            style={{
              height: RFValue(165),
              borderRadius: 10,
              backgroundColor: colors.White,
              borderWidth: 1,
              borderColor: "#34b26770",
              paddingHorizontal: "5%",
              alignSelf: "center",
              marginTop: RFValue(15),
            }}
          >
            <View
              style={{
                flexDirection: "row",
                justifyContent: "space-between",
                alignItems: "center",
                height: RFValue(85),
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
                {data?.freightType?.description}
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
                    {new Intl.NumberFormat(this.state.lang + "-IN").format(
                      data.price
                    )}{" "}
                    {data.priceCurrency.currencyCode}
                  </Text>
                </View>
              </View>

              <Image
                resizeMode="contain"
                style={{
                  marginTop: RFValue(10),
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
              <View style={{ width: "55%" }}>
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
                      marginRight: RFValue(4),
                      height: RFValue(14),
                      width: RFValue(14),
                    }}
                    source={require("../../../assets/images/DashboardCarrier/icn_arrow_freight.png")}
                  />
                  {data.fromAddress ? (
                    <Text
                      style={{
                        color: "#000",
                        marginLeft: 5,
                        fontSize: RFValue(13),
                        fontFamily: FONTS.Medium,
                      }}
                      numberOfLines={1}
                    >
                      {data?.fromAddress?.city.name +
                        ", " +
                        data.fromAddress?.country.name}
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
                    marginTop: RFValue(4),
                  }}
                >
                  <Image
                    resizeMode="contain"
                    style={{
                      marginRight: RFValue(4),
                      height: RFValue(14),
                      width: RFValue(14),
                    }}
                    source={require("../../../assets/images/DashboardCarrier/icn_calender_freight.png")}
                  />
                  {data?.plannedDepartureDate ? (
                    <Text
                      style={{
                        marginLeft: 5,
                        color: "#000",
                        fontSize: RFValue(13),
                        fontFamily: FONTS.Medium,
                      }}
                    >
                      {
                        new Date(data.plannedDepartureDate)
                          .toLocaleString(this.state.lang + "-IN")
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
                      numberOfLines={1}
                    >
                      {this.state.LangStr.Departure_Date}
                    </Text>
                  )}
                </View>
              </View>
              <View style={{ width: "45%" }}>
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
                      marginRight: RFValue(2),
                      height: RFValue(14),
                      width: RFValue(14),
                    }}
                    source={require("../../../assets/images/DashboardCarrier/icn_location_freight.png")}
                  />
                  {data.toAddress ? (
                    <Text
                      style={{
                        color: "#000",
                        marginLeft: 5,
                        fontSize: RFValue(13),
                        fontFamily: FONTS.Medium,
                      }}
                      numberOfLines={1}
                    >
                      {data.toAddress?.city.name +
                        ", " +
                        data.toAddress?.country.name}
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
                    marginTop: RFValue(4),
                  }}
                >
                  <Image
                    resizeMode="contain"
                    style={{
                      marginRight: RFValue(4),
                      height: RFValue(14),
                      width: RFValue(14),
                    }}
                    source={require("../../../assets/images/DashboardCarrier/icn_calender_freight.png")}
                  />
                  {data?.plannedArrivalDate ? (
                    <Text
                      style={{
                        marginLeft: 5,
                        color: "#000",
                        fontSize: RFValue(13),
                        fontFamily: FONTS.Medium,
                      }}
                    >
                      {
                        new Date(data?.plannedArrivalDate)
                          .toLocaleString(this.state.lang + "-IN")
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
        </TouchableOpacity>
      </View>
    );
  };

  onShowDetails(proposal) {
    var objSelectedFreight = this.state.SelectedFreightObj;
    this.setState({ OpenOptionDialog: false, SelectedFreightObj: {} });
    this.props.navigation.navigate("FreightDetails", {
      FreightObject: JSON.stringify(objSelectedFreight),
      proposal: proposal,
      proposalData: this.props.GetSelectedContainerProposal.data,
    });
  }

  onUpdate() {
    var objSelectedFreight = this.state.SelectedFreightObj;
    this.setState({ OpenOptionDialog: false, SelectedFreightObj: {} });
    this.props.navigation.navigate("SaveFreight", {
      Action: 2,
      FreightObject: JSON.stringify(objSelectedFreight),
    });
  }

  onDelete() {
    var intSelectedDriverID = this.state.SelectedFreightObj.userId;
    this.setState({
      OpenOptionDialog: false,
      DeleteConfirmationDialog: false,
      loading: true,
      APIAction: 1,
    });
    // this.props.DeleteDriverAction(intSelectedDriverID)
  }

  SearchAction(SearchText) {
    this.setState({ searchTxt: SearchText });
    this.FetchFreightList(true, SearchText);
  }

  handleFilterPress() {
    this.setState({
      showFilter: true,
    });
  }

  hideFilterModal() {
    this.setState({
      showFilter: false,
    });
  }

  async handleFilterSubmit(FilterOptions = null) {
    // console.log("handleFilterSubmit.FilterOptions", FilterOptions);
    this.hideFilterModal();

    if (!(await NetChecker())) {
      alert("Network Issue ");
      return;
    }

    this.setState({ APIAction: 0 });
    await this.props.GetFreightSignedListAction(
      "",
      0,
      this.state.PageCount,
      FilterOptions
    );
  }

  render() {
    const { FreightList } = this.state;

    return (
      <SafeAreaView style={Style.mainView}>
        <StatusBar
          animated={false}
          backgroundColor={colors.WhiteSmoke}
          barStyle={"dark-content"}
        />
        <View style={Style.listSearchComponentContainerView}>
          <ListSearchField
            searchText={this.state.searchTxt}
            onChangeSearchText={(v) => {
              this.SearchAction(v);
            }}
            onClearSearchText={() => this.SearchAction("")}
            // filter
            // filterPress={() => {
            //   this.handleFilterPress();
            // }}
            // navigation={this.props.navigation}
          />
        </View>
        <View style={[Style.listComponentContainerView]}>
          {FreightList.length > 0 ? (
            <FlatList
              refreshing={this.state.refreshing}
              onRefresh={() => this.FetchFreightList(false, "")}
              ref={(ref) => (this.flatListRef = ref)}
              contentContainerStyle={{ paddingBottom: RFValue(100) }}
              data={this.state.FreightList}
              keyExtractor={(item, index) => index.toString()}
              renderItem={({ item, index }) => this.RenderItem2(item, index)}
              ListFooterComponent={
                this.state.ScrollIndicatorVisible ? (
                  <ActivityIndicator size="small" color={colors.LimeGreen} />
                ) : null
              }
              onEndReached={this.onLoadMoreItems}
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
          ) : (
            <Text style={Style.NoDAta}>{StringsOfLanguages.No_data_found}</Text>
          )}
        </View>

        {this.state.SelectedFreightObj?.appliedForTransport && (
          <ListItemMoreOptions2
            isVisible={this.state.OpenOptionDialog}
            OnFetchDetails={() => this.onShowDetails("details")}
            onUpdate={(e) => this.showModal(e)} // 1=Insert, 2=Update
            onView={() => this.onShowDetails("view")}
            onDelete={() => this.DeleteProposalApplication()}
            data={this.props.GetContainerProposal}
            onClose={() =>
              this.setState({ OpenOptionDialog: false, SelectedFreightObj: {} })
            }
            appliedForTransport={
              this.state.SelectedFreightObj?.appliedForTransport
            }
          />
        )}
        {this.props.GetSelectedContainerProposal
          .GetSelectedContainerProposalSuccess && (
          <CreateApplicationForm
            isVisible={this.state.showForm}
            hideModal={() => this.setState({ showForm: false })}
            showModal={() => this.setState({ showForm: true })}
            applicationData={this.state.SelectedFreightObj}
            editData={this.props.GetSelectedContainerProposal}
            onSubmit={(data) => {
              this.CreateTransportApplication(data);
            }}
          />
        )}

        <DeleteConfirmationModel
          isVisible={this.state.DeleteConfirmationDialog}
          onDelete={() => this.onDelete()}
          onCancel={() => this.setState({ DeleteConfirmationDialog: false })}
        />

        <WarningModal
          isVisible={this.state.WarningConfirmationDialog}
          onContinue={() => {
            this.setState({ WarningConfirmationDialog: false });
            this.props.navigation.navigate("AddTransport");
          }}
          onCancel={() => this.setState({ WarningConfirmationDialog: false })}
        />

        <FilterForm
          onSubmit={(v) => {
            this.handleFilterSubmit(v);
          }}
          isVisible={this.state.showFilter}
          hideModal={() => {
            this.hideFilterModal();
          }}
          onReset={() => {
            this.handleFilterSubmit();
          }}
        />

        {/* <Loader visible={this.state.loading} /> */}
        {this.state.loading ? (
          <Modal transparent={true} animationType="none" visible={true}>
            <ActivityIndicator
              size={"large"}
              style={{
                position: "absolute",
                backgroundColor: colors.TransperantBlack,
                left: 0,
                right: 0,
                top: 0,
                bottom: 0,
                alignItems: "center",
                justifyContent: "center",
              }}
              color={colors.LimeGreen}
            />
          </Modal>
        ) : null}
      </SafeAreaView>
    );
  }
}

const mapStateToProps = (state) => {
  return {
    FreightList: state.FreightSignedList,
    SavedToken: state.SavedDeviceTokenList,
    CreateTransportApplication: state.CreateTransportApplication,
    DeleteTransportApplication: state.DeleteTransportApplication,
    GetContainerProposal: state.GetContainerProposal,
    GetSelectedContainerProposal: state.GetSelectedContainerProposal,
  };
};
export default connect(mapStateToProps, {
  GetFreightSignedListAction,
  SaveDeviceTokenAction,
  CreateTransportApplicationAction,
  DeleteTransportApplicationAction,
  GetContainerProposalAction,
  GetSelectedContainerProposalAction,
})(FreightSignedList);
