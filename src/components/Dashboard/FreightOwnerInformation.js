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
  Linking,
} from "react-native";
import StringsOfLanguages from "../../Localization/stringsoflanguages";
import * as colors from "../../common/colors";
import * as Fonts from "../../common/fonts";
import { Style } from "../../common/Style";
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";
import { RFPercentage, RFValue } from "react-native-responsive-fontsize";
import { TextField, TextFieldWithIcon } from "../../common/Component/TextField";
import Header from "../../common/Component/Header";
import { AuthContext } from "../../navigation/AuthContext";
import AsyncStorage from "@react-native-async-storage/async-storage";

export const { width, height } = Dimensions.get("window");

class FreightOwnerInformation extends React.Component {
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

  onClickResetPassword() {}

  render() {
    const SignOutContext = this.context;
    return (
      <SafeAreaView style={Style.mainView}>
        <Header
          Title={this.state.LangStr.Information}
          BackActionValidate={false}
          signOutAction={() => {
            AsyncStorage.removeItem("AccessToken"),
              AsyncStorage.removeItem("LocationData"),
              SignOutContext.signOut();
          }}
          BackLogo={require("../../assets/images/icn_logout.png")}
          signOut={true}
        />
        <View style={Style.componentContainerView}>
          <StatusBar
            animated={false}
            backgroundColor={colors.WhiteSmoke}
            barStyle={"dark-content"}
          />
          <View
            style={{
              paddingBottom: height * 0.02,
              justifyContent: "center",
              alignItems: "center",
            }}
          >
            <Image
              source={require("../../assets/images/tick(true).png")}
              style={{ height: RFPercentage(34), width: RFPercentage(24) }}
              resizeMode="contain"
            />
            <Text
              style={{
                fontFamily: Fonts.Medium,
                textAlign: "center",
                fontSize: (height * 16) / height,
              }}
            >
              {StringsOfLanguages.FreightOwnerInformation}
            </Text>
          </View>
          <View style={Style.SignInbtnView}>
            <TouchableOpacity
              onPress={() => {
                Linking.openURL("https://www.rivalog.com");
              }}
              // activeOpacity={1}
              style={[Style.signInBtn]}
            >
              <Text style={[Style.signinBtnTxt, { color: colors.White }]}>
                {this.state.LangStr.GotoWeb}
              </Text>
            </TouchableOpacity>
          </View>
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

export default FreightOwnerInformation;
