import React from "react";
import {
  SafeAreaView,
  Text,
  View,
  Image,
  TouchableOpacity,
  StatusBar,
} from "react-native";
import { RFPercentage, RFValue } from "react-native-responsive-fontsize";
import { Style } from "../../../common/Style";
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";
import * as colors from "../../../common/colors";
import Api from "../../../../src/common/Api";
import { AuthContext } from "../../../navigation/AuthContext";
import DeleteConfirmationModel from "../../../common/Component/DeleteConfirmationModel";
import { HeaderWithNotification } from "../../../common/Component/Header";
import AsyncStorage from "@react-native-async-storage/async-storage";

import stringsoflanguages from "../../../Localization/stringsoflanguages";

export class FreightSetting extends React.Component {
  static contextType = AuthContext;
  constructor(props) {
    super(props);
    this.state = { OpenOptionDialog: false };
  }

  onhandleDeleteAccount = async () => {
    this.setState({ OpenOptionDialog: true });
  };
  onDeleteAccountConfirmed = async () => {
    const SignOutContext = this.context;

    try {
      // Call the delete account API here
      const response = await Api.DeleteAccount();
      console.log(">>>>delete", response);
      if (response[1] === 200) {
        AsyncStorage.removeItem("AccessToken");
        AsyncStorage.removeItem("LocationData");
        SignOutContext.signOut();
      }
    } catch (error) {
      console.error("An error occurred while deleting account:", error.message);
    }
  };

  onCancelDelete = () => {
    this.setState({ OpenOptionDialog: false });
  };

  render() {
    return (
      <SafeAreaView style={Style.mainView}>
        <StatusBar
          animated={false}
          backgroundColor={colors.WhiteSmoke}
          barStyle={"dark-content"}
        />
        <HeaderWithNotification
          Title={stringsoflanguages?.Settings}
          BackAction={() => this.props.navigation.openDrawer()}
        />
        <View style={Style.componentContainerView}>
          <KeyboardAwareScrollView
            contentContainerStyle={{ paddingBottom: RFPercentage(10) }}
            bounces={false}
            showsVerticalScrollIndicator={false}
          >
            <View style={{ marginTop: RFPercentage(4) }}>
              <View style={Style.ListItemView}>
                <TouchableOpacity
                  onPress={() => {
                    this.props.navigation.navigate("Language");
                  }}
                  activeOpacity={1}
                  style={Style.InlineViewContainer}
                >
                  <Image
                    style={Style.ListIconImg}
                    source={require("../../../assets/images/icn_language.png")}
                  />
                  <Text style={[Style.MenuListItemTxt]}>
                    {stringsoflanguages.Language}
                  </Text>
                </TouchableOpacity>
                <View
                  style={[Style.LightDivider, { marginTop: RFValue(12) }]}
                />
              </View>
              <View style={Style.ListItemView}>
                <TouchableOpacity
                  onPress={this.onhandleDeleteAccount}
                  activeOpacity={1}
                  style={Style.InlineViewContainer}
                >
                  <Image
                    style={Style.ListIconImg}
                    source={require("../../../assets/images/icn_Delete_3.png")}
                  />
                  <Text
                    style={{
                      color: "red",
                      fontSize: RFValue(15),
                    }}
                  >
                    {stringsoflanguages.deleteAccount}
                  </Text>
                </TouchableOpacity>
                <View
                  style={[Style.LightDivider, { marginTop: RFValue(12) }]}
                />
              </View>
            </View>
          </KeyboardAwareScrollView>
        </View>
        {this.state.OpenOptionDialog ? (
          <DeleteConfirmationModel
            isVisible={this.state.OpenOptionDialog}
            onDelete={this.onDeleteAccountConfirmed}
            onCancel={this.onCancelDelete}
          />
        ) : null}
      </SafeAreaView>
    );
  }
}

export default FreightSetting;
