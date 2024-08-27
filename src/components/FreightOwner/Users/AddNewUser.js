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
import { HeaderWithNotification } from "../../../common/Component/Header";
import { Style } from "../../../common/Style";
import * as colors from "../../../common/colors";
import * as Fonts from "../../../common/fonts";
import { RFPercentage, RFValue } from "react-native-responsive-fontsize";
import {
  TextField2,
  TextFieldWithCountryCode,
  TextFieldWithCountryCode2,
} from "../../../common/Component/TextField";
import { ScrollView } from "react-native-gesture-handler";
import Button from "../../../common/Component/Button";
import { useDispatch, useSelector } from "react-redux";
import {
  CreateUserListAction,
  GetCountryAction,
  GetUsersListAction,
} from "../../../Redux/actions";
import { Formik } from "formik";
import * as Yup from "yup";
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";
import { GapV } from "../../../common/Component/gap";
import stringsoflanguages from "../../../Localization/stringsoflanguages";
import { getCountryCodeAsync } from "../../../common/Utils/localize";

const validationSchema = Yup.object().shape({
  name: Yup.string().required(stringsoflanguages.NameRequired),
  surname: Yup.string()
    .required(stringsoflanguages?.SurnameRequired)
    .label("surame"),
  username: Yup.string()
    .required(stringsoflanguages?.UsernameRequired)
    .label("username"),
  email: Yup.string().email().required(stringsoflanguages?.EmailRequired),
  telephone: Yup.string().required(stringsoflanguages?.TelephoneRequired),
  countryCode: Yup.string().required(stringsoflanguages?.CountryRequired),
});

export default function AddNewUser(props) {
  const [countryModal, setCountryModal] = useState(false);
  const [counryIso, setCountryIso] = useState("");
  const [countryCodesArr, setCountryCodesArr] = useState([]);

  const dispatch = useDispatch();
  const { data, loader, CreateNewUserSuccess } = useSelector(
    (state) => state.CreateNewUser
  );
  const { data: countryData, GetCountrySuccess } = useSelector(
    (state) => state.CountryData
  );

  useEffect(() => {
    dispatch(GetCountryAction());
  }, []);

  useEffect(() => {
    if (CreateNewUserSuccess) dispatch(GetUsersListAction("", 0, 20));
    return () => {};
  }, [CreateNewUserSuccess]);

  //   set country array from server
  useEffect(() => {
    if (countryData)
      (async () => {
        const currentCountryCode = await getCountryCodeAsync();
        let countryCodes = [];
        await countryData?.[0]?.map((v) => {
          if (v?.code === currentCountryCode) {
            countryCodes.splice(0, 0, v?.code);
          } else {
            countryCodes.push(v?.code);
          }
        });
        setCountryCodesArr(countryCodes);
      })();
  }, [countryData]);

  const onSubmitHandler = (values, resetForm) => {
    console.log(values);
    const data = {
      name: values.name,
      surname: values.surname,
      username: values.username,
      email: values.email,
      countryCode: "+" + values.countryCode,
      mobile: values.telephone,
    };

    dispatch(CreateUserListAction(data));
    resetForm({
      values: {
        name: "",
        surname: "",
        username: "",
        email: "",
        telephone: "",
        countryCode: "",
      },
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
        Title={stringsoflanguages?.UserTitle}
        back
        BackAction={props.navigation.goBack}
      />

      <Text style={styles.title}>{stringsoflanguages?.CreateNewUser}</Text>
      <KeyboardAwareScrollView showsVerticalScrollIndicator={false}>
        <Formik
          initialValues={{
            name: "",
            surname: "",
            username: "",
            email: "",
            telephone: "",
            countryCode: "",
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
                  name={stringsoflanguages?.Name}
                  value={values.name}
                  placeholder={stringsoflanguages?.NamePlaceholder}
                  backgroundColor={colors.silverLight}
                  onChange={handleChange("name")}
                  onBlur={() => setFieldTouched("name")}
                />
                {touched.name && errors.name && (
                  <Text style={styles.errorText}>{errors.name}</Text>
                )}
                <TextField2
                  name={stringsoflanguages?.Surname}
                  value={values.surname}
                  placeholder={stringsoflanguages?.SurnameAlert}
                  backgroundColor={colors.silverLight}
                  onChange={handleChange("surname")}
                  onBlur={() => setFieldTouched("surname")}
                />
                {touched.surname && errors.surname && (
                  <Text style={styles.errorText}>{errors.surname}</Text>
                )}
                <TextField2
                  name={stringsoflanguages?.Username}
                  value={values.username}
                  placeholder={stringsoflanguages?.EmptyUsernameAlert}
                  backgroundColor={colors.silverLight}
                  onChange={handleChange("username")}
                  onBlur={() => setFieldTouched("username")}
                />
                {touched.username && errors.username && (
                  <Text style={styles.errorText}>{errors.username}</Text>
                )}
                <TextField2
                  name={stringsoflanguages?.Email}
                  value={values.email}
                  placeholder={stringsoflanguages?.EmptyEmailAlert}
                  backgroundColor={colors.silverLight}
                  onChange={handleChange("email")}
                  onBlur={() => setFieldTouched("email")}
                />
                {touched.email && errors.email && (
                  <Text style={styles.errorText}>{errors.email}</Text>
                )}
                <TextField2
                  name={stringsoflanguages?.Telephone}
                  value={values.telephone}
                  placeholder={stringsoflanguages?.TelephonePlaceholder}
                  backgroundColor={colors.silverLight}
                  keyboardType="phone-pad"
                  onChange={handleChange("telephone")}
                  onBlur={() => setFieldTouched("telephone")}
                />
                {touched.telephone && errors.telephone && (
                  <Text style={styles.errorText}>{errors.telephone}</Text>
                )}

                <TextFieldWithCountryCode2
                  name={stringsoflanguages?.CountryCode}
                  editable={false}
                  countryCodeValue={values.countryCode}
                  value={
                    values.countryCode != "" &&
                    `+${
                      values.countryCode?.toString()?.includes("+")
                        ? values.countryCode.toString().split("+")[1]
                        : values.countryCode
                    }`
                  }
                  countryCodesArr={countryCodesArr || []}
                  isoCode={counryIso}
                  placeholder={stringsoflanguages?.CountryPlaceholder}
                  onChange={(iso) => setCountryIso(iso)}
                  keyboardType="phone-pad"
                  backgroundColor={colors.silverLight}
                  codelcik={handleChange("countryCode")}
                  Cmodal={countryModal}
                  onClose={() => setCountryModal(false)}
                  onOpen={() => setCountryModal(true)}
                />
                {touched.countryCode && errors.countryCode && (
                  <Text style={styles.errorText}>{errors.countryCode}</Text>
                )}

                <Button
                  loader={loader}
                  onPress={handleSubmit}
                  border={false}
                  name={stringsoflanguages?.AddUser}
                />
              </View>
              <GapV />
            </ScrollView>
          )}
        </Formik>
      </KeyboardAwareScrollView>
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
