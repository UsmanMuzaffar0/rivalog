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
import React, { useEffect, useState } from "react";
import { HeaderWithNotification } from "../../../../common/Component/Header";
import { Style } from "../../../../common/Style";
import * as colors from "../../../../common/colors";
import * as Fonts from "../../../../common/fonts";
import { RFPercentage, RFValue } from "react-native-responsive-fontsize";

import {
  TextField2,
  TextFieldWithIcon2,
} from "../../../../common/Component/TextField";
import { ScrollView } from "react-native-gesture-handler";
import Button from "../../../../common/Component/Button";
import { useDispatch, useSelector } from "react-redux";
import {
  AddNewInvoiceAddress,
  GetTrailerTypeListAction,
  GetTrailerFloorTypeListAction,
  GetFreightTypeList,
  GetAddressList,
  CreateFreightAction,
} from "../../../../Redux/actions";
import Api from "../../../../common/Api";
import { Formik } from "formik";
import * as Yup from "yup";
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";
import { DividerV, GapV } from "../../../../common/Component/gap";
import stringsoflanguages from "../../../../Localization/stringsoflanguages";
import {
  TextSmall,
  TextMed,
  TextMuted,
  TextLarge,
} from "../../../../common/Component/Text";
import NetChecker2 from "../../../../common/Component/Network";
import Loader from "../../../../common/Component/Loader";
import { global } from "../../../../common/global";
import {
  changeDateFormat,
  changeUnixDateFormat,
} from "../../../../common/Utils/date";
import { showFailure, showSucces } from "../../../../common/Utils/flashMessage";
import { format } from "date-fns";

