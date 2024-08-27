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
  Alert,
  ActivityIndicator,
  Dimensions,
} from "react-native";
import React, { useEffect, useRef, useState } from "react";
import * as colors from "../../../common/colors";
import * as Fonts from "../../../common/fonts";
import { RFPercentage, RFValue } from "react-native-responsive-fontsize";

import * as Api from "../../../common/Api";
import {
  TextField,
  TextFieldWithIconCarrier,
} from "../../../common/Component/TextField";
import { ButtonOld as Button } from "../../../common/Component/Button";
import * as Yup from 'yup'
import { useDispatch, useSelector } from "react-redux";
import {
  GetAddressList,
  GetContainerProposalList,
  GetCurrencyListAction,
  GetFreightListAction,
  GetSelectedContainerProposalAction,
} from "../../../Redux/actions";
import { useFormik } from "formik";
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";
import { GapV } from "../../../common/Component/gap";
import stringsoflanguages from "../../../Localization/stringsoflanguages";
import { IconButton } from "react-native-paper";
import NetChecker2 from "../../../common/Component/Network";
import { useNavigation } from "@react-navigation/native";
import { showSucces } from "../../../common/Utils/flashMessage";


export default function CreateApplicationForm({
  onSubmit,
  isVisible,
  hideModal,
  showModal,
  onSuccess,
  onReset,
  applicationData,
  editData,
}) {
  const { width, height } = Dimensions.get("window");
  const [currencyModal, setCurrencyModal] = useState(false);
  const [currencyValue, setCurrencyValue] = useState(editData.data[0]?.currency);
  const [propsalScopeModal, setPropsalScopeModal] = useState(false);
  const [proposalScopeValue, setProposalScopeValue] = useState(editData.data[0]?.proposalScope);
  const [loading, setLoading] = useState(false);
  const dispatch = useDispatch();
  const pageIndex = 0;
  const navigation = useNavigation();
  let proposalScopeEmpty = {"code": "", "description": "", "proposalScopeId": null};
  let currencyEmpty = {"currencyCode": "", "currencyId": null, "description": ""}

  const { data: GetCurrencyListData, loader: currencyLoader } = useSelector(
    (state) => state.GetCurrencyList
  );

  const { data: GetSelectedProposalData } = useSelector(
    (state) => state.GetSelectedContainerProposal
  );

  const validationSchema = Yup.object().shape({
    price: Yup.string().required(stringsoflanguages.priceRequired),
    currency: Yup.object().shape({
      description: Yup.string().required(stringsoflanguages.currencyRequired),
      currencyId: Yup.number(),
      currencyCode: Yup.string()
    }),
    proposalScope: Yup.object().shape({
      description: Yup.string().required(stringsoflanguages.proposalScopeRequired),
      proposalScopeId: Yup.number(),
      code: Yup.string()
    }),
    explanation: Yup.string(),
  });

  
  const { data: GetContainerProposalListData, loader: proposalData } =
    useSelector((state) => state.GetContainerProposalList);

  useEffect(() => {
    dispatch(GetCurrencyListAction());
  }, []);

  useEffect(() => {
    dispatch(GetContainerProposalList("", pageIndex, 20));
  }, []);

  const formik = useFormik({
    enableReinitialize: true,
    initialValues: {
      price: editData.data[0].price,
      currency: editData.data[0]?.currency || currencyEmpty,
      proposalScope: editData.data[0]?.proposalScope || proposalScopeEmpty,
      explanation: editData.data[0]?.explanation,
    },
    onSubmit: (values, { resetForm }) => {
      onSubmitHandler(values, resetForm);
    },
    onReset: () => {
      setCurrencyValue(null);
      setProposalScopeValue(null);
    },
    validationSchema: validationSchema,
  });

  const transportAlert = () => {
    Alert.alert(
      "Transporter Alert !",
      "you did not select truck and trailer. do you want to select?",
      [
        {
          text: "Cancel",
          onPress: () => console.log("Cancel Pressed"),
          style: "cancel",
        },
        {
          text: "OK",
          onPress: () => {
            hideModal();
            navigation.navigate("AddTransport");
          },
        },
      ]
    );
  };

  const onSubmitHandler = async (values, resetForm) => {

    setLoading(true);

    const data = {
      container: {
        containerId: applicationData?.containerId,
      },
      price: parseInt(values?.price),
      currency: {
        currencyId: values.currency?.currencyId,
      },
      explanation: values?.explanation !== undefined ? values?.explanation : "",
      proposalScope: {
        proposalScopeId: values?.proposalScope?.proposalScopeId,
      },
    };
    const updateData = {
      containerProposalId: editData.data[0]?.containerProposalId,
      price: parseInt(values?.price),
      currency: {
        currencyId: values.currency?.currencyId,
      },
      explanation: values?.explanation ? values?.explanation : "",
      proposalScope: {
        proposalScopeId: values?.proposalScope?.proposalScopeId,
      },
    };
    try {
      if (!(await NetChecker2())) return;

      if (GetSelectedProposalData?.[1] === 200) {
        let res = await Api.EditContainerProposal(JSON.stringify(updateData));
        console.log("res", JSON.stringify(res, null, 2));
        if (res?.[1] === 200) {
          if (onSuccess) onSuccess();
          showSucces({ description: "Proposal Updated Successfully" });
          hideModal();
        } else {
          Alert.alert("Error", res[0]?.message);
        }
      } else {
        let res = await Api.CreateContainerProposal(JSON.stringify(data));
        console.log("Res Create", JSON.stringify(res, null, 2));
        if (res?.[1] === 200) {
          if (onSuccess) onSuccess();
          dispatch(GetFreightListAction("", 0, 20));
          showSucces({ description: stringsoflanguages.TransportAddedSuccess });
          hideModal();
        } else {
          if (res?.[0]?.code == "Error_215") {
            transportAlert();
          } else Alert.alert("Error", res[0]?.message);
        }
      }
      resetForm({
        values: {},
      });
    } catch (e) {
      console.error(e);
    }
    setLoading(false);
  };

  if (!applicationData) return null;

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
            <TextField
              value={formik.values.price?.toString()}
              name={stringsoflanguages?.Price}
              placeholder={stringsoflanguages?.Price}
              backgroundColor={colors?.silverLight}
              onChange={(e)=>{
                // setPrice(e)
                formik.setFieldValue("price",e)
              }}
              onBlur={() => formik.setFieldTouched("price")}
              editable={true}
              keyboardType="decimal-pad"
            />
            {formik.touched.price && formik.errors.price && (
              <Text style={styles.errorText}>{formik.errors.price}</Text>
            )}
            <TextFieldWithIconCarrier
              name={stringsoflanguages?.Currency}
              value={formik.values.currency?.description}
              placeholder={stringsoflanguages.Currency}
              backgroundColor={colors?.silverLight}
              onPress={() => setCurrencyModal(true)}
              styles={styles.textField}
              onClick={() => setCurrencyModal(false)}
              cModal={currencyModal}
              onBlur={()=> formik.setFieldTouched("currency")}
              modalData={(GetCurrencyListData && GetCurrencyListData[0]) || []}
              showValue={["description"]}
              setModalValue={(e) => {
                formik.setFieldValue("currency", e);
              }}
            />
            {formik.touched.currency && formik.errors.currency && (
              <Text style={styles.errorText}>{formik.errors.currency.description}</Text>
            )}
            <TextFieldWithIconCarrier
              name={stringsoflanguages?.ProposalScope}
              value={formik.values.proposalScope?.description}
              placeholder={stringsoflanguages.ProposalScope}
              backgroundColor={colors?.silverLight}
              onPress={() => setPropsalScopeModal(true)}
              onBlur={()=> formik.setFieldTouched("proposalScope")}
              styles={styles.textField}
              onClick={() => setPropsalScopeModal(false)}
              cModal={propsalScopeModal}
              onSearch={(v) => {
                dispatch(GetContainerProposalList(v, pageIndex, 20));
              }}
              modalData={
                (GetContainerProposalListData?.[1] === 200 &&
                  GetContainerProposalListData?.[0]) ||
                []
              }
              showValue={["description"]}
              setModalValue={(e) => {
                formik.setFieldValue("proposalScope", e);
              }}

            />
            {formik.touched.proposalScope && formik.errors.proposalScope && (
              <Text style={styles.errorText}>
                {formik.errors.proposalScope.description}
              </Text>
            )}
            {/* proposalScopeCode == "OTHERS" */}
            {formik.values.proposalScope?.code === "OTHER" && (
              <TextField
                value={formik.values.explanation}
                name={stringsoflanguages?.Explanation}
                placeholder={stringsoflanguages?.Explanation}
                backgroundColor={colors?.silverLight}
                onChange={formik.handleChange("explanation")}
                onBlur={() => formik.setFieldTouched("explanation")}
              />
            )}
            {formik.touched.explanation && formik.errors.explanation && (
              <Text style={styles.errorText}>{formik.errors.explanation}</Text>
            )}
            <Button
              loader={loading}
              onPress={formik.handleSubmit}
              border={false}
              name={stringsoflanguages?.Submit}
            />
            {/* <Button
              border={true}
              name={stringsoflanguages?.Cancel}
              onPress={formik.handleReset}
            /> */}
            <GapV />
          </View>
        </KeyboardAwareScrollView>
      </Modal>
    </>
  );
}

const styles = StyleSheet.create({
  modal: {
    // flex: 1,
    backgroundColor: colors?.TransperantBlack,
  },

  modalcontainer: {
    flexGrow: 1,
    paddingHorizontal: RFValue(10),
    paddingTop: RFValue(70),
    paddingBottom: RFValue(10),
  },
  ModelViewContainer: {
    flex: 1,
    backgroundColor: colors?.White,
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
    color: colors?.Red,
  },
});
