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
import stringsoflanguages from "../../../../Localization/stringsoflanguages";
import MaterialIcons from "react-native-vector-icons/MaterialIcons";

import {
  TextField2,
  TextFieldWithIcon2,
} from "../../../../common/Component/TextField";
import { ScrollView } from "react-native-gesture-handler";
import Button from "../../../../common/Component/Button";
import { useDispatch, useSelector } from "react-redux";
import { GetAddressList, GetCityAction } from "../../../../Redux/actions";
import Api from "../../../../common/Api";
import TabBar from "./TabBar";
import { Formik, useFormik } from "formik";
import * as Yup from "yup";
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";
import { GapV } from "../../../../common/Component/gap";
import {
  TextSmall,
  TextMed,
  TextMuted,
  TextLarge,
} from "../../../../common/Component/Text";
import NetChecker2 from "../../../../common/Component/Network";
import Loader from "../../../../common/Component/Loader";
import AddAddressForm from "../../Addresses/addAddressForm";
import { getCountriesAsync } from "react-native-country-picker-modal/lib/CountryService";
import PickLocationModal from "../../../../common/Component/PickLocationModal";

export default function CreateFreightStep2(props) {
  const title = props?.route?.params?.title;
  const prevData = JSON.parse(props?.route?.params?.data ?? {});

  const [arrivalLocationModal, setArrivalLocationModal] = useState(false);
  const [arrivalLocationValue, setArrivalLocationValue] = useState("");
  const [loadingLocationModal, setLoadingLocationModal] = useState(false);
  const [loadingLocationValue, setLoadingLocationValue] = useState("");
  const [activeTab, setActiveTab] = useState("existingAddress");
  const [loading, setLoading] = useState(false);
  const [addressFormVisible, setAddressFormVisible] = useState(false);
  //New
  const [fromCountryModal, setFromCountryModal] = useState(false);
  const [toCountryModal, setToCountryModal] = useState(false);
  const [fromCityModal, setFromCityModal] = useState(false);
  const [toCityModal, setToCityModal] = useState(false);
  const [fromCountryCode, setFromCountryCode] = useState("");
  const [fromCountryObject,setFromCountryObject] = useState({})
  const [toCountryObject,setToCountryObject] = useState({})
  const [toCountryCode, setToCountryCode] = useState("");
  const [fromCityObject,setFromCityObject] = useState({})
  const [toCityObject,setToCityObject] = useState({})
  const [fromCityCode, setFromCityCode] = useState("");
  const [toCityCode, setToCityCode] = useState("");
  const [fromMapLocation, setFromMapLocation] = useState(null);
  const [toMapLocation, setToMapLocation] = useState(null);
  const [countryCodesArr, setCountryCodesArr] = useState([]);
  const [countryArr, setCountryArr] = useState([]);
  const [mapVisible, setMapVisible] = useState(false);
  const [selectedRegion, setSelectedRegion] = useState(null); // for edit address
  const [mapLoading, setMapLoading] = useState(false);
  const [toMapLoading, setToMapLoading] = useState(false);
  const [fromAddressDetails, setFromAddressDetails] = useState(false);
  const [toAddressDetails, setToAddressDetails] = useState(false);
  const [toggleMapFromTo, setToggleMapFromTo] = useState(false);
  const [fromAddressText,setFromAddressText]=useState("")
  const [toAddressText,setToAddressText]=useState("")
  const tempSelectedFromCity = useRef(null);
  const tempSelectedToCity = useRef(null);

  const dispatch = useDispatch();

  const { data: addressListData, loader: addressLoader } = useSelector(
    (state) => state.GetAddressData
  );

  const { data: cityData, GetCitySuccess } = useSelector(
    (state) => state.CityData
  );
  const { data: countryData, GetCountrySuccess } = useSelector(
    (state) => state.CountryData
  );

  const validationSchemaExistingAddress = Yup.object().shape({
    loadingLocation: Yup.string()
      .required(stringsoflanguages.DepartureLocationRequired)
      .label(stringsoflanguages.DepartureLocation),
    arrivalLocation: Yup.string()
      .required(stringsoflanguages.ArrivalLocationRequired)
      .test(
        "arrivalLocationTest",
        "Arrival Location cannot be same as Loading Location",
        function (arrivalLocation) {
          // const { loadingLocation } = this.parent;
          if (arrivalLocationValue === loadingLocationValue) return false;
          return true;
        }
      )
      .label(stringsoflanguages.ArrivalLocation),
  });

  const validationSchemaNewAddress = Yup.object().shape({
    fromCountry: Yup.string()
      .required(stringsoflanguages.CountryRequired)
      .label("Country"),
    fromCity: Yup.string().required(stringsoflanguages?.CityRequired),
    fromDistrict: Yup.string(),
    fromNeighborhood: Yup.string(),
    fromStreet: Yup.string(),
    fromStreetNo: Yup.string(),

    toCountry: Yup.string()
      .required(stringsoflanguages.CountryRequired)
      .label("Country"),
    toCity: Yup.string().required(stringsoflanguages?.CityRequired),
    toDistrict: Yup.string(),
    toNeighborhood: Yup.string(),
    toStreet: Yup.string(),
    toStreetNo: Yup.string(),
  });

  const formik = useFormik({
    initialValues: {
      loadingLocation: "",
      arrivalLocation: "",
      fromCountry: "",
      fromCity: "",
      fromDistrict: "",
      fromNeighborhood: "",
      fromStreet: "",
      fromStreetNo: "",
      toCountry: "",
      toCity: "",
      toDistrict: "",
      toNeighborhood: "",
      toStreet: "",
      toStreetNo: "",
    },
    onSubmit: (values, { resetForm }) => {
      onSubmitHandler(values, resetForm);
    },
    // onReset: () => {
    //   if (removeEditAddress) removeEditAddress();
    // },
    validationSchema:
      activeTab == "existingAddress"
        ? validationSchemaExistingAddress
        : validationSchemaNewAddress,
  });

  useEffect(() => {
    dispatch(GetAddressList("", 0, 1000));
    return () => {};
  }, []);

  //   set country array from backend
  useEffect(() => {
    if (countryData)
      (async () => {
        const currentCountryCode = await getCountriesAsync();
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

  useEffect(() => {
    if (fromCountryCode)
      dispatch(
        GetCityAction({
          searchTxt: "",
          countryCode: fromCountryCode,
          pageIndex: 0,
          pageCount: 100,
        })
      );
  }, [fromCountryCode]);

  useEffect(() => {
    if (toCountryCode)
      dispatch(
        GetCityAction({
          searchTxt: "",
          countryCode: toCountryCode,
          pageIndex: 0,
          pageCount: 100,
        })
      );
  }, [toCountryCode]);

  useEffect(() => {
    if (addressLoader) setLoading(true);
    else setLoading(false);
  }, [addressLoader]);

  // useEffect(() => {
  //   handleSetCityFromMap(
  //     toggleMapFromTo
  //       ? tempSelectedFromCity.current
  //       : tempSelectedToCity.current,
  //       cityData
  //   );
  // }, [cityData]);

  const handleSetCityFromMap = (city,citites) => {
    if (city && citites) {
      try {
        let cityfind = citites?.find(
          (item) => item?.originalName.toLowerCase().includes(city.toLowerCase())
        );
        console.log("HandleCity", cityfind, city,citites.length);
        if (cityfind) {
          formik?.setFieldValue(
            toggleMapFromTo ? "fromCity" : "toCity",
            cityfind?.name
          );
          toggleMapFromTo ? setFromCityObject(cityfind) : setToCityObject(cityfind)
          toggleMapFromTo ? setFromCityCode(cityfind?.cityId):setToCityCode(cityfind?.cityId);
        }
      } catch (e) {
        console.error(e);
      }
    }
  };

  const handlePickLocation = async (response) => {
    // console.log("APi Response DAta --->>>>>>>", JSON.stringify(response));
    const { region, geoAddress, extractedAddressData } = response;
    setMapVisible(false);
    toggleMapFromTo ? setFromMapLocation(region) : setToMapLocation(region);

    console.log(JSON.stringify(extractedAddressData, null, 2));
    pickLocationControl(extractedAddressData);
  };

  const pickLocationControl = async (addressData) => {
    console.log("Api Response Data --->>>>>>>>", JSON.stringify(addressData));
    // formik.resetForm();
    tempSelectedFromCity.current = null;
    tempSelectedToCity.current = null;
    if (addressData) {
      toggleMapFromTo ? setFromAddressText(addressData?.addressText) : setToAddressText(addressData?.addressText) 
      addressData?.streetNo &&
        formik?.setFieldValue(
          toggleMapFromTo ? "fromStreetNo" : "toStreetNo",
          addressData?.streetNo
        );
      addressData?.street &&
        formik?.setFieldValue(
          toggleMapFromTo ? "fromStreet" : "toStreet",
          addressData?.street
        );
      addressData?.district &&
        formik?.setFieldValue(
          toggleMapFromTo ? "fromDistrict" : "toDistrict",
          addressData?.district
        );
      (addressData?.neighborhood || addressData?.town) &&
        formik?.setFieldValue(
          toggleMapFromTo ? "fromNeighborhood" : "toNeightborhood",
          addressData?.neighborhood || addressData?.town
        );
      if (addressData?.country) {
        let selectedCountry = countryArr?.find(
          (v) => v.code == addressData?.country
        );
        console.log(
          ">country",
          toggleMapFromTo,
          selectedCountry?.code,
          fromCountryCode,
          addressData?.city
        );

          const response = await Api.GetCity({countryCode:selectedCountry?.code,searchTxt:"",pageIndex:0,pageCount:100});
          if (response[1] === 200) {
            handleSetCityFromMap(addressData?.city,response[0]);
          }
        toggleMapFromTo ? setFromCountryObject(selectedCountry) : setToCountryObject(selectedCountry)
        toggleMapFromTo
        ? setFromCountryCode(selectedCountry?.code)
        : setToCountryCode(selectedCountry?.code);
        formik?.setFieldValue(
          toggleMapFromTo ? "fromCity" : "toCity",
          addressData?.city
        );
        formik?.setFieldValue(
          toggleMapFromTo ? "fromCountry" : "toCountry",
          selectedCountry?.name
        );
      }
      if (addressData?.city) {
        toggleMapFromTo
          ? (tempSelectedFromCity.current = addressData?.city)
          : (tempSelectedToCity.current = addressData?.city);
      }
    }
  };

  const onSubmitHandler = (values) => {
    if (activeTab == "existingAddress") {
      getDistanceMatrixApi({
        fromCityId: loadingLocationValue?.city?.cityId,
        toCityId: arrivalLocationValue?.city?.cityId,
        values
      });
    } else {
      getDistanceMatrixApi({
        fromCityId: fromCityCode,
        toCityId: toCityCode,
        values
      });
    }
  };

  const hideAddressForm = () => {
    setAddressFormVisible(false);
  };

  const showAddressForm = () => {
    setAddressFormVisible(true);
  };

  const handleTabChange = (tab) => {
    setActiveTab(tab);
    // showAddressForm();
  };
  const handleOpenMap = (toggle) => {
    if (toggle == "from") {
      setToggleMapFromTo(true);
    } else {
      setToggleMapFromTo(false);
    }
    setMapVisible(true);
  };

  //TO CITY API
  const getDistanceMatrixApi = async ({ fromCityId, toCityId, values }) => {
    setLoading(true);
    if (!(await NetChecker2())) return;
    let param = {
      fromCityId,
      toCityId,
    };
    let res = await Api.GetDistanceMatrix(param);
    if (res[1] === 200) {
      console.log("Distance matrix",fromCountryObject,toCountryObject)
    let newAddressFrom = {
      "city":{
        "name":fromCityObject?.name ,
        "cityId":fromCityId? fromCityId : fromCityObject?.cityId,
        "latitude":fromCityObject?.latitude,
        "longitude":fromCityObject?.longitude,
        "originalName":fromCityObject?.originalName,
      },
      "country":{
        "name": values?.fromCountry,
        "code": fromCountryObject?.code,
        "phoneCode":fromCountryObject?.phoneCode
      },
      "addressText":fromAddressText,
      "district":values?.toDistrict,
      "latitude":null,
      "longitude":null,
      "neighborhood":values?.fromNeighborhood,
      "postCode":values?.fromPostCode,
      "street":values?.fromStreet,
      "streetNumber":values?.formStreetNo,
    }
    let newAddressTo = {
      "city":{
        "name": values?.toCity ? values.toCity : toCityObject.name ,
        "cityId":toCityId? toCityId : toCityObject?.cityId,
        "latitude":toCityObject?.latitude,
        "longitude":toCityObject?.longitude,
        "originalName":toCityObject?.originalName,
      },
      "country":{
        "name": values.toCountry,
        "code": toCountryObject?.code,
        "phoneCode":toCountryObject?.phoneCode
      },
      "addressText":toAddressText,
      "district":values.toDistrict,
      "latitude":null,
      "longitude":null,
      "neighborhood":values?.toNeighborhood,
      "postCode":values?.toPostCode,
      "street":values?.toStreet,
      "streetNumber":values?.toStreetNo,
    }
      const data = {
        fromAddress: activeTab == "existingAddress" ? loadingLocationValue : newAddressFrom,
        toAddress: activeTab == "existingAddress" ? arrivalLocationValue: newAddressTo,
        distanceMatrix: res[0],
        ...prevData,
      };

      // console.log("res", res);

      props.navigation.navigate("CreateFreightStep3", {
        data: JSON.stringify(data),
        cityDistanceMatrix: true,
      });
    } else {
      alert(stringsoflanguages.Alert);
    }
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

      <TextLarge style={styles.subTitle}>
        {stringsoflanguages.FromWhereToWhere}
      </TextLarge>
      <TabBar activeTab={activeTab} onTabChange={handleTabChange} />

      <KeyboardAwareScrollView showsVerticalScrollIndicator={false}>
        <ScrollView showsVerticalScrollIndicator={false}>
          <View style={styles.container}>
            {activeTab == "existingAddress" ? (
              <>
                <View
                  style={{
                    justifyContent: "flex-end",
                    alignItems: "flex-end",
                    marginTop: RFValue(5),
                    marginBottom: RFValue(15),
                  }}
                >
                  <Pressable onPress={showAddressForm} style={styles.addNew}>
                    <Text style={styles.addNewText}>
                      {stringsoflanguages.AddNewAddress}
                    </Text>
                  </Pressable>
                </View>

                <TextFieldWithIcon2
                  name={stringsoflanguages.DepartureLocation}
                  editable={false}
                  value={formik.values.loadingLocation}
                  onSearch={(v) => {
                    dispatch(GetAddressList(v, 0, 1000));
                  }}
                  placeholder={stringsoflanguages.SelectDepartureLocation}
                  backgroundColor={colors.silverLight}
                  onPress={() => setLoadingLocationModal(true)}
                  styles={{ justifyContent: "space-between", zIndex: 1 }}
                  onClick={() => setLoadingLocationModal(false)}
                  cModal={loadingLocationModal}
                  modalData={(addressListData && addressListData[0]) || []}
                  showValue={["description"]}
                  setCity={(e) => {
                    setLoadingLocationValue(e);
                    formik.setFieldValue("loadingLocation", e.description);
                  }}
                />
                {formik.touched.loadingLocation &&
                  formik.errors.loadingLocation && (
                    <Text style={styles.errorText}>
                      {formik.errors.loadingLocation}
                    </Text>
                  )}

                <TextFieldWithIcon2
                  name={stringsoflanguages.ArrivalLocation}
                  editable={false}
                  value={formik.values.arrivalLocation}
                  placeholder={stringsoflanguages.SelectArrivalLocation}
                  backgroundColor={colors.silverLight}
                  onSearch={(v) => {
                    dispatch(GetAddressList(v, 0, 1000));
                  }}
                  onPress={() => setArrivalLocationModal(true)}
                  styles={{ justifyContent: "space-between", zIndex: 1 }}
                  onClick={() => setArrivalLocationModal(false)}
                  cModal={arrivalLocationModal}
                  modalData={(addressListData && addressListData[0]) || []}
                  showValue={["description"]}
                  setModalValue={(e) => {
                    setArrivalLocationValue(e);
                    formik.setFieldValue("arrivalLocation", e.description);
                  }}
                />
                {formik.touched.arrivalLocation &&
                  formik.errors.arrivalLocation && (
                    <Text style={styles.errorText}>
                      {formik.errors.arrivalLocation}
                    </Text>
                  )}

                <TextMuted>{stringsoflanguages.TwostepLeft}</TextMuted>
              </>
            ) : (
              <>
                <Text style={styles.fromToText}>{stringsoflanguages.DepartureLocation}</Text>
                <Button
                  loader={mapLoading}
                  onPress={() => handleOpenMap("from")}
                  border={true}
                  name={"Select from map"}
                  icon="location"
                  style={styles.mapButton}
                />
                <TextFieldWithIcon2
                  name={stringsoflanguages?.Country}
                  editable={false}
                  value={formik.values.fromCountry}
                  placeholder={stringsoflanguages?.CountryPlaceholder}
                  backgroundColor={colors.silverLight}
                  onPress={() => setFromCountryModal(true)}
                  styles={{ justifyContent: "space-between", zIndex: 1 }}
                  onClick={() => setFromCountryModal(false)}
                  cModal={fromCountryModal}
                  countryCodesArr={countryCodesArr || []}
                  setCountry={(d) => {
                    formik.setFieldValue("fromCountry", d.name);
                    setFromCountryCode(d.cca2);
                    setFromCountryObject({"code": d.cca2, "name": d?.name, "phoneCode": d?.callingCode?.[0]})
                    setFromCityCode(null);
                    formik.setFieldValue("fromCity", "");
                    tempSelectedFromCity.current = null;
                  }}
                />
                {formik.touched.fromCountry && formik.errors.fromCountry && (
                  <Text style={styles.errorText}>
                    {formik.errors.fromCountry}
                  </Text>
                )}
                <TextFieldWithIcon2
                  name={stringsoflanguages?.City}
                  editable={false}
                  value={formik.values.fromCity}
                  placeholder={stringsoflanguages?.SelectCity}
                  backgroundColor={colors.silverLight}
                  onSearch={(v) => {
                    GetCityAction({
                      searchTxt: v,
                      countryCode: fromCountryCode,
                      pageIndex: 0,
                      pageCount: 100,
                    });
                  }}
                  onPress={() =>
                    formik.values.fromCountry !== ""
                      ? setFromCityModal(true)
                      : alert("Select country first")
                  }
                  styles={{ justifyContent: "space-between", zIndex: 1 }}
                  onClick={() => setFromCityModal(false)}
                  cModal={fromCityModal}
                  cityData={cityData && cityData[0]}
                  setCity={(e) => {
                    setFromCityCode(e.cityId);
                    setFromCityObject(e)
                    formik.setFieldValue("fromCity", e.name);
                  }}
                />
                {formik.touched.fromCity && formik.errors.fromCity && (
                  <Text style={styles.errorText}>{formik.errors.fromCity}</Text>
                )}
                <View style={styles.rowContainer}>
                  <MaterialIcons
                    onPress={() => setFromAddressDetails(!fromAddressDetails)}
                    size={RFValue(25)}
                    color={fromAddressDetails ? colors.LimeGreen : colors.Grey}
                    name={
                      fromAddressDetails
                        ? "check-box"
                        : "check-box-outline-blank"
                    }
                  />
                  <Text
                    style={[
                      styles.showAddressDetails,
                      {
                        color: fromAddressDetails
                          ? colors.LimeGreen
                          : colors.Grey,
                      },
                    ]}
                  >
                    Show address details
                  </Text>
                </View>
                {fromAddressDetails && (
                  <>
                    <TextField2
                      value={formik.values.fromDistrict}
                      name={stringsoflanguages?.District}
                      placeholder={stringsoflanguages?.DistrictPlaceholder}
                      backgroundColor={colors.silverLight}
                      onChange={formik.handleChange("fromDistrict")}
                      onBlur={() => formik.handleBlur("fromDistrict")}
                    />
                    {formik.touched.fromDistrict &&
                      formik.errors.fromDistrict && (
                        <Text style={styles.errorText}>
                          {formik.errors.fromDistrict}
                        </Text>
                      )}

                    <TextField2
                      value={formik.values.fromNeighborhood}
                      name={stringsoflanguages?.Neighborhood}
                      placeholder={stringsoflanguages?.NeighborhoodPlaceholder}
                      backgroundColor={colors.silverLight}
                      onChange={formik.handleChange("fromNeighborhood")}
                      onBlur={() => formik.handleBlur("fromNeighborhood")}
                    />
                    {formik.touched.fromNeighborhood &&
                      formik.errors.fromNeighborhood && (
                        <Text style={styles.errorText}>
                          {formik.errors.fromNeighborhood}
                        </Text>
                      )}
                    <TextField2
                      value={formik.values.fromStreet}
                      name={stringsoflanguages?.Street}
                      placeholder={stringsoflanguages?.StreetPlaceholder}
                      backgroundColor={colors.silverLight}
                      onChange={formik.handleChange("fromStreet")}
                      onBlur={() => formik.handleBlur("fromStreet")}
                    />
                    {formik.touched.fromStreet && formik.errors.fromStreet && (
                      <Text style={styles.errorText}>
                        {formik.errors.fromStreet}
                      </Text>
                    )}
                    <TextField2
                      value={formik.values.fromStreetNo}
                      name={stringsoflanguages?.StreetNo}
                      placeholder={stringsoflanguages?.StreetNoPlaceholder}
                      backgroundColor={colors.silverLight}
                      onChange={formik.handleChange("fromStreetNo")}
                      onBlur={() => formik.handleBlur("fromStreetNo")}
                    />
                    {formik.touched.fromStreetNo &&
                      formik.errors.fromStreetNo && (
                        <Text style={styles.errorText}>
                          {formik.errors.fromStreetNo}
                        </Text>
                      )}
                  </>
                )}

                <Text style={styles.fromToText}>{stringsoflanguages.ArrivalLocation}</Text>

                <Button
                  loader={mapLoading}
                  onPress={() => handleOpenMap("to")}
                  border={true}
                  name={"Select from map"}
                  icon="location"
                  style={styles.mapButton}
                />

                <TextFieldWithIcon2
                  name={stringsoflanguages?.Country}
                  editable={false}
                  value={formik.values.toCountry}
                  placeholder={stringsoflanguages?.CountryPlaceholder}
                  backgroundColor={colors.silverLight}
                  onPress={() => setToCountryModal(true)}
                  styles={{ justifyContent: "space-between", zIndex: 1 }}
                  onClick={() => setToCountryModal(false)}
                  cModal={toCountryModal}
                  countryCodesArr={countryCodesArr || []}
                  setCountry={(d) => {
                    formik.setFieldValue("toCountry", d.name);
                    setToCountryCode(d.cca2);
                    setToCountryObject({"code": d.cca2, "name": d?.name, "phoneCode": d?.callingCode?.[0]})
                    setToCityCode(null);
                    formik.setFieldValue("toCity", "");
                    tempSelectedToCity.current = null;
                  }}
                />
                {formik.touched.toCountry && formik.errors.toCountry && (
                  <Text style={styles.errorText}>
                    {formik.errors.toCountry}
                  </Text>
                )}
                <TextFieldWithIcon2
                  name={stringsoflanguages?.City}
                  editable={false}
                  value={formik.values.toCity}
                  placeholder={stringsoflanguages?.SelectCity}
                  backgroundColor={colors.silverLight}
                  onSearch={(v) => {
                    GetCityAction({
                      searchTxt: v,
                      countryCode: toCountryCode,
                      pageIndex: 0,
                      pageCount: 100,
                    });
                  }}
                  onPress={() =>
                    formik.values.toCountry !== ""
                      ? setToCityModal(true)
                      : alert("Select country first")
                  }
                  styles={{ justifyContent: "space-between", zIndex: 1 }}
                  onClick={() => setToCityModal(false)}
                  cModal={toCityModal}
                  cityData={cityData && cityData[0]}
                  setCity={(e) => {
                    setToCityCode(e.cityId);
                    setToCityObject(e)
                    formik.setFieldValue("toCity", e.name);
                  }}
                />
                {formik.touched.toCity && formik.errors.toCity && (
                  <Text style={styles.errorText}>{formik.errors.toCity}</Text>
                )}

                <View style={styles.rowContainer}>
                  <MaterialIcons
                    onPress={() => setToAddressDetails(!toAddressDetails)}
                    size={RFValue(25)}
                    color={toAddressDetails ? colors.LimeGreen : colors.Grey}
                    name={
                      toAddressDetails ? "check-box" : "check-box-outline-blank"
                    }
                  />
                  <Text
                    style={[
                      styles.showAddressDetails,
                      {
                        color: toAddressDetails
                          ? colors.LimeGreen
                          : colors.Grey,
                      },
                    ]}
                  >
                    Show address details
                  </Text>
                </View>
                {toAddressDetails && (
                  <>
                    <TextField2
                      value={formik.values.toDistrict}
                      name={stringsoflanguages?.District}
                      placeholder={stringsoflanguages?.DistrictPlaceholder}
                      backgroundColor={colors.silverLight}
                      onChange={formik.handleChange("toDistrict")}
                      onBlur={() => formik.handleBlur("toDistrict")}
                    />
                    {formik.touched.toDistrict && formik.errors.toDistrict && (
                      <Text style={styles.errorText}>
                        {formik.errors.toDistrict}
                      </Text>
                    )}

                    <TextField2
                      value={formik.values.toNeighborhood}
                      name={stringsoflanguages?.Neighborhood}
                      placeholder={stringsoflanguages?.NeighborhoodPlaceholder}
                      backgroundColor={colors.silverLight}
                      onChange={formik.handleChange("toNeighborhood")}
                      onBlur={() => formik.handleBlur("toNeighborhood")}
                    />
                    {formik.touched.toNeighborhood &&
                      formik.errors.toNeighborhood && (
                        <Text style={styles.errorText}>
                          {formik.errors.toNeighborhood}
                        </Text>
                      )}
                    <TextField2
                      value={formik.values.toStreet}
                      name={stringsoflanguages?.Street}
                      placeholder={stringsoflanguages?.StreetPlaceholder}
                      backgroundColor={colors.silverLight}
                      onChange={formik.handleChange("toStreet")}
                      onBlur={() => formik.handleBlur("toStreet")}
                    />
                    {formik.touched.toStreet && formik.errors.toStreet && (
                      <Text style={styles.errorText}>
                        {formik.errors.toStreet}
                      </Text>
                    )}
                    <TextField2
                      value={formik.values.toStreetNo}
                      name={stringsoflanguages?.StreetNo}
                      placeholder={stringsoflanguages?.StreetNoPlaceholder}
                      backgroundColor={colors.silverLight}
                      onChange={formik.handleChange("toStreetNo")}
                      onBlur={() => formik.handleBlur("toStreetNo")}
                    />
                    {formik.touched.toStreetNo && formik.errors.toStreetNo && (
                      <Text style={styles.errorText}>
                        {formik.errors.toStreetNo}
                      </Text>
                    )}
                  </>
                )}
              </>
            )}
            <Button
              onPress={formik.handleSubmit}
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
      </KeyboardAwareScrollView>
      <AddAddressForm
        isVisible={addressFormVisible}
        showModal={showAddressForm}
        hideModal={hideAddressForm}
      />
      <PickLocationModal
        selectedRegion={selectedRegion}
        setSelectedRegion={setSelectedRegion}
        isVisible={mapVisible}
        handlePick={handlePickLocation}
      />
      <Loader visible={loading} />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    marginTop: RFValue(10),
    paddingHorizontal: RFValue(20),
  },
  subTitle: {
    textAlign: "center",
    marginVertical: RFValue(10),
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
  fromToText: {
    fontSize: RFValue(18),
    fontFamily: Fonts.SemiBold,
    paddingBottom: RFValue(10),
    color: colors.LimeGreen,
  },
  mapButton: {
    width: "100%",
    marginBottom: 10,
  },
  rowContainer: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: RFValue(10),
  },
  showAddressDetails: {
    fontSize: RFValue(15),
    fontFamily: Fonts.Medium,
    color: colors.Grey,
    marginLeft: RFValue(5),
  },
});
