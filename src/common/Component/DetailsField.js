import React from "react";
import {
  TextInput,
  View,
  Text,
  StyleSheet,
  I18nManager,
  Image,
  Platform,
  TouchableOpacity,
} from "react-native";
import { RFPercentage, RFValue } from "react-native-responsive-fontsize";
import * as colors from "../colors";
import * as Fonts from "../fonts";
import { Style } from "../Style";

export const DetailsField = ({ name, value, icon }) => {
  return (
    <View style={[style.TextfieldMainView]}>
      <View style={[style.DisplayTextFieldView]}>
        {icon ? (
          <View
            style={{
              backgroundColor: "#ebf7f0",
              height: RFValue(44),
              marginTop: RFValue(9),
              width: RFValue(44),
              justifyContent: "center",
              alignItems: "center",
              borderRadius: RFValue(22),
            }}
          >
            <Image
              source={icon}
              style={{
                height: RFValue(22),
                width: RFValue(22),
              }}
              resizeMode={"contain"}
            />
          </View>
        ) : null}
        <View style={style.TextfieldTitleView}>
          <Text style={style.TextfieldTitle}>{name}</Text>
          <Text numberOfLines={1} style={[style.NameTxt]}>
            {value?.length > 26 ? value?.substring(0, 26) + "..." : value}
          </Text>
        </View>
      </View>
    </View>
  );
};
export const DetailsField3 = ({ name, value, date, icon, Dot }) => {
  return (
    <View style={[style.TextfieldMainView]}>
      <View style={[style.DisplayTextFieldView]}>
        {Dot ? (
          <View
            style={{
              width: RFValue(10),
              height: RFValue(10),
              borderRadius: RFValue(5),
              backgroundColor: "#f57382",
              marginTop: RFValue(10),
            }}
          ></View>
        ) : null}
        {icon ? (
          <View
            style={{
              backgroundColor: "#ebf7f0",
              height: RFValue(52),
              marginTop: RFValue(18),
              width: RFValue(52),
              justifyContent: "center",
              alignItems: "center",
              borderRadius: RFValue(26),
            }}
          >
            <Image
              source={icon}
              style={{
                tintColor: "#33b267",
                height: RFValue(20),
                width: RFValue(20),
              }}
              resizeMode={"contain"}
            />
          </View>
        ) : null}
        <View
          style={[style.TextfieldTitleView, { flexShrink: 1, width: "100%" }]}
        >
          <View>
            <Text
              style={{
                fontSize: RFValue(14),
                fontFamily: Fonts.LexendSemiBold,
              }}
            >
              {name}
            </Text>
            <Text
              style={{
                flexShrink: 1,
                fontFamily: Fonts.LexendRegular,
                color: "#767676",
                marginTop: RFValue(4),
                fontSize: RFValue(12),
              }}
            >
              {value}
            </Text>
          </View>
          <Text
            style={{
              alignSelf: "flex-end",
              fontSize: RFValue(10),
              fontFamily: Fonts.LexendRegular,
              color: "#767676",
            }}
          >
            {date}
          </Text>
        </View>
      </View>
    </View>
  );
};
export const DetailsField2 = ({ name, value, icon }) => {
  return (
    <View style={[style.TextfieldMainView]}>
      <View style={[style.DisplayTextFieldView1]}>
        {icon ? (
          <View
            style={{
              backgroundColor: "#ebf7f0",
              height: RFValue(44),
              marginTop: RFValue(20),
              width: RFValue(44),
              justifyContent: "center",
              alignItems: "center",
              borderRadius: RFValue(22),
            }}
          >
            <Image
              source={icon}
              style={{
                tintColor: "#33b267",
                height: RFValue(18),
                width: RFValue(18),
              }}
              resizeMode={"contain"}
            />
          </View>
        ) : null}
        <View style={style.TextfieldTitleView}>
          <Text style={style.TextfieldTitle1}>{name}</Text>
          <Text style={[style.NameTxt1]}>{value}</Text>
          <Text style={{ alignSelf: "flex-end", fontSize: 10, color: "grey" }}>
            On 3rd July 2023
          </Text>
        </View>
      </View>
    </View>
  );
};

export const DetailsFieldWithIcon = ({
  name,
  value,
  imageFlag,
  onClickIcon,
}) => {
  var imagePath =
    imageFlag == 1
      ? require("../../assets/images/icn_view.png")
      : imageFlag == 3
      ? require("../../assets/images/icn_arrow_down.png")
      : require("../../assets/images/details_call.png");
  return (
    <View style={style.TextfieldMainView}>
      <View style={style.DisplayTextWithIconFieldView}>
        <View style={style.TextfieldWithIconTitleView}>
          <Text style={style.TextfieldTitle}>{name}</Text>
          <Text style={[style.NameTxt]}>{value}</Text>
        </View>

        <TouchableOpacity
          style={[style.DropdownImageView]}
          onPress={onClickIcon}
        >
          <Image source={imagePath} style={style.TextFieldIcon} />
        </TouchableOpacity>
      </View>
    </View>
  );
};

const style = StyleSheet.create({
  TextfieldMainView: {
    marginBottom: RFPercentage(3),
  },

  TextfieldTitleView: {
    marginLeft: RFValue(12),
    marginTop: RFValue(6),
  },
  TextfieldWithIconTitleView: {
    marginLeft: RFValue(8),
    paddingHorizontal: RFValue(18),
    paddingVertical: RFValue(10),
  },

  TextfieldTitle: {
    color: colors.Black,
    fontFamily: Fonts.LexendSemiBold,
    fontSize: Platform.OS === "android" ? RFValue(14) : RFValue(13),
    marginTop: RFValue(6),
  },
  TextfieldTitle1: {
    color: colors.Black,
    fontFamily: Fonts.Bold,
    fontSize: RFValue(14),
    marginTop: RFValue(6),
  },
  DetailsFilesRow: {
    flexDirection: "row",
  },

  NameTxt: {
    fontSize: RFValue(14),
    fontFamily: Fonts.LexendRegular,
    color: "#00000080",
    textAlign: "left",
    textAlignVertical: "top",
    marginTop: RFValue(5),
  },
  NameTxt1: {
    fontSize: RFValue(14),
    fontFamily: Fonts.LexendSemiBold,
    color: "#00000080",
    textAlign: "left",
    textAlignVertical: "top",
  },

  DisplayTextFieldView: {
    flexDirection: "row",
    paddingHorizontal: RFValue(10),
    paddingVertical: RFValue(10),
    borderRadius: RFValue(7),
    backgroundColor: "white",
    // marginHorizontal: RFValue(2),
    shadowColor: colors.Grey,
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.2,
    shadowRadius: 2,
    elevation: 2,
  },
  DisplayTextFieldView1: {
    flexDirection: "row",
    paddingHorizontal: RFValue(18),
    paddingVertical: RFValue(15),
    borderRadius: RFValue(5),
    backgroundColor: "white",
    marginHorizontal: RFValue(2),
    shadowColor: colors.Grey,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 3,
    elevation: 3,
  },
  DisplayTextWithIconFieldView: {
    flexDirection: "row",
    borderRadius: RFValue(5),
    backgroundColor: "#E7F3FF",
  },

  // with Icon
  DropdownImageView: {
    position: "absolute",
    right: 0,
    backgroundColor: colors.Blue,
    width: RFValue(50),
    height: "100%",
    justifyContent: "center",
  },

  TextFieldIcon: {
    height: RFPercentage(2.5),
    width: RFPercentage(2.5),
    resizeMode: "contain",
    alignSelf: "center",
    tintColor: colors.White,
  },
});
