import React from "react";
import {
  View,
  SafeAreaView,
  Text,
  TouchableOpacity,
  StatusBar,
  Modal,
  Image,
  ActivityIndicator,
} from "react-native";

import StringsOfLanguages from "../../Localization/stringsoflanguages";
import * as Fonts from "../../common/fonts";
import * as colors from "../../common/colors";
import { Style } from "../../common/Style";
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";
import { RFPercentage, RFValue } from "react-native-responsive-fontsize";
import {
  TextField,
  TextFieldWithCountryCode,
  TextFieldWithCountryCode2,
} from "../../common/Component/TextField";
import { url } from "../../common/Api";
import Button from "../../common/Component/Button";
import Header, { Header2 } from "../../common/Component/Header";

class ForgotPassword extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      loading: false,
      Mobile: "",
      LangStr: StringsOfLanguages,
      CountryCode: "91",
      Cmodal: false,
      SentSuccessfully: false,
      isLoading: false,
    };
  }

  async onClickForgotPassword() {
    this.setState({ isLoading: true });
    var raw = JSON.stringify({
      countryCode: "+" + this.state.CountryCode,
      mobile: this.state.Mobile,
    });
    console.log(
      { countryCode: "+" + this.state.CountryCode, mobile: this.state.Mobile },
      url
    );
    // return fetch(`${url}user-management/users/password/link/bymobile`, {
    return fetch(`${url}user-management/users/password/link/bymobile`, {
      method: "POST",
      headers: {
        // Accept: "*/*",
        "Content-Type": "application/json",
        // Authorization: token,
      },
      body: raw,
    }).then(async (response) => {
      const res = await response.json();
      console.log([res, response.status]);
      if (response.status == 200) {
        this.setState({ SentSuccessfully: true, isLoading: false });
        setTimeout(() => {
          this.setState({ SentSuccessfully: false });
          this.props.navigation.reset({
            index: 0,
            routes: [{ name: "Login" }],
          });
        }, 2000);
      } else {
        this.setState({ isLoading: false });
        const e = res;
        console.log(e);
        alert(e.message);
      }
      // return [await response.json(), response.status];
    });

    // setTimeout(() => {
    //   this.setState({ SentSuccessfully: false })
    //   this.props.navigation.reset({
    //     index: 0,
    //     routes: [{ name: 'Login' }],
    //   });
    // }, 2000);
    // this.props.navigation.navigate("ResetPassword");
  }

  render() {
    return (
      <SafeAreaView style={Style.mainView}>
        <View style={Style.componentContainerView}>
          <StatusBar
            animated={false}
            backgroundColor={colors.WhiteSmoke}
            barStyle={"dark-content"}
          />

          <KeyboardAwareScrollView showsVerticalScrollIndicator={false}>
            <Header2
              Title={StringsOfLanguages.ForgotPasswordHeader}
              BackButton={true}
              BackAction={() => this.props.navigation.goBack()}
            />

            <View style={{ paddingTop: RFValue(30) }}>
              <TextFieldWithCountryCode2
                name={this.state.LangStr.MobileNo}
                countryCodeValue={this.state.CountryCode}
                value={this.state.Mobile}
                placeholder={this.state.LangStr.EnterMobileNo}
                onChange={(text) => this.setState({ Mobile: text })}
                keyboardType="phone-pad"
                codelcik={(item) =>
                  this.setState({
                    CountryCode: item.callingCode,
                    Cmodal: false,
                  })
                }
                Cmodal={this.state.Cmodal}
                onClose={() => this.setState({ Cmodal: false })}
                onOpen={() => this.setState({ Cmodal: true })}
              />
            </View>
            <Button
              loader={false}
              onPress={() => {
                this.onClickForgotPassword();
              }}
              border={false}
              style={{
                backgroundColor: "#34B267",
                marginTop: RFValue(40),
              }}
              name={this.state.LangStr.Send}
            />
          </KeyboardAwareScrollView>
          <Modal
            animationType={"fade"}
            transparent={true}
            visible={this.state.SentSuccessfully}
            // visible={true}
          >
            <View style={Style.Modal}>
              <View
                style={[Style.ModelViewContainer, { alignContent: "center" }]}
              >
                <View style={Style.ImageView}>
                  <Image
                    style={Style.Image}
                    source={require("../../assets/images/icn_select_check.png")}
                  />
                </View>
                <View style={{ marginTop: RFValue(16), alignItems: "center" }}>
                  <Text style={Style.FontMedium_18}>
                    {this.state.LangStr.SMSSentTitle}
                  </Text>
                  <Text style={[Style.FontMedium_14, { marginVertical: 15 }]}>
                    {this.state.LangStr.SMSSentMsg}
                  </Text>
                  {/* <TouchableOpacity
                  onPress={() => {
                    this.setState({ ResetSuccessfully: false });
                    SignOutContext.signOut();
                  }}
                  activeOpacity={1}
                  style={[Style.signInBtn, { paddingHorizontal: 15 }]}
                >
                  <Text style={[Style.signinBtnTxt, { color: colors.White }]}>
                    {this.state.LangStr.BackToSignIn}
                  </Text>
                </TouchableOpacity> */}
                </View>
              </View>
            </View>
          </Modal>
        </View>
        {this.state.isLoading && (
          <View style={{ flex: 1 }}>
            <ActivityIndicator size={35} color={colors.LimeGreen} />
          </View>
        )}
      </SafeAreaView>
    );
  }
}

export default ForgotPassword;
