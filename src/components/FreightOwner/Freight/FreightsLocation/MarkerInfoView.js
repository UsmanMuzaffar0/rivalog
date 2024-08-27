import {
  StyleSheet,
  Text,
  View,
  SafeAreaView,
  StatusBar,
  Pressable,
  Image,
  FlatList,
  Modal,
} from "react-native";
import React, { useEffect, useRef, useState } from "react";
import { HeaderWithNotification } from "../../../../common/Component/Header";
import { Style } from "../../../../common/Style";
import * as colors from "../../../../common/colors";
import * as Fonts from "../../../../common/fonts";
import { RFPercentage, RFValue } from "react-native-responsive-fontsize";
import { ScrollView } from "react-native-gesture-handler";

import {
  TextField2,
  TextFieldWithIcon2,
} from "../../../../common/Component/TextField";
import Button from "../../../../common/Component/Button";
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";
import { DividerV, GapV } from "../../../../common/Component/gap";
import stringsoflanguages from "../../../../Localization/stringsoflanguages";
import { IconButton } from "react-native-paper";
import Animated, { ZoomIn } from "react-native-reanimated";
import {
  TextLarge,
  TextMed,
  TextSmall,
} from "../../../../common/Component/Text";
import { changeUnixDateFormat } from "../../../../common/Utils/date";
import { global } from "../../../../common/global";

export default function MarkerViewInfo({ isVisible, hideModal, marker }) {
  if (!marker) return null;

  const {
    container,
    transporterCompany,
    lastSubmissionDate,
    driver,
    vehicle,
    trailer,
  } = marker;

  return (
    <Modal animationType={"none"} transparent={true} visible={isVisible}>
      <KeyboardAwareScrollView
        showsVerticalScrollIndicator={false}
        style={styles.modal}
        contentContainerStyle={styles.modalcontainer}
      >
        <Animated.View entering={ZoomIn} style={styles.ModelViewContainer}>
          <IconButton
            icon={"close"}
            style={styles.iconBtn}
            onPress={hideModal}
          />

          <TextLarge>{container?.description}</TextLarge>
          <DividerV />
          <GapV />

          <View style={styles.row}>
            <TextSmall>{stringsoflanguages.CompanyName}</TextSmall>
            <TextMed>{transporterCompany?.name}</TextMed>
          </View>
          <View style={styles.row}>
            <TextSmall>{stringsoflanguages.LastUpdate}</TextSmall>
            <TextMed>
              {changeUnixDateFormat(lastSubmissionDate, global.dateTimeFormat)}
            </TextMed>
          </View>
          <GapV />
          <DividerV />
          <GapV />

          <TextLarge>{stringsoflanguages.DriverInfo}</TextLarge>
          <GapV />
          <View style={styles.row}>
            <TextSmall>{stringsoflanguages.DriverName}</TextSmall>
            <TextMed>{driver?.name}</TextMed>
          </View>
          <View style={styles.row}>
            <TextSmall>{stringsoflanguages.PhoneNo}</TextSmall>
            <TextMed>{`${driver?.countryCode + driver?.mobile}`}</TextMed>
          </View>
          <GapV />
          <DividerV />
          <GapV />

          <TextLarge>{stringsoflanguages.VehicleInfo}</TextLarge>
          <GapV />
          <View style={styles.row}>
            <TextSmall>{stringsoflanguages.VehiclePlate}</TextSmall>
            <TextMed>{vehicle?.plate}</TextMed>
          </View>
          <View style={styles.row}>
            <TextSmall>{stringsoflanguages.VehicleBrand}</TextSmall>
            <TextMed>{vehicle?.make}</TextMed>
          </View>
          <View style={styles.row}>
            <TextSmall>{stringsoflanguages.TrailerPlate}</TextSmall>
            <TextMed>{trailer?.plate}</TextMed>
          </View>
          <GapV />
        </Animated.View>
      </KeyboardAwareScrollView>
    </Modal>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  modal: {
    // flex: 1,
    backgroundColor: colors.TransperantBlack,
  },
  modalcontainer: {
    // flexGrow: 1,
    paddingHorizontal: RFValue(10),
    paddingTop: RFValue(70),
    paddingBottom: RFValue(10),
  },
  ModelViewContainer: {
    // flex: 1,
    backgroundColor: colors.White,
    paddingHorizontal: RFValue(20),
    paddingVertical: RFValue(20),
    borderRadius: RFValue(20),
  },
  iconBtn: {
    alignSelf: "flex-end",
  },
  row: { flexDirection: "row" },
});
