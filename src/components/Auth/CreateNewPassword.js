import React from "react";
import {
  View,
  SafeAreaView,
  Text,
  TouchableOpacity,
  Image,
  StatusBar,
  Dimensions,
  Modal,
  ActivityIndicator,
} from "react-native";
import StringsOfLanguages from "../../Localization/stringsoflanguages";
import * as colors from "../../common/colors";
import { Style } from "../../common/Style";
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";
import { RFValue } from "react-native-responsive-fontsize";
import { TextField, TextFieldWithIcon } from "../../common/Component/TextField";
import Header from "../../common/Component/Header";
import { AuthContext } from "../../navigation/AuthContext";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { url } from "../../common/Api";

export const { width, height } = Dimensions.get("window");

class CreateNewPassword extends React.Component {
  static contextType = AuthContext;

  constructor(props) {
    super(props);
    this.state = {
      loading: false,
      Password: "",
      Password: "",
      ConfirmPassword: "",
      // ConfirmPassword: this.props.route?.params?.secretKey,
      LangStr: StringsOfLanguages,
      ResetSuccessfully: false,
      PasswordShowFlag: false,
      NewPasswordShowFlag: false,
      ConfirmPasswordShowFlag: false,
      isLoading: false,
    };
  }

  onClickResetPassword() {
    if (this.state.Password != this.state.ConfirmPassword) {
      alert(this.state.LangStr.UnmatchPasswordAlert);
      return;
    } else {
      this.setState({ isLoading: true });
      const secretKey = this.props.route?.params?.secretKey;
      console.log("secretKey==>>", secretKey);
      var raw = JSON.stringify({
        secretKey: secretKey,
        password: this.state.Password,
      });
      this.Verification(raw);
    }
  }

  async Verification(params) {
    console.log(params, "update password");

    return fetch(`${url}user-management/users/password`, {
      method: "PATCH",
      headers: {
        Accept: "*/*",
        "Content-Type": "application/json",
      },
      body: params,
    }).then(async (response) => {
      const res = await response.json();
      console.log([res, response.status]);
      if (response.status == 200) {
        this.setState({ ResetSuccessfully: true, isLoading: false });
        setTimeout(() => {
          this.setState({ ResetSuccessfully: false });
          this.props.navigation.reset({
            index: 0,
            routes: [{ name: "Login" }],
          });
        }, 2000);
      } else {
        this.setState({ isLoading: false });
        var key = Object.keys(res);
        // console.log("res=>",Object.keys(res))
        alert(res[key[0]]);
        // alert(response.json().error)
      }
      // return [await response.json(), response.status];
    });
  }

  render() {
    const SignOutContext = this.context;
    return (
      <SafeAreaView style={Style.mainView}>
        <Header
          Title={this.state.LangStr.CreateNewPassword}
          BackActionValidate={false}
          // BackAction={() => this.props.navigation.goBack()}
        />
        <View style={Style.componentContainerView}>
          <StatusBar
            animated={false}
            backgroundColor={colors.WhiteSmoke}
            barStyle={"dark-content"}
          />
          <KeyboardAwareScrollView showsVerticalScrollIndicator={false}>
            <View style={{ paddingTop: RFValue(30) }}>
              {/* <TextFieldWithIcon
                name={this.state.LangStr.OldPassword}
                placeholder={this.state.LangStr.OldPasswordPlaceholder}
                onChange={(text) => this.setState({ Password: text })}
                secureTextEntry={!this.state.PasswordShowFlag}
                onClickIcon={() =>
                  this.setState({
                    PasswordShowFlag: !this.state.PasswordShowFlag,
                  })
                }
                imageFlag={this.state.PasswordShowFlag ? 1 : 0}
              /> */}
              <TextFieldWithIcon
                name={this.state.LangStr.Password}
                placeholder={this.state.LangStr.Password}
                onChange={(text) => this.setState({ Password: text })}
                secureTextEntry={!this.state.NewPasswordShowFlag}
                onClickIcon={() =>
                  this.setState({
                    NewPasswordShowFlag: !this.state.NewPasswordShowFlag,
                  })
                }
                imageFlag={this.state.NewPasswordShowFlag ? 1 : 0}
              />
              <TextFieldWithIcon
                name={this.state.LangStr.ConfirmNewPassword}
                placeholder={this.state.LangStr.ConfirmNewPassword}
                onChange={(text) => this.setState({ ConfirmPassword: text })}
                secureTextEntry={!this.state.ConfirmPasswordShowFlag}
                onClickIcon={() =>
                  this.setState({
                    ConfirmPasswordShowFlag:
                      !this.state.ConfirmPasswordShowFlag,
                  })
                }
                imageFlag={this.state.ConfirmPasswordShowFlag ? 1 : 0}
              />
              {/* <TextField
                value={this.state.ConfirmPassword}
                name={this.state.LangStr.PasswordVerification}
                placeholder={this.state.LangStr.PasswordVerification}
                // onChange={(text) => this.setState({ ConfirmPassword: text })}
                // onClickIcon={() =>
                //   this.setState({
                //     ConfirmPasswordShowFlag: !this.state.ConfirmPasswordShowFlag,
                //   })
                // }
                // imageFlag={this.state.ConfirmPasswordShowFlag ? 1 : 0}
                backgroundColor={colors.SemiLightGrey}
                editable={false}
              /> */}
            </View>
            <View style={Style.SignInbtnView}>
              <TouchableOpacity
                onPress={() => {
                  this.onClickResetPassword();
                }}
                // activeOpacity={1}
                disabled={
                  this.state.Password == "" || this.state.ConfirmPassword == ""
                    ? true
                    : false
                }
                style={[
                  Style.signInBtn,
                  {
                    backgroundColor:
                      this.state.Password != "" &&
                      this.state.ConfirmPassword != ""
                        ? colors.Blue
                        : colors.LightBlue,
                  },
                ]}
              >
                <Text style={[Style.signinBtnTxt, { color: colors.White }]}>
                  {this.state.LangStr.CreatePassword}
                </Text>
              </TouchableOpacity>
            </View>
          </KeyboardAwareScrollView>
        </View>
        <Modal
          animationType={"fade"}
          transparent={true}
          visible={this.state.ResetSuccessfully}
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
                  {this.state.LangStr.PasswordChangedTitle}
                </Text>
                <Text style={[Style.FontMedium_14, { marginVertical: 30 }]}>
                  {this.state.LangStr.PasswordChangedMsg}
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
        {this.state.isLoading && (
          <View style={{ flex: 1 }}>
            <ActivityIndicator size={35} color={colors.LimeGreen} />
          </View>
        )}
      </SafeAreaView>
    );
  }
}

export default CreateNewPassword;
