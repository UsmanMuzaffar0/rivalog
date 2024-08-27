import React from "react";
import {
  View,
  SafeAreaView,
  Text,
  TouchableOpacity,
  StatusBar,
  Alert,
} from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { connect } from "react-redux";

import {
  LanguageAction,
  GetCountryAction,
  SignUpAction,
} from "../../Redux/actions";
import NetChecker from "../../common/Component/Network";
import StringsOfLanguages from "../../Localization/stringsoflanguages";
import * as Fonts from "../../common/fonts";
import * as colors from "../../common/colors";
import { Style } from "../../common/Style";
import { useNavigation } from "@react-navigation/native";
import { AuthContext } from "../../navigation/AuthContext";
import { RFPercentage, RFValue } from "react-native-responsive-fontsize";
import {
  TextField,
  TextField2,
  TextFieldWithCountryCode,
  TextFieldWithCountryCode2,
  TextFieldWithIcon,
} from "../../common/Component/TextField";
import DropDownField from "../../common/Component/DropDownField";
import { ModalSelector } from "../../common/Component/ModalSelection";
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";
import Loader from "../../common/Component/Loader";
import { getCountryCodeAsync } from "../../common/Utils/localize";
import Header, { Header2 } from "../../common/Component/Header";
import Button from "../../common/Component/Button";

class Registration extends React.Component {
  static contextType = AuthContext;
  constructor(props) {
    super(props);
    this.state = {
      LangString: StringsOfLanguages,
      Name: "",
      Surname: "",
      Email: "",
      Password: "",
      LanguageAry: [],
      Language: "",
      LanguageId: "",
      Country: "",
      CountryId: "",
      CountryAry: [],
      ModalVisible: false,
      dropdownNumber: 0,
      loading: false,
      SignUpCall: false,
      PasswordShowFlag: false,
      Username: "",
      CompanyName: "",
      CountryCode: "",
      CountryCodesArr: [],
      ContactNumber: "",
      Cmodal: false,
    };
  }

  async componentDidMount() {
    console.log(this.props.route.params);
    const NetworkStatus = NetChecker();
    if ((await NetworkStatus) == false) {
      alert("network issue ");
      return;
    }
    this.props.LanguageAction();
    // this.props.GetCompanyAction()
    this.props.GetCountryAction();
  }

