import React from "react";
import {
  View,
  SafeAreaView,
  Text,
  TouchableOpacity,
  StatusBar,
} from "react-native";
import { AuthContext } from "../../../navigation/AuthContext";
import * as colors from "../../../common/colors";
import StringsOfLanguages from "../../../Localization/stringsoflanguages";
import { Style, width } from "../../../common/Style";
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";
import { RFPercentage, RFValue } from "react-native-responsive-fontsize";

import DropDownField from "../../../common/Component/DropDownField";
import { ModalSelector } from "../../../common/Component/ModalSelection";
import Loader from "../../../common/Component/Loader";
import { Header } from "../../../common/Component/Header";
import Button from "../../../common/Component/Button";
import { connect } from "react-redux";
import {
  GetCountryAction,
  GetCityAction,
  AddPrefferedRouteAction,
  UpdatePrefferedRouteAction,
} from "../../../Redux/actions";

class SavePreferredRoute extends React.Component {
  static contextType = AuthContext;
  DateFormat = "DD/MM/YYYY";
  constructor(props) {
    super(props);
    this.defaultState = {
      loading: false,
      LangStr: StringsOfLanguages,
      ModalVisible: false,
      Name: "",
      Surname: "",

      ContactNumber: "",

      SelectedDriverLicenceFileName: "",
      SelectedDriverLicenceFileURI: "",
      SelectedDriverLicenceFileType: "",

      SelectedSRCLicenceFileName: "",
      SelectedSRCLicenceFileURI: "",
      SelectedSRCLicenceFileType: "",

      ViewerFileName: "",
      ViewerFileURI: "",

      FileViewerFlag: false,

      DriverObject: 0,
      IsFirstTimeLoad: false,
      IsFileChange: false,
      UserID: 0,
      CountryCode: 0,
      Cmodal: false,
      ModalVisible: false,
      CountryAry: [],
      CityAry: [],
      FromCountryId: "",
      FromCountry: "",
      ToCountryId: "",
      ToCountry: "",
      ToCity: "",
      ToCityId: "",
      FromCityId: "",
      FromCity: "",
      DropDownType: 0,
      forCountry: true,
      ForCity: false,
      loadingForFromDropDown: false,
      loadingForToDropDown: false,
      ForAdd: false,
      ForUpdate: false,
      preferredRouteId: 0,
    };
    this.state = { ...this.defaultState };
  }

  async componentDidMount() {
    if (this.props.route.params) {
      // alert(this.props.route.params.Action)
      this.setState({ Action: this.props.route.params.Action });
      if (this.props.route.params.Action == 2) {
        var PrefferedRouteObject = JSON.parse(
          this.props.route.params.PrefferedRouteObject
        );
        console.log("===---", PrefferedRouteObject);
        this.setState({
          FromCountryId: PrefferedRouteObject?.fromCountry?.code,
          FromCountry: PrefferedRouteObject?.fromCountry?.name,
          ToCountryId: PrefferedRouteObject?.toCountry?.code,
          ToCountry: PrefferedRouteObject?.toCountry?.name,
          ToCity: PrefferedRouteObject?.toCity?.name,
          ToCityId: PrefferedRouteObject?.toCity?.cityId,
          FromCityId: PrefferedRouteObject?.fromCity?.cityId,
          FromCity: PrefferedRouteObject?.fromCity?.name,
          preferredRouteId: PrefferedRouteObject?.preferredRouteId,
        });
      }
    }
    this.props.GetCountryAction();
  }

