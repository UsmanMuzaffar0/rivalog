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

import * as Api from "../../../../common/Api";
import {
  TextField2,
  TextFieldWithIcon2,
} from "../../../../common/Component/TextField";
import { ScrollView } from "react-native-gesture-handler";
import Button from "../../../../common/Component/Button";
import { useDispatch, useSelector } from "react-redux";
import {
  AddNewInvoiceAddress,
  GetCityAction,
  GetInvoiceAddressesAction,
  UpdateInvoiceAddress,
  GetCountryAction,
} from "../../../../Redux/actions";
import { Formik } from "formik";
import * as Yup from "yup";
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";
import { GapV } from "../../../../common/Component/gap";
import stringsoflanguages from "../../../../Localization/stringsoflanguages";
import { getCountryCodeAsync } from "../../../../common/Utils/localize";
import { showFailure, showSucces } from "../../../../common/Utils/flashMessage";
import { useNavigation } from "@react-navigation/native";

export default function AddBillingAddress(props) {
  const navigation = useNavigation();
  const [countryModal, setCountryModal] = useState(false);
  const [cityModal, setCityModal] = useState(false);
  const [countryCode, setCountryCode] = useState("");
  const [cityCode, setCityCode] = useState("");
  const [countryCodesArr, setCountryCodesArr] = useState([]);
  const [countryArr, setCountryArr] = useState([]);
  const [loading, setLoading] = useState(false);
  const dispatch = useDispatch();
  const { data } = useSelector((state) => state.CityData);
  const { loader, AddNewInvoiceAddrressSuccess } = useSelector(
    (state) => state.AddNewInvoiceAddress
  );
  const { data: countryData, GetCountrySuccess } = useSelector(
    (state) => state.CountryData
  );

  const updateInvoice = useSelector((state) => state.UpdateInvoiceAddress);

  const { params } = props.route;
  console.log("Props>>", params);

  const onSubmitHandler = async (values, resetForm) => {
    setLoading(true);
    const data = {
      description: values?.addressDesription,
      country: { code: countryCode },
      city: { cityId: cityCode },
      district: values?.district,
      neighborhood: values?.neighborhood,
      street: values?.street,
      streetNo: values?.streetNo,
      postCode: values?.postCode,
      addressText: values?.fullAddress,
    };

    // if (params?.update) {
    //   const dataUpdate = {
    //     ...data,
    //     invoiceAddressId: params?.update?.invoiceAddressId,
    //   };

    //   dispatch(UpdateInvoiceAddress(dataUpdate));
    // } else {
    //   dispatch(AddNewInvoiceAddress(data));
    // }

    // console.log(data);
    try {
      let res = params?.update
        ? await Api.UpdateInvoiceAddress({
            ...data,
            invoiceAddressId: params?.update?.invoiceAddressId,
          })
        : await Api.AddNewInvoiceAddress(data);
      if (res?.[1] === 200) {
        dispatch(GetInvoiceAddressesAction("", 0, 20));
        showSucces({
          description: "Added new Address Successfully",
          onHide: () => {
            dispatch(GetInvoiceAddressesAction("", 0, 20));
          },
        });
      } else {
        console.log(res);
        showFailure({ title: "Add new Address Failed", description: res?.[1] });
      }
      resetForm({
        values: {
          addressDesription: "",
          country: "",
          city: "",
          district: "",
          neighborhood: "",
          street: "",
          streetNo: "",
          postCode: "",
          fullAddress: "",
        },
      });
    } catch (e) {
      console.error(e);
      showFailure({ title: "Add new Address Failed", description: e?.message });
    }
    setLoading(false);
  };

  const validationSchema = Yup.object().shape({
    // addressDesription: Yup.string().required(
    //   stringsoflanguages?.AddressDescriptionRequired
    // ),
    country: Yup.string()
      .required(stringsoflanguages.CountryRequired)
      .label(stringsoflanguages.Country),
    city: Yup.string().required(stringsoflanguages?.CityRequired),
    // district: Yup.string().required(stringsoflanguages?.DistrictRequired),
    // neighborhood: Yup.string().required(
    // stringsoflanguages?.NeighborhoodRequired
    // ),
    // street: Yup.string().required(stringsoflanguages?.StreetRequired),
    // streetNo: Yup.string().required(stringsoflanguages?.StreetNoRequired),
    // postCode: Yup.string().required(stringsoflanguages?.PostRequired),
    // fullAddress: Yup.string().required(stringsoflanguages?.FullAddressRequired),
  });

  useEffect(() => {
    dispatch(GetCountryAction());
  }, []);

  //   set country array from backend
  useEffect(() => {
    if (countryData)
      (async () => {
        const currentCountryCode = await getCountryCodeAsync();
        let countryCodes = [];
        let countriesArr = [];
        countryData[0].map((v) => {
          if (v?.code === currentCountryCode) {
            countriesArr.splice(0, 0, v);
            countryCodes.splice(0, 0, v?.code);
          } else {
            countriesArr.push(v);
            countryCodes.push(v?.code);
          }
        });
        setCountryCodesArr(countryCodes);
        setCountryArr(countriesArr);
      })();
  }, [countryData]);

  useEffect(() => {
    if (params?.update) {
      setCountryCode(params?.update?.country?.code);
      setCityCode(params?.update?.city?.cityId);
    }

    return () => {};
  }, []);

  // useEffect(() => {
  //   if (
  //     AddNewInvoiceAddrressSuccess ||
  //     updateInvoice.UpdateInvoiceAddrressSuccess
  //   )
  //     dispatch(GetInvoiceAddressesAction("", 0, 20));

  //   return () => {};
  // }, [
  //   AddNewInvoiceAddrressSuccess,
  //   updateInvoice.UpdateInvoiceAddrressSuccess,
  // ]);

  return (
    <SafeAreaView style={Style.mainView}>
      <StatusBar
        animated={false}
        backgroundColor={colors.WhiteSmoke}
        barStyle={"dark-content"}
      />
      <HeaderWithNotification
        Title={stringsoflanguages?.BillingAddressesTitle}
        back
        BackAction={props.navigation.goBack}
      />
      <KeyboardAwareScrollView showsVerticalScrollIndicator={false}>
        <Formik
          initialValues={{
            addressDesription: params?.update
              ? params?.update?.description
              : "",
            country: params?.update ? params?.update?.country?.name : "",
            city: params?.update ? params?.update?.city?.name : "",
            district: params?.update ? params?.update?.district : "",
            // town: params?.update ? params?.update?.town : "",
            neighborhood: params?.update ? params?.update?.neighborhood : "",
            street: params?.update ? params?.update?.street : "",
            streetNo: params?.update ? params?.update?.streetNo : "",
            postCode: params?.update ? params?.update?.postCode : "",
            fullAddress: params?.update ? params?.update?.addressText : "",
          }}
          onSubmit={(values, { resetForm }) =>
            onSubmitHandler(values, resetForm)
          }
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
            console.log(errors);
            return (
              <ScrollView showsVerticalScrollIndicator={false}>
                <View
                  style={{
                    flex: 1,
                    marginTop: RFValue(10),
                    paddingHorizontal: RFValue(20),
                  }}
                >
                  <TextField2
                    value={values.addressDesription}
                    name={stringsoflanguages?.AddressDescription}
                    placeholder={stringsoflanguages?.AddressPlaceholder}
                    backgroundColor={colors.silverLight}
                    onChange={handleChange("addressDesription")}
                    onBlur={() => setFieldTouched("addressDesription")}
                  />
                  {touched.addressDesription && errors.addressDesription && (
                    <Text style={styles.errorText}>
                      {errors.addressDesription}
                    </Text>
                  )}

                  <TextFieldWithIcon2
                    name={stringsoflanguages?.Country}
                    editable={false}
                    value={values.country}
                    placeholder={stringsoflanguages?.CountryPlaceholder}
                    backgroundColor={colors.silverLight}
                    onPress={() => setCountryModal(true)}
                    styles={{ justifyContent: "space-between", zIndex: 1 }}
                    onClick={() => setCountryModal(false)}
                    cModal={countryModal}
                    countryCodesArr={countryCodesArr || []}
                    setCountry={(d) => {
                      setFieldValue("country", d.name);
                      setCountryCode(d.cca2);
                      dispatch(
                        GetCityAction({
                          searchTxt: "",
                          countryCode: d.cca2,
                          pageIndex: 0,
                          pageCount: 1000,
                        })
                      );
                      setFieldValue("city", "");
                      setCityCode("");
                    }}
                  />
                  {touched.country && errors.country && (
                    <Text style={styles.errorText}>{errors.country}</Text>
                  )}
                  <TextFieldWithIcon2
                    name={stringsoflanguages?.City}
                    editable={false}
                    value={values.city}
                    placeholder={stringsoflanguages?.SelectCity}
                    backgroundColor={colors.silverLight}
                    onPress={() =>
                      values.country !== ""
                        ? setCityModal(true)
                        : alert(stringsoflanguages.SelectCountryAlert)
                    }
                    styles={{ justifyContent: "space-between", zIndex: 1 }}
                    onClick={() => setCityModal(false)}
                    cModal={cityModal}
                    cityData={data && data[0]}
                    setCity={(e) => {
                      setCityCode(e.cityId);
                      setFieldValue("city", e.name);
                    }}
                  />
                  {touched.city && errors.city && (
                    <Text style={styles.errorText}>{errors.city}</Text>
                  )}
                  <TextField2
                    value={values.district}
                    name={stringsoflanguages?.District}
                    placeholder={stringsoflanguages?.DistrictPlaceholder}
                    backgroundColor={colors.silverLight}
                    onChange={handleChange("district")}
                    onBlur={() => setFieldTouched("district")}
                  />
                  {touched.district && errors.district && (
                    <Text style={styles.errorText}>{errors.district}</Text>
                  )}
                  <TextField2
                    value={values.neighborhood}
                    name={stringsoflanguages?.Neighborhood}
                    placeholder={stringsoflanguages?.NeighborhoodPlaceholder}
                    backgroundColor={colors.silverLight}
                    onChange={handleChange("neighborhood")}
                    onBlur={() => setFieldTouched("neighborhood")}
                  />
                  {touched.neighborhood && errors.neighborhood && (
                    <Text style={styles.errorText}>{errors.neighborhood}</Text>
                  )}
                  <TextField2
                    value={values.street}
                    name={stringsoflanguages?.Street}
                    placeholder={stringsoflanguages?.StreetPlaceholder}
                    backgroundColor={colors.silverLight}
                    onChange={handleChange("street")}
                    onBlur={() => setFieldTouched("street")}
                  />
                  {touched.street && errors.street && (
                    <Text style={styles.errorText}>{errors.street}</Text>
                  )}
                  <TextField2
                    value={values.streetNo}
                    name={stringsoflanguages?.StreetNo}
                    placeholder={stringsoflanguages?.StreetNoPlaceholder}
                    backgroundColor={colors.silverLight}
                    onChange={handleChange("streetNo")}
                    onBlur={() => setFieldTouched("streetNo")}
                  />
                  {touched.streetNo && errors.streetNo && (
                    <Text style={styles.errorText}>{errors.streetNo}</Text>
                  )}
                  <TextField2
                    value={values.postCode}
                    name={stringsoflanguages?.PostCode}
                    placeholder={stringsoflanguages?.PostPlaceholder}
                    backgroundColor={colors.silverLight}
                    onChange={handleChange("postCode")}
                    keyboardType="number-pad"
                    onBlur={() => setFieldTouched("postCode")}
                  />
                  {touched.postCode && errors.postCode && (
                    <Text style={styles.errorText}>{errors.postCode}</Text>
                  )}
                  <TextField2
                    value={values.fullAddress}
                    name={stringsoflanguages?.FullAddress}
                    placeholder={stringsoflanguages?.FullAddressPlaceholder}
                    backgroundColor={colors.silverLight}
                    multiline={true}
                    styles={{
                      height: RFValue(100),
                      alignItems: "flex-start",
                    }}
                    onChange={handleChange("fullAddress")}
                    onBlur={() => setFieldTouched("fullAddress")}
                  />
                  {touched.fullAddress && errors.fullAddress && (
                    <Text style={styles.errorText}>{errors.fullAddress}</Text>
                  )}

                  <Button
                    loader={params?.update ? updateInvoice.loader : loader}
                    onPress={handleSubmit}
                    border={false}
                    name={
                      params?.update
                        ? "Update Address"
                        : stringsoflanguages?.AddAddress
                    }
                  />
                  <Button
                    onPress={() => navigation.goBack()}
                    loader={loading}
                    border={true}
                    name={stringsoflanguages?.Cancel}
                  />
                  <GapV />
                </View>
              </ScrollView>
            );
          }}
        </Formik>
      </KeyboardAwareScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  errorText: {
    fontSize: RFPercentage(1.3),
    fontFamily: Fonts.Medium,
    color: colors.Red,
    top: RFValue(-10),
  },
});