  async UNSAFE_componentWillReceiveProps(nextProps) {
    const SignInContext = this.context;
    //login
    if (nextProps.Language.GetLangSuccess) {
      if (nextProps.Language.data[1] == 200) {
        this.setState({ LanguageAry: await nextProps.Language.data[0] });
        AsyncStorage.setItem(
          "LanguageList",
          JSON.stringify(await nextProps.Language.data[0])
        );
      } else {
        console.log("nextProps.Language");
      }
    }
    // setting locales for drop down and stuff
    if (nextProps.CountryData.GetCountrySuccess) {
      console.log("--------------nextProps.CountryData");
      if (nextProps.CountryData.data[1] == 200) {
        const currentCountryCode = await getCountryCodeAsync();
        let countriesArr = [];
        let countryCodes = [];
        // get current country phone code from API
        let currentCountry = await nextProps.CountryData.data[0]?.filter(
          (v) => v.code == currentCountryCode
        );
        // sort countries according to currentCountry first
        await nextProps.CountryData.data[0].map((v) => {
          if (v?.code === currentCountryCode) {
            countriesArr.splice(0, 0, v);
            countryCodes.splice(0, 0, v?.code);
          } else {
            countriesArr.push(v);
            countryCodes.push(v?.code);
          }
        });
        this.setState({
          CountryAry: countriesArr,
          CountryCode: currentCountry[0]?.phoneCode,
          CountryCodesArr: countryCodes,
        });
        AsyncStorage.setItem("CountryList", JSON.stringify(countriesArr));
      } else {
        console.log("nextProps.CountryData");
      }
    }

    //registration
    if (this.state.SignUpCall == true) {
      console.log(
        "FirstData",
        this.state.SignUpCall,
        JSON.stringify(nextProps.SignUp)
      );
      this.setState({ SignUpCall: false });
      console.log("SecondData", this.state.SignUpCall);
      if (nextProps.SignUp.data[0]) {
        console.log("DATAA>>", nextProps.SignUp.data[0]);
        const data = await nextProps.SignUp.data[0];
        console.log("fffff", data);
        if (nextProps.SignUp.data[1] == 200) {
          await AsyncStorage.setItem("AccessToken", data.userToken.token);
          await AsyncStorage.setItem("SelectedLanguage", this.state.LanguageId);
          await AsyncStorage.setItem(
            "GoogleApiKey",
            data?.parameters?.[0]?.parameterValue
          );

          SignInContext.signIn(
            data.userToken.token,
            this.state.LanguageId,
            data?.parameters?.[0]?.parameterValue,
            data?.user
          );

          // Alert.alert(
          //   "Account Created",
          //   "Your account has been created successfully!",
          //   [
          //     {
          //       text: "OK",
          //       onPress: () => {
          //         const SignInContext = this.context;
          //         SignInContext.signIn(
          //           data.userToken.token,
          //           this.state.LanguageId,
          //           data?.parameters?.[0]?.parameterValue,
          //           data?.user
          //         );
          //       },
          //     },
          //   ]
          // );
          this.setState({ loading: false });

          // ??? store here after geting from API response--> AsyncStorage.setItem("AccessToken", data.token);
          // alert(data.message)
        } else {
          alert(data.message);
          this.setState({ loading: false });
        }
      }
    }
  }
  async SignUpPress() {
    const NetworkStatus = NetChecker();

    if ((await NetworkStatus) == false) {
      alert("network issue");
      return;
    }

    var mailformat =
      /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/;

    if (!this.state.Email.match(mailformat)) {
      alert(StringsOfLanguages.EmailAlert);
    } else if (
      this.state.Password.length < 4 ||
      this.state.Password.length > 8
    ) {
      alert(StringsOfLanguages.PasswordLengthAlert);
    }
    // else if (!this.state.Username) {
    //   alert(StringsOfLanguages.EmptyUsernameAlert);
    // }
    else if (!this.state.CompanyName) {
      alert(StringsOfLanguages.EmptyComapanynameAlert);
    } else if (!this.state.ContactNumber) {
      alert(StringsOfLanguages.EmptyMobilenumberAlert);
    } else {
      this.setState({ loading: true, SignUpCall: true });
      this.props.SignUpAction({
        language: this.state.LanguageId,
        country: this.state.CountryId,
        channel: "MOBILE",
        user: {
          name: this.state.Name,
          surname: this.state.Surname,
          email: this.state.Email,
          countryCode: "+" + this.state.CountryCode,
          mobile: this.state.ContactNumber,
          // username: this.state.Username,
          password: this.state.Password,
        },
        company: {
          name: this.state.CompanyName,
          //   this.props.route.params.CompanyTypeID == 1 ?
          //   "Truck Owner"
          // : "Freight Owner",
          companyType: {
            companyTypeId: this.props.route.params.CompanyTypeID,
          },
        },
      });
      this.setState({ loading: false });
    }
  }