  async UNSAFE_componentWillReceiveProps(nextProps) {
    if (this.state.forCountry) {
      if (nextProps.CountryData.GetCountrySuccess) {
        if (nextProps.CountryData.data[1] == 200) {
          this.setState({
            CountryAry: await nextProps.CountryData.data[0],
            forCountry: false,
          });
        } else if (nextProps.CountryData.data[1] == 401) {
          const SignOutContext = this.context;
          SignOutContext.signOut();
        } else {
          console.log("nextProps.CountryData");
        }
      }
    }

    if (this.state.ForCity) {
      if (nextProps.CityData.GetCitySuccess) {
        if (nextProps.CityData.data[1] == 200) {
          this.setState({
            CityAry: await nextProps.CityData.data[0],
            ForCity: false,
            ModalVisible: true,
            loadingForFromDropDown: false,
            loadingForToDropDown: false,
          });
        }
        // else if (nextProps.CityData.data[1] == 401) {
        //   const SignOutContext = this.context;
        //   SignOutContext.signOut();
        // }
        else {
          this.setState({
            loadingForFromDropDown: false,
            ForCity: false,
            loadingForToDropDown: false,
          });
          console.log("nextProps.CountryData", nextProps.CityData);
        }
      }
    }

    if (this.state.ForAdd) {
      if (nextProps.AddPrefferedRouteData.AddPreferredRouteSuccess) {
        // console.log(
        //   "nextProps.AddPrefferedRouteData.data==>",
        //   nextProps.AddPrefferedRouteData.data
        // );
        if (nextProps.AddPrefferedRouteData.data[1] == 200) {
          this.setState({ loading: false, ForAdd: false });
          this.props.navigation.navigate("PreferredRouteList");
        } else if (nextProps.AddPrefferedRouteData.data[1] == 401) {
          const SignOutContext = this.context;
          SignOutContext.signOut();
        } else {
          this.setState({ loading: false, ForAdd: false });
          // console.log(nextProps.AddPrefferedRouteData.data[0].message)
          alert(nextProps.AddPrefferedRouteData.data[0].message);
          // alert
        }
      }
    }

    if (this.state.ForUpdate) {
      if (nextProps.UpdatePrefferedRouteData.UpdatePreferredRouteSuccess) {
        if (nextProps.UpdatePrefferedRouteData.data[1] == 200) {
          this.setState({ loading: false, ForUpdate: false });
          this.props.navigation.navigate("PreferredRouteList");
        } else if (nextProps.UpdatePrefferedRouteData.data[1] == 401) {
          const SignOutContext = this.context;
          SignOutContext.signOut();
        } else {
          this.setState({ loading: false, ForAdd: false });
          // console.log(nextProps.AddPrefferedRouteData.data[0].message)
          alert(nextProps.UpdatePrefferedRouteData.data[0].message);
          // alert
        }
      }
    }
  }

  GetCityList(country, countryCode) {
    this.setState({ ForCity: true });
    this.props.GetCityAction({
      searchTxt: "",
      countryCode: countryCode,
      pageIndex: 0,
      pageCount: 1000,
    });
  }

  AddUpdatePrefferedRouteFunc() {
    var data = {
      fromCountry: {
        code: this.state.FromCountryId,
      },
      fromCity: {
        cityId: this.state.FromCityId,
      },
      toCountry: {
        code: this.state.ToCountryId,
      },
      toCity: {
        cityId: this.state.ToCityId,
      },
    };

    var UpdateData = {
      preferredRouteId: this.state.preferredRouteId,
      fromCountry: {
        code: this.state.FromCountryId,
      },
      fromCity: {
        cityId: this.state.FromCityId,
      },
      toCountry: {
        code: this.state.ToCountryId,
      },
      toCity: {
        cityId: this.state.ToCityId,
      },
    };

    this.state.Action == 2
      ? this.props.UpdatePrefferedRouteAction({
          data: UpdateData,
        })
      : this.props.AddPrefferedRouteAction({
          data: data,
        });
  }

