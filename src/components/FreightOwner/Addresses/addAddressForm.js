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
import { HeaderWithNotification } from "../../../common/Component/Header";
import { Style } from "../../../common/Style";
import * as colors from "../../../common/colors";
import * as Fonts from "../../../common/fonts";
import { RFPercentage, RFValue } from "react-native-responsive-fontsize";

import * as Api from "../../../common/Api";
import {
  TextField2,
  TextFieldWithIcon2,
} from "../../../common/Component/TextField";

import Button from "../../../common/Component/Button";
import { useDispatch, useSelector } from "react-redux";
import {
  GetAddressList,
  GetCityAction,
  GetCountryAction,
} from "../../../Redux/actions";
import { useFormik } from "formik";
import * as Yup from "yup";
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";
import { GapV } from "../../../common/Component/gap";
import stringsoflanguages from "../../../Localization/stringsoflanguages";
import { IconButton } from "react-native-paper";
import { showFailure, showSucces } from "../../../common/Utils/flashMessage";
import PickLocationModal from "../../../common/Component/PickLocationModal";
import { getCountryCodeAsync } from "../../../common/Utils/localize";
import { isEmpty } from "../../../common/Utils/object";

const validationSchema = Yup.object().shape({
  addressDesription: Yup.string(),
  // .required(
  //   stringsoflanguages?.AddressDescriptionRequired
  // ),
  country: Yup.string().required(stringsoflanguages.CountryRequired).label("Country"),
  city: Yup.string().required(stringsoflanguages?.CityRequired),
  district: Yup.string(),
  // .required(stringsoflanguages?.DistrictRequired),

  neighborhood: Yup.string(),
  // .required(stringsoflanguages?.NeighborhoodRequired),
  street: Yup.string(),
  // .required(stringsoflanguages?.StreetRequired),
  streetNo: Yup.string(),
  // .required(stringsoflanguages?.StreetNoRequired),
  postCode: Yup.string(),
  // .required(stringsoflanguages?.PostRequired),
  fullAddress: Yup.string(),
  // .required(stringsoflanguages?.FullAddressRequired),
});

