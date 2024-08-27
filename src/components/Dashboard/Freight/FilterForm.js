import { useFormik } from "formik";
import React, { useState, useEffect, useCallback } from "react";
import { Image, View, StyleSheet, TouchableOpacity, Modal } from "react-native";
import { ScrollView } from "react-native-gesture-handler";
import { IconButton } from "react-native-paper";
import { RFValue } from "react-native-responsive-fontsize";

import { ModalSelector } from "../../../common/Component/ModalSelection";
import * as colors from "../../../common/colors";
import { GapV } from "../../../common/Component/gap";
import DropDownField from "../../../common/Component/DropDownField";
import { Style } from "../../../common/Style";
import { TextLarge, TextMed } from "../../../common/Component/Text";
import * as Api from "../../../common/Api";
import NetChecker2 from "../../../common/Component/Network";
import CheckBox from "@react-native-community/checkbox";
import { DatePickerButton } from "../../../common/Component/DatePickerButton";
import StringsOfLanguages from "../../../Localization/stringsoflanguages";

let handleModalSelector;
let dropDownModalTitle;
// let dropDownList = [];
let modalIDPropertyName = "code";
let customDropDownSearchHandler;
// cityId

function FilterForm({ loading, onSubmit, isVisible, hideModal, onReset }) {
  const [countryList, setCountryList] = useState([]);
  const [fromCityList, setFromCityList] = useState([]);
  const [toCityList, setToCityList] = useState([]);
  const [dropDownList, setdropDownList] = useState([]);
  const [dropDownModalVisible, setDropDownModalVisible] = useState(false);
  const [reload, setReload] = useState(false);

  const formik = useFormik({
    initialValues: {
      fromCountry: null,
      fromCity: null,
      toCountry: null,
      toCity: null,
      plannedDepartureDate: null,
      trailerSuitable: "N",
    },
    onSubmit: async (values) => {
      await onSubmit(values);
      // formik.resetForm({});
      // setReload(!reload);
    },
    onReset: () => {
      handleReset();
    },
    // validationSchema: uploadValidationSchema,
  });

  const handleReset = () => {
    setToCityList([]);
    setFromCityList([]);
    onReset();
  };

  const handleTrailerSuitable = formik.handleChange("trailerSuitable");

  const onPressModalFromCountry = (v) => {
    dropDownModalTitle = "From Country";
    handleModalSelector = setFromCountry;
    setdropDownList(countryList);
    modalIDPropertyName = "code";
    customDropDownSearchHandler = null; // emptying search handle back
    setDropDownModalVisible(true);
  };
  const onPressModalFromCity = () => {
    dropDownModalTitle = "From City";
    handleModalSelector = setFromCity;
    setdropDownList(fromCityList);
    modalIDPropertyName = "cityId";
    customDropDownSearchHandler = handleFromCitySearch;
    setDropDownModalVisible(true);
  };
  const onPressModalToCountry = () => {
    dropDownModalTitle = "To Country";
    handleModalSelector = setToCountry;
    setdropDownList(countryList);
    modalIDPropertyName = "code";
    customDropDownSearchHandler = null; // emptying search handle back
    setDropDownModalVisible(true);
  };
  const onPressModalToCity = () => {
    dropDownModalTitle = "To City";
    handleModalSelector = setToCity;
    setdropDownList(toCityList);
    modalIDPropertyName = "cityId";
    customDropDownSearchHandler = handleToCitySearch;
    setDropDownModalVisible(true);
  };

  // COUNTRY API
  const callCountryListApi = async () => {
    if (!(await NetChecker2())) return;
    let res = await Api.GetCountries();
    if (res[1] === 200) {
      setCountryList(res[0]);
    }
  };

  // FROM CITY API
  const callFromCityListApi = async ({
    countryCode,
    searchTxt = "",
    pageIndex = 0,
    pageCount = 20,
  }) => {
    if (!(await NetChecker2())) return;
    let param = {
      countryCode,
      searchTxt,
      pageIndex,
      pageCount,
    };
    let res = await Api.GetCity(param);
    if (res[1] === 200) {
      setFromCityList(res[0]);
      return res[0];
    }

    return [];
  };

  //TO CITY API
  const callToCityListApi = async ({
    countryCode,
    searchTxt = "",
    pageIndex = 0,
    pageCount = 20,
  }) => {
    if (!(await NetChecker2())) return;
    let param = {
      countryCode,
      searchTxt,
      pageIndex,
      pageCount,
    };
    let res = await Api.GetCity(param);
    if (res[1] === 200) {
      setToCityList(res[0]);
      return res[0];
    }
    return [];
  };

  // get Country
  useEffect(() => {
    const effect = async () => {
      callCountryListApi();
    };
    effect();
  }, []);

  // getFromCity
  useEffect(() => {
    const effect = async () => {
      callFromCityListApi({ countryCode: formik.values.fromCountry.id });
    };
    if (formik.values.fromCountry) {
      effect();
    }
  }, [formik.values.fromCountry]);

  // getToCity
  useEffect(() => {
    const effect = async () => {
      callToCityListApi({ countryCode: formik.values.toCountry.id });
    };
    if (formik.values.toCountry) {
      effect();
    }
  }, [formik.values.toCountry]);

  // handleFromCitySearchWithApi
  const handleFromCitySearch = async (txt) => {
    if (formik.values.fromCountry) {
      let res = await callFromCityListApi({
        countryCode: formik.values.fromCountry.id,
        searchTxt: txt,
      });

      setdropDownList(res);
    }
  };

  // handle To City Search
  const handleToCitySearch = async (txt) => {
    if (formik.values.toCountry) {
      let res = await callToCityListApi({
        countryCode: formik.values.toCountry.id,
        searchTxt: txt,
      });
      setdropDownList(res);
    }
  };

  const setFromCountry = (name, id) => {
    console.log(" ", name, id);
    formik.setFieldValue("fromCountry", { name, id });
    formik.setFieldError("fromCountry", null);
    formik.setFieldTouched("fromCountry", false);
    setFromCity(null);
  };

  const setFromCity = (name, id) => {
    if (name === null) {
      formik.setFieldValue("fromCity", null);
      return;
    }
    console.log(" ", name, id);
    formik.setFieldValue("fromCity", { name, id });
    formik.setFieldError("fromCity", null);
    formik.setFieldTouched("fromCity", false);
  };

  const setToCountry = (name, id) => {
    console.log(" ", name, id);
    formik.setFieldValue("toCountry", { name, id });
    formik.setFieldError("toCountry", null);
    formik.setFieldTouched("toCountry", false);
    setToCity(null);
  };

  const setToCity = (name, id) => {
    if (name === null) {
      formik.setFieldValue("toCity", null);
      return;
    }
    console.log(" ", name, id);
    formik.setFieldValue("toCity", { name, id });
    formik.setFieldError("toCity", null);
    formik.setFieldTouched("toCity", false);
  };

  const setPlannedDepartureDate = (date) => {
    formik.setFieldValue("plannedDepartureDate", date);
    formik.setFieldError("plannedDepartureDate", null);
    formik.setFieldTouched("plannedDepartureDate", false);
  };

  return (
    <>
      <Modal animationType={"none"} transparent={true} visible={isVisible}>
        <ScrollView
          style={styles.modal}
          contentContainerStyle={[styles.modalcontainer]}
        >
          <View style={styles.ModelViewContainer}>
            <IconButton
              icon={"close"}
              style={styles.iconBtn}
              onPress={hideModal}
            />

            <DropDownField
              name={StringsOfLanguages.FromCountry}
              placeholder={StringsOfLanguages.SelectCountry}
              value={formik.values.fromCountry?.name}
              onPress={onPressModalFromCountry}
            />
            <GapV />

            <DropDownField
              name={StringsOfLanguages.FromCity}
              placeholder={StringsOfLanguages.SelectCity}
              value={formik.values.fromCity?.name}
              onPress={onPressModalFromCity}
            />
            <GapV />

            <DropDownField
              name={StringsOfLanguages.ToCountry}
              placeholder={StringsOfLanguages.SelectCountry}
              value={formik.values.toCountry?.name}
              onPress={onPressModalToCountry}
            />
            <GapV />

            <DropDownField
              name={StringsOfLanguages.ToCity}
              placeholder={StringsOfLanguages.SelectCity}
              value={formik.values.toCity?.name}
              onPress={onPressModalToCity}
            />

            <DatePickerButton
              onChange={setPlannedDepartureDate}
              title={StringsOfLanguages.Departure_Date}
              stateDate={formik.values.plannedDepartureDate}
            />

            {/* TRAILER CHECKBOX */}
            <TextMed>{StringsOfLanguages.SuitableTrailer}</TextMed>
            <View style={styles.checkboxRow}>
              <CheckBox
                value={formik.values.trailerSuitable === "Y"}
                onValueChange={() =>
                  handleTrailerSuitable(
                    formik.values.trailerSuitable === "Y" ? "N" : "Y"
                  )
                }
              />
            </View>

            <GapV />

            <TouchableOpacity
              style={Style.signInBtn}
              onPress={formik.handleSubmit}
            >
              <TextLarge style={styles.submitBtn}>
                {StringsOfLanguages.Submit}
              </TextLarge>
            </TouchableOpacity>

            <GapV />

            <TouchableOpacity
              style={Style.signInBtn}
              onPress={formik.handleReset}
            >
              <TextLarge style={styles.submitBtn}>
                {StringsOfLanguages.ResetFilters}
              </TextLarge>
            </TouchableOpacity>
          </View>
        </ScrollView>

        <ModalSelector
          visible={dropDownModalVisible}
          title={dropDownModalTitle}
          data={dropDownList || []}
          SearchOptionExist={true}
          IDPropertyName={modalIDPropertyName}
          searchHandler={customDropDownSearchHandler}
          onPress={(text, id) => {
            handleModalSelector(text, id);
            setDropDownModalVisible(false);
          }}
          closeModal={() => setDropDownModalVisible(false)}
        />
      </Modal>
    </>
  );
}

export default FilterForm;

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

  checkboxRow: {
    flexDirection: "row",
    alignItems: "center",
  },

  submitBtn: { color: colors.White },

  resetBtn: {},
});

//   Style.listComponentContainerView
