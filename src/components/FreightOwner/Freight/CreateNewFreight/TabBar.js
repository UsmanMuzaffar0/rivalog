import React from "react";
import { View, TouchableOpacity, Text, StyleSheet } from "react-native";
import { RFValue } from "react-native-responsive-fontsize";
import * as colors from "../../../../common/colors";
import * as FONTS from "../../../../common/fonts";
import stringsoflanguages from "../../../../Localization/stringsoflanguages";

const TabBar = ({ activeTab, onTabChange }) => {
  return (
    <View style={styles.container}>
      <TouchableOpacity
        onPress={() => onTabChange("existingAddress")}
        style={[
          styles.tabView,
          {
            borderBottomWidth: activeTab === "existingAddress" ? 2 : 0,
            borderBottomColor:
              activeTab === "existingAddress"
                ? colors.LimeGreen
                : "transparent",
          },
        ]}
      >
        <Text
          style={[
            styles.text,
            {
              color:
                activeTab == "existingAddress"
                  ? colors.LimeGreen
                  : colors.Black,
            },
          ]}
        >{stringsoflanguages.ExistingAddress}
        </Text>
      </TouchableOpacity>
      <TouchableOpacity
        onPress={() => onTabChange("newAddress")}
        style={[
          styles.tabView,
          {
            borderBottomWidth: activeTab == "newAddress" ? 2 : 0,
            borderBottomColor:
              activeTab === "newAddress" ? colors.LimeGreen : "transparent",
          },
        ]}
      >
        <Text
          style={[
            styles.text,
            {
              color:
                activeTab == "newAddress" ? colors.LimeGreen : colors.Black,
            },
          ]}
        >
        {stringsoflanguages.NewAddress}
        </Text>
      </TouchableOpacity>
    </View>
  );
};

export default TabBar;

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-evenly",
    marginBottom: 5,
  },
  text: {
    fontSize: RFValue(13),
    fontFamily: FONTS.Medium,
  },
  tabView: {
    paddingVertical: RFValue(10),
    paddingHorizontal: RFValue(20),
  },
});
