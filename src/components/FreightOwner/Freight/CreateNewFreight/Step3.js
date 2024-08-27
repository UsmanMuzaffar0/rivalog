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
import { compareAsc, formatISO } from "date-fns";
import stringsoflanguages from "../../../../Localization/stringsoflanguages";

import { global } from "../../../../common/global";
import {
  TextField2,
  TextFieldWithIcon2,
} from "../../../../common/Component/TextField";
import { DatePickerButton2 } from "../../../../common/Component/DatePickerButton";
import { ScrollView } from "react-native-gesture-handler";
import Button from "../../../../common/Component/Button";
import Api from "../../../../common/Api";
import { Formik } from "formik";
import * as Yup from "yup";
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";
import { GapV } from "../../../../common/Component/gap";
import {
  TextMed,
  TextMuted,
  TextLarge,
} from "../../../../common/Component/Text";
import NetChecker2 from "../../../../common/Component/Network";
import {
  changeDateFormat,
  combineDateTime,
  getUnixTimeStamp,
} from "../../../../common/Utils/date";
import Loader from "../../../../common/Component/Loader";

const validationSchema = Yup.object().shape({
  uploadDate: Yup.date()
    .required(stringsoflanguages.UploadDateRequired)
    .label(stringsoflanguages.UploadDate),
  loadingTime: Yup.date()
    .required(stringsoflanguages.LoadingTimeRequired)
    .label(stringsoflanguages.LoadingTime),
  arrivalDate: Yup.date()
    .required(stringsoflanguages.ArrivalDateRequired)
    // .test(
    //   "arrivalDateTest",
    //   "Arrival Date cannot be less than Upload Date",
    //   function (arrivalDate) {
    //     const { uploadDate } = this.parent;
    //     if (compareAsc(arrivalDate, uploadDate) === -1) {
    //       console.log(arrivalDate.toDateString(), uploadDate.toDateString());
    //       if (arrivalDate.toDateString() === uploadDate?.toDateString())
    //         return true;
    //       return false;
    //     }
    //     return true;
    //   }
    // )
    .label(stringsoflanguages.ArrivalDate),
  timeOfArrival: Yup.date()
    .required(stringsoflanguages.ArrivalTimeRequired)
    .test(
      "timeOfArrivalTest",
      "Time of Arrival cannot be less than Loading Time",
      function (timeOfArrival) {
        const { loadingTime, uploadDate, arrivalDate } = this.parent;
        if (
          compareAsc(
            combineDateTime(arrivalDate, timeOfArrival),
            combineDateTime(uploadDate, loadingTime)
          ) === -1
        ) {
          return false;
        }
        return true;
      }
    )
    .label(stringsoflanguages.ArrivalTime),
});