  render() {
    return (
      <>
        <SafeAreaView style={Style.mainView}>
          <StatusBar
            animated={false}
            backgroundColor={colors.WhiteSmoke}
            barStyle={"dark-content"}
          />
          <View style={Style.componentContainerView}>
            <KeyboardAwareScrollView showsVerticalScrollIndicator={false}>
              <Header2
                Title={StringsOfLanguages.SignUP}
                BackButton={true}
                BackAction={() => this.props.navigation.goBack()}
              />
              <View style={{ marginTop: RFValue(10) }}>
                {/* here using common component of text input */}

                <TextField2
                  name={StringsOfLanguages.Name}
                  value={this.state.Name}
                  placeholder={StringsOfLanguages.NamePlaceholder}
                  onChange={(text) => this.setState({ Name: text })}
                  styles={{ marginBottom: RFValue(5) }}
                  // regex={stringRegex}
                />

                <TextField2
                  name={StringsOfLanguages.Surname}
                  value={this.state.Surname}
                  placeholder={StringsOfLanguages.SurnamePlaceholder}
                  onChange={(text) => this.setState({ Surname: text })}
                  styles={{ marginBottom: RFValue(5) }}
                />

                <TextField2
                  name={StringsOfLanguages.Email}
                  value={this.state.Email}
                  placeholder={StringsOfLanguages.EmailAddressPlaceholder}
                  onChange={(text) => this.setState({ Email: text })}
                  styles={{ marginBottom: RFValue(5) }}
                />

                <TextField2
                  name={StringsOfLanguages.CompanyName}
                  value={this.state.CompanyName}
                  placeholder={StringsOfLanguages.CompanyPlaceholder}
                  onChange={(text) => this.setState({ CompanyName: text })}
                  styles={{ marginBottom: RFValue(5) }}
                />

                <TextFieldWithCountryCode2
                  name={StringsOfLanguages.MobileNo}
                  countryCodeValue={this.state.CountryCode}
                  countryCodesArr={this.state.CountryCodesArr || []}
                  value={this.state.ContactNumber}
                  placeholder={StringsOfLanguages.EnterMobileNo}
                  onChange={(text) => this.setState({ ContactNumber: text })}
                  keyboardType="phone-pad"
                  codelcik={(item) => {
                    console.log("Code>>>>>>>>>>>>>>>>", item.callingCode?.[0]);
                    this.setState({
                      CountryCode: +item.callingCode?.[0],
                      Cmodal: false,
                    });
                  }}
                  Cmodal={this.state.Cmodal}
                  onClose={() => this.setState({ Cmodal: false })}
                  onOpen={() => this.setState({ Cmodal: true })}
                  styles={{ marginBottom: RFValue(5) }}
                />

                <TextFieldWithIcon
                  name={StringsOfLanguages.Password}
                  placeholder={StringsOfLanguages.PasswordPlaceholder}
                  secureTextEntry={!this.state.PasswordShowFlag}
                  onChange={(text) => this.setState({ Password: text })}
                  onClickIcon={() =>
                    this.setState({
                      PasswordShowFlag: !this.state.PasswordShowFlag,
                    })
                  }
                  imageFlag={this.state.PasswordShowFlag ? 1 : 0}
                />

                <DropDownField
                  name={StringsOfLanguages.Language}
                  placeholder={StringsOfLanguages.LanguagePlaceholder}
                  value={this.state.Language}
                  onPress={() =>
                    this.setState({ ModalVisible: true, dropdownNumber: 1 })
                  }
                />
                <DropDownField
                  name={StringsOfLanguages.Country}
                  placeholder={StringsOfLanguages.CountryPlaceholder}
                  value={this.state.Country}
                  onPress={() =>
                    this.setState({ ModalVisible: true, dropdownNumber: 2 })
                  }
                />
                {/* <DropDownField name={StringsOfLanguages.CompanyType} placeholder={StringsOfLanguages.CompanyTypePlaceholder} value={this.state.Company} onPress={() => this.setState({ ModalVisible: true, dropdownNumber: 1 })} />

                <TextField name={StringsOfLanguages.Company} placeholder={StringsOfLanguages.CompanyPlaceholder} onChange={(text) => this.setState({ Email: text })} /> */}
              </View>
              {/* <View style={Style.SignInbtnView}>
                <TouchableOpacity
                  onPress={() => {
                    this.SignUpPress();
                  }}
                  activeOpacity={1}
                  disabled={
                    this.state.Email == "" &&
                    this.state.Password == "" &&
                    this.state.Surname == "" &&
                    this.state.Name == "" &&
                    this.state.Language == "" &&
                    this.state.Country == ""
                      ? true
                      : false
                  }
                  style={[
                    Style.signInBtn,
                    {
                      backgroundColor:
                        this.state.Email != "" &&
                        this.state.Password != "" &&
                        this.state.Surname != "" &&
                        this.state.Name != "" &&
                        this.state.Language != "" &&
                        this.state.Country != ""
                          ? colors.Blue
                          : colors.LightBlue,
                    },
                  ]}
                >
                  <Text style={[Style.signinBtnTxt, { color: colors.White }]}>
                    {StringsOfLanguages.SignUP}
                  </Text>
                </TouchableOpacity>
                <View style={Style.signUptxtView}>
                  <Text style={Style.signUptxt}>
                    {StringsOfLanguages.afterSignUpBtnTxt}
                    <Text
                      onPress={() => this.props.navigation.navigate("Login")}
                      style={[Style.signUptxt, { color: colors.Blue }]}
                    >
                      {" "}
                      {StringsOfLanguages.SignIn}
                    </Text>
                  </Text>
                </View>
              </View> */}
              <View style={Style.SignInbtnView}>
                <Button
                  loader={false}
                  onPress={() => {
                    this.SignUpPress();
                  }}
                  activeOpacity={1}
                  disabled={
                    this.state.Email == "" &&
                    this.state.Password == "" &&
                    this.state.Surname == "" &&
                    this.state.Name == "" &&
                    this.state.Language == "" &&
                    this.state.Country == ""
                      ? true
                      : false
                  }
                  border={false}
                  // disabled={
                  //   this.state.Radiovalue === 1
                  //     ? this.state.Username == "" &&
                  //       this.state.Password == "" &&
                  //       this.state.CompanyId <= 0
                  //       ? true
                  //       : false
                  //     : this.state.Radiovalue === 2
                  //     ? this.state.Email == "" &&
                  //       this.state.Password == "" &&
                  //       this.state.CompanyId <= 0
                  //       ? true
                  //       : false
                  //     : this.state.Radiovalue === 0
                  //     ? this.state.ContactNumber == "" &&
                  //       this.state.Password == "" &&
                  //       this.state.CompanyId <= 0
                  //       ? true
                  //       : false
                  //     : false
                  // }
                  style={{
                    backgroundColor: "#34B267",
                    // this.state.Radiovalue === 1
                    //   ? this.state.Username != "" &&
                    //     this.state.Password != "" &&
                    //     this.state.CompanyId > 0
                    //     ? colors.Blue
                    //     : colors.LightBlue
                    //   : this.state.Radiovalue === 2
                    //   ? this.state.Email != "" &&
                    //     this.state.Password != "" &&
                    //     this.state.CompanyId > 0
                    //     ? colors.Blue
                    //     : colors.LightBlue
                    //   : this.state.ContactNumber != "" &&
                    //     this.state.Password != "" &&
                    //     this.state.CompanyId > 0

                    // : "#BCBCBC",
                  }}
                  name={StringsOfLanguages.SignUP}
                />

                <View style={Style.signUptxtView}>
                  <Text style={Style.signUptxt}>
                    {StringsOfLanguages.afterSignUpBtnTxt}
                    <Text
                      onPress={() => this.props.navigation.navigate("Login")}
                      style={[Style.signUptxt, { color: colors.LimeGreen }]}
                    >
                      {" "}
                      {StringsOfLanguages.SignIn}
                    </Text>
                  </Text>
                </View>
              </View>
            </KeyboardAwareScrollView>
          </View>
          <Loader visible={this.state.loading} />
        </SafeAreaView>
        <ModalSelector
          visible={this.state.ModalVisible}
          title={
            this.state.dropdownNumber == 1
              ? `${StringsOfLanguages.Language}`
              : `${StringsOfLanguages.Country}`
          }
          data={
            this.state.dropdownNumber == 1
              ? this.state.LanguageAry
              : this.state.CountryAry
          }
          SearchOptionExist={this.state.dropdownNumber == 2 ? true : false}
          IDPropertyName={"code"}
          ValuePropertyName={"name"}
          onPress={(text, id) => {
            console.log("?OKOKOOKO ", text, id);
            this.state.dropdownNumber == 1
              ? this.setState({ Language: text, LanguageId: id })
              : this.setState({ Country: text, CountryId: id });

            this.setState({ ModalVisible: false });
          }}
          closeModal={() => this.setState({ ModalVisible: false })}
        />
      </>
    );
  }
}

const mapStateToProps = (state) => {
  return {
    Language: state.Language,
    CountryData: state.CountryData,
    SignUp: state.SignUp,
  };
};
export default connect(mapStateToProps, {
  LanguageAction,
  GetCountryAction,
  SignUpAction,
})(Registration);
