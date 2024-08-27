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
import stringsoflanguages from "../../../../Localization/stringsoflanguages";

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
import {
  TextSmall,
  TextMed,
  TextMuted,
  TextLarge,
} from "../../../../common/Component/Text";
import NetChecker2 from "../../../../common/Component/Network";
import Loader from "../../../../common/Component/Loader";
import { global } from "../../../../common/global";
import { changeDateFormat } from "../../../../common/Utils/date";
import { showFailure, showSucces } from "../../../../common/Utils/flashMessage";
import moment from "moment";

export default function PreiviewFreight(props) {
  const title = props?.route?.params?.title;
  const prevData = JSON.parse(props?.route?.params?.data);
  const viewData = { ...prevData };
  let removeEmptyValues = Object.fromEntries(
    Object.entries(prevData).filter(([_, v]) => v != "" && v != null)
  );
  const {
    description,
    trailerType,
    floorType,
    specificationList,
    plannedArrivalDate,
    plannedDepartureDate,
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
    note,
  } = viewData;

  const [loading, setLoading] = useState(false);
  const { data: CreateFreightResponse } = useSelector(
    (state) => state.CreateFreight
  );

  const dispatch = useDispatch();

  //   useEffect(() => {
  //     console.log(CreateFreightResponse);
  //     if (CreateFreightResponse) {
  //       if (CreateFreightResponse[1] === 200) {
  //         showSucces({
  //           description: "Freight Created Successfully",
  //           onHide: () => {
  //             setTimeout(() => {
  //               props.navigation.reset({
  //                 index: 0,
  //                 routes: [{ name: "Home" }],
  //               });
  //             }, 4000);
  //           },
  //         });
  //       } else alert("Create Freight Failed");
  //     }
  //     setLoading(false);
  //   }, [CreateFreightResponse]);

  const onSubmitHandler = () => {
    // setLoading(true);
    // dispatch(CreateFreightAction(prevData));

    try {
      handleCreateFreightApi();
    } catch (e) {}
  };

  const handleCreateFreightApi = async () => {
    setLoading(true);
    if (!(await NetChecker2())) return;
    console.log("Create Freight",JSON.stringify(removeEmptyValues))
    const res = await Api.createFreight(JSON.stringify(removeEmptyValues));
    if (!res) return;
    // console.log(JSON.stringify(prevData, null, 2));
    console.log("Create Freight",res)
    if (res?.[1] === 200) {
      showSucces({
        description: stringsoflanguages.FreightCreatedSuccessfully,
        onHide: () => {
          setTimeout(() => {
       
          });
        },
      });
      props.navigation.reset({
        index: 0,
        routes: [{ name: "Home" }],
      });
    } else
      showFailure({
        title: stringsoflanguages.CreateFreightFailed,
        description: res?.[1],
      });
    console.log(JSON.stringify(res, null, 2));

    setLoading(false);
  };

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
            {stringsoflanguages.VehicleOption}
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
                {stringsoflanguages.UploadData}
              </TextMed>
              <TextMuted style={[styles.subTitle]}>
                {moment(plannedDepartureDate).format("DD/MMM/YYYY")}
              </TextMuted>

              <TextMed style={[styles.title]}>
                {stringsoflanguages.ArrivalDate}
              </TextMed>
              <TextMuted style={[styles.subTitle]}>
                {moment(plannedArrivalDate).format("DD/MMM/YYYY")}
              </TextMuted>
            </View>

            <View style={styles.rightBox}>
              <TextMed style={[styles.title]}>
                {stringsoflanguages.LoadingTime}
              </TextMed>
              <TextMuted style={[styles.subTitle]}>
                {moment(plannedDepartureDate).format("HH:mm A")}
              </TextMuted>

              <TextMed style={[styles.title]}>
                {stringsoflanguages.TimeOfArrival}
              </TextMed>
              <TextMuted style={[styles.subTitle]}>
                {moment(plannedArrivalDate).format("HH:mm A")}
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

              <TextMed style={[styles.title]}>
                {stringsoflanguages.Note}
              </TextMed>
              <TextMuted style={[styles.subTitle]}>{note}</TextMuted>
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

          <Button
            onPress={onSubmitHandler}
            border={false}
            name={stringsoflanguages.Save}
          />

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
