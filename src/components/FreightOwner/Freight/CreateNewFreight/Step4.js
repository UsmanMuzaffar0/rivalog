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
import CheckBox from "@react-native-community/checkbox";
import stringsoflanguages from "../../../../Localization/stringsoflanguages";

import {
  TextField2,
  TextFieldWithIcon2,
} from "../../../../common/Component/TextField";
import { DatePickerButton2 } from "../../../../common/Component/DatePickerButton";
import { ScrollView } from "react-native-gesture-handler";
import Button from "../../../../common/Component/Button";
import { useDispatch, useSelector } from "react-redux";
import {
  GetCurrencyListAction,
  GetPackagingTypeAction,
  GetFreightContentTypeListAction,
  GetLoadingTypeAction,
  GetGtipListAction,
} from "../../../../Redux/actions";
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
import {
  RegexIsDigit,
  RegexisValidNumber,
} from "../../../../common/Utils/regex";
import Loader from "../../../../common/Component/Loader";

const validationSchema = Yup.object().shape({
  // value: Yup.string()
  //   .required(stringsoflanguages.ValueRequired)
  //   .label(stringsoflanguages.Value),
  // currency: Yup.string()
  //   .required(stringsoflanguages.CurrencyRequired)
  //   .label(stringsoflanguages.Currency),
  freightContentType: Yup.string()
    .required(stringsoflanguages.FreightContentTypeRequired)
    .label(stringsoflanguages.FreightContentType),
  // packagingType: Yup.string()
  //   .required(stringsoflanguages.PackagingTypeRequired)
  //   .label(stringsoflanguages.PackagingType),
  // loadingType: Yup.string()
  //   .required(stringsoflanguages.LoadingTypeRequired)
  //   .label(stringsoflanguages.LoadingType),
  gtip: Yup.string()
    .required(stringsoflanguages.GtipRequired)
    .label(stringsoflanguages.Gtip),
  // lengthValue: Yup.string()
  //   .required(stringsoflanguages.LenghtRequired)
  //   .label(stringsoflanguages.Lenght),
  // width: Yup.string()
  //   .required(stringsoflanguages.WidthRequired)
  //   .label(stringsoflanguages.Width),
  // height: Yup.string()
  //   .required(stringsoflanguages.HeightRequired)
  //   .label(stringsoflanguages.Height),
  // gross: Yup.string()
  //   .required(stringsoflanguages.GrossRequired)
  //   .label(stringsoflanguages.Gross),
  // note: Yup.string()
  //   .required(stringsoflanguages.EnterNote)
  //   .label(stringsoflanguages.Note),
});

