import {
  StyleSheet,
  Text,
  View,
  SafeAreaView,
  StatusBar,
  ActivityIndicator,
} from "react-native";
import React, { useEffect, useState } from "react";
import { HeaderWithNotification } from "../../../common/Component/Header";
import { Style } from "../../../common/Style";
import * as colors from "../../../common/colors";
import * as Fonts from "../../../common/fonts";
import { RFPercentage, RFValue } from "react-native-responsive-fontsize";
import { TextField2 } from "../../../common/Component/TextField";
import { ScrollView } from "react-native-gesture-handler";
import Button from "../../../common/Component/Button";
import { useDispatch, useSelector } from "react-redux";
import {
  GetCurrentCompanyInfoAction,
  UpdateCurrentCompanyInfoAction,
} from "../../../Redux/actions";
import { Formik } from "formik";
import * as Yup from "yup";
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";
import stringsoflanguages from "../../../Localization/stringsoflanguages";

export default function CompanyInfo(props) {
  const dispatch = useDispatch();

  const { data, loader } = useSelector((state) => state.GetCurrentCompanyInfo);
  const updateData = useSelector((state) => state.UpdateCurrentCompanyInfo);

  const onSubmitHandler = (values) => {
    console.log(values);
    const data = {
      taxNumber: values.taxNumber,
      web: values.website,
      taxOffice: values.freightComapnyInfo,
      phone: values.phoneNumber,
    };

    dispatch(UpdateCurrentCompanyInfoAction(data));
  };

  if (updateData.UpdateCurrentCompanyInfoSuccess) {
    alert("Updated Successfully");
  }

  const validationSchema = Yup.object().shape({
    companyName: Yup.string().required(stringsoflanguages?.CompanyNameRequired),
    taxNumber: Yup.string()
      .required(stringsoflanguages?.TaxNumberRequired)
      .label("taxNumber"),
    website: Yup.string()
      .required(stringsoflanguages?.WebsiteRequired)
      .label("website"),
    freightComapnyInfo: Yup.string().required("Freight Company is required"),
    phoneNumber: Yup.string().required(stringsoflanguages?.PhoneRequired),
  });

  useEffect(() => {
    dispatch(GetCurrentCompanyInfoAction());

    return () => {};
  }, []);

  return (
    <SafeAreaView style={Style.mainView}>
      <StatusBar
        animated={false}
        backgroundColor={colors.WhiteSmoke}
        barStyle={"dark-content"}
      />
      <HeaderWithNotification
        Title={stringsoflanguages?.CompanyInfoTitle}
        BackAction={() => props.navigation.openDrawer()}
      />
      {loader ? (
        <View
          style={{ flex: 1, justifyContent: "center", alignItems: "center" }}
        >
          <ActivityIndicator size={"large"} color={colors.LimeGreen} />
        </View>
      ) : (
        <KeyboardAwareScrollView showsVerticalScrollIndicator={false}>
          <Formik
            initialValues={{
              companyName: data[0]?.name,
              taxNumber: data[0]?.taxNumber,
              website: data[0]?.web,
              freightComapnyInfo: data[0]?.taxOffice,
              phoneNumber: data[0]?.phone,
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
            }) => (
              <ScrollView showsVerticalScrollIndicator={false}>
                <View
                  style={{
                    flex: 1,
                    marginTop: RFValue(10),
                    paddingHorizontal: RFValue(20),
                  }}
                >
                  <TextField2
                    name={stringsoflanguages?.CompanyName}
                    value={values.companyName}
                    editable={false}
                    placeholder={""}
                    backgroundColor={colors.silverLight}
                    onChange={handleChange("companyName")}
                    onBlur={() => setFieldTouched("companyName")}
                  />
                  {touched.companyName && errors.companyName && (
                    <Text style={styles.errorText}>{errors.companyName}</Text>
                  )}
                  <TextField2
                    name={stringsoflanguages?.TaxNumber}
                    value={values.taxNumber}
                    placeholder={stringsoflanguages?.TaxNumberPlaceholder}
                    backgroundColor={colors.silverLight}
                    onChange={handleChange("taxNumber")}
                    onBlur={() => setFieldTouched("taxNumber")}
                  />
                  {touched.taxNumber && errors.taxNumber && (
                    <Text style={styles.errorText}>{errors.taxNumber}</Text>
                  )}
                  <TextField2
                    name={"Freight Company Info tax"}
                    value={values.freightComapnyInfo}
                    placeholder={""}
                    backgroundColor={colors.silverLight}
                    onChange={handleChange("freightComapnyInfo")}
                    onBlur={() => setFieldTouched("freightComapnyInfo")}
                  />
                  {touched.freightComapnyInfo && errors.freightComapnyInfo && (
                    <Text style={styles.errorText}>
                      {errors.freightComapnyInfo}
                    </Text>
                  )}
                  <TextField2
                    name={stringsoflanguages?.Website}
                    value={values.website}
                    placeholder={stringsoflanguages?.WebsitePlaceholder}
                    backgroundColor={colors.silverLight}
                    onChange={handleChange("website")}
                    onBlur={() => setFieldTouched("website")}
                  />
                  {touched.website && errors.website && (
                    <Text style={styles.errorText}>{errors.website}</Text>
                  )}
                  <TextField2
                    name={stringsoflanguages?.Phone}
                    value={values.phoneNumber}
                    placeholder={stringsoflanguages?.PhonePlaceholder}
                    backgroundColor={colors.silverLight}
                    keyboardType="phone-pad"
                    onChange={handleChange("phoneNumber")}
                    onBlur={() => setFieldTouched("phoneNumber")}
                  />
                  {touched.phoneNumber && errors.phoneNumber && (
                    <Text style={styles.errorText}>{errors.phoneNumber}</Text>
                  )}

                  <Button
                    loader={updateData.loader}
                    onPress={handleSubmit}
                    border={false}
                    name={stringsoflanguages?.UpdateInformations}
                  />
                </View>
              </ScrollView>
            )}
          </Formik>
        </KeyboardAwareScrollView>
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  title: {
    fontSize: RFPercentage(2),
    fontFamily: Fonts.Medium,
    color: colors.Black,
    textAlign: "center",
    marginBottom: RFValue(20),
  },

  errorText: {
    fontSize: RFPercentage(1.3),
    fontFamily: Fonts.Medium,
    color: colors.Red,
    top: RFValue(-10),
  },
});
