import React from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { View, SafeAreaView, Text, StatusBar } from "react-native";
import { DetailsField } from "../../../common/Component/DetailsField";
import { Style, width } from "../../../common/Style";
import StringsOfLanguages from "../../../Localization/stringsoflanguages";
import * as colors from "../../../common/colors";
import Header from "../../../common/Component/Header";
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";
import { RFPercentage, RFValue } from "react-native-responsive-fontsize";

class FreightDetails extends React.Component {
  constructor(props) {
    super(props);
    this.defaultState = {
      loading: false,
      LangStr: StringsOfLanguages,
      lang: "en",
      APIAction: 0,
      FreightObject: [
        {
          containerId: 5,
          description: "first freight",
          plannedDepartureDate: null,
          plannedArrivalDate: null,
          issueStartDate: 1647818717000,
          createDate: 1647818717000,
          price: 10000.0,
          currency: {
            currencyId: 1,
            currencyCode: "TL",
            description: "Türk Lirası",
          },
          fromLocation: {
            locationId: 1,
            description: "falan adres",
            country: {
              code: "TR",
              name: "Türkiye",
            },
            city: {
              cityId: 21,
              name: "Istanbul",
              originalName: "Istanbul",
              country: {
                code: "TR",
                name: "Türkiye",
              },
            },
            district: "filanya",
            town: "kasaba",
            street: null,
            building: null,
            apartment: null,
            postCode: "posta kodu",
            addressText: "geri kalan text",
            latitude: null,
            longitude: null,
          },
          toLocation: {
            locationId: 2,
            description: "filani adres",
            locationType: null,
            country: {
              code: "TR",
              name: "Türkiye",
            },
            city: {
              cityId: 116,
              name: "Ankara",
              originalName: "Ankara",
              country: {
                code: "TR",
                name: "Türkiye",
              },
            },
            district: "ulan yaaa",
            town: "kasaba",
            street: null,
            building: null,
            apartment: null,
            postCode: "posta kodu",
            addressText: "ileri giden text",
            latitude: null,
            longitude: null,
          },
          containerType: {
            containerTypeId: 1,
            description: "dummy text",
          },
          trailerType: {
            trailerTypeId: 1,
            description: "dummy text",
          },
          floorType: {
            floorTypeId: 1,
            description: "dummy text",
          },
          specificationList: [
            {
              specificationId: 1,
              description: "dummy text",
            },
          ],
        },
      ],

      Price: 0,
      CurrencyCode: "",

      TransportNumber: "",
      PlannedDepartureDate: "",
      PlannedArrivalDate: "",

      FromCountryName: "",
      FromCityName: "",
      ToCountryName: "",
      ToCityName: "",

      TrailerType: "",
      FloorType: "",
      TrailerSpecificationList: "",
      ContainerName: "",
    };
    this.state = { ...this.defaultState };
  }

  async componentDidMount() {
    this._Reload = this.props.navigation.addListener("focus", async () => {
      this.setState({ ...this.defaultState });
      if (this.props.route.params) {
        let lang = await AsyncStorage.getItem("SelectedLanguage");

        const objFreight = JSON.parse(this.props.route.params.FreightObject);
        console.log(objFreight, "------objFreight------");
        this.setState({
          FreightObject: objFreight,
          Price: objFreight.price,
          CurrencyCode: objFreight.priceCurrency
            ? objFreight.priceCurrency.currencyCode
            : "",
          FromCountryName: objFreight.fromAddress.country.name,
          FromCityName: objFreight.fromAddress.city.name,
          ToCountryName: objFreight.toAddress.country.name,
          ToCityName: objFreight.toAddress.city.name,
          PlannedDepartureDate: objFreight.plannedDepartureDate,
          PlannedArrivalDate: objFreight.plannedArrivalDate,
          TrailerType: objFreight.trailerType?.description,
          FloorType: objFreight.floorType?.description,
          TrailerSpecificationList: objFreight.specificationList,
          // objFreight.trailerType?.specificationSelection,
          lang: lang,
        });
      }
    });
  }

  onUpdate() {
    var objSelectedFreight = this.state.FreightObject;
    this.props.navigation.navigate("SaveFreight", {
      Action: 2,
      FreightObject: JSON.stringify(objSelectedFreight),
    });
  }

  onDelete() {
    alert("comming soon.");
    return;
    // return Alert.alert(
    //     StringsOfLanguages.DeleteAlertTitle,
    //     StringsOfLanguages.DeleteAlertMessage,
    //   [
    //     // The "Yes" button
    //     {
    //       text: "Yes",
    //       onPress: () => {
    //         this.setState({APIAction: 2, loading: true})
    //         var intSelectedDriverID = this.state.DriverObject.userId;
    //         this.props.DeleteDriverAction(intSelectedDriverID)
    //       },
    //     },
    //     // The "No" button
    //     // Does nothing but dismiss the dialog when tapped
    //     {
    //       text: "No",
    //     },
    //   ]
    // );
  }

