import React from "react";
import {
  View,
  TouchableOpacity,
  Image,
  Dimensions,
  Platform,
  TextInput,
  I18nManager,
} from "react-native";
import * as colors from "../../common/colors";
import * as Fonts from "../../common/fonts";
import { RFPercentage, RFValue } from "react-native-responsive-fontsize";
import StringsOfLanguages from "../../Localization/stringsoflanguages";
const { width, height } = Dimensions.get("window");

export const ListSearchField = ({
  filter,
  searchText,
  filterPress,
  onChangeSearchText,
  onClearSearchText,
}) => {
  return (
    <View
      style={{
        width: "100%",
        paddingHorizontal: RFValue(10),
        paddingVertical: Platform.OS == "android" ? RFValue(0) : RFValue(5),
        backgroundColor:colors.White,
        height: RFValue(46),
        flexDirection: "row",
        borderRadius: 5,
      }}
    >
      <View
        style={{
          flexDirection: "row",
          width: width / 1.4,
          alignItems: "center",
          flex: 1,
          paddingLeft: RFValue(10),
        }}
      >
        <Image
          style={{
            height: RFPercentage(2.5),
            width: RFPercentage(2.5),
            resizeMode: "contain",
          }}
          source={require("../../assets/images/icn_search.png")}
        />
        <View
          style={{
            width: 1,
            height: "70%",
            backgroundColor: "#EBF7F0",
            marginHorizontal: RFValue(12),
          }}
        />
        <TextInput
          textAlign={I18nManager.isRTL ? "right" : "left"}
          placeholder={
            searchText == "" ? StringsOfLanguages.SerchTxt : searchText
          }
          placeholderTextColor={searchText == "" ? "#D4D4D4" : colors.Black}
          style={{
            flex: 1,
            fontFamily: Fonts.Regular,
            color: colors.Black,
            fontSize: RFValue(14),
            // paddingTop: RFValue(10),
            width: width / 1.6,

            textDecorationColor: searchText == "" ? "white" : colors.Black,
          }}
          onChangeText={onChangeSearchText}
          value={searchText}
        />

        {searchText != "" ? (
          <TouchableOpacity
            style={{ justifyContent: "center" }}
            onPress={() => {
              onClearSearchText();
            }}
          >
            <Image
              style={{
                height: RFPercentage(2),
                width: RFPercentage(2),
                resizeMode: "contain",
              }}
              source={require("../../assets/images/icn_close.png")}
            />
          </TouchableOpacity>
        ) : undefined}

        {filter ? (
          <TouchableOpacity
            style={{
              justifyContent: "center",
              marginHorizontal: RFPercentage(1),
            }}
            onPress={filterPress}
          >
            <Image
              style={{
                height: RFPercentage(2),
                width: RFPercentage(2),
                resizeMode: "contain",
              }}
              source={require("../../assets/images/funnel.png")}
            />
          </TouchableOpacity>
        ) : undefined}
      </View>
    </View>
  );
};

export const AddNewItem = ({ Visible, onAddItem }) => {
  return Visible ? (
    <TouchableOpacity
      onPress={() => onAddItem()}
      style={{
        height: RFValue(50),
        width: RFValue(50),
        borderRadius: RFValue(25),
        backgroundColor: colors.White,
        position: "absolute",
        right: 0,
        bottom: 35,
        alignItems: "center",
        justifyContent: "center",
        shadowColor: colors.Grey,
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.2,
        shadowRadius: 3,
        elevation: 3,
      }}
    >
      <Image
        style={{
          height: RFPercentage(2),
          width: RFPercentage(2),
          resizeMode: "contain",
        }}
        source={require("../../assets/images/icn_add.png")}
      />
    </TouchableOpacity>
  ) : null;
};