export default function ViewFreight(props) {
  const title = props?.route?.params?.title;
  const freight = JSON.parse(props?.route?.params?.freight);
  const {
    description,
    trailerType,
    floorType,
    specificationList,
    uploadDate,
    loadingTime,
    arrivalDate,
    timeOfArrival,
    fromAddress,
    toAddress,
    value,
    valueCurrency,
    freightPackageType,
    freightLoadingType,
    harmonizedSystemCode,
    length,
    width,
    weight,
    height,
    desi,
    ldm,
    flammable,
    stackable,
    plannedDepartureDate,
    plannedArrivalDate,
  } = freight;

  const [loading, setLoading] = useState(false);

  return (
    <SafeAreaView style={Style.mainView}>
      <StatusBar
        animated={false}
        backgroundColor={colors.WhiteSmoke}
        barStyle={"dark-content"}
      />
      <HeaderWithNotification
        Title={title}
        BackAction={props.navigation.goBack}
        back
      />
      <KeyboardAwareScrollView showsVerticalScrollIndicator={false}>
        {/* <ScrollView showsVerticalScrollIndicator={false}> */}
        <View
          style={{
            flex: 1,
            marginTop: RFValue(10),
            paddingHorizontal: RFValue(20),
          }}
        >
          {/* VEHICLE OPTIONS */}
          <TextLarge style={styles.infoTitle}>
            {stringsoflanguages.VehicleOptions}
          </TextLarge>
          <View style={styles.boxContainer}>
            <View style={styles.leftBox}>
              <TextMed style={[styles.title]}>
                {stringsoflanguages.LoadDescription}
              </TextMed>
              <TextMuted style={[styles.subTitle]}>{description}</TextMuted>

              <TextMed style={[styles.title]}>
                {stringsoflanguages.FloorType}
              </TextMed>
              <TextMuted style={[styles.subTitle]}>
                {floorType?.description}
              </TextMuted>
            </View>

            <View style={styles.rightBox}>
              <TextMed style={[styles.title]}>
                {stringsoflanguages.TrailerType}
              </TextMed>
              <TextMuted style={[styles.subTitle]}>
                {trailerType?.description}
              </TextMuted>

              <TextMed style={[styles.title]}>
                {stringsoflanguages.TrailerCustomization}
              </TextMed>
              <TextMuted style={[styles.subTitle]}>
                {specificationList?.map((item) => item?.description + " ")}
              </TextMuted>
            </View>
          </View>
          <DividerV />

          {/* Date and Time */}
          <TextLarge style={styles.infoTitle}>
            {stringsoflanguages.DateAndTime}
          </TextLarge>
          <View style={styles.boxContainer}>
            <View style={styles.leftBox}>
              <TextMed style={[styles.title]}>
                {stringsoflanguages.UploadDate}
              </TextMed>
              <TextMuted style={[styles.subTitle]}>
                {changeUnixDateFormat(new Date(plannedDepartureDate))}
              </TextMuted>

              <TextMed style={[styles.title]}>
                {stringsoflanguages.ArivalDate}
              </TextMed>
              <TextMuted style={[styles.subTitle]}>
                {changeUnixDateFormat(new Date(plannedArrivalDate))}{" "}
              </TextMuted>
            </View>

            <View style={styles.rightBox}>
              <TextMed style={[styles.title]}>
                {stringsoflanguages.LoadingTime}
              </TextMed>
              <TextMuted style={[styles.subTitle]}>
                {changeUnixDateFormat(
                  new Date(plannedDepartureDate),
                  global.timeFormat
                )}
              </TextMuted>

              <TextMed style={[styles.title]}>
                {stringsoflanguages.TimeOfArrival}
              </TextMed>
              <TextMuted style={[styles.subTitle]}>
                {changeUnixDateFormat(
                  new Date(plannedArrivalDate),
                  global.timeFormat
                )}
              </TextMuted>
            </View>
          </View>
          <DividerV />

          {/* Address Preferences */}
          <TextLarge style={styles.infoTitle}>
            {stringsoflanguages.AddressPreferences}
          </TextLarge>
          <View style={styles.boxContainer}>
            <View style={styles.leftBox}>
              <TextMed style={[styles.title]}>
                {stringsoflanguages.UplaodAddress}
              </TextMed>
              <TextMuted style={[styles.subTitle]}>
                {fromAddress?.description}
              </TextMuted>
            </View>

            <View style={styles.rightBox}>
              <TextMed style={[styles.title]}>
                {stringsoflanguages.ArrivalAddress}
              </TextMed>
              <TextMuted style={[styles.subTitle]}>
                {toAddress?.description}
              </TextMuted>
            </View>
          </View>
          <DividerV />

          {/* Good Information */}
          <TextLarge style={styles.infoTitle}>
            {stringsoflanguages.GoodInformation}
          </TextLarge>
          <View style={styles.boxContainer}>
            <View style={styles.leftBox}>
              <TextMed style={[styles.title]}>
                {stringsoflanguages.Value}
              </TextMed>
              <TextMuted style={[styles.subTitle]}>{value}</TextMuted>

              <TextMed style={[styles.title]}>
                {stringsoflanguages.PackagingType}
              </TextMed>
              <TextMuted style={[styles.subTitle]}>
                {freightPackageType?.description}
              </TextMuted>

              <TextMed style={[styles.title]}>
                {stringsoflanguages.GtipCode}
              </TextMed>
              <TextMuted style={[styles.subTitle]}>
                {harmonizedSystemCode?.description}
              </TextMuted>

              <TextMed style={[styles.title]}>
                {stringsoflanguages.WidthValue}
              </TextMed>
              <TextMuted style={[styles.subTitle]}>{width}</TextMuted>

              <TextMed style={[styles.title]}>
                {stringsoflanguages.GrossKG}
              </TextMed>
              <TextMuted style={[styles.subTitle]}>{weight}</TextMuted>

              <TextMed style={[styles.title]}>{stringsoflanguages.LDM}</TextMed>
              <TextMuted style={[styles.subTitle]}>{ldm}</TextMuted>

              <TextMed style={[styles.title]}>
                {stringsoflanguages.StackableProduct}
              </TextMed>
              <TextMuted style={[styles.subTitle]}>
                {stackable === "Y" ? "Yes" : "No"}
              </TextMuted>
            </View>

            <View style={styles.rightBox}>
              <TextMed style={[styles.title]}>
                {stringsoflanguages.LoadingCurrency}
              </TextMed>
              <TextMuted style={[styles.subTitle]}>
                {valueCurrency?.description}
              </TextMuted>

              <TextMed style={[styles.title]}>
                {stringsoflanguages.LoadingType}
              </TextMed>
              <TextMuted style={[styles.subTitle]}>
                {freightLoadingType?.description}
              </TextMuted>

              <TextMed style={[styles.title]}>
                {stringsoflanguages.LenghtValue}
              </TextMed>
              <TextMuted style={[styles.subTitle]}>{length}</TextMuted>

              <TextMed style={[styles.title]}>
                {stringsoflanguages.HeightValue}
              </TextMed>
              <TextMuted style={[styles.subTitle]}>{height}</TextMuted>

              <TextMed style={[styles.title]}>
                {stringsoflanguages.Desi}
              </TextMed>
              <TextMuted style={[styles.subTitle]}>{desi}</TextMuted>

              <TextMed style={[styles.title]}>
                {stringsoflanguages.ProductContainingADRI}
              </TextMed>
              <TextMuted style={[styles.subTitle]}>
                {flammable === "Y" ? "Yes" : "No"}
              </TextMuted>
            </View>
          </View>

          <GapV />
        </View>
        {/* </ScrollView> */}
      </KeyboardAwareScrollView>
      <Loader visible={loading} />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  infoTitle: {
    textAlign: "center",
    marginVertical: RFValue(10),
  },

  boxContainer: {
    flexDirection: "row",
  },

  title: {
    // fontSize: RFPercentage(2)
  },

  subTitle: {
    marginTop: RFPercentage(0.5),
    marginBottom: RFPercentage(1),
  },

  leftBox: { width: "55%" },
  rightBox: { width: "40%" },
});
