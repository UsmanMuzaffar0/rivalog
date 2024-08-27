import {
  StyleSheet,
  Text,
  View,
  Pressable,
  ActivityIndicator,
} from "react-native";
import React from "react";
import { RFValue, RFPercentage } from "react-native-responsive-fontsize";
import * as colors from "../../common/colors";
import * as Fonts from "../../common/fonts";
import MaterialCommunityIcons from "react-native-vector-icons/MaterialCommunityIcons";
import Feather from "react-native-vector-icons/Feather";
import IonIcon from "react-native-vector-icons/Ionicons";
import { IconButton as PaperIconButton } from "react-native-paper";

export default function Button({
  onPress,
  name,
  style,
  border,
  loader,
  icon,
  disabled,
}) {
  return (
    <Pressable
      onPress={onPress}
      disabled={disabled || loader}
      style={[
        styles.container,

        {
          borderWidth: border ? 1 : 0,
          borderColor: colors.LimeGreen,
          backgroundColor: border ? "transparent" : colors.LimeGreen,
        },
        style,
      ]}
    >
      {loader != null && loader ? (
        <ActivityIndicator
          style={{ paddingVertical: RFValue(10) }}
          size={"small"}
          color={colors.LimeGreen}
        />
      ) : (
        <Text
          style={{
            paddingVertical: RFValue(10),
            fontSize: RFPercentage(2),
            fontFamily: Fonts.LexendSemiBold,
            color: border ? colors.Black : colors.White,
          }}
        >
          {name}
          {icon ? (
            <>
              {` `}
              <IonIcon name={icon} />
            </>
          ) : null}
        </Text>
      )}
    </Pressable>
  );
}

export function IconButton({
  onPress,
  size = RFValue(15),
  color,
  name,
  style,
  disabled,
  feather,
}) {
  return (
    <Pressable style={styles.iconView} onPress={onPress} disabled={disabled}>
      {feather ? (
        <Feather name={name} style={[style]} color={color} size={size} />
      ) : (
        <MaterialCommunityIcons
          name={name}
          style={[style]}
          color={color}
          size={size}
        />
      )}
      {/* <PaperIconButton
        icon={name}
        style={[style]}
        color={color}
        size={size}
        onPress={onPress}
        disabled={disabled}
      /> */}
    </Pressable>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: "#33b267",
    borderRadius: RFValue(20),
    marginTop: RFValue(10),
    width: "75%",
    alignSelf: "center",
    justifyContent: "center",
    alignItems: "center",
  },

  iconView: {
    backgroundColor: "#F6F6F6",
    padding: 8,
    borderRadius: 5,
  },
});

export function ButtonOld({ onPress, name, style, border, loader, icon }) {
  return (
    <Pressable
      onPress={onPress}
      disabled={loader}
      style={[
        styles.container,
        style,
        {
          borderWidth: border ? 1 : 0,
          borderColor: colors.LimeGreen,
          backgroundColor: border ? "transparent" : colors.LimeGreen,
        },
      ]}
    >
      {loader != null && loader ? (
        <ActivityIndicator
          style={{ paddingVertical: RFValue(10) }}
          size={"small"}
          color={colors.White}
        />
      ) : (
        <Text
          style={{
            paddingVertical: RFValue(10),
            fontSize: RFPercentage(1.7),
            fontFamily: Fonts.Medium,
            color: border ? colors.Black : colors.White,
          }}
        >
          {name}
          {icon ? (
            <>
              {` `}
              <IonIcon name={icon} />
            </>
          ) : null}
        </Text>
      )}
    </Pressable>
  );
}
