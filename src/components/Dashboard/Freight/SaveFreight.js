import React from "react";
import {
  View,
  SafeAreaView,
  Text,
  TouchableOpacity,
  StatusBar,
} from "react-native";
import * as colors from "../../../common/colors";
import NetChecker from "../../../common/Component/Network";
import StringsOfLanguages from "../../../Localization/stringsoflanguages";
import { Style, width } from "../../../common/Style";
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";
import { RFPercentage, RFValue } from "react-native-responsive-fontsize";
import Header from "../../../common/Component/Header";
import {
  TextField,
  TextFieldForDatePicker,
} from "../../../common/Component/TextField";
import DateTimePickerModal from "react-native-modal-datetime-picker";
import moment from "moment";
import AsyncStorage from "@react-native-async-storage/async-storage";
import DropDownField from "../../../common/Component/DropDownField";
import { ModalSelector } from "../../../common/Component/ModalSelection";
import Loader from "../../../common/Component/Loader";

class SaveTransport extends React.Component {
  constructor(props) {
    super(props);
    this.defaultState = {
      loading: false,
      LangStr: StringsOfLanguages,
      ModalVisible: false,
      ChecklistModalVisible: false,

      TransportNumber: "",
      DatePickerNumber: 0,
      PlannedDepartureDate: "",
      PlannedArrivalDate: "",

      CountryListAry: [],
      DropdownNumber: 0,
      DropdownModelData: [],
      DropdownModelTitleName: "",

      SelectedFromCountryCode: "",
      SelectedFromCountryName: "",
      SelectedFromCityCode: "",
      SelectedFromCityName: "",

      SelectedToCountryCode: "",
      SelectedToCountryName: "",
      SelectedToCityCode: "",
      SelectedToCityName: "",

      APIAction: 0,
      ShowDatePicker: false,

      // Update properties
      Action: 0,
      FreightObject: 0,
      IsFirstTimeLoad: false,
    };
    this.state = { ...this.defaultState };
  }

  async componentDidMount() {
    this._Reload = this.props.navigation.addListener("focus", async () => {
      this.setState({ ...this.defaultState });
      if (this.props.route.params) {
        this.setState({ Action: this.props.route.params.Action });
        if (this.props.route.params.Action == 2) {
          const objFreight = JSON.parse(this.props.route.params.FreightObject);
          this.setState({
            FreightObject: objFreight,
            ContainerID: objFreight.containerId,
            IsFirstTimeLoad: true,
          });
          this.setState({
            TransportNumber: "",
            PlannedDepartureDate: moment(
              objFreight.plannedDepartureDate
            ).format("DD/MM/YYYY"),
            PlannedArrivalDate: moment(objFreight.plannedArrivalDate).format(
              "DD/MM/YYYY"
            ),
            SelectedFromCountryName: objFreight.fromLocation.country.name,
            SelectedFromCountryCode: objFreight.fromLocation.country.code,
            SelectedFromCityName: objFreight.fromLocation.city.name,
            SelectedFromCityCode: objFreight.fromLocation.city.code,
            SelectedToCountryName: objFreight.toLocation.country.name,
            SelectedToCountryCode: objFreight.toLocation.country.code,
            SelectedToCityName: objFreight.toLocation.city.name,
            SelectedToCityCode: objFreight.toLocation.city.code,
          });
        }
      }
    });

    this.setState({
      CountryListAry: JSON.parse(await AsyncStorage.getItem("CountryList")),
    });
  }

  onSelectDate(date) {
    if (this.state.DatePickerNumber == 1)
      this.setState({
        PlannedDepartureDate: moment(date).format("DD/MM/YYYY"),
        ShowDatePicker: false,
      });
    else if (this.state.DatePickerNumber == 2)
      this.setState({
        PlannedArrivalDate: moment(date).format("DD/MM/YYYY"),
        ShowDatePicker: false,
      });
  }

