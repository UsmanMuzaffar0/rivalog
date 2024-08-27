import React, { useState, useRef } from "react";
import {
  View,
  SafeAreaView,
  Text,
  TouchableOpacity,
  StatusBar,
  StyleSheet,
} from "react-native";
import { AuthContext } from "../../../navigation/AuthContext";
import * as colors from "../../../common/colors";
import StringsOfLanguages from "../../../Localization/stringsoflanguages";
import { Style, width } from "../../../common/Style";
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";
import { RFPercentage, RFValue } from "react-native-responsive-fontsize";
import Button from "../../../common/Component/Button";
import DropDownField from "../../../common/Component/DropDownField";
import {
  DetailsFieldWithIcon,
  DetailsField,
} from "../../../common/Component/DetailsField";
import {
  ModalSelector,
  ModalSelectorWithCheckbox,
} from "../../../common/Component/ModalSelection";
import Loader from "../../../common/Component/Loader";
import { Header } from "../../../common/Component/Header";
import { connect } from "react-redux";
import {
  GetCountryAction,
  GetCityAction,
  AddPrefferedRouteAction,
  UpdatePrefferedRouteAction,
  DeletePrefferedRouteAction,
} from "../../../Redux/actions";
import DeleteConfirmationModel from "../../../common/Component/DeleteConfirmationModel";

class PreferredRouteDetails extends React.Component {
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

      PreferredRouteObj: 0,
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
      DeleteConfirmationDialog: false,
      ForDelete: false,
    };
    this.state = { ...this.defaultState };
  }

  async componentDidMount() {
    var PrefferedRouteObject = JSON.parse(
      this.props.route.params.PrefferedRouteObject
    );
    this.setState({
      PreferredRouteObj: PrefferedRouteObject,
      FromCountryId: PrefferedRouteObject.fromCountry.code,
      FromCountry: PrefferedRouteObject.fromCountry.name,
      ToCountryId: PrefferedRouteObject.toCountry.code,
      ToCountry: PrefferedRouteObject.toCountry.name,
      ToCity: PrefferedRouteObject.toCity.name,
      ToCityId: PrefferedRouteObject.toCity.cityId,
      FromCityId: PrefferedRouteObject.fromCity.cityId,
      FromCity: PrefferedRouteObject.fromCity.name,
      preferredRouteId: PrefferedRouteObject.preferredRouteId,
    });
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
        } else if (nextProps.CityData.data[1] == 401) {
          const SignOutContext = this.context;
          SignOutContext.signOut();
        } else {
          this.setState({
            loadingForFromDropDown: false,
            ForCity: false,
            loadingForToDropDown: false,
          });
          console.log("nextProps.CountryData");
        }
      }
    }

    if (this.state.ForAdd) {
      if (nextProps.AddPrefferedRouteData.AddPreferredRouteSuccess) {
        if (nextProps.AddPrefferedRouteData.data[1] == 200) {
          this.setState({ loading: false, ForAdd: false });
          this.props.navigation.navigate("PreferredRouteList");
        } else if (nextProps.AddPrefferedRouteData.data[1] == 401) {
          const SignOutContext = this.context;
          SignOutContext.signOut();
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
        }
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
          this.props.navigation.navigate("PreferredRouteList");
        } else if (nextProps.DeletePrefferedRouteData.data[1] == 401) {
          const SignOutContext = this.context;
          SignOutContext.signOut();
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

  onUpdate() {
    var PrefferedRouteObject = this.state.PreferredRouteObj;
    this.props.navigation.navigate("SavePreferredRoute", {
      Action: 2,
      PrefferedRouteObject: JSON.stringify(PrefferedRouteObject),
    });
  }

  onDelete() {
    this.setState({ DeleteConfirmationDialog: true });
  }

  funcDelete() {
    var intSelectedPrefferedRouteID =
      this.state.PreferredRouteObj.preferredRouteId;
    this.setState({
      DeleteConfirmationDialog: false,
      loading: true,
      ForDelete: true,
    });
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
            <View
              style={{
                flex: 1,
                paddingTop: RFValue(10),
              }}
            >
              <DetailsField
                name={StringsOfLanguages.FromCountry}
                value={this.state.FromCountry}
                imageFlag={3}
                onClickIcon={() => console.log()}
                icon={require("../../../assets/images/country.png")}
              />

              <DetailsField
                name={StringsOfLanguages.FromCity}
                value={this.state.FromCity}
                imageFlag={3}
                onClickIcon={() => console.log()}
                icon={require("../../../assets/images/city.png")}
              />
              <DetailsField
                name={StringsOfLanguages.ToCountry}
                value={this.state.ToCountry}
                imageFlag={3}
                onClickIcon={() => console.log()}
                icon={require("../../../assets/images/country.png")}
              />
              <DetailsField
                name={StringsOfLanguages.ToCity}
                value={this.state.ToCity}
                imageFlag={3}
                onClickIcon={() => console.log()}
                icon={require("../../../assets/images/city.png")}
              />
            </View>
            {/* <View>
              <View
                style={[
                  Style.SignInbtnView,
                  { flex: 1, paddingHorizontal: RFValue(10) },
                ]}
              >
                <TouchableOpacity
                  onPress={() => {
                    this.onUpdate();
                  }}
                  activeOpacity={1}
                  style={Style.signInBtn}
                >
                  <Text style={[Style.signinBtnTxt, { color: colors.White }]}>
                    {this.state.LangStr.Update}
                  </Text>
                </TouchableOpacity>
              </View>
              <View
                style={[
                  Style.SignInbtnView,
                  { flex: 1, paddingHorizontal: RFValue(10) },
                ]}
              >
                <TouchableOpacity
                  onPress={() => {
                    this.onDelete();
                  }}
                  activeOpacity={1}
                  style={[
                    Style.signInBtn,
                    {
                      backgroundColor: colors.White,
                      borderWidth: StyleSheet.hairlineWidth,
                    },
                  ]}
                >
                  <Text style={[Style.signinBtnTxt, { color: colors.Grey }]}>
                    {this.state.LangStr.Delete}
                  </Text>
                </TouchableOpacity>
              </View>
            </View> */}
            <View>
              <View style={[{ flex: 1, paddingHorizontal: RFValue(10) }]}>
                <Button
                  loader={false}
                  onPress={() => {
                    this.onUpdate();
                  }}
                  border={false}
                  name={this.state.LangStr.Update}
                />
              </View>
              <View style={[{ flex: 1, paddingHorizontal: RFValue(10) }]}>
                <Button
                  loader={false}
                  onPress={() => {
                    this.props.navigation.goBack();
                  }}
                  border={true}
                  name={this.state.LangStr.Cancel}
                />
              </View>
            </View>
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
        <DeleteConfirmationModel
          isVisible={this.state.DeleteConfirmationDialog}
          onDelete={() => this.funcDelete()}
          onCancel={() => this.setState({ DeleteConfirmationDialog: false })}
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
    DeletePrefferedRouteData: state.DeletePrefferedRouteData,
  };
};
export default connect(mapStateToProps, {
  GetCountryAction,
  GetCityAction,
  AddPrefferedRouteAction,
  UpdatePrefferedRouteAction,
  DeletePrefferedRouteAction,
})(PreferredRouteDetails);
