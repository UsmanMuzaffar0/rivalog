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
import { ScrollView } from "react-native-gesture-handler";
import Button from "../../../../common/Component/Button";
import { useDispatch, useSelector } from "react-redux";
import {
  AddNewInvoiceAddress,
  GetTrailerTypeListAction,
  GetTrailerFloorTypeListAction,
  GetFreightTypeList,
  GetTransportTypeList,
  GetTrailerSpecificationListAction,
} from "../../../../Redux/actions";
import { Formik } from "formik";
import * as Yup from "yup";
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";
import { GapV } from "../../../../common/Component/gap";
import {
  TextSmall,
  TextMed,
  TextMuted,
  TextLarge,
} from "../../../../common/Component/Text";
import Loader from "../../../../common/Component/Loader";

const validationSchema = Yup.object().shape({
  loadDescription: Yup.string()
    // .required(stringsoflanguages.LoadDescriptionRequired)
    .label(stringsoflanguages.LoadDescription),
  // country: Yup.object().required("Country is required").label("Country"),

  transportType: Yup.string()
    .required(stringsoflanguages.TransportTypeRequired)
    .label(stringsoflanguages.TransportType),

  freightType: Yup.string()
    .required(stringsoflanguages.FreightTypeRequired)
    .label(stringsoflanguages.FreightType),
  trailerType: Yup.string()
    // .required(stringsoflanguages.TrailerTypeRequired)
    .label(stringsoflanguages.TrailerType),
  floorType: Yup.string()
    // .required(stringsoflanguages.FloorTypeRequired)
    .label(stringsoflanguages.FloorType),
  trailerCostumization: Yup.array()
    // .required("Trailer Costumization is required")
    .label(stringsoflanguages.TrailerCostumization),
});