  async AddNewTransport() {
    if (!this.state.TransportNumber) {
      alert(StringsOfLanguages.EmptyTransportNumberAlert);
      return;
    }

    if (!this.state.PlannedDepartureDate) {
      alert(StringsOfLanguages.SelectPlannedDepartureDateAlert);
      return;
    }

    var PlannedDepartureDate = moment(this.state.PlannedDepartureDate);
    if (!PlannedDepartureDate.isValid()) {
      alert(StringsOfLanguages.InvalidPlannedDepartureDateAlert);
      return;
    }

    if (!this.state.PlannedArrivalDate) {
      alert(StringsOfLanguages.SelectPlannedArrivalDateAlert);
      return;
    }

    var PlannedArrivalDate = moment(this.state.PlannedArrivalDate);
    if (!PlannedArrivalDate.isValid()) {
      alert(StringsOfLanguages.InvalidPlannedArrivalDateAlert);
      return;
    }

    if (!this.state.SelectedFromCountryCode) {
      alert(StringsOfLanguages.SelectedFromCountryCode);
      return;
    }

    if (!this.state.SelectedFromCityCode) {
      alert(StringsOfLanguages.SelectedFromCityCode);
      return;
    }

    if (!this.state.SelectedToCountryCode) {
      alert(StringsOfLanguages.SelectedFromCountryCode);
      return;
    }

    if (!this.state.SelectedToCityCode) {
      alert(StringsOfLanguages.SelectedFromCityCode);
      return;
    }

    const NetworkStatus = NetChecker();
    if ((await NetworkStatus) == false) {
      alert("network issue.");
      return;
    }
    return;
    if (this.state.Action == 2) {
      this.setState({ APIAction: 5, loading: true });
      this.props.EditDriverAction({
        userId: this.state.UserID,
        name: this.state.Name,
        surname: this.state.Surname,
        mobile: this.state.ContactNumber,
      });
    } else {
      this.setState({ APIAction: 1, loading: true });
      this.props.AddDriverAction({
        name: this.state.Name,
        surname: this.state.Surname,
        mobile: this.state.ContactNumber,
      });
    }
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
              ? this.state.LangStr.UpdateFreightTitle
              : this.state.LangStr.AddFreightTitle
          }
          BackAction={() => this.props.navigation.goBack()}
        />
        <View style={Style.componentContainerView}>
          <KeyboardAwareScrollView
            showsVerticalScrollIndicator={false}
            contentContainerStyle={{ flexGrow: 1 }}
          >
            <View style={{ flex: 1, paddingTop: RFValue(10) }}>
              <TextField
                name={StringsOfLanguages.TransportNumber}
                value={this.state.TransportNumber}
                placeholder={StringsOfLanguages.TransportNumberPlaceholder}
                onChange={(text) => this.setState({ TransportNumber: text })}
              />
              <TextFieldForDatePicker
                name={StringsOfLanguages.PlannedDepartureDate}
                value={this.state.PlannedDepartureDate}
                placeholder={this.state.LangStr.PlannedDepartureDatePlaceholder}
                onClick={() =>
                  this.setState({ ShowDatePicker: true, DatePickerNumber: 1 })
                }
              />
              <TextFieldForDatePicker
                name={StringsOfLanguages.PlannedArrivalDate}
                value={this.state.PlannedArrivalDate}
                placeholder={this.state.LangStr.PlannedArrivalDatePlaceholder}
                onClick={() =>
                  this.setState({ ShowDatePicker: true, DatePickerNumber: 2 })
                }
              />
              <DropDownField
                name={StringsOfLanguages.FromCountry}
                placeholder={StringsOfLanguages.FromCountryPlaceholder}
                value={this.state.SelectedFromCountryName}
                onPress={() =>
                  this.setState({
                    ModalVisible: true,
                    DropdownNumber: 1,
                    DropdownModelData: this.state.CountryListAry,
                    DropdownModelTitleName: this.state.LangStr.FromCountry,
                    IDPropertyName: "code",
                    ValuePropertyName: "name",
                  })
                }
              />
              {this.state.SelectedFromCountryCode != "" ? (
                <DropDownField
                  name={StringsOfLanguages.FromCity}
                  placeholder={StringsOfLanguages.FromCityPlaceholder}
                  value={this.state.SelectedFromCityName}
                  onPress={() =>
                    this.setState({
                      ModalVisible: true,
                      DropdownNumber: 2,
                      DropdownModelData: this.state.CountryListAry,
                      DropdownModelTitleName: this.state.LangStr.FromCountry,
                      IDPropertyName: "code",
                      ValuePropertyName: "name",
                    })
                  }
                />
              ) : null}

