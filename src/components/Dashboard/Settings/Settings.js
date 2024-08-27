import React, { useState } from "react";
import {
  SafeAreaView,
  Text,
  View,
  Image,
  TouchableOpacity,
  Dimensions,
  StatusBar,
} from "react-native";
import { RFPercentage, RFValue } from "react-native-responsive-fontsize";
import { Style } from "../../../common/Style";
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";
import AsyncStorage from "@react-native-async-storage/async-storage";
const { width, height } = Dimensions.get("window");
import * as colors from "../../../common/colors";

import { AuthContext } from "../../../navigation/AuthContext";
import stringsoflanguages from "../../../Localization/stringsoflanguages";

import { Header } from "../../../common/Component/Header";

export class Settings extends React.Component {
  static contextType = AuthContext;

  constructor(props) {
    super(props);
    this.state = {
      dataAry: [
        stringsoflanguages.Language,
        stringsoflanguages.Notification,
        stringsoflanguages.ResetPassword,
      ],
      LangStr: stringsoflanguages,
    };
  }

  async componentDidMount() {
    this.focusListener = this.props.navigation.addListener(
      "focus",
      async () => {
        stringsoflanguages.setLanguage(
          await AsyncStorage.getItem("SelectedLanguage")
        );
        this.setState({
          LangStr: stringsoflanguages,
          dataAry: [
            stringsoflanguages.Language,
            stringsoflanguages.Notification,
            stringsoflanguages.ResetPassword,
          ],
        });
      }
    );
  }

  fetchIcon(data) {
    switch (data) {
      case stringsoflanguages.Language:
        return (
          <Image
            style={Style.ListIconImg}
            source={require("../../../assets/images/icn_language.png")}
          />
        );
      case stringsoflanguages.Notification:
        return (
          <Image
            style={Style.ListIconImg}
            source={require("../../../assets/images/icn_notification_tab.png")}
          />
        );
      case stringsoflanguages.ResetPassword:
        return (
          <Image
            style={Style.ListIconImg}
            source={require("../../../assets/images/icn_reset.png")}
          />
        );
      default:
        return null;
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
        {/* <Header
          Title={this.state.LangStr.Settings}
          BackAction={() => this.props.navigation.goBack()}
        /> */}
        <View style={Style.componentContainerView}>
          <KeyboardAwareScrollView
            contentContainerStyle={{ paddingBottom: RFPercentage(10) }}
            bounces={false}
            showsVerticalScrollIndicator={false}
          >
            <View style={{ marginTop: RFPercentage(4) }}>
              {this.state.dataAry.map((data, index) => {
                return (
                  <View style={Style.ListItemView}>
                    <TouchableOpacity
                      onPress={() => {
                        if (data == stringsoflanguages.Language) {
                          this.props.navigation.navigate("Language");
                        } else if (data == stringsoflanguages.Notification) {
                          this.props.navigation.navigate("Notification");
                        } else if (data == stringsoflanguages.ResetPassword) {
                          this.props.navigation.navigate("ResetPassword");
                        }
                      }}
                      activeOpacity={1}
                      style={Style.InlineViewContainer}
                    >
                      {this.fetchIcon(data)}
                      <Text style={[Style.MenuListItemTxt]}>{data}</Text>
                    </TouchableOpacity>
                    <View
                      style={[Style.LightDivider, { marginTop: RFValue(12) }]}
                    />
                  </View>
                );
              })}
            </View>
          </KeyboardAwareScrollView>
        </View>
      </SafeAreaView>
    );
  }
}

export default Settings;
