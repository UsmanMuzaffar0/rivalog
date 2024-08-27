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
} from "react-native";
import { connect } from "react-redux";
import { ChangePasswordAction } from "../../Redux/actions";
import StringsOfLanguages from "../../Localization/stringsoflanguages";
import * as Fonts from "../../common/fonts";
import * as colors from "../../common/colors";
import { Style } from "../../common/Style";
import Loader from "../../common/Component/Loader";
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";
import { RFPercentage, RFValue } from "react-native-responsive-fontsize";
import { TextField, TextFieldWithIcon } from "../../common/Component/TextField";
import Header, { Header2 } from "../../common/Component/Header";
import Button from "../../common/Component/Button";
import { AuthContext } from "../../navigation/AuthContext";

export const { width, height } = Dimensions.get("window");

class ResetPassword extends React.Component {
  static contextType = AuthContext;

  constructor(props) {
    super(props);
    this.state = {
      loading: false,
      Password: "",
      NewPassword: "",
      ConfirmPassword: "",
      LangStr: StringsOfLanguages,
      ResetSuccessfully: false,
      PasswordShowFlag: false,
      NewPasswordShowFlag: false,
      ConfirmPasswordShowFlag: false,
    };
  }

  async UNSAFE_componentWillReceiveProps(nextProps) {
    if (nextProps.ChangePassword.ChangePasswordSuccess) {
      const SignOutContext = this.context;
      console.log("first", nextProps.ChangePassword);
      if (nextProps.ChangePassword.data[1] === 200) {
        this.setState({ ResetSuccessfully: true });
        setTimeout(() => {
          this.setState({ ResetSuccessfully: false });
          SignOutContext.signOut();
        }, 2000);
        // alert("Successfully Password Change")
        // console.log(nextProps.ChangePassword.data[0]);
        // this.setState({ TokenApi: false, loading: false });
      } else {
        alert(nextProps.ChangePassword.data[0].message);
      }
    }
  }

  onClickResetPassword() {
    if (this.state.NewPassword != this.state.ConfirmPassword) {
      alert(this.state.LangStr.UnmatchPasswordAlert);
      return;
    } else {
      var raw = JSON.stringify({
        // oldPassword: this.state.Password,
        newPassword: this.state.NewPassword,
      });
      this.props.ChangePasswordAction(raw);
    }

    // this.setState({ ResetSuccessfully: true });
  }

  render() {
    const SignOutContext = this.context;
    return (
      <SafeAreaView style={Style.mainView}>
        <Header2
          Title={this.state.LangStr.ResetPasswordTitle}
          BackButton={true}
          BackAction={() => this.props.navigation.goBack()}
        />
        <View style={Style.componentContainerView}>
          <StatusBar
            animated={false}
            backgroundColor={colors.WhiteSmoke}
            barStyle={"dark-content"}
          />
          <KeyboardAwareScrollView showsVerticalScrollIndicator={false}>
            <View style={{ paddingTop: RFValue(30) }}>
              <TextFieldWithIcon
                name={this.state.LangStr.NewPasswordPlaceholder}
                placeholder={this.state.LangStr.NewPasswordPlaceholder}
                onChange={(text) => this.setState({ NewPassword: text })}
                secureTextEntry={!this.state.NewPasswordShowFlag}
                onClickIcon={() =>
                  this.setState({
                    NewPasswordShowFlag: !this.state.NewPasswordShowFlag,
                  })
                }
                imageFlag={this.state.NewPasswordShowFlag ? 1 : 0}
                backgroundColor={colors.silverLight}
                styles={{ justifyContent: "space-between", zIndex: 1 }}
              />
              <TextFieldWithIcon
                name={this.state.LangStr.ConfirmNewPasswordPlaceholder}
                placeholder={this.state.LangStr.ConfirmNewPasswordPlaceholder}
                onChange={(text) => this.setState({ ConfirmPassword: text })}
                secureTextEntry={!this.state.ConfirmPasswordShowFlag}
                onClickIcon={() =>
                  this.setState({
                    ConfirmPasswordShowFlag:
                      !this.state.ConfirmPasswordShowFlag,
                  })
                }
                imageFlag={this.state.ConfirmPasswordShowFlag ? 1 : 0}
                backgroundColor={colors.silverLight}
                styles={{ justifyContent: "space-between", zIndex: 1 }}
              />

              <Button
                style={{
                  backgroundColor:
                    this.state.selectedLangCode != ""
                      ? colors.LimeGreen
                      : colors.silver,
                  marginTop: height / 2.5,
                }}
                loader={false}
                disabled={
                  this.state.NewPassword == "" ||
                  this.state.ConfirmPassword == ""
                    ? true
                    : false
                }
                border={false}
                name={this.state.LangStr.Submit2}
                onPress={() => {
                  this.onClickResetPassword();
                }}
              />
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
      </SafeAreaView>
    );
  }
}
const mapStateToProps = (state) => {
  return {
    ChangePassword: state.ChangePassword,
  };
};

export default connect(mapStateToProps, {
  ChangePasswordAction,
})(ResetPassword);