  render() {
    return (
      <SafeAreaView style={Style.mainView}>
        <StatusBar
          animated={false}
          backgroundColor={colors.WhiteSmoke}
          barStyle={"dark-content"}
        />
        <Header
          Title={
            this.state.Action == 2
              ? this.state.LangStr.UpdatePrefferedRouteTitle
              : this.state.LangStr.NewPrefferedRouteTitle
          }
          BackAction={() => this.props.navigation.goBack()}
        />
        <View style={Style.componentContainerView}>
          <KeyboardAwareScrollView
            showsVerticalScrollIndicator={false}
            contentContainerStyle={{ flexGrow: 1 }}
          >
            <View style={{ flex: 1, paddingTop: RFValue(10) }}>
              <DropDownField
                name={StringsOfLanguages.FromCountry}
                placeholder={StringsOfLanguages.SelectCountry}
                value={this.state.FromCountry}
                onPress={() =>
                  this.setState({ ModalVisible: true, DropDownType: 1 })
                }
              />
              <DropDownField
                name={StringsOfLanguages.FromCity}
                placeholder={StringsOfLanguages.SelectCity}
                load={this.state.loadingForFromDropDown}
                value={this.state.FromCity}
                onPress={() => {
                  if (this.state.FromCountry != "") {
                    this.GetCityList(
                      this.state.FromCountry,
                      this.state.FromCountryId
                    );
                    this.setState({
                      DropDownType: 2,
                      loadingForFromDropDown: true,
                    });
                  } else {
                    alert("Please select country.");
                  }
                }}
              />
              <DropDownField
                name={StringsOfLanguages.ToCountry}
                placeholder={StringsOfLanguages.SelectCountry}
                value={this.state.ToCountry}
                onPress={() =>
                  this.setState({ ModalVisible: true, DropDownType: 3 })
                }
              />
              <DropDownField
                name={StringsOfLanguages.ToCity}
                placeholder={StringsOfLanguages.SelectCity}
                value={this.state.ToCity}
                load={this.state.loadingForToDropDown}
                onPress={() => {
                  if (this.state.ToCountry != "") {
                    this.GetCityList(
                      this.state.ToCountry,
                      this.state.ToCountryId
                    );
                    this.setState({
                      DropDownType: 4,
                      loadingForToDropDown: true,
                    });
                  } else {
                    alert("Please select country.");
                  }
                }}
              />
            </View>
            {/* <View style={Style.SignInbtnView}>
              <TouchableOpacity
                onPress={() => {
                  this.state.Action == 2
                    ? this.setState({ ForUpdate: true })
                    : this.setState({ ForAdd: true });
                  this.setState({ loading: true });
                  this.AddUpdatePrefferedRouteFunc();
                }}
                activeOpacity={1}
                disabled={
                  this.state.FromCountry != "" && this.state.ToCountry != ""
                    ? // &&
                      // this.state.FromCity != "" &&
                      // this.state.ToCity != ""
                      false
                    : true
                }
                style={[
                  Style.signInBtn,
                  {
                    backgroundColor:
                      this.state.FromCountry != "" && this.state.ToCountry != ""
                        ? // &&
                          // this.state.FromCity != "" &&
                          // this.state.ToCity != ""
                          colors.Blue
                        : colors.LightBlue,
                  },
                ]}
              >
                <Text style={[Style.signinBtnTxt, { color: colors.White }]}>
                  {this.state.Action == 2
                    ? this.state.LangStr.Update
                    : this.state.LangStr.Add}
                </Text>
              </TouchableOpacity>
            </View> */}

            <Button
              loader={false}
              onPress={() => {
                this.state.Action == 2
                  ? this.setState({ ForUpdate: true })
                  : this.setState({ ForAdd: true });
                this.setState({ loading: true });
                this.AddUpdatePrefferedRouteFunc();
              }}
              disabled={
                this.state.FromCountry != "" && this.state.ToCountry != ""
                  ? // &&
                    // this.state.FromCity != "" &&
                    // this.state.ToCity != ""
                    false
                  : true
              }
              border={false}
              style={{
                backgroundColor:
                  this.state.FromCountry != "" && this.state.ToCountry != ""
                    ? // &&
                      // this.state.FromCity != "" &&
                      // this.state.ToCity != ""
                      "#34B267"
                    : "#BCBCBC",
              }}
              name={
                this.state.Action == 2
                  ? this.state.LangStr.Update
                  : this.state.LangStr.Save
              }
            />
          </KeyboardAwareScrollView>
        </View>
        <ModalSelector
          visible={this.state.ModalVisible}
          title={
            this.state.DropDownType == 1 || this.state.DropDownType == 3
              ? StringsOfLanguages.Country
              : StringsOfLanguages.City
          }
          data={
            this.state.DropDownType == 1 || this.state.DropDownType == 3
              ? this.state.CountryAry
              : this.state.CityAry
          }
          SearchOptionExist={true}
          IDPropertyName={
            this.state.DropDownType == 1 || this.state.DropDownType == 3
              ? "code"
              : "cityId"
          }
          ValuePropertyName={"name"}
          onPress={(text, id) => {
            console.log("?OKOKOOKO ", text, id);
            this.state.DropDownType == 1
              ? this.setState({
                  FromCountry: text,
                  FromCountryId: id,
                  ModalVisible: false,
                  FromCity: "",
                  FromCityId: "",
                })
              : this.state.DropDownType == 3
              ? this.setState({
                  ToCountry: text,
                  ToCountryId: id,
                  ModalVisible: false,
                  ToCity: "",
                  ToCityId: "",
                })
              : this.state.DropDownType == 2
              ? this.setState({
                  FromCity: text,
                  FromCityId: id,
                  ModalVisible: false,
                })
              : this.state.DropDownType == 4
              ? this.setState({
                  ToCity: text,
                  ToCityId: id,
                  ModalVisible: false,
                })
              : "";
          }}
          closeModal={() => this.setState({ ModalVisible: false })}
        />
        <Loader visible={this.state.loading} />
      </SafeAreaView>
    );
  }
}

const mapStateToProps = (state) => {
  return {
    CountryData: state.CountryData,
    CityData: state.CityData,
    AddPrefferedRouteData: state.AddPrefferedRouteData,
    UpdatePrefferedRouteData: state.UpdatePrefferedRouteData,
  };
};
export default connect(mapStateToProps, {
  GetCountryAction,
  GetCityAction,
  AddPrefferedRouteAction,
  UpdatePrefferedRouteAction,
})(SavePreferredRoute);