export default function CreateFreightStep4(props) {
  const title = props?.route?.params?.title;
  const prevData = JSON.parse(props?.route?.params?.data);
  const [currencyValue, setCurrencyValue] = useState(null);
  const [currencyValueModal, setCurrencyValueModal] = useState(false);
  const [freightContentTypeValue, setFreightContentTypeValue] = useState(null);
  const [freightContentTypeModal, setFreightContentTypeModal] = useState(false);
  const [packagingTypeValue, setPackagingTypeValue] = useState(null);
  const [packagingTypeModal, setPackagingTypeModal] = useState(false);
  const [loadingTypeValue, setLoadingTypeValue] = useState(null);
  const [loadingTypeModal, setLoadingTypeModal] = useState(false);
  const [gtipListValue, setGtipListValue] = useState(null);
  const [gtipListModal, setGtipListModal] = useState(false);
  const [loading, setLoading] = useState(false);

  const dispatch = useDispatch();
  const { data: GetCurrencyListData, loader: currencyLoader } = useSelector(
    (state) => state.GetCurrencyList
  );
  const { data: GetFreightContentTypeListData, loader: freightContentLoader } =
    useSelector((state) => state.GetFreightContentTypeList);
  const { data: GetPackagingTypeData, loader: packagingTypeLoader } =
    useSelector((state) => state.GetPackagingType);
  const { data: GetLoadingTypeData, loader: loadingTypeLoader } = useSelector(
    (state) => state.GetLoadingType
  );
  const { data: GetGtipListData } = useSelector((state) => state.GetGtipList);

  useEffect(() => {
    dispatch(GetCurrencyListAction());
    dispatch(GetFreightContentTypeListAction("", 0, 30));
    dispatch(GetPackagingTypeAction("", 0, 100));
    dispatch(GetLoadingTypeAction("", 0, 100));
    dispatch(GetGtipListAction("", 0, 30));

    return () => {};
  }, []);

  useEffect(() => {
    if (
      currencyLoader ||
      freightContentLoader ||
      packagingTypeLoader ||
      loadingTypeLoader
    )
      setLoading(true);
    else setLoading(false);
  }, [
    currencyLoader,
    freightContentLoader,
    packagingTypeLoader,
    loadingTypeLoader,
  ]);

  const onSubmitHandler = (values) => {
    const data = {
      valueCurrency: currencyValue,
      harmonizedSystemCode: gtipListValue,
      freightLoadingType: loadingTypeValue,
      freightPackageType: packagingTypeValue,
      freightContentType: freightContentTypeValue,
      value: parseInt(values.value),
      weight: parseInt(values.gross),
      width: parseInt(values.width),
      height: parseInt(values.height),
      length: parseInt(values.lengthValue),
      desi: parseInt(values.desi),
      ldm: parseInt(values.ldm),
      note: values.note,
      flammable: values.adr1 ? "Y" : "N",
      stackable: values.stackable ? "Y" : "N",
      ...prevData,
    };

    // navigate
    props.navigation.navigate("PreviewCreateFreight", {
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
        <Formik
          initialValues={{
            value: "",
            currency: "",
            freightContentType: "",
            packagingType: "",
            loadingType: "",
            gtip: "",
            lengthValue: "",
            width: "",
            height: "",
            gross: "",
            desi: "",
            ldm: "",
            note: "",
            adr1: false,
            stackable: false,
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
                <TextLarge style={styles.subTitle}>
                  {stringsoflanguages.GoodsInfo}
                </TextLarge>

                <TextField2
                  name={stringsoflanguages.Value}
                  value={values.value}
                  placeholder={stringsoflanguages.EnterValue}
                  keyboardType={"decimal-pad"}
                  backgroundColor={colors.silverLight}
                  // regex={RegexisValidNumber}
                  onChange={handleChange("value")}
                  onBlur={() => setFieldTouched("value")}
                />
                {touched.value && errors.value && (
                  <Text style={styles.errorText}>{errors.value}</Text>
                )}

                {/* Currency */}
                <TextFieldWithIcon2
                  name={stringsoflanguages.Currency}
                  editable={false}
                  value={values.currency}
                  placeholder={stringsoflanguages.SelectCurrency}
                  backgroundColor={colors.silverLight}
                  onPress={() => setCurrencyValueModal(true)}
                  styles={{ justifyContent: "space-between", zIndex: 1 }}
                  onClick={() => setCurrencyValueModal(false)}
                  cModal={currencyValueModal}
                  modalData={
                    (GetCurrencyListData && GetCurrencyListData[0]) || []
                  }
                  showValue={["description"]}
                  setModalValue={(e) => {
                    setCurrencyValue(e);
                    setFieldValue("currency", e.description);
                  }}
                />
                {touched.currency && errors.currency && (
                  <Text style={styles.errorText}>{errors.currency}</Text>
                )}

                <DividerV />
                <GapV large />

                {/* Freight Content Type */}
                <TextFieldWithIcon2
                  onSearch={(v) => {
                    dispatch(GetFreightContentTypeListAction(v, 0, 20));
                  }}
                  name={stringsoflanguages.FreightContentType}
                  editable={false}
                  value={values.freightContentType}
                  placeholder={stringsoflanguages.SelectFreightContentType}
                  backgroundColor={colors.silverLight}
                  onPress={() => setFreightContentTypeModal(true)}
                  styles={{ justifyContent: "space-between", zIndex: 1 }}
                  onClick={() => setFreightContentTypeModal(false)}
                  cModal={freightContentTypeModal}
                  modalData={
                    (GetFreightContentTypeListData &&
                      GetFreightContentTypeListData[0]) ||
                    []
                  }
                  showValue={["description"]}
                  setModalValue={(e) => {
                    console.log(e);
                    setFreightContentTypeValue(e);
                    setFieldValue("freightContentType", e.description);
                  }}
                />
                {touched.freightContentType && errors.freightContentType && (
                  <Text style={styles.errorText}>
                    {errors.freightContentType}
                  </Text>
                )}

                {/* Packaging Type */}
                <TextFieldWithIcon2
                  name={stringsoflanguages.PackagingType}
                  editable={false}
                  value={values.packagingType}
                  placeholder={stringsoflanguages.SelectPackagingType}
                  backgroundColor={colors.silverLight}
                  onPress={() => setPackagingTypeModal(true)}
                  styles={{ justifyContent: "space-between", zIndex: 1 }}
                  onClick={() => setPackagingTypeModal(false)}
                  cModal={packagingTypeModal}
                  modalData={
                    (GetPackagingTypeData && GetPackagingTypeData[0]) || []
                  }
                  showValue={["description"]}
                  setModalValue={(e) => {
                    setPackagingTypeValue(e);
                    setFieldValue("packagingType", e.description);
                  }}
                />
                {touched.packagingType && errors.packagingType && (
                  <Text style={styles.errorText}>{errors.packagingType}</Text>
                )}

                {/* Loading Type */}
                <TextFieldWithIcon2
                  name={stringsoflanguages.LoadingType}
                  editable={false}
                  value={values.loadingType}
                  placeholder={stringsoflanguages.SelectLoadingType}
                  backgroundColor={colors.silverLight}
                  onPress={() => setLoadingTypeModal(true)}
                  styles={{ justifyContent: "space-between", zIndex: 1 }}
                  onClick={() => setLoadingTypeModal(false)}
                  cModal={loadingTypeModal}
                  modalData={
                    (GetLoadingTypeData && GetLoadingTypeData[0]) || []
                  }
                  showValue={["description"]}
                  setModalValue={(e) => {
                    setLoadingTypeValue(e);
                    setFieldValue("loadingType", e.description);
                  }}
                />
                {touched.loadingType && errors.loadingType && (
                  <Text style={styles.errorText}>{errors.loadingType}</Text>
                )}

                {/* Gtip(Hs Code) */}
                {console.log("Gtip(Hs Code",GetGtipListData)}
                <TextFieldWithIcon2
                  name={stringsoflanguages.GripCode}
                  editable={false}
                  value={values.gtip}
                  placeholder={stringsoflanguages.SearchGtip}
                  backgroundColor={colors.silverLight}
                  onPress={() => setGtipListModal(true)}
                  styles={{ justifyContent: "space-between", zIndex: 1 }}
                  onClick={() => setGtipListModal(false)}
                  cModal={gtipListModal}
                  modalData={(GetGtipListData && GetGtipListData[0]) || []}
                  showValue={["code", "description"]}
                  onSearch={(v) => {
                    dispatch(GetGtipListAction(v, 0, 20));
                  }}
                  setModalValue={(e) => {
                    setGtipListValue(e);
                    setFieldValue("gtip", e.description);
                  }}
                />
                {touched.gtip && errors.gtip && (
                  <Text style={styles.errorText}>{errors.gtip}</Text>
                )}

                <DividerV />
                <GapV large />

                <TextField2
                  name={stringsoflanguages.LengthValue}
                  placeholder={stringsoflanguages.EnterLenghtValue}
                  value={values.lengthValue}
                  // regex={RegexIsDigit}
                  backgroundColor={colors.silverLight}
                  onChange={handleChange("lengthValue")}
                  onBlur={() => setFieldTouched("lengthValue")}
                  keyboardType={"decimal-pad"}
                />
                {touched.lengthValue && errors.lengthValue && (
                  <Text style={styles.errorText}>{errors.lengthValue}</Text>
                )}

                <TextField2
                  name={stringsoflanguages.WidhtValue}
                  placeholder={stringsoflanguages.EnterWidthValue}
                  value={values.width}
                  // regex={RegexIsDigit}
                  backgroundColor={colors.silverLight}
                  onChange={handleChange("width")}
                  onBlur={() => setFieldTouched("width")}
                  keyboardType={"decimal-pad"}
                />
                {touched.width && errors.width && (
                  <Text style={styles.errorText}>{errors.width}</Text>
                )}

                <TextField2
                  name={stringsoflanguages.HeightValue}
                  placeholder={stringsoflanguages.EnterHeightValue}
                  // regex={RegexIsDigit}
                  backgroundColor={colors.silverLight}
                  onChange={handleChange("height")}
                  onBlur={() => setFieldTouched("height")}
                  keyboardType={"decimal-pad"}
                />
                {touched.height && errors.height && (
                  <Text style={styles.errorText}>{errors.height}</Text>
                )}

                <TextField2
                  name={stringsoflanguages.GrossKG}
                  placeholder={stringsoflanguages.EnterWeight}
                  value={values.gross}
                  // regex={RegexIsDigit}
                  backgroundColor={colors.silverLight}
                  onChange={handleChange("gross")}
                  onBlur={() => setFieldTouched("gross")}
                  keyboardType={"decimal-pad"}
                />
                {touched.gross && errors.gross && (
                  <Text style={styles.errorText}>{errors.gross}</Text>
                )}

                <TextField2
                  name={stringsoflanguages.Desi}
                  placeholder={stringsoflanguages.EnterDesiValue}
                  value={values.desi}
                  // regex={RegexIsDigit}
                  backgroundColor={colors.silverLight}
                  onChange={handleChange("desi")}
                  onBlur={() => setFieldTouched("desi")}
                  keyboardType={"decimal-pad"}
                />
                {touched.desi && errors.desi && (
                  <Text style={styles.errorText}>{errors.desi}</Text>
                )}

                <TextField2
                  name={stringsoflanguages.LDM}
                  placeholder={stringsoflanguages.EnterLDMValue}
                  value={values.ldm}
                  // regex={RegexIsDigit}
                  backgroundColor={colors.silverLight}
                  onChange={handleChange("ldm")}
                  onBlur={() => setFieldTouched("ldm")}
                  keyboardType={"decimal-pad"}
                />
                {touched.ldm && errors.ldm && (
                  <Text style={styles.errorText}>{errors.ldm}</Text>
                )}
                <TextField2
                  name={stringsoflanguages.Note}
                  placeholder={stringsoflanguages.EnterNote}
                  value={values.note}
                  backgroundColor={colors.silverLight}
                  onChange={handleChange("note")}
                  onBlur={() => setFieldTouched("note")}
                />
                {touched.note && errors.note && (
                  <Text style={styles.errorText}>{errors.note}</Text>
                )}

                <View style={styles.checkboxView}>
                  <CheckBox
                    value={values.adr1}
                    onChange={() => {
                      setFieldValue("adr1", !values.adr1);
                    }}
                  />
                  <TextSmall style={styles.textcheckBox}>
                    {stringsoflanguages.ProductContainingADR1}
                  </TextSmall>
                </View>

                <View style={styles.checkboxView}>
                  <CheckBox
                    value={values.stackable}
                    onChange={() => {
                      setFieldValue("stackable", !values.stackable);
                    }}
                  />
                    <TextSmall style={styles.textcheckBox}>{stringsoflanguages.Stackable}</TextSmall>
                </View>

                <GapV />

                <TextMuted>{stringsoflanguages.LastStep}</TextMuted>

                <Button
                  onPress={handleSubmit}
                  border={false}
                  name={stringsoflanguages.PreviewInfo}
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
          )}
        </Formik>
      </KeyboardAwareScrollView>
      <Loader visible={loading} />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  subTitle: {
    textAlign: "center",
    marginVertical: RFValue(10),
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
  checkboxView: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom:RFValue(10)
  },
  textcheckBox:{
    marginLeft: RFValue(5),
    fontSize: RFValue(14),
    fontFamily: Fonts.Medium,
    color: colors.Black
  }
});
