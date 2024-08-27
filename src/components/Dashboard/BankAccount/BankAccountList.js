import React, { useState, useRef } from "react";
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
  Alert,
  Platform,
} from "react-native";
import { AuthContext } from "../../../navigation/AuthContext";
import * as colors from "../../../common/colors";
import { HeaderWithRefreshOption } from "../../../common/Component/Header";
import StringsOfLanguages from "../../../Localization/stringsoflanguages";
import { Style } from "../../../common/Style";
import {
  GetBankAccountListAction,
  DeleteBankAccountAction,
  SetAsPrimaryAction,
} from "../../../Redux/actions";
import { connect } from "react-redux";
import NetChecker from "../../../common/Component/Network";
import Loader from "../../../common/Component/Loader";
import { Colors } from "react-native/Libraries/NewAppScreen";
import { RFPercentage, RFValue } from "react-native-responsive-fontsize";
import { ScrollView } from "react-native";
import * as Fonts from "../../../common/fonts";
const { width, height } = Dimensions.get("window");
import {
  ListSearchField,
  AddNewItem,
} from "../../../common/Component/ListSearchField";
import ListItemMoreOptions from "../../../common/Component/ListItemMoreOptions";
import DeleteConfirmationModel from "../../../common/Component/DeleteConfirmationModel";
import LinearGradient from "react-native-linear-gradient";

class BankAccountList extends React.Component {
  static contextType = AuthContext;
  constructor(props) {
    super(props);
    this.flatListRef = null;
    this.defaultState = {
      loading: true,
      LangStr: StringsOfLanguages,
      BankAccountList: [],

      searchTxt: "",
      OpenOptionDialog: false,
      DeleteConfirmationDialog: false,
      APIAction: 0,

      SelectedBankAccountObj: {},
      PageCount: 20,
      ScrollIndicatorVisible: false,

      offset: 0,
      AddItemVisible: true,
      isSetPrimary: false,
      setPrimaryLoad: false,
    };
    this.state = { ...this.defaultState };
  }

  async componentDidMount() {
    this._Reload = this.props.navigation.addListener("focus", async () => {
      if (this.props.route.params) {
        if (this.props.route.params.NeedtoReload) {
          this.setState({ ...this.defaultState });
          this.FetchBankAccountList(false);
        }
      }
    });

    this.FetchBankAccountList(false);
  }

  async UNSAFE_componentWillReceiveProps(nextProps) {
    if (this.state.APIAction == 1) {
      if (nextProps.DeleteBankAccount.DeleteBankAccountSuccess) {
        if (nextProps.DeleteBankAccount.data[1] == 200) {
          this.setState({ loading: false, SelectedBankAccountObj: 0 });
          this.FetchBankAccountList(false);
        } else if (nextProps.DeleteBankAccount.data[1] == 401) {
          const SignOutContext = this.context;
          SignOutContext.signOut();
        } else {
          this.setState({ loading: false, APIAction: 0 });
          alert((await nextProps.DeleteBankAccount.data[0]).message);
          console.log("nextProps.DeleteBankAccount");
        }
      }
    } else {
      if (nextProps.BankAccountList.GetBankAccountListSuccess) {
        this.setState({ loading: false });
        if (nextProps.BankAccountList.data[1] == 200) {
          var lstBankAccountList = await nextProps.BankAccountList.data[0];
          this.setState({
            BankAccountList: await nextProps.BankAccountList.data[0],
            ScrollIndicatorVisible: false,
          });
        } else if (nextProps.BankAccountList.data[1] == 401) {
          const SignOutContext = this.context;
          SignOutContext.signOut();
        } else {
          this.setState({ loading: false, ScrollIndicatorVisible: false });
        }
      }
    }

    if (this.state.isSetPrimary) {
      if (nextProps.SetAsPrimary.SetAsPrimarySuccess) {
        if (nextProps.SetAsPrimary.data[1] == 200) {
          this.setState({
            isSetPrimary: false,
            OpenOptionDialog: false,
            setPrimaryLoad: false,
          });
          this.FetchBankAccountList(true);
        } else if (nextProps.SetAsPrimary.data[1] == 401) {
          const SignOutContext = this.context;
          SignOutContext.signOut();
        } else {
          this.setState({ setPrimaryLoad: false });
          alert(nextProps.SetAsPrimary.data[0].message);
        }
      } else {
        this.setState({ setPrimaryLoad: false });

        alert("Something went wrong.");
      }
      console.log(nextProps.SetAsPrimary, "heyyyyaaaa");
    }
  }

  SearchAction(SearchText) {
    this.setState({ searchTxt: SearchText });
    this.FetchBankAccountList(true);
  }

  async FetchBankAccountList(isSearchAction) {
    const NetworkStatus = NetChecker();
    if ((await NetworkStatus) == false) {
      alert("network issue ");
      return;
    }

    this.setState({ APIAction: 0 });
    if (!isSearchAction) this.setState({ loading: true });
    this.props.GetBankAccountListAction(
      this.state.searchTxt,
      0,
      this.state.PageCount
    );
  }

  onLoadMoreItems = () => {
    if (
      this.state.searchTxt == "" &&
      this.state.BankAccountList.length == this.state.PageCount
    ) {
      this.setState(
        {
          PageCount: this.state.PageCount + 20,
          ScrollIndicatorVisible: true,
        },
        () => {
          this.FetchBankAccountList(true);
        }
      );
    }
  };

  onUpdate() {
    var objSelectedBankAccount = this.state.SelectedBankAccountObj;
    this.setState({ OpenOptionDialog: false, objSelectedBankAccount: {} });
    this.props.navigation.navigate("SaveBankAccount", {
      Action: 2,
      BankAccountObject: JSON.stringify(objSelectedBankAccount),
    });
  }