export default function AddNewAddressForm({
  onSubmit,
  isVisible,
  hideModal,
  showModal,
  onSuccess,
  onReset,
  setAddressByMap,
  address = null, // will behave as edit form if passed
  removeEditAddress,
}) {
  const [countryModal, setCountryModal] = useState(false);
  const [cityModal, setCityModal] = useState(false);
  const [countryCode, setCountryCode] = useState("");
  const [cityCode, setCityCode] = useState("");
  const [mapLocation, setMapLocation] = useState(null);
  const [countryCodesArr, setCountryCodesArr] = useState([]);
  const [countryArr, setCountryArr] = useState([]);
  const [loading, setLoading] = useState(false);
  const [mapVisible, setMapVisible] = useState(false);
  const [selectedRegion, setSelectedRegion] = useState(null); // for edit address
  const tempSelectedCity = useRef(null);
  const dispatch = useDispatch();
  const { data: cityData, GetCitySuccess } = useSelector(
    (state) => state.CityData
  );
  const { data: countryData, GetCountrySuccess } = useSelector(
    (state) => state.CountryData
  );

  const formik = useFormik({
    initialValues: {
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
    onSubmit: (values, { resetForm }) => {
      onSubmitHandler(values, resetForm);
    },
    onReset: () => {
      if (removeEditAddress) removeEditAddress();
    },
    validationSchema: validationSchema,
  });

  useEffect(() => {
    dispatch(GetCountryAction());
  }, []);

  useEffect(() => {
    if (address) {
      setCountryCode(address?.country?.code);
      setCityCode(address?.city?.cityId);
      setSelectedRegion({
        latitude: address?.latitude,
        longitude: address?.longitude,
      });
      formik.setFieldValue("addressDesription", address?.addressText);
      formik.setFieldValue("country", address?.country?.name);
      formik.setFieldValue("city", address?.city?.name);
      formik.setFieldValue("district", address?.district);
      formik.setFieldValue("neighborhood", address?.neighborhood);
      formik.setFieldValue("town", address?.town);
      formik.setFieldValue("postCode", address?.postCode);
      formik.setFieldValue("fullAddress", address?.addressText);
      formik.setFieldValue("streetNo", address?.streetNo);
      formik.setFieldValue("street", address?.street);

      // addressDesription: "",
      // country: "",
      // city: "",
      // district: "",
      // town: "",
      // postCode: "",
      // fullAddress: "",
    }
  }, [address]);

  //   set country array from backend
  useEffect(() => {
    if (countryData)
      (async () => {
        const currentCountryCode = await getCountryCodeAsync();
        let countryCodes = [];
        let countriesArr = [];
        await countryData[0].map((v) => {
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

  //   on country select
  useEffect(() => {
    if (countryCode)
      dispatch(
        GetCityAction({
          searchTxt: "",
          countryCode: countryCode,
          pageIndex: 0,
          pageCount: 100,
        })
      );
  }, [countryCode]);

  //   if city ref is selected by pickmap location then autof fill city
  useEffect(() => {
    handleSetCityFromMap(tempSelectedCity.current);
  }, [cityData]);

  const handleSetCityFromMap = (city) => {
    if (city && cityData) {
      try {
        let cityfind = cityData[0]?.find(
          (item) => city?.toLowerCase() === item?.originalName.toLowerCase()
        );
        if (cityfind) {
          formik?.setFieldValue("city", cityfind?.name);
          setCityCode(cityfind?.cityId);
        }
      } catch (e) {
        console.error(e);
      }
    }
  };

  const hanldeOpenMap = () => {
    hideModal();
    setMapVisible(true);
  };

  const handlePickLocation = async (response) => {
    // console.log("APi Response DAta --->>>>>>>", JSON.stringify(response));
    const { region, geoAddress, extractedAddressData } = response;

    showModal();
    setMapVisible(false);
    setMapLocation(region);
    // console.log(JSON.stringify(extractedAddressData, null, 2));
    pickLocationControl(extractedAddressData);
  };

  const pickLocationControl = async (addressData) => {
    console.log("Api Response Data --->>>>>>>>", JSON.stringify(addressData));
    formik.resetForm();
    tempSelectedCity.current = null;
    if (addressData) {
      // desc for only edit address
      if (address)
        formik.setFieldValue("addressDesription", address?.addressText);
      addressData?.postCode &&
        formik?.setFieldValue("postCode", addressData?.postCode);
      addressData?.streetNo &&
        formik?.setFieldValue("streetNo", addressData?.streetNo);
      addressData?.street &&
        formik?.setFieldValue("street", addressData?.street);
      addressData?.district &&
        formik?.setFieldValue("district", addressData?.district);
      (addressData?.neighborhood || addressData?.town) &&
        formik?.setFieldValue(
          "neighborhood",
          addressData?.neighborhood || addressData?.town
        );
      addressData?.addressText &&
        formik?.setFieldValue("fullAddress", addressData?.addressText);
      if (addressData?.country) {
        let selectedCountry = countryArr?.find(
          (v) => v.code == addressData?.country
        );
        selectedCountry?.code == countryCode &&
          handleSetCityFromMap(addressData?.city);
        formik?.setFieldValue("country", selectedCountry?.name);
        setCountryCode(selectedCountry?.code);
      }
      if (addressData?.city) {
        tempSelectedCity.current = addressData?.city;
      }
    }
  };

  const onSubmitHandler = async (values, resetForm) => {
    setLoading(true);
    const data = {
      description: values?.addressDesription,
      country: { code: countryCode },
      city: { cityId: cityCode },
      district: values?.district,
      neighborhood: values.neighborhood,
      street: values.street,
      streetNo: values.streetNo,
      postCode: values?.postCode,
      addressText: values?.fullAddress,
      latitude: mapLocation?.latitude,
      longitude: mapLocation?.longitude,
    };
    // console.log(data);
    try {
      let res = address
        ? await Api.EditAddress(
            JSON.stringify({ ...data, addressId: address?.addressId })
          )
        : await Api.AddNewAddress(JSON.stringify(data));
        console.log("Resolved address",res)
      if (res?.[1] === 200) {
        if (onSuccess) onSuccess();
        dispatch(GetAddressList("", 0, 20));
        hideModal();
        showSucces({
          description: "Added new Address Successfully",
          onHide: () => {
            dispatch(GetAddressList("", 0, 20));
          },
        });
      } else {
        console.log(res);
        hideModal();
        showFailure({ title: "Add new Address Failed", description: res?.[1] });
      }
      resetForm({
        values: {
          addressDesription: "",
          country: "",
          city: "",
          district: "",
          neighborhood: "",
          // town: "",
          postCode: "",
          fullAddress: "",
          streetNo: "",
          street: "",
        },
      });
    } catch (e) {
      console.error(e);
      hideModal();
      showFailure({ title: "Add new Address Failed", description: e?.message });
    }
    setLoading(false);
  };
  console.log("formik.errors", JSON.stringify(formik.errors, null, 2));
  return (
    <>
      <Modal animationType={"none"} transparent={true} visible={isVisible}>
        <KeyboardAwareScrollView
          showsVerticalScrollIndicator={false}
          style={styles.modal}
          contentContainerStyle={styles.modalcontainer}
        >
          <View style={styles.ModelViewContainer}>
            <IconButton
              icon={"close"}
              style={styles.iconBtn}
              onPress={() => {
                formik.handleReset();
                hideModal();
              }}
            />

            <GapV />

            <Button
              loader={loading}
              onPress={hanldeOpenMap}
              border={true}
              name={"Select from map"}
              icon="location"
              style={{ width: "100%" }}
            />

            <GapV />

            <TextField2
              value={formik.values.addressDesription}
              name={stringsoflanguages?.AddressDescription}
              placeholder={stringsoflanguages?.AddressPlaceholder}
              backgroundColor={colors.silverLight}
              onChange={formik.handleChange("addressDesription")}
              onBlur={() => formik.setFieldTouched("addressDesription")}
            />
            {formik.touched.addressDesription &&
              formik.errors.addressDesription && (
                <Text style={styles.errorText}>
                  {formik.errors.addressDesription}
                </Text>
              )}

            <TextFieldWithIcon2
              name={stringsoflanguages?.Country}
              editable={false}
              value={formik.values.country}
              placeholder={stringsoflanguages?.CountryPlaceholder}
              backgroundColor={colors.silverLight}
              onPress={() => setCountryModal(true)}
              styles={{ justifyContent: "space-between", zIndex: 1 }}
              onClick={() => setCountryModal(false)}
              cModal={countryModal}
              countryCodesArr={countryCodesArr || []}
              setCountry={(d) => {
                formik.setFieldValue("country", d.name);
                setCountryCode(d.cca2);
                setCityCode(null);
                formik.setFieldValue("city", "");
                tempSelectedCity.current = null;
              }}
            />
            {formik.touched.country && formik.errors.country && (
              <Text style={styles.errorText}>{formik.errors.country}</Text>
            )}
            <TextFieldWithIcon2
              name={stringsoflanguages?.City}
              editable={false}
              value={formik.values.city}
              placeholder={stringsoflanguages?.SelectCity}
              backgroundColor={colors.silverLight}
              onSearch={(v) => {
                GetCityAction({
                  searchTxt: v,
                  countryCode: countryCode,
                  pageIndex: 0,
                  pageCount: 100,
                });
              }}
              onPress={() =>
                formik.values.country !== ""
                  ? setCityModal(true)
                  : alert("Select country first")
              }
              styles={{ justifyContent: "space-between", zIndex: 1 }}
              onClick={() => setCityModal(false)}
              cModal={cityModal}
              cityData={cityData && cityData[0]}
              setCity={(e) => {
                setCityCode(e.cityId);
                formik.setFieldValue("city", e.name);
              }}
            />
            {formik.touched.city && formik.errors.city && (
              <Text style={styles.errorText}>{formik.errors.city}</Text>
            )}

            <TextField2
              value={formik.values.district}
              name={stringsoflanguages?.District}
              placeholder={stringsoflanguages?.DistrictPlaceholder}
              backgroundColor={colors.silverLight}
              onChange={formik.handleChange("district")}
              onBlur={() => formik.handleBlur("district")}
            />
            {formik.touched.district && formik.errors.district && (
              <Text style={styles.errorText}>{formik.errors.district}</Text>
            )}

            <TextField2
              value={formik.values.neighborhood}
              name={stringsoflanguages?.Neighborhood}
              placeholder={stringsoflanguages?.NeighborhoodPlaceholder}
              backgroundColor={colors.silverLight}
              onChange={formik.handleChange("neighborhood")}
              onBlur={() => formik.handleBlur("neighborhood")}
            />
            {formik.touched.neighborhood && formik.errors.neighborhood && (
              <Text style={styles.errorText}>{formik.errors.neighborhood}</Text>
            )}
            <TextField2
              value={formik.values.street}
              name={stringsoflanguages?.Street}
              placeholder={stringsoflanguages?.StreetPlaceholder}
              backgroundColor={colors.silverLight}
              onChange={formik.handleChange("street")}
              onBlur={() => formik.handleBlur("street")}
            />
            {formik.touched.street && formik.errors.street && (
              <Text style={styles.errorText}>{formik.errors.street}</Text>
            )}
            <TextField2
              value={formik.values.streetNo}
              name={stringsoflanguages?.StreetNo}
              placeholder={stringsoflanguages?.StreetNoPlaceholder}
              backgroundColor={colors.silverLight}
              onChange={formik.handleChange("streetNo")}
              onBlur={() => formik.handleBlur("streetNo")}
            />
            {formik.touched.streetNo && formik.errors.streetNo && (
              <Text style={styles.errorText}>{formik.errors.streetNo}</Text>
            )}

            <TextField2
              value={formik.values.postCode}
              name={stringsoflanguages?.PostCode}
              placeholder={stringsoflanguages?.PostPlaceholder}
              backgroundColor={colors.silverLight}
              onChange={formik.handleChange("postCode")}
              keyboardType="number-pad"
              onBlur={() => formik.handleBlur("postCode")}
            />
            {formik.touched.postCode && formik.errors.postCode && (
              <Text style={styles.errorText}>{formik.errors.postCode}</Text>
            )}
            <TextField2
              value={formik.values.fullAddress}
              name={stringsoflanguages?.FullAddress}
              placeholder={stringsoflanguages?.FullAddressPlaceholder}
              backgroundColor={colors.silverLight}
              multiline={true}
              styles={{
                height: RFValue(100),
                alignItems: "flex-start",
              }}
              onChange={formik.handleChange("fullAddress")}
              onBlur={() => formik.handleBlur("fullAddress")}
            />
            {formik.touched.fullAddress && formik.errors.fullAddress && (
              <Text style={styles.errorText}>{formik.errors.fullAddress}</Text>
            )}

            <Button
              loader={loading}
              onPress={formik.handleSubmit}
              border={false}
              name={
                address
                  ? stringsoflanguages?.Update
                  : stringsoflanguages?.AddAddress
              }
            />
            <Button
              border={true}
              name={stringsoflanguages?.Cancel}
              onPress={() => hideModal()}
            />
            <GapV />
          </View>
        </KeyboardAwareScrollView>
      </Modal>

      <PickLocationModal
        selectedRegion={selectedRegion}
        setSelectedRegion={setSelectedRegion}
        isVisible={mapVisible}
        handlePick={handlePickLocation}
      />
    </>
  );
}

const styles = StyleSheet.create({
  modal: {
    // flex: 1,
    backgroundColor: colors.TransperantBlack,
  },

  modalcontainer: {
    flexGrow: 1,
    paddingHorizontal: RFValue(10),
    paddingTop: RFValue(70),
    paddingBottom: RFValue(10),
  },
  ModelViewContainer: {
    flex: 1,
    backgroundColor: colors.White,
    paddingHorizontal: RFValue(20),
    paddingVertical: RFValue(20),
    borderRadius: RFValue(20),
    // borderTopLeftRadius: RFValue(30),
    // borderTopRightRadius: RFValue(30),
  },

  iconBtn: {
    alignSelf: "flex-end",
  },
  errorText: {
    fontSize: RFPercentage(1.3),
    fontFamily: Fonts.Medium,
    color: colors.Red,
    top: RFValue(-10),
  },
});
