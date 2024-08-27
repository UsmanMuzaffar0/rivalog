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
import { Formik, useFormik } from "formik";
import { compareAsc } from "date-fns";
import * as Yup from "yup";
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";
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
  GetTrailerSpecificationListAction,
  GetCurrencyListAction,
  GetFreightContentTypeListAction,
  GetPackagingTypeAction,
  GetLoadingTypeAction,
  GetGtipListAction,
} from "../../../../Redux/actions";
import Api from "../../../../common/Api";
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
import {
  changeDateFormat,
  changeUnixDateFormat,
  getUnixTimeStamp,
} from "../../../../common/Utils/date";
import { showFailure, showSucces } from "../../../../common/Utils/flashMessage";
import {
  RegexIsDigit,
  RegexisValidNumber,
} from "../../../../common/Utils/regex";
import { DatePickerButton2 } from "../../../../common/Component/DatePickerButton";

export default function EditFreight(props) {
  // console.log("freight", JSON.stringify(freight, null, 2));
  const freight = JSON.parse(props?.route?.params?.freight);
  const title = props?.route?.params?.title;
  const {
    description,
    trailerType,
    floorType,
    specificationList,
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
    freightType,
    freightContentType,
    ...restFreight
  } = freight;

  const [loading, setLoading] = useState(false);
  // vehicle optionso
  const [trailerModal, setTrailerModal] = useState(false);
  const [trailerCode, setTrailerCode] = useState(trailerType);
  const [floorModal, setFloorModal] = useState(false);
  const [floorCode, setFloorCode] = useState(floorType);
  const [freightTypeModal, setFreightTypeModal] = useState(false);
  const [freightTypeCode, setFreightTypeCode] = useState(freightType);
  // address pref
  const [arrivalLocationModal, setArrivalLocationModal] = useState(false);
  const [arrivalLocationValue, setArrivalLocationValue] = useState(fromAddress);
  const [loadingLocationModal, setLoadingLocationModal] = useState(false);
  const [loadingLocationValue, setLoadingLocationValue] = useState(toAddress);
  // Goods Info
  const [currencyValue, setCurrencyValue] = useState(valueCurrency);
  const [currencyValueModal, setCurrencyValueModal] = useState(false);
  const [packagingTypeValue, setPackagingTypeValue] =
    useState(freightPackageType);
  const [packagingTypeModal, setPackagingTypeModal] = useState(false);
  const [freightContentTypeValue, setFreightContentTypeValue] =
    useState(freightContentType);
  const [freightContentTypeModal, setFreightContentTypeModal] = useState(false);
  const [loadingTypeValue, setLoadingTypeValue] = useState(freightLoadingType);
  const [loadingTypeModal, setLoadingTypeModal] = useState(false);
  const [gtipListValue, setGtipListValue] = useState(harmonizedSystemCode);
  const [gtipListModal, setGtipListModal] = useState(false);
  const dispatch = useDispatch();

  const validationSchema = Yup.object().shape({
    description: Yup.string().required(stringsoflanguages.DescriptionRequired),
    trailerType: Yup.string()
      .required(stringsoflanguages.TrailerTypeRequired)
      .label(stringsoflanguages.TrailerType),
    floorType: Yup.string()
      .required(stringsoflanguages.FloorTypeRequired)
      .label(stringsoflanguages.FloorType),
    // date and time
    uploadDateAndTime: Yup.date()
      .required(stringsoflanguages.UploadDateAndTimeRequired)
      .label(stringsoflanguages.UploadDate),
    arrivalDateAndTime: Yup.date()
      .required(stringsoflanguages.ArrivalDateRequired)
      .test(
        "arrivalDateTest",
        "Arrival Date and time cannot be less than Upload Date",
        function (arrivalDateAndTime) {
          const { uploadDateAndTime } = this.parent;
          if (compareAsc(arrivalDateAndTime, uploadDateAndTime) === -1)
            return false;
          return true;
        }
      )
      .label(stringsoflanguages.ArrivalDate),
    // address
    fromAddress: Yup.string()
      .required(stringsoflanguages.DepartureLocationRequired)
      .label(stringsoflanguages.DepartureLocation),
    toAddress: Yup.string()
      .required(stringsoflanguages.ArrivalLocationRequired)
      .test(
        "arrivalLocationTest",
        "Arrival Location cannot be same as Loading Location",
        function () {
          if (arrivalLocationValue === loadingLocationValue) return false;
          return true;
        }
      )
      .label(stringsoflanguages.ArrivalLocation),
    // Goods info
    freightType: Yup.string()
      .required(stringsoflanguages.FreightTypeRequired)
      .label(stringsoflanguages.FreightType),
    value: Yup.string()
      .required(stringsoflanguages.ValueRequired)
      .label(stringsoflanguages.Value),
    currency: Yup.string()
      .required(stringsoflanguages.Value)
      .label(stringsoflanguages.Currency),
    packagingType: Yup.string()
      .required(stringsoflanguages.PackagingTypeRequired)
      .label(stringsoflanguages.PackagingType),
    loadingType: Yup.string()
      .required(stringsoflanguages.LoadingTypeRequired)
      .label(stringsoflanguages.LoadingType),
    gtip: Yup.string()
      .required(stringsoflanguages.GtipRequired)
      .label(stringsoflanguages.Gtip),
    lengthValue: Yup.string()
      .required(stringsoflanguages.LenghtRequired)
      .label(stringsoflanguages.Length),
    width: Yup.string()
      .required(stringsoflanguages.WidthRequired)
      .label(stringsoflanguages.Width),
    height: Yup.string()
      .required(stringsoflanguages.HeightRequired)
      .label(stringsoflanguages.Height),
    weight: Yup.string()
      .required(stringsoflanguages.WeightRequired)
      .label(stringsoflanguages.Weight),
    freightContentType: Yup.string()
      .required(stringsoflanguages.FreightContentTypeRequired)
      .label(stringsoflanguages.FreightContentType),
  });

  // vehicle options
  const { data: freightTypesListData, loader: freightLoader } = useSelector(
    (state) => state.FreightTypeList
  );
  const { data: trailerData, loader: trailerLoader } = useSelector(
    (state) => state.TrailerTypeList
  );
  const { data: floorData, floorLoader } = useSelector(
    (state) => state.TrailerFloorTypeList
  );
  const { data: trailerSpecificationListData, loader: specificationLoader } =
    useSelector((state) => state.TrailerSpecificationList);
  // address pref
  const { data: addressListData, loader: addressLoader } = useSelector(
    (state) => state.GetAddressData
  );
  // Goods iNformation
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
    dispatch(GetTrailerTypeListAction("", 0, 1000));
    dispatch(GetTrailerFloorTypeListAction("", 0, 1000));
    dispatch(GetFreightTypeList("", 0, 1000));
    dispatch(
      GetTrailerSpecificationListAction(trailerType?.trailerTypeId, "", 0, 20)
    );
    // Address pref
    dispatch(GetAddressList("", 0, 40));
    // goods Infromation
    dispatch(GetCurrencyListAction());
    dispatch(GetFreightContentTypeListAction("", 0, 30));
    dispatch(GetPackagingTypeAction("", 0, 100));
    dispatch(GetLoadingTypeAction("", 0, 100));
    dispatch(GetGtipListAction("", 0, 30));
  }, []);

  useEffect(() => {
    if (freightLoader || trailerLoader || floorLoader || specificationLoader) {
      setLoading(true);
    } else setLoading(false);
  }, [freightLoader, trailerLoader, floorLoader, specificationLoader]);

  const formik = useFormik({
    initialValues: {
      description: description,
      floorType: floorType?.description,
      trailerType: trailerType?.description,
      trailerCostumization: specificationList ?? [],
      // date and time
      uploadDateAndTime: plannedDepartureDate
        ? new Date(plannedDepartureDate)
        : plannedDepartureDate,
      arrivalDateAndTime: plannedArrivalDate
        ? new Date(plannedArrivalDate)
        : plannedArrivalDate,
      // address
      fromAddress: fromAddress?.description,
      toAddress: toAddress?.description,
      // Goods info
      freightType: freightType?.description,
      value: value?.toString(),
      lengthValue: length?.toString(),
      width: width?.toString(),
      weight: weight?.toString(),
      height: height?.toString(),
      desi: desi?.toString() || "",
      ldm: ldm?.toString() || "",
      flammable: flammable === "Y",
      stackable: stackable === "Y",
      currency: valueCurrency?.description,
      freightContentType: freightContentType?.description,
      packagingType: freightPackageType?.description,
      loadingType: freightLoadingType?.description,
      gtip: harmonizedSystemCode?.description,
    },
    onSubmit: (values, { resetForm }) => {
      console.log("SUBMIT");
      onSubmitHandler(values, resetForm);
    },
    onReset: () => {},
    validationSchema: validationSchema,
  });

  const handleSpecificationChange = (item, indexFound) => {
    // indexFound ? remove item
    if (indexFound > -1) {
      let temp = [...formik.values.trailerCostumization];
      temp.splice(indexFound, 1);
      formik.setFieldValue("trailerCostumization", [...temp]);
    } else {
      formik.setFieldValue("trailerCostumization", [
        ...formik.values.trailerCostumization,
        item,
      ]);
    }
  };

  const onSubmitHandler = async (v) => {
    const {
      lengthValue,
      stackable,
      flammable,
      trailerCostumization,
      uploadDateAndTime,
      arrivalDateAndTime,
      ...restValues
    } = v;

    // console.log("onSubmitHandler", JSON.stringify(data, null, 2));

    setLoading(true);
    try {
      let data = {
        ...restValues,
        ...restFreight,
        length: lengthValue,
        flammable: flammable === true ? "Y" : "N",
        stackable: stackable === true ? "Y" : "N",
        valueCurrency: currencyValue,
        plannedDepartureDate: getUnixTimeStamp(uploadDateAndTime),
        plannedArrivalDate: getUnixTimeStamp(arrivalDateAndTime),
        fromAddress: loadingLocationValue,
        toAddress: arrivalLocationValue,
        trailerType: trailerCode,
        floorType: floorCode,
        specificationList: trailerCostumization || [],
        freightType: freightTypeCode,
        freightLoadingType: loadingTypeValue,
        freightPackageType: packagingTypeValue,
        harmonizedSystemCode: gtipListValue,
        freightContentType: freightContentTypeValue,
      };
      if (!(await NetChecker2())) return;
      const res = await Api.updateFreight(JSON.stringify(data));
      if (!res) return;

      if (res?.[1] === 200) {
        showSucces({
          description: stringsoflanguages.FreightUpdateSuccess,
          onHide: () => {
            setTimeout(() => {
              props.navigation.reset({
                index: 0,
                routes: [{ name: "Home" }],
              });
            });
          },
        });
      } else
        showFailure({
          title: stringsoflanguages.UpdateFreightFailed,
          description: res?.[1],
        });
    } catch (e) {}
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
      <KeyboardAwareScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ flexGrow: 1 }}
      >
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
              <TextField2
                value={formik.values.description}
                name={stringsoflanguages.LoadDescription}
                styles={styles.textField}
                onChange={formik.handleChange("description")}
                onBlur={() => formik.setFieldTouched("description")}
              />
              {formik.touched.description && formik.errors.description && (
                <Text style={styles.errorText}>
                  {formik.errors.description}
                </Text>
              )}

              <TextFieldWithIcon2
                name={stringsoflanguages.FloorType}
                editable={false}
                value={formik.values.floorType}
                placeholder={stringsoflanguages.SelectFloorType}
                onPress={() => setFloorModal(true)}
                backgroundColor={colors.silverLight}
                onClick={() => setFloorModal(false)}
                cModal={floorModal}
                modalData={(floorData && floorData[0]) || []}
                showValue={["description"]}
                setModalValue={(e) => {
                  formik.setFieldValue("floorType", e.description);
                  setFloorCode(e);
                }}
                styles={styles.textField}
              />
              {formik.touched.floorType && formik.errors.floorType && (
                <Text style={styles.errorText}>{formik.errors.floorType}</Text>
              )}
            </View>

            <View style={styles.rightBox}>
              <TextFieldWithIcon2
                name={stringsoflanguages.TrailerType}
                editable={false}
                value={formik.values.trailerType}
                placeholder={stringsoflanguages.SelectTrailerType}
                onPress={() => setTrailerModal(true)}
                backgroundColor={colors.silverLight}
                onClick={() => setTrailerModal(false)}
                cModal={trailerModal}
                modalData={(trailerData && trailerData[0]) || []}
                showValue={["description"]}
                setModalValue={(e) => {
                  formik.setFieldValue("trailerType", e.description);
                  setTrailerCode(e);
                  dispatch(
                    GetTrailerSpecificationListAction(
                      e?.trailerTypeId,
                      "",
                      0,
                      20
                    )
                  );
                  if (trailerCode?.trailerTypeId != e?.trailerTypeId)
                    formik.setFieldValue("trailerCostumization", []);
                }}
                styles={styles.textField}
              />
              {formik.touched.trailerType && formik.errors.trailerType && (
                <Text style={styles.errorText}>
                  {formik.errors.trailerType}
                </Text>
              )}

              <TextMed style={[styles.title]}>
                {stringsoflanguages.TrailerCustomization}
              </TextMed>
              {trailerSpecificationListData?.[0].map((item, index) => {
                // description": "Removable Side Tent", "specificationId
                let indexFound = formik.values?.trailerCostumization?.findIndex(
                  (v) => v?.specificationId === item?.specificationId
                );

                return (
                  <View
                    style={styles.trailerCostumizationItem}
                    key={index.toString()}
                  >
                    <CheckBox
                      value={indexFound === -1 ? false : true}
                      onValueChange={() => {
                        handleSpecificationChange(item, indexFound);
                      }}
                    />
                    <TextSmall>{item?.description}</TextSmall>
                  </View>
                );
              })}
            </View>
          </View>
          <DividerV />

          {/* Date and Time */}
          <TextLarge style={styles.infoTitle}>
            {stringsoflanguages.DateAndTime}
          </TextLarge>
          <View>
            <DatePickerButton2
              onChange={(v) => {
                formik.setFieldValue("uploadDateAndTime", v);
              }}
              title={stringsoflanguages.UploadDateAndTime}
              placeholder={stringsoflanguages.SelectUploadDate}
              stateDate={formik.values.uploadDateAndTime}
              format={global.dateTimeFormat}
              mode="datetime"
              minDate={
                plannedDepartureDate ? new Date(plannedDepartureDate) : null
              }
            />
            {formik.touched.uploadDateAndTime &&
              formik.errors.uploadDateAndTime && (
                <Text style={styles.errorText}>
                  {formik.errors.uploadDateAndTime}
                </Text>
              )}

            <DatePickerButton2
              onChange={(v) => {
                formik.setFieldValue("arrivalDateAndTime", v);
              }}
              title={stringsoflanguages.ArrivalDateAndTime}
              placeholder={stringsoflanguages.SelectArrivalDate}
              stateDate={formik.values.arrivalDateAndTime}
              format={global.dateTimeFormat}
              mode="datetime"
              disabled={!formik.values.uploadDateAndTime}
              minDate={formik.values.uploadDateAndTime}
            />
            {formik.touched.arrivalDateAndTime &&
              formik.errors.arrivalDateAndTime && (
                <Text style={styles.errorText}>
                  {formik.errors.arrivalDateAndTime}
                </Text>
              )}
          </View>
          <DividerV />

          {/* Address Preferences */}
          <TextLarge style={styles.infoTitle}>
            {stringsoflanguages.AddressPreferences}
          </TextLarge>
          <View style={styles.boxContainer}>
            <View style={styles.leftBox}>
              <TextFieldWithIcon2
                name={stringsoflanguages.UploadAddress}
                editable={false}
                value={formik.values.fromAddress}
                onSearch={(v) => {
                  dispatch(GetAddressList(v, 0, 1000));
                }}
                placeholder={stringsoflanguages.SelectUploadLocation}
                backgroundColor={colors.silverLight}
                onPress={() => setLoadingLocationModal(true)}
                styles={styles.textField}
                onClick={() => setLoadingLocationModal(false)}
                cModal={loadingLocationModal}
                modalData={(addressListData && addressListData[0]) || []}
                showValue={["description"]}
                setModalValue={(e) => {
                  setLoadingLocationValue(e);
                  formik.setFieldValue("fromAddress", e.description);
                  dispatch(GetAddressList("", 0, 1000));
                }}
              />
              {formik.touched.fromAddress && formik.errors.fromAddress && (
                <Text style={styles.errorText}>
                  {formik.errors.fromAddress}
                </Text>
              )}
            </View>

            <View style={styles.rightBox}>
              <TextFieldWithIcon2
                name={stringsoflanguages.ArrivalAddress}
                editable={false}
                value={formik.values.toAddress}
                onSearch={(v) => {
                  dispatch(GetAddressList(v, 0, 1000));
                }}
                placeholder={stringsoflanguages.SelectArrivalLocation}
                backgroundColor={colors.silverLight}
                onPress={() => setArrivalLocationModal(true)}
                styles={styles.textField}
                onClick={() => setArrivalLocationModal(false)}
                cModal={arrivalLocationModal}
                modalData={(addressListData && addressListData[0]) || []}
                showValue={["description"]}
                setModalValue={(e) => {
                  dispatch(GetAddressList(v, 0, 1000));
                  setArrivalLocationValue(e);
                  formik.setFieldValue("toAddress", e.description);
                  dispatch(GetAddressList("", 0, 1000));
                }}
              />
              {formik.touched.toAddress && formik.errors.toAddress && (
                <Text style={styles.errorText}>{formik.errors.toAddress}</Text>
              )}
            </View>
          </View>
          <DividerV />

          {/* Good Information */}
          <TextLarge style={styles.infoTitle}>
            {stringsoflanguages.GoodInformation}
          </TextLarge>
          <View style={styles.boxContainer}>
            <View style={styles.leftBox}>
              <TextField2
                value={formik.values.value}
                name={stringsoflanguages.Value}
                styles={styles.textField}
                regex={RegexisValidNumber}
                onChange={formik.handleChange("value")}
                keyboardType={"decimal-pad"}
                onBlur={() => formik.setFieldTouched("value")}
              />
              {formik.touched.value && formik.errors.value && (
                <Text style={styles.errorText}>{formik.errors.value}</Text>
              )}

              <TextFieldWithIcon2
                name={stringsoflanguages.FreightType}
                editable={false}
                value={formik.values.freightType}
                placeholder={stringsoflanguages.SelectFreightType}
                backgroundColor={colors.silverLight}
                onPress={() => setFreightTypeModal(true)}
                onClick={() => setFreightTypeModal(false)}
                cModal={freightTypeModal}
                modalData={
                  (freightTypesListData && freightTypesListData[0]) || []
                }
                showValue={["description"]}
                setModalValue={(e) => {
                  setFreightTypeCode(e);
                  formik.setFieldValue("freightType", e.description);
                }}
              />
              {formik.touched.freightType && formik.errors.freightType && (
                <Text style={styles.errorText}>
                  {formik.errors.freightType}
                </Text>
              )}

              <TextFieldWithIcon2
                name={stringsoflanguages.PackagingType}
                editable={false}
                value={formik.values.packagingType}
                placeholder={stringsoflanguages.SelectPackagingType}
                onPress={() => setPackagingTypeModal(true)}
                backgroundColor={colors.silverLight}
                onClick={() => setPackagingTypeModal(false)}
                cModal={packagingTypeModal}
                modalData={
                  (GetPackagingTypeData && GetPackagingTypeData[0]) || []
                }
                showValue={["description"]}
                setModalValue={(e) => {
                  formik.setFieldValue("packagingType", e.description);
                  setPackagingTypeValue(e);
                }}
                styles={styles.textField}
              />
              {formik.touched.packagingType && formik.errors.packagingType && (
                <Text style={styles.errorText}>
                  {formik.errors.packagingType}
                </Text>
              )}

              <TextFieldWithIcon2
                name={stringsoflanguages.GtipCode}
                editable={false}
                value={formik.values.gtip}
                placeholder={stringsoflanguages.SelectGtipCode}
                onPress={() => setGtipListModal(true)}
                backgroundColor={colors.silverLight}
                onClick={() => setGtipListModal(false)}
                cModal={gtipListModal}
                modalData={(GetGtipListData && GetGtipListData[0]) || []}
                showValue={["code", "description"]}
                onSearch={(v) => dispatch(GetGtipListAction(v, 0, 30))}
                setModalValue={(e) => {
                  formik.setFieldValue("gtip", e.description);
                  setGtipListValue(e);
                }}
                styles={styles.textField}
              />
              {formik.touched.gtip && formik.errors.gtip && (
                <Text style={styles.errorText}>{formik.errors.gtip}</Text>
              )}

              {/* <TextMed style={[styles.title]}>{"Gtip (Hs Code)"}</TextMed>
              <TextMuted style={[styles.subTitle]}>
                {harmonizedSystemCode?.description}
              </TextMuted> */}

              <TextField2
                value={formik.values.width}
                name={stringsoflanguages.WidthValue}
                regex={RegexIsDigit}
                styles={styles.textField}
                keyboardType={"decimal-pad"}
                onChange={formik.handleChange("width")}
                onBlur={() => formik.setFieldTouched("width")}
              />
              {formik.touched.width && formik.errors.width && (
                <Text style={styles.errorText}>{formik.errors.width}</Text>
              )}

              <TextField2
                value={formik.values.weight}
                name={stringsoflanguages.GrossKG}
                regex={RegexIsDigit}
                styles={styles.textField}
                keyboardType={"decimal-pad"}
                onChange={formik.handleChange("weight")}
                onBlur={() => formik.setFieldTouched("weight")}
              />
              {formik.touched.weight && formik.errors.weight && (
                <Text style={styles.errorText}>{formik.errors.weight}</Text>
              )}

              <TextField2
                value={formik.values.ldm}
                name={stringsoflanguages.LDM}
                regex={RegexIsDigit}
                styles={styles.textField}
                keyboardType={"decimal-pad"}
                onChange={formik.handleChange("ldm")}
                onBlur={() => formik.setFieldTouched("ldm")}
              />

              <TextMed style={[styles.title]}>
                {stringsoflanguages.ProductContainingADR1}
              </TextMed>
              <CheckBox
                value={formik.values.flammable}
                onChange={() => {
                  formik.setFieldValue("flammable", !formik.values.flammable);
                }}
              />
            </View>

            <View style={styles.rightBox}>
              <TextFieldWithIcon2
                name={stringsoflanguages.LoadingCurrency}
                editable={false}
                value={formik.values.currency}
                placeholder={stringsoflanguages.SelectLoadingCurrency}
                onPress={() => setCurrencyValueModal(true)}
                backgroundColor={colors.silverLight}
                onClick={() => setCurrencyValueModal(false)}
                cModal={currencyValueModal}
                modalData={
                  (GetCurrencyListData && GetCurrencyListData[0]) || []
                }
                showValue={["description"]}
                setModalValue={(e) => {
                  formik.setFieldValue("currency", e.description);
                  setCurrencyValue(e);
                }}
                styles={styles.textField}
              />
              {formik.touched.currency && formik.errors.currency && (
                <Text style={styles.errorText}>{formik.errors.currency}</Text>
              )}

              <TextFieldWithIcon2
                onSearch={(v) => {
                  dispatch(GetFreightContentTypeListAction(v, 0, 20));
                }}
                name={stringsoflanguages.FreightContentType}
                editable={false}
                value={formik.values.freightContentType}
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
                  formik.setFieldValue("freightContentType", e.description);
                }}
              />
              {formik.touched.freightContentType &&
                formik.errors.freightContentType && (
                  <Text style={styles.errorText}>
                    {formik.errors.freightContentType}
                  </Text>
                )}

              <TextFieldWithIcon2
                name={stringsoflanguages.LoadingType}
                editable={false}
                value={formik.values.loadingType}
                placeholder={stringsoflanguages.SelectLoadingType}
                onPress={() => setLoadingTypeModal(true)}
                backgroundColor={colors.silverLight}
                onClick={() => setLoadingTypeModal(false)}
                cModal={loadingTypeModal}
                modalData={(GetLoadingTypeData && GetLoadingTypeData[0]) || []}
                showValue={["description"]}
                setModalValue={(e) => {
                  formik.setFieldValue("loadingType", e.description);
                  setLoadingTypeValue(e);
                }}
                styles={styles.textField}
              />
              {formik.touched.loadingType && formik.errors.loadingType && (
                <Text style={styles.errorText}>
                  {formik.errors.loadingType}
                </Text>
              )}

              <TextField2
                value={formik.values.lengthValue}
                name={stringsoflanguages.LenghtValue}
                regex={RegexIsDigit}
                styles={styles.textField}
                keyboardType={"decimal-pad"}
                onChange={formik.handleChange("lengthValue")}
                onBlur={() => formik.setFieldTouched("lengthValue")}
              />
              {formik.touched.lengthValue && formik.errors.lengthValue && (
                <Text style={styles.errorText}>
                  {formik.errors.lengthValue}
                </Text>
              )}
              <TextField2
                value={formik.values.height}
                name={stringsoflanguages.HeightValue}
                regex={RegexIsDigit}
                styles={styles.textField}
                keyboardType={"decimal-pad"}
                onChange={formik.handleChange("height")}
                onBlur={() => formik.setFieldTouched("height")}
              />
              {formik.touched.height && formik.errors.height && (
                <Text style={styles.errorText}>{formik.errors.height}</Text>
              )}
              <TextField2
                value={formik.values.desi}
                name={stringsoflanguages.Desi}
                regex={RegexIsDigit}
                styles={styles.textField}
                keyboardType={"decimal-pad"}
                onChange={formik.handleChange("desi")}
                onBlur={() => formik.setFieldTouched("desi")}
              />
              <TextMed style={[styles.title]}>
                {stringsoflanguages.StackableProduct}
              </TextMed>
              <CheckBox
                value={formik.values.stackable}
                onChange={() => {
                  formik.setFieldValue("stackable", !formik.values.stackable);
                }}
              />
            </View>
          </View>

          <GapV />

          <Button
            border={false}
            name={stringsoflanguages.Update}
            onPress={formik.handleSubmit}
          />
          <Button
            border={true}
            name={stringsoflanguages.Cancel}
            onPress={props.navigation.goBack}
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
  boxContainer: {
    flexDirection: "row",
    flex: 1,
  },
  leftBox: { flex: 2 },
  rightBox: { flex: 2 },
  textField: { width: "90%" },
  infoTitle: {
    textAlign: "center",
    marginVertical: RFValue(10),
  },
  title: {
    // fontSize: RFPercentage(2)
  },
  subTitle: {
    marginTop: RFPercentage(0.5),
    marginBottom: RFPercentage(1),
  },
  errorText: {
    fontSize: RFPercentage(1.3),
    fontFamily: Fonts.Medium,
    color: colors.Red,
    top: RFValue(-10),
  },
  trailerCostumizationItem: {
    flexDirection: "row",
    alignItems: "center",
  },
});