  onDelete() {
    var intSelectedBankAccountID =
      this.state.SelectedBankAccountObj.bankAccountId;
    this.setState({
      OpenOptionDialog: false,
      DeleteConfirmationDialog: false,
      loading: true,
      APIAction: 1,
    });
    this.props.DeleteBankAccountAction(intSelectedBankAccountID);
  }

  RenderItem = (data, index) => {
    console.log("Dataaaaa>>>", data);
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
            this.setState({
              OpenOptionDialog: true,
              SelectedBankAccountObj: data,
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
                source={require("../../../assets/images/bank2.png")}
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
                alignItems: "center",
                justifyContent: "space-between",
              }}
            >
              <Text
                style={{
                  fontFamily: Fonts.LexendRegular,
                  fontSize: Platform.OS === "ios" ? RFValue(13) : RFValue(14),
                }}
              >
                {data?.accountHolder}
              </Text>
              {data?.isPrimary === "Y" ? (
                <View style={{ marginRight: RFValue(30) }}>
                  <Image
                    source={require("../../../assets/images/Star21.png")}
                    style={[Style.IconImg]}
                  />
                </View>
              ) : null}
            </View>

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
                  fontSize: Platform.OS === "ios" ? RFValue(13) : RFValue(14),
                  fontFamily: Fonts.LexendRegular,
                }}
              >
                {this.state.LangStr.AccountNo}
                {":"}
              </Text>

              <Text
                numberOfLines={1}
                style={{
                  color: "#A0A0A0",
                  marginLeft: RFValue(10),
                  fontSize: Platform.OS === "ios" ? RFValue(13) : RFValue(14),
                  width: "55%",
                }}
              >
                {data?.iban}
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
                  fontSize: Platform.OS === "ios" ? RFValue(13) : RFValue(14),
                  fontFamily: Fonts.LexendRegular,
                }}
              >
                {this.state.LangStr.SwiftCode}
              </Text>
              <Text
                style={{
                  color: "#A0A0A0",
                  fontSize: Platform.OS === "ios" ? RFValue(13) : RFValue(14),
                  marginLeft: RFValue(10),
                }}
              >
                {data?.swiftCode}
              </Text>
            </View>
          </View>
        </TouchableOpacity>
      </View>
    );
  };

  render() {
    return (
      <>
        <SafeAreaView style={Style.mainView}>
          <StatusBar
            translucent
            backgroundColor={colors.WhiteSmoke}
            barStyle={"dark-content"}
          />
          <HeaderWithRefreshOption
            Title={this.state.LangStr.BankAccountTitle}
            BackAction={() => this.props.navigation.goBack()}
            onRefresh={() => {
              this.setState({ searchTxt: "", PageCount: 20 });
              this.FetchBankAccountList(false);
            }}
          />
          {/* {this.state.BankAccountList.length > 0 ?
                        <View style={[Style.listSearchComponentContainerView, { marginBottom: RFPercentage(2) }]}>
                            <ListSearchField
                                searchText={this.state.searchTxt}
                                onChangeSearchText={(text) => this.SearchAction(text)}
                                onClearSearchText={() => this.SearchAction("")}
                                navigation={this.props.navigation}
                            />
                        </View> : undefined} */}
          <View style={Style.listComponentContainerView}>
            {this.state.BankAccountList.length == 0 &&
            this.state.loading == false ? (
              <Text style={Style.NoDataTxt}>
                {this.state.LangStr.No_data_found}
              </Text>
            ) : (
              <FlatList
                ref={(ref) => (this.flatListRef = ref)}
                data={this.state.BankAccountList}
                keyExtractor={(item, index) => index.toString()}
                contentContainerStyle={{ paddingBottom: 30 }}
                renderItem={({ item, index }) => this.RenderItem(item, index)}
                ListFooterComponent={
                  this.state.ScrollIndicatorVisible ? (
                    <ActivityIndicator size="small" color={colors.LimeGreen} />
                  ) : null
                }
                onEndReached={this.onLoadMoreItems}
                onEndThreshold={5}
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
            <AddNewItem
              Visible={this.state.AddItemVisible}
              onAddItem={() =>
                this.props.navigation.navigate("SaveBankAccount", { Action: 1 })
              }
            />
          </View>
          <ListItemMoreOptions
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
              this.setState({
                OpenOptionDialog: false,
                SelectedBankAccountObj: {},
              })
            }
            showDetailsOption={false}
            showPrimaryOption={
              this.state.SelectedBankAccountObj.isPrimary == "Y" ? false : true
            }
            onSetPrimary={() => {
              this.setState({ isSetPrimary: true, setPrimaryLoad: true });
              this.props.SetAsPrimaryAction({
                bankAccountId: this.state.SelectedBankAccountObj.bankAccountId,
              });
            }}
          />
          <DeleteConfirmationModel
            isVisible={this.state.DeleteConfirmationDialog}
            onDelete={() => this.onDelete()}
            onCancel={() => this.setState({ DeleteConfirmationDialog: false })}
          />
          <Loader visible={this.state.loading} />
        </SafeAreaView>
        {this.state.setPrimaryLoad ? (
          <ActivityIndicator
            size="large"
            color={colors.LimeGreen}
            style={{ position: "absolute", top: height / 2, left: width / 2 }}
          />
        ) : undefined}
      </>
    );
  }
}

const mapStateToProps = (state) => {
  return {
    BankAccountList: state.BankAccountList,
    DeleteBankAccount: state.DeleteBankAccount,
    SetAsPrimary: state.SetAsPrimary,
  };
};

export default connect(mapStateToProps, {
  GetBankAccountListAction,
  DeleteBankAccountAction,
  SetAsPrimaryAction,
})(BankAccountList);
