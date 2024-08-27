import React from "react";
import {
  View,
  Text,
  TouchableOpacity,
  Image,
  ActivityIndicator,
  StyleSheet,
  I18nManager,
  Pressable,
  TextInput,
} from "react-native";
import * as colors from "../../common/colors";
import MaterialCommunityIcons from "react-native-vector-icons/MaterialCommunityIcons";

import { Style } from "../Style";
import { RFValue } from "react-native-responsive-fontsize";

const DropDownField = ({
  name,
  onPress,
  value = "",
  placeholder = "",
  load,
}) => {
  return (
    <View style={Style.TextMainView}>
      <View style={Style.TextfieldTitleView}>
        <Text style={Style.TextfieldTitle}>{name}</Text>
      </View>
      <TouchableOpacity
        activeOpacity={1}
        onPress={() => onPress()}
        style={Style.DropdownFieldView}
      >
        <View style={Style.DropdownTextFieldView}>
          {value == "" ? (
            <Text style={[Style.TextFieldPlaceholder]}>{placeholder}</Text>
          ) : (
            <Text style={[Style.InputTextField]} numberOfLines={1}>
              {value}
            </Text>
          )}
        </View>
        <View style={Style.DropdownImageView}>
          {load && load ? (
            <ActivityIndicator size={"small"} color={colors.Grey} />
          ) : (
            <Image
              source={require("../../assets/images/DownArrow.png")}
              style={Style.TexFielIcon2}
            />
          )}
        </View>
      </TouchableOpacity>
    </View>
  );
};

export const DropDownFieldWithCheckbox = ({
  name,
  onPress,
  value = "",
  placeholder = "",
}) => {
  return (
    <View style={Style.TextfieldMainView}>
      <View style={Style.TextfieldTitleView}>
        <Text style={Style.TextfieldTitle}>{name}</Text>
      </View>
      <TouchableOpacity
        onPress={() => onPress()}
        style={Style.DropdownFieldView}
      >
        <View style={Style.DropdownTextFieldView}>
          {value == "" ? (
            <Text style={[Style.TextFieldPlaceholder]}>{placeholder}</Text>
          ) : (
            <Text style={[Style.InputTextField]}>{value}</Text>
          )}
        </View>
        <View style={Style.DropdownImageView}>
          <Image
            source={require("../../assets/images/icn_arrow_down.png")}
            style={[Style.TextFieldIcon, {}]}
          />
        </View>
      </TouchableOpacity>
    </View>
  );
};

export const DropDownField2 = ({
  name,
  onPress,
  value = "",
  placeholder = "",
  disabled,
  icon,
  backgroundColor = colors.silverLight,
  styles,
}) => {
  return (
    <View style={Style.TextfieldMainView2}>
      <View style={Style.TextfieldTitleView2}>
        <Text style={Style.TextfieldTitle2}>{name}</Text>
      </View>
      <Pressable
        onPress={onPress}
        disabled={disabled}
        style={[
          Style.InputTextFieldView2,
          { backgroundColor: backgroundColor },
          disabled && { backgroundColor: colors.SemiLightGrey },
          styles,
        ]}
      >
        <TextInput
          textAlign={I18nManager.isRTL ? "right" : "left"}
          style={[Style.InputTextField2, Style.InputTextFieldWithIcon2]}
          placeholderTextColor={colors.blacklight}
          autoCapitalize="none"
          value={value}
          editable={false}
          placeholder={placeholder}
        ></TextInput>
        <MaterialCommunityIcons
          name={icon ?? "chevron-down"}
          size={RFValue(20)}
          color={disabled ? colors.silverLight : colors.Grey}
        />
      </Pressable>
    </View>
  );
};

export default DropDownField;