  render() {
    console.log(">>>>>>>>>>>>>>", this.props.route.params.proposalData);
    return (
      <SafeAreaView style={Style.mainView}>
        <StatusBar
          animated={false}
          backgroundColor={colors.WhiteSmoke}
          barStyle={"dark-content"}
        />
        <Header
          Title={StringsOfLanguages.Details}
          BackAction={() => this.props.navigation.goBack()}
        />
        <View style={Style.componentContainerView}>
          <KeyboardAwareScrollView
            showsVerticalScrollIndicator={false}
            contentContainerStyle={{ flexGrow: 1 }}
          >
            <View style={{ flex: 1 }}>
              {this.props.route.params.proposal == "view" ? (
                <View style={{ marginTop: RFValue(10) }}>
                  <DetailsField
                    name={StringsOfLanguages.Price}
                    value={this.props.route.params.proposalData[0]?.price}
                  />
                  <DetailsField
                    name={StringsOfLanguages.Currency}
                    value={
                      this.props.route.params.proposalData[0]?.currency
                        ?.description
                    }
                  />
                  <DetailsField
                    name={StringsOfLanguages.ProposalScope}
                    value={
                      this.props.route.params.proposalData[0]?.proposalScope
                        ?.description
                    }
                  />
                </View>
              ) : (
                <View style={{ marginTop: RFValue(10) }}>
                  <DetailsField
                    name={StringsOfLanguages.Price}
                    // value={this.state.Price.toFixed(2)}
                    icon={require("../../../assets/images/Price.png")}
                    value={`${new Intl.NumberFormat(
                      this.state.lang + "-IN"
                    ).format(this.state.Price.toFixed(2))} ${
                      this.state.CurrencyCode
                    }`}
                  />
                  {/* <DetailsField
                  name={StringsOfLanguages.Currency}
                  value={this.state.CurrencyCode}
                /> */}

                  <DetailsField
                    name={StringsOfLanguages.FromCountry}
                    value={`${this.state.FromCityName}, ${this.state.FromCountryName}`}
                    icon={require("../../../assets/images/country.png")}
                  />
                  {/* <DetailsField
                  name={StringsOfLanguages.FromCity}
                  value={this.state.FromCityName}
                  icon={require("../../../assets/images/details_city.png")}
                /> */}
                  <DetailsField
                    name={StringsOfLanguages.ToCountry}
                    value={`${this.state.ToCityName}, ${this.state.ToCountryName}`}
                    icon={require("../../../assets/images/country.png")}
                  />
                  {/* <DetailsField
                  name={StringsOfLanguages.ToCity}
                  value={this.state.ToCityName}
                  icon={require("../../../assets/images/details_city.png")}
                /> */}

                  <DetailsField
                    name={StringsOfLanguages.PlannedDepartureDate}
                    value={
                      this.state.PlannedDepartureDate == null
                        ? "-"
                        : new Date(this.state.PlannedDepartureDate)
                            .toLocaleString(this.state.lang + "-IN")
                            .split(" ")[0]
                            .split(",")[0]
                    }
                    icon={require("../../../assets/images/Direction.png")}
                  />

                  <DetailsField
                    name={StringsOfLanguages.PlannedArrivalDate}
                    value={
                      this.state.PlannedArrivalDate == null
                        ? "-"
                        : new Date(this.state.PlannedArrivalDate)
                            .toLocaleString(this.state.lang + "-IN")
                            .split(" ")[0]
                            .split(",")[0]
                    }
                    icon={require("../../../assets/images/Direction.png")}
                  />

                  <DetailsField
                    name={StringsOfLanguages.TrailerType}
                    value={this.state.TrailerType}
                    icon={require("../../../assets/images/DashboardCarrier/icn_trailer.png")}
                  />

                  <View style={Style.TextfieldMainView}>
                    <View style={Style.TextfieldTitleView}>
                      <Text style={Style.TextfieldTitle}>
                        {StringsOfLanguages.TrailerSpecifications}
                      </Text>
                    </View>
                    <View
                      style={[
                        Style.InputTextFieldView,
                        { paddingTop: RFValue(8), paddingBottom: 0 },
                      ]}
                    >
                      {this.state.TrailerSpecificationList ? (
                        <View
                          style={{ flexDirection: "row", flexWrap: "wrap" }}
                        >
                          {this.state.TrailerSpecificationList.map(
                            (specificationData, index) => (
                              <View
                                style={[
                                  Style.TrailerSpecificationItemContainer,
                                  { marginBottom: RFValue(8) },
                                ]}
                              >
                                <Text style={Style.EmailTxt}>
                                  {specificationData.description}
                                </Text>
                              </View>
                            )
                          )}
                        </View>
                      ) : null}
                    </View>
                  </View>

                  <DetailsField
                    name={StringsOfLanguages.FloorType}
                    value={this.state.FloorType}
                    icon={require("../../../assets/images/details_floortype.png")}
                  />
                </View>
              )}
            </View>
          </KeyboardAwareScrollView>
        </View>
      </SafeAreaView>
    );
  }
}

export default FreightDetails;
