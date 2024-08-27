import React, { useState } from "react";
import {
  View,
  TouchableOpacity,
  Text,
  StyleSheet,
  Platform,
} from "react-native";
import FreightList from "./FreightList";
import FreightUnsignedList from "./FreightSignedList";
import * as colors from "../../../common/colors";
import { HeaderWithRefreshOption } from "../../../common/Component/Header";
import { RFValue } from "react-native-responsive-fontsize";
import { useNavigation } from "@react-navigation/native";
import StringsOfLanguages from "../../../Localization/stringsoflanguages";

const MainFreightTab = (props) => {
  const [activeTab, setActiveTab] = useState("FreightList");
  const navigation = useNavigation();

  const renderTabButton = (label, tabKey) => {
    return (
      <TouchableOpacity
        onPress={() => setActiveTab(tabKey)}
        style={[
          styles.tabButton,
          activeTab === tabKey ? styles.activeTabButton : styles.inactiveTab,
        ]}
      >
        <Text
          style={
            activeTab === tabKey ? styles.activeTabText : styles.inactiveTabText
          }
        >
          {label}
        </Text>
      </TouchableOpacity>
    );
  };

  return (
    <View style={styles.container}>
      {/* <HeaderWithRefreshOption
        Title={"Rivalog"}
        BackAction={() => navigation.goBack()}
        onRefresh={() => {}}
      /> */}
      <View style={styles.tabContainer}>
        {renderTabButton(StringsOfLanguages.FreightExchange, "FreightList")}
        {renderTabButton(
          StringsOfLanguages.ContractedCompanyFreights,
          "FreightSignedList"
        )}
      </View>
      {activeTab === "FreightList" && <FreightList {...props} />}
      {activeTab === "FreightSignedList" && <FreightUnsignedList {...props} />}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.WhiteSmoke,
    // marginTop: Platform.OS === "ios" ? RFValue(34) : RFValue(0),
  },
  tabContainer: {
    flexDirection: "row",
    justifyContent: "space-around",
    alignItems: "center",
    backgroundColor: colors.WhiteSmoke,
  },
  tabButton: {
    paddingHorizontal: 30,
    paddingVertical: 12,
  },
  activeTabButton: {
    borderBottomWidth: 2,
    borderBottomColor: "green",
  },
  inactiveTab: {
    borderBottomWidth: 2,
    borderBottomColor: "lightgray",
  },
  activeTabText: {
    fontWeight: "bold",
    color: "green",
  },
  inactiveTabText: {
    color: "gray",
  },
});

export default MainFreightTab;