export default function CreateFreightStep3(props) {
  const title = props?.route?.params?.title;
  const prevData = JSON.parse(props?.route?.params?.data);
  const cityDistanceMatrix = props?.route?.params?.cityDistanceMatrix;
  const [loading, setLoading] = useState(false);

  const onSubmitHandler = (values) => {
    const data = {
      plannedDepartureDate: getUnixTimeStamp(
        combineDateTime(values.uploadDate, values.loadingTime)
      ),
      plannedArrivalDate: getUnixTimeStamp(
        combineDateTime(values.arrivalDate, values.timeOfArrival)
      ),
      // uploadDate: values.uploadDate,
      // loadingTime: values.loadingTime,
      // arrivalDate: values.arrivalDate,
      // timeOfArrival: values.timeOfArrival,
      ...prevData,
    };

    // navigate
    props.navigation.navigate("CreateFreightStep4", {
      data: JSON.stringify(data),
    });
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
        {/* 
          uploadDate
          arrivalDate
          loadingTime
          timeOfArrival
        */}

        <Formik
          initialValues={{
            uploadDate: null,
            loadingTime: null,
            arrivalDate: null,
            timeOfArrival: null,
          }}
          onSubmit={(values) => onSubmitHandler(values)}
          validationSchema={validationSchema}
        >
          {({
            handleChange,
            handleBlur,
            handleSubmit,
            values,
            touched,
            errors,
            isValid,
            setFieldTouched,
            setFieldValue,
          }) => {
            const getDistanceMatrix = async (date) => {
              setLoading(true);
              if (!(await NetChecker2())) return;
              if (cityDistanceMatrix) {
                let param = {
                  fromCityId: prevData?.fromAddress?.city?.cityId,
                  toCityId: prevData?.toAddress?.city?.cityId,
                  date: getUnixTimeStamp(date),
                };
                let res = await Api.GetDistanceMatrix(param);
                if (res[1] === 200) {
                  const arrivalDate = res[0]?.arrivalDate;
                  if (arrivalDate) {
                    setFieldValue("arrivalDate", new Date(arrivalDate));
                    if (values.loadingTime)
                      // if time is also selected
                      setFieldValue("timeOfArrival", new Date(arrivalDate));
                  }
                } else {
                  alert(stringsoflanguages.Alert);
                }
              }
              setLoading(false);
            };

            useEffect(() => {
              const effect = async () => {
                if (values.uploadDate && values.loadingTime)
                  return getDistanceMatrix(
                    combineDateTime(values.uploadDate, values.loadingTime)
                  );
                if (values.uploadDate)
                  return getDistanceMatrix(values.uploadDate);
              };

              effect();
            }, [values.uploadDate, values.loadingTime]);

            return (
              <ScrollView showsVerticalScrollIndicator={false}>
                <View
                  style={{
                    flex: 1,
                    marginTop: RFValue(10),
                    paddingHorizontal: RFValue(20),
                  }}
                >
                  <TextLarge style={styles.subTitle}>
                    {stringsoflanguages.DateAndTime}
                  </TextLarge>

                  <View
                    style={{
                      padding: RFValue(10),
                      backgroundColor: colors.White,
                      marginVertical: RFValue(20),
                    }}
                  >
                    <TextMed
                      style={styles.boxText}
                    >{`${stringsoflanguages.TotalDistance} : ${prevData?.distanceMatrix?.distance} ${prevData?.distanceMatrix?.unit?.description}`}</TextMed>
                    <TextMed style={styles.boxText}>{`${
                      stringsoflanguages.Estimation
                    } : ${
                      prevData?.distanceMatrix?.day
                        ? prevData?.distanceMatrix?.day + " day "
                        : ""
                    }${
                      prevData?.distanceMatrix?.hour
                        ? prevData?.distanceMatrix?.hour + " hours "
                        : ""
                    }${
                      prevData?.distanceMatrix?.minute
                        ? prevData?.distanceMatrix?.minute + " minutes"
                        : ""
                    }`}</TextMed>
                  </View>

                  <DatePickerButton2
                    onChange={(v) => {
                      setFieldValue("uploadDate", v);
                    }}
                    title={stringsoflanguages.UploadData}
                    placeholder={stringsoflanguages.SelectUploadDate}
                    stateDate={values.uploadDate}
                  />
                  {touched.uploadDate && errors.uploadDate && (
                    <Text style={styles.errorText}>{errors.uploadDate}</Text>
                  )}

                  <DatePickerButton2
                    onChange={(v) => {
                      setFieldValue("loadingTime", v);
                    }}
                    title={stringsoflanguages.LoadingTime}
                    placeholder={stringsoflanguages.SelectLoadingTime}
                    stateDate={values.loadingTime}
                    format={global.timeFormat}
                    mode="time"
                    icon={"clock"}
                  />
                  {touched.loadingTime && errors.loadingTime && (
                    <Text style={styles.errorText}>{errors.loadingTime}</Text>
                  )}

                  <DatePickerButton2
                    onChange={(v) => {
                      setFieldValue("arrivalDate", v);
                    }}
                    title={stringsoflanguages.ArrivalDate}
                    placeholder={stringsoflanguages.SelectArrivalDate}
                    stateDate={values.arrivalDate}
                    disabled={!values.uploadDate}
                    minDate={values.uploadDate}
                  />
                  {touched.arrivalDate && errors.arrivalDate && (
                    <Text style={styles.errorText}>{errors.arrivalDate}</Text>
                  )}

                  <DatePickerButton2
                    onChange={(v) => {
                      setFieldValue("timeOfArrival", v);
                    }}
                    title={stringsoflanguages.TimeOfArrival}
                    placeholder={stringsoflanguages.SelectTimeOfArrival}
                    stateDate={values.timeOfArrival}
                    format={global.timeFormat}
                    disabled={!values.loadingTime}
                    mode="time"
                    icon={"clock"}
                  />
                  {touched.timeOfArrival && errors.timeOfArrival && (
                    <Text style={styles.errorText}>{errors.timeOfArrival}</Text>
                  )}

                  <TextMuted>{stringsoflanguages.OneStepLeft}</TextMuted>

                  <Button
                    onPress={handleSubmit}
                    border={false}
                    name={stringsoflanguages.Continue}
                  />
                  <Button
                    onPress={() => {
                      props.navigation.goBack();
                    }}
                    border={true}
                    name={stringsoflanguages.TurnBack}
                  />
                  {/* <Button border={true} name={"Cancel"} /> */}
                  <GapV />
                </View>
              </ScrollView>
            );
          }}
        </Formik>
      </KeyboardAwareScrollView>
      <Loader visible={loading} />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  subTitle: {
    textAlign: "center",
  },

  boxText: {
    textAlign: "center",
  },

  errorText: {
    fontSize: RFPercentage(1.3),
    fontFamily: Fonts.Medium,
    color: colors.Red,
    top: RFValue(-10),
  },

  addNew: {
    backgroundColor: colors.LimeGreen,
    borderRadius: RFValue(8),
    height: RFValue(35),
    justifyContent: "center",
  },

  addNewText: {
    paddingHorizontal: RFValue(10),
    fontSize: RFValue(12),
    fontFamily: Fonts.Medium,
    color: colors.White,
  },
});
