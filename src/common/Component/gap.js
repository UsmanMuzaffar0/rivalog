import React from "react";
import { StyleSheet, View } from "react-native";
import { Divider } from "react-native-paper";
import { RFPercentage, RFValue } from "react-native-responsive-fontsize";

let mgS = RFPercentage(2),
  mgM = RFValue(5),
  mgL = RFValue(10);

export function GapV({ small, md, large, xL }) {
  return (
    <View
      style={{
        marginTop: small ? mgS : large ? mgL : xL ? mgL * 2 : md ? mgM : mgM,
      }}
    />
  );
}

export function GapH({ small, md, large, xL }) {
  return (
    <View
      style={{
        marginLeft: small ? mgS : large ? mgL : xL ? mgL * 2 : md ? mgM : mgM,
      }}
    />
  );
}

export function DividerV({ s, m }) {
  return <Divider style={{ borderTopWidth: StyleSheet.hairlineWidth }} />;
}
