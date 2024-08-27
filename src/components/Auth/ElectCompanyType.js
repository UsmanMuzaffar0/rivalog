import React from "react";
import {
  View,
  SafeAreaView,
  Text,
  TouchableOpacity,
  Image,
  StatusBar,
} from "react-native";
import { Style } from "../../common/Style";
import StringsOfLanguages from "../../Localization/stringsoflanguages";
import * as colors from "../../common/colors";
import { RFPercentage, RFValue } from "react-native-responsive-fontsize";
import AsyncStorage from "@react-native-async-storage/async-storage";
import Header, { Header2 } from "../../common/Component/Header";
import Button from "../../common/Component/Button";

class ElectCompanyType extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      SelectedCompanyTypeID: 0,
      LangStr: StringsOfLanguages,
    };
  }

  render() {
    return (
      <SafeAreaView style={Style.mainView}>
        <StatusBar
          animated={false}
          backgroundColor={colors.WhiteSmoke}
          barStyle={"dark-content"}
        />

        <View style={[Style.componentContainerView]}>
          <Header2
            Title={StringsOfLanguages.SignUP}
            BackButton={true}
            BackAction={() => this.props.navigation.goBack()}
          />
          <View
            style={{
              height: RFPercentage(40),
              justifyContent: "flex-end",
            }}
          >
            <Image
              style={Style.CompanyTypeIllustratorImg}
              source={require("../../assets/images/Truck2.png")}
            />
          </View>
          <View style={{ flex: 1, flexDirection: "row", marginVertical: 10 }}>
            <TouchableOpacity
              activeOpacity={1}
              style={[
                Style.CompanyTypeSelectionView,
                {
                  borderWidth: 1,
                  borderColor:
                    this.state.SelectedCompanyTypeID == 1
                      ? colors.Green
                      : colors.White,

                  backgroundColor: colors.White,
                  marginHorizontal: RFValue(7),
                },
              ]}
              onPress={() => this.setState({ SelectedCompanyTypeID: 1 })}
            >
              <View style={[Style.HeaderImageView, { margin: 15 }]}>
                <View
                  style={{
                    backgroundColor: "#ebf7f0",
                    width: RFValue(64),
                    borderRadius: RFValue(32),
                    alignItems: "center",
                    height: RFValue(64),
                    justifyContent: "center",
                  }}
                >
                  <Image
                    style={Style.CompanyTypeImg}
                    source={require("../../assets/images/smallTruck.png")}
                  />
                </View>

                <Text style={Style.FontRegular_13}>
                  {this.state.LangStr.TruckOwner}
                </Text>
              </View>
            </TouchableOpacity>
            <TouchableOpacity
              activeOpacity={1}
              style={[
                Style.CompanyTypeSelectionView,
                {
                  borderWidth: 1,
                  borderColor:
                    this.state.SelectedCompanyTypeID == 2
                      ? colors.Green
                      : colors.White,
                  backgroundColor: colors.White,
                  marginHorizontal: RFValue(7),
                },
              ]}
              onPress={() => this.setState({ SelectedCompanyTypeID: 2 })}
            >
              <View style={[Style.HeaderImageView, { margin: 15 }]}>
                <View
                  style={{
                    backgroundColor: "#ebf7f0",
                    width: RFValue(64),
                    borderRadius: RFValue(32),
                    alignItems: "center",
                    height: RFValue(64),
                    justifyContent: "center",
                  }}
                >
                  <Image
                    style={Style.CompanyTypeImg}
                    source={require("../../assets/images/AirFreight.png")}
                  />
                </View>

                <Text style={Style.FontRegular_13}>
                  {this.state.LangStr.FreightOwner}
                </Text>
              </View>
            </TouchableOpacity>
          </View>
          <View>
            {/* <TouchableOpacity
              onPress={async () => {
                try {
                  await AsyncStorage.setItem(
                    "COMPANY_TYPE",
                    JSON.stringify(this.state.SelectedCompanyTypeID)
                  );
                } catch (e) {
                  console.log(e?.message);
                }

                this.props.navigation.navigate("Registration", {
                  CompanyTypeID: this.state.SelectedCompanyTypeID,
                });
              }}
              activeOpacity={1}
              disabled={this.state.SelectedCompanyTypeID == 0 ? true : false}
              style={[
                Style.signInBtn,
                {
                  backgroundColor:
                    this.state.SelectedCompanyTypeID > 0
                      ? colors.Blue
                      : colors.LightBlue,
                },
              ]}
            >
              <Text style={[Style.signinBtnTxt, { color: colors.White }]}>
                {this.state.LangStr.Next}
              </Text>
            </TouchableOpacity> */}

            <Button
              loader={false}
              onPress={async () => {
                try {
                  await AsyncStorage.setItem(
                    "COMPANY_TYPE",
                    JSON.stringify(this.state.SelectedCompanyTypeID)
                  );
                } catch (e) {
                  console.log(e?.message);
                }

                this.props.navigation.navigate("Registration", {
                  CompanyTypeID: this.state.SelectedCompanyTypeID,
                });
              }}
              activeOpacity={1}
              disabled={this.state.SelectedCompanyTypeID == 0 ? true : false}
              border={false}
              style={[
                {
                  backgroundColor:
                    this.state.SelectedCompanyTypeID > 0
                      ? "#34B267"
                      : colors.Grey,
                },
              ]}
              name={this.state.LangStr.Next}
            />
          </View>
        </View>
      </SafeAreaView>
    );
  }
}

export default ElectCompanyType;
