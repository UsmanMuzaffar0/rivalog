import React from "react";
import { View, Text, Image, TouchableOpacity, StatusBar } from "react-native";
import { RFValue } from "react-native-responsive-fontsize";
import Feather from "react-native-vector-icons/Feather";
import { Style, width } from "../../common/Style";
import { Platform } from "react-native";
import * as colors from "../colors";

export const Header = ({
  Title,
  BackAction,
  signOutAction,
  BackActionValidate = true,
  BackLogo = require("../../assets/images/icn_back.png"),
  signOut = false,
}) => {
  return (
    <View
      style={{
        flexDirection: "row",
        marginBottom: RFValue(15),
        marginTop:
          Platform.OS == "android"
            ? StatusBar.currentHeight + RFValue(15)
            : RFValue(15),
      }}
    >
      {BackActionValidate ? (
        <View style={{ width: RFValue(60) }}>
          <TouchableOpacity
            onPress={() => BackAction()}
            style={Style.HeaderMenuView}
          >
            {/*Donute Button Image */}
            <Image
              source={BackLogo}
              style={[Style.DrawerMenuImage, { left: 0 }]}
            />
          </TouchableOpacity>
        </View>
      ) : undefined}
      {signOut ? <View style={{ width: RFValue(60) }} /> : undefined}
      <View style={{ flex: 1, alignItems: "center" }}>
        <Text style={Style.HeaderTitleTxt}>{Title}</Text>
      </View>
      {BackActionValidate ? <View style={{ width: RFValue(60) }} /> : undefined}
      {signOut ? (
        <View style={{ width: RFValue(60) }}>
          <TouchableOpacity
            onPress={() => signOutAction()}
            style={Style.HeaderImageView}
          >
            {/*Donute Button Image */}
            <Image source={BackLogo} style={Style.DrawerMenuImage} />
          </TouchableOpacity>
        </View>
      ) : undefined}
    </View>
  );
};

export const Header2 = ({
  Title,
  BackAction,
  signOutAction,
  BackButton,
  BackActionValidate = true,
  BackLogo = require("../../assets/images/icn_back.png"),
  signOut = false,
}) => {
  return (
    <View
      style={{
        flexDirection: "row",
        marginBottom: RFValue(25),
        marginTop: Platform.OS == "android" ? RFValue(20) : RFValue(10),
      }}
    >
      {BackActionValidate ? (
        <View style={{ width: RFValue(60) }}>
          {BackButton && (
            <TouchableOpacity
              onPress={() => BackAction()}
              style={Style.HeaderMenuView}
            >
              <Image
                source={BackLogo}
                style={[Style.DrawerMenuImage, { left: 0 }]}
              />
            </TouchableOpacity>
          )}
        </View>
      ) : undefined}
      {signOut ? <View style={{ width: RFValue(60) }} /> : undefined}
      <View style={{ flex: 1, alignItems: "center" }}>
        <Text style={Style.HeaderTitleTxt}>{Title}</Text>
      </View>
      {BackActionValidate ? <View style={{ width: RFValue(60) }} /> : undefined}
      {signOut ? (
        <View style={{ width: RFValue(60) }}>
          <TouchableOpacity
            onPress={() => signOutAction()}
            style={Style.HeaderImageView}
          >
            {/*Donute Button Image */}
            <Image source={BackLogo} style={Style.DrawerMenuImage} />
          </TouchableOpacity>
        </View>
      ) : undefined}
    </View>
  );
};

export const HeaderWithRefreshOption = ({ Title, BackAction, onRefresh }) => {
  return (
    <View
      style={{
        flexDirection: "row",
        marginBottom: RFValue(10),
        marginTop: Platform.OS == "android" ? RFValue(51) : RFValue(15),
      }}
    >
      <View style={{ width: RFValue(60) }}>
        <TouchableOpacity
          onPress={() => BackAction()}
          style={Style.HeaderMenuView}
        >
          {/*Donute Button Image */}
          <Image
            source={require("../../assets/images/icn_back.png")}
            style={[Style.DrawerMenuImage, { left: 0 }]}
          />
        </TouchableOpacity>
      </View>
      <View style={{ flex: 1, alignItems: "center", justifyContent: "center" }}>
        <Text style={Style.HeaderTitleTxt}>{Title}</Text>
      </View>
      <View
        style={{
          width: RFValue(60),
        }}
      >
        <TouchableOpacity
          onPress={() => onRefresh()}
          style={[Style.HeaderMenuView, { left: 0 }]}
        >
          {/*Donute Button Image */}
          <Image
            source={require("../../assets/images/refres1.png")}
            style={Style.DrawerMenuImage}
          />
        </TouchableOpacity>
      </View>
    </View>
  );
};

export const HeaderWithNotification = ({
  Title,
  BackAction,
  RightAction,
  back,
  onlyNavButton,
  dontShowNotifications,
}) => {
  if (onlyNavButton === true)
    return (
      <View
        style={{
          width: RFValue(60),
          position: "absolute",
          zIndex: 1,
          left: 0,
          top: Platform.OS == "android" ? StatusBar.currentHeight : RFValue(15),
        }}
      >
        <TouchableOpacity
          onPress={() => BackAction()}
          style={Style.HeaderMenuView}
        >
          {/*Donute Button Image */}
          <Image
            source={
              back
                ? require("../../assets/images/icn_previous.png")
                : require("../../assets/images/icn_menu2.png")
            }
            style={Style.HeaderMenuImage}
          />
        </TouchableOpacity>
      </View>
    );

  return (
    <View
      style={{
        flexDirection: "row",
        marginBottom: RFValue(15),
        marginTop:
          Platform.OS == "android" ? StatusBar.currentHeight : RFValue(15),
      }}
    >
      <View style={{ width: RFValue(60) }}>
        <TouchableOpacity
          onPress={() => BackAction()}
          style={Style.HeaderMenuView}
        >
          {/*Donute Button Image */}
          <Image
            source={
              back
                ? require("../../assets/images/icn_previous.png")
                : require("../../assets/images/icn_menu2.png")
            }
            style={Style.HeaderMenuImage}
          />
        </TouchableOpacity>
      </View>
      <View style={{ flex: 1, alignItems: "center" }}>
        <Text style={Style.HeaderTitleTxt}>{Title}</Text>
      </View>
      <View style={{ width: RFValue(60) }}>
        {!dontShowNotifications && (
          <TouchableOpacity
            onPress={RightAction}
            style={[Style.HeaderMenuView, { left: RFValue(10) }]}
          >
            {/*Donute Button Image */}
            <Image
              source={require("../../assets/images/icn_notification.png")}
              style={Style.HeaderNotificationImage}
            />
          </TouchableOpacity>
        )}
      </View>
    </View>
  );
};

export default Header;