export default function CreateFreightStep1(props) {
  const title = props?.route?.params?.title;

  const [trailerModal, setTrailerModal] = useState(false);
  const [transportTypeModal, setTransportTypeModal] = useState(false);
  const [trailerCode, setTrailerCode] = useState("");
  const [trailerTypeDisabled, setTrailerTypeDisabled] = useState(true);
  const [transportTypeCode, setTransportTypeCode] = useState("");
  const [floorModal, setFloorModal] = useState(false);
  const [floorCode, setFloorCode] = useState("");
  const [freightTypeModal, setFreightTypeModal] = useState(false);
  const [freightTypeCode, setFreightTypeCode] = useState("");
  const [loading, setLoading] = useState(false);
  const [selectedTransportId, setSelectedTransportId] = useState("");

  const dispatch = useDispatch();
  const { data: freightTypesListData, loader: freightLoader } = useSelector(
    (state) => state.FreightTypeList
  );
  const { data: trailerData, loader: trailerLoader } = useSelector(
    (state) => state.TrailerTypeList
  );
  const { data: transportTypeListData, loader: transportLoader } = useSelector(
    (state) => state.TransportTypeList
  );
  const { data: floorData, floorLoader } = useSelector(
    (state) => state.TrailerFloorTypeList
  );
  const { data: trailerSpecificationListData, loader: specificationLoader } =
    useSelector((state) => state.TrailerSpecificationList);

  useEffect(() => {
    dispatch(GetTrailerFloorTypeListAction("", 0, 1000));
    dispatch(GetFreightTypeList("", 0, 1000));
    dispatch(GetTransportTypeList("", 0, 1000));
  }, []);

  useEffect(() => {
    if (selectedTransportId !== "") {
      dispatch(GetTrailerTypeListAction("", 0, 20, selectedTransportId));
    }
    // other dispatch calls
  }, [selectedTransportId]);

  useEffect(() => {
    if (freightLoader || floorLoader || specificationLoader) {
      setLoading(true);
    } else setLoading(false);
  }, [freightLoader, trailerLoader, floorLoader, specificationLoader]);

  const onSubmitHandler = (values) => {
    const data = {
      description: values?.loadDescription,
      trailerType: trailerCode,
      transportType: {
        transportTypeId: transportTypeCode?.transportTypeId,
      },
      floorType: floorCode,
      freightType: freightTypeCode,
      specificationList: values?.trailerCostumization,
    };

    props.navigation.navigate("CreateFreightStep2", {
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
        BackAction={props.navigation.toggleDrawer}
      />
      <KeyboardAwareScrollView showsVerticalScrollIndicator={false}>
        <Formik
          initialValues={{
            freightType: "",
            loadDescription: "",
            transportType: "",
            trailerType: "",
            floorType: "",
            trailerCostumization: [],
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
            const handleSpecificationChange = (item, isSelected) => {
              if (isSelected) {
                // selected == true ? remove item
                let index = values.trailerCostumization.indexOf(item);
                if (index > -1) {
                  let temp = values.trailerCostumization;
                  temp.splice(index, 1);
                  setFieldValue("trailerCostumization", temp);
                }
              } else {
                setFieldValue("trailerCostumization", [
                  ...values.trailerCostumization,
                  item,
                ]);
              }
            };

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
                    {stringsoflanguages.VehicleOption}
                  </TextLarge>

                  <TextFieldWithIcon2
                    name={stringsoflanguages.FreightType}
                    editable={false}
                    value={values.freightType}
                    placeholder={stringsoflanguages.SelectFreightType}
                    backgroundColor={colors.silverLight}
                    onPress={() => setFreightTypeModal(true)}
                    styles={{ justifyContent: "space-between", zIndex: 1 }}
                    onClick={() => setFreightTypeModal(false)}
                    cModal={freightTypeModal}
                    modalData={
                      (freightTypesListData && freightTypesListData[0]) || []
                    }
                    showValue={["description"]}
                    setCity={(e) => {
                      setFreightTypeCode(e);
                      setFieldValue("freightType", e.description);
                    }}
                  />
                  {touched.freightType && errors.freightType && (
                    <Text style={styles.errorText}>{errors.freightType}</Text>
                  )}

                  <TextField2
                    name={stringsoflanguages.LoadDescription}
                    placeholder={stringsoflanguages.EnterLoadDescription}
                    backgroundColor={colors.silverLight}
                    onChange={handleChange("loadDescription")}
                    onBlur={handleBlur("loadDescription")}
                  />
                  {touched.loadDescription && errors.loadDescription && (
                    <Text style={styles.errorText}>
                      {errors.loadDescription}
                    </Text>
                  )}

                  <TextFieldWithIcon2
                    name={stringsoflanguages.TransportType}
                    editable={false}
                    value={values.transportType}
                    placeholder={stringsoflanguages.SelectTransportType}
                    backgroundColor={colors.silverLight}
                    onPress={() => setTransportTypeModal(true)}
                    styles={{ justifyContent: "space-between", zIndex: 1 }}
                    onClick={() => setTransportTypeModal(false)}
                    cModal={transportTypeModal}
                    modalData={
                      (transportTypeListData && transportTypeListData[0]) || []
                    }
                    showValue={["description"]}
                    setCity={(e) => {
                      setSelectedTransportId(e.transportTypeId);
                      setTransportTypeCode(e);
                      setFieldValue("transportType", e.description);
                      setFieldValue("trailerType", "");
                      setFieldValue("trailerCostumization", []);
                      setTrailerTypeDisabled(false);
                    }}
                  />
                  {touched.transportType && errors.transportType && (
                    <Text style={styles.errorText}>{errors.transportType}</Text>
                  )}

                  <TextFieldWithIcon2
                    name={stringsoflanguages.TrailerType}
                    editable={false}
                    value={values.trailerType}
                    placeholder={stringsoflanguages.SelectTrailerType}
                    backgroundColor={colors.silverLight}
                    onPress={() => {
                      if (!trailerTypeDisabled) {
                        setTrailerModal(true);
                      }
                    }}
                    styles={{ justifyContent: "space-between", zIndex: 1 }}
                    onClick={() => setTrailerModal(false)}
                    cModal={trailerModal}
                    modalData={(trailerData && trailerData[0]) || []}
                    showValue={["description"]}
                    setCity={(e) => {
                      setTrailerCode(e);
                      setFieldValue("trailerType", e.description);
                      console.log("e.trailerTypeId", e.trailerTypeId);
                      dispatch(
                        GetTrailerSpecificationListAction(
                          e.trailerTypeId,
                          "",
                          0,
                          20
                        )
                      );
                    }}
                  />
                  {touched.trailerType && errors.trailerType && (
                    <Text style={styles.errorText}>{errors.trailerType}</Text>
                  )}

                  <TextFieldWithIcon2
                    name={stringsoflanguages.FloorType}
                    editable={false}
                    value={values.floorType}
                    placeholder={stringsoflanguages.SelectFloorType}
                    backgroundColor={colors.silverLight}
                    onPress={() => setFloorModal(true)}
                    styles={{ justifyContent: "space-between", zIndex: 1 }}
                    onClick={() => setFloorModal(false)}
                    cModal={floorModal}
                    modalData={(floorData && floorData[0]) || []}
                    showValue={["description"]}
                    setCity={(e) => {
                      setFloorCode(e);
                      setFieldValue("floorType", e.description);
                    }}
                  />
                  {touched.floorType && errors.floorType && (
                    <Text style={styles.errorText}>{errors.floorType}</Text>
                  )}

                  {trailerSpecificationListData && trailerCode ? (
                    <View>
                      <TextMed>
                        {stringsoflanguages.TrailerCustomization}
                      </TextMed>
                      <GapV />
                      {trailerSpecificationListData[0].map((item, index) => {
                        // description": "Removable Side Tent", "specificationId
                        let isSelected =
                          values.trailerCostumization.includes(item);

                        return (
                          <View
                            style={styles.trailerCostumizationItem}
                            key={`trailerSpecificationListData ${index}`}
                          >
                            <CheckBox
                              value={isSelected}
                              onValueChange={() => {
                                handleSpecificationChange(item, isSelected);
                              }}
                            />
                            <TextSmall>{item?.description}</TextSmall>
                          </View>
                        );
                      })}
                    </View>
                  ) : (
                    <TextField2
                      name={stringsoflanguages.TrailerCustomization}
                      placeholder={stringsoflanguages.TrailerPlaceholder}
                      backgroundColor={colors.silverLight}
                      onChange={handleChange("Trailer Customization")}
                      multiline={false}
                      editable={false}
                    />
                  )}

                  {touched.trailerCostumization &&
                    errors.trailerCostumization && (
                      <Text style={styles.errorText}>
                        {errors.trailerCostumization}
                      </Text>
                    )}

                  <GapV />
                  <TextMuted>{stringsoflanguages.ThreeStepsLeft}</TextMuted>

                  <Button
                    onPress={handleSubmit}
                    border={false}
                    name={stringsoflanguages.Continue}
                    // disabled={trailerTypeDisabled}
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
    marginVertical: RFValue(10),
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