              <DropDownField
                name={StringsOfLanguages.ToCountry}
                placeholder={StringsOfLanguages.ToCountryPlaceholder}
                value={this.state.SelectedToCountryName}
                onPress={() =>
                  this.setState({
                    ModalVisible: true,
                    DropdownNumber: 3,
                    DropdownModelData: this.state.CountryListAry,
                    DropdownModelTitleName: this.state.LangStr.ToCountry,
                    IDPropertyName: "code",
                    ValuePropertyName: "name",
                  })
                }
              />
              {this.state.SelectedToCountryCode != "" ? (
                <DropDownField
                  name={StringsOfLanguages.ToCity}
                  placeholder={StringsOfLanguages.ToCityPlaceholder}
                  value={this.state.SelectedToCityName}
                  onPress={() =>
                    this.setState({
                      ModalVisible: true,
                      DropdownNumber: 4,
                      DropdownModelData: this.state.CountryListAry,
                      DropdownModelTitleName: this.state.LangStr.FromCountry,
                      IDPropertyName: "code",
                      ValuePropertyName: "name",
                    })
                  }
                />
              ) : null}
            </View>

            <View style={Style.SignInbtnView}>
              <TouchableOpacity
                onPress={() => {
                  this.AddNewTransport();
                }}
                activeOpacity={1}
                disabled={
                  this.state.TransportNumber != "" &&
                  this.state.PlannedDepartureDate != "" &&
                  this.state.PlannedArrivalDate != "" &&
                  this.state.SelectedFromCountryCode != "" &&
                  this.state.SelectedFromCityCode != "" &&
                  this.state.SelectedToCountryCode != "" &&
                  this.state.SelectedToCityCode != ""
                    ? false
                    : true
                }
                style={[
                  Style.signInBtn,
                  {
                    backgroundColor:
                      this.state.TransportNumber != "" &&
                      this.state.PlannedDepartureDate != "" &&
                      this.state.PlannedArrivalDate != "" &&
                      this.state.SelectedFromCountryCode != "" &&
                      this.state.SelectedFromCityCode != "" &&
                      this.state.SelectedToCountryCode != "" &&
                      this.state.SelectedToCityCode != ""
                        ? colors.Blue
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
            </View>
          </KeyboardAwareScrollView>
          <DateTimePickerModal
            isVisible={this.state.ShowDatePicker}
            mode="date"
            onConfirm={(date) => this.onSelectDate(date)}
            onCancel={() => this.setState({ ShowDatePicker: false })}
          />
          <ModalSelector
            visible={this.state.ModalVisible}
            title={this.state.DropdownModelTitleName}
            data={this.state.DropdownModelData}
            SearchOptionExist={false}
            IDPropertyName={this.state.IDPropertyName}
            ValuePropertyName={this.state.ValuePropertyName}
            onPress={(text, id) => {
              if (this.state.DropdownNumber == 1)
                this.setState({
                  SelectedFromCountryCode: id,
                  SelectedFromCountryName: text,
                });
              else if (this.state.DropdownNumber == 2)
                this.setState({
                  SelectedFromCityCode: id,
                  SelectedFromCityName: text,
                });
              else if (this.state.DropdownNumber == 3)
                this.setState({
                  SelectedToCountryCode: id,
                  SelectedToCountryName: text,
                });
              else if (this.state.DropdownNumber == 4)
                this.setState({
                  SelectedToCityCode: id,
                  SelectedToCityName: text,
                });

              this.setState({ ModalVisible: false });
            }}
            closeModal={() => this.setState({ ModalVisible: false })}
          />
        </View>
        <Loader visible={this.state.loading} />
      </SafeAreaView>
    );
  }
}

export default SaveTransport;
