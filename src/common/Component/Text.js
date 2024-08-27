import React from "react";
import { StyleSheet, Text } from "react-native";
import * as Fonts from "../fonts";
import * as colors from "../colors";
import { RFValue, RFPercentage } from "react-native-responsive-fontsize";

export const TextMed = ({ style, ...props }) => {
  return <Text style={[styles.fontMed, style]} {...props}></Text>;
};

export const TextSmall = ({ style, ...props }) => {
  return <Text style={[styles.fontSmall, style]} {...props}></Text>;
};

export const TextLarge = ({ style, ...props }) => {
  return <Text style={[styles.fontsLarge, style]} {...props}></Text>;
};

export const TextMuted = ({ style, ...props }) => {
  return <Text style={[styles.fontSmallMuted, style]} {...props}></Text>;
};

const styles = StyleSheet.create({
  fontMed: {
    fontFamily: Fonts.Medium,
    color: colors.Black,
    // fontSize: RFValue(13),
    fontSize: RFPercentage(1.8),
  },

  fontSmall: {
    fontFamily: Fonts.Medium,
    color: colors.Black,
    fontSize: RFValue(12),
  },

  fontsLarge: {
    fontFamily: Fonts.Medium,
    color: colors.Black,
    fontSize: RFValue(16),
  },

  fontSmallMuted: {
    fontFamily: Fonts.Medium,
    color: colors.Grey,
    fontSize: RFValue(12),
  },
});
