import React from "react";
import {
  View,
  SafeAreaView,
  Text,
  TouchableOpacity,
  StatusBar,
  I18nManager,
  Alert,
  Linking,
} from "react-native";

import AsyncStorage from "@react-native-async-storage/async-storage";
import { connect } from "react-redux";

import {
  Action,
  GetCompanyAction,
  LanguageAction,
  UsernameAction,
  GetCountryAction,
  MobileAction,
  SaveDeviceTokenAction,
  SetNotificationToken,
} from "../../Redux/actions";
import NetChecker from "../../common/Component/Network";
import StringsOfLanguages from "../../Localization/stringsoflanguages";
import * as Fonts from "../../common/fonts";
import * as colors from "../../common/colors";

import { Style, width } from "../../common/Style";
import { AuthContext } from "../../navigation/AuthContext";
import {
  TextField,
  TextFieldWithCountryCode,
  TextFieldWithCountryCode2,
  TextFieldWithIcon,
} from "../../common/Component/TextField";
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";
import Loader from "../../common/Component/Loader";
import DeviceLanguage from "../../common/Component/DeviceLanguage";

import { RFPercentage, RFValue } from "react-native-responsive-fontsize";

import { regEmailAddressValidation } from "../../common/Component/Config";

import { ModalSelector } from "../../common/Component/ModalSelection";
import RNRestart from "react-native-restart";
import rtlDetect from "rtl-detect";
import messaging from "@react-native-firebase/messaging";
import RadioForm, {
  RadioButton,
  RadioButtonInput,
  RadioButtonLabel,
} from "react-native-simple-radio-button";
import { getCountryCodeAsync } from "../../common/Utils/localize";
import { showFailure } from "../../common/Utils/flashMessage";
import Button from "../../common/Component/Button";
import Header, { Header2 } from "../../common/Component/Header";

let langCode;

// var radio_props = [
//   { label: StringsOfLanguages.MobileNo, value: 0 },
//   { label: StringsOfLanguages.Username, value: 1 },
//   { label: StringsOfLanguages.Email, value: 2 },
// ];

class Login extends React.Component {
  static contextType = AuthContext;

  constructor(props) {
    super(props);
    this.state = {
      // LangString: StringsOfLanguages,
      loading: false,
      Email: "",
      Password: "",
      LoginCall: false,
      LangStr: StringsOfLanguages,
      ModalVisible: false,
      Company: "",
      CompanyAry: [],
      CompanyId: 2,
      CountryAry: [],
      CountryCodesArr: [],
      PasswordShowFlag: false,
      Radiovalue: 0,
      isChecked: false,
      ContactNumber: "",
      Cmodal: false,
      CountryCode: "0",
      Username: "",
      SaveDeviceTokenCall: false,
      TokenApi: false,
      forceToChangePassword: false,
    };
  }

  async getFcmToken() {
    const authStatus = await messaging().requestPermission();
    const enabled =
      authStatus === messaging.AuthorizationStatus.AUTHORIZED ||
      authStatus === messaging.AuthorizationStatus.PROVISIONAL;
    console.log("authStatus--->>>", authStatus, enabled);
    if (enabled) {
      messaging()
        .getToken()
        .then((fcmtoken) => {
          // console.log("fcmtoken--", fcmtoken);
          this.setToken(fcmtoken);
          // this.LoginPress()
        })
        .catch((err) => {
          console.log("err", err);
        });
    } else {
      console.log("enabled", enabled);
      return;
      // Show an alert to the user explaining how to enable the permission in Settings
      // Alert.alert(
      //   "Messaging Permission Required",
      //   "Please enable messaging permission from Settings",
      //   [
      //     {
      //       text: "Cancel",
      //       style: "cancel",
      //     },
      //     {
      //       text: "Open Settings",
      //       onPress: () => {
      //         Linking.openSettings();
      //       },
      //     },
      //   ]
      // );
    }
  }

  setToken(fcmtoken) {
    this.props.SetNotificationToken({
      token: fcmtoken,
    });
  }

  async onAddDeviceToken() {
    this.setState({ SaveDeviceTokenCall: true });
    messaging()
      .getToken()
      .then((deviceToken) => {
        console.log(deviceToken, "deviceToken");
        this.props.SaveDeviceTokenAction({
          token: deviceToken,
        });
      });
  }

  async componentDidMount() {
    try {
      AsyncStorage.removeItem("CARRIER_OPERATOR");

      StringsOfLanguages.setLanguage(
        (await AsyncStorage.getItem("SelectedLanguage")) || "en"
      );
      this.setState({ LangStr: StringsOfLanguages });
    } catch (e) {
      console.error(e);
    }

    const NetworkStatus = NetChecker();
    if ((await NetworkStatus) == false) {
      alert("network issue ");
    }
    this.props.GetCountryAction();
    this.props.GetCompanyAction();

    this._Reload = this.props.navigation.addListener("focus", async () => {
      // this.onAddDeviceToken();
      this.setState({
        lang: (await AsyncStorage.getItem("SelectedLanguage")) || "en",
      });
      StringsOfLanguages.setLanguage(
        (await AsyncStorage.getItem("SelectedLanguage")) || "en"
      );

      // if(StringsOfLanguages.getLanguage() =="en"||StringsOfLanguages.getLanguage() =="en" ||
      // )

      // this.focusListener = this.props.navigation.addListener(
      //   "focus",
      //   async () => {
      //     langCode = await DeviceLanguage();
      //     const SelectedLanguage = await AsyncStorage.getItem("SelectedLanguage");

      //     StringsOfLanguages.setLanguage(
      //       SelectedLanguage ? SelectedLanguage : langCode
      //     );
      //     this.setState({ LangStr: StringsOfLanguages });

      // var isRTLLanguage = rtlDetect.isRtlLang(langCode);

      // if(isRTLLanguage && !I18nManager.isRTL)
      // {
      //     I18nManager.forceRTL(true);
      //     RNRestart.Restart();
      // }
      // else if(!isRTLLanguage && I18nManager.isRTL)
      // {
      //     I18nManager.forceRTL(false);
      //     RNRestart.Restart();
      // }
    });
  }

  async componentWillUnmount() {
    this.props.navigation.removeListener("focus", this._Reload);
  }

  async UNSAFE_componentWillReceiveProps(nextProps) {
    const SignInContext = this.context;

    // if (this.state.TokenApi) {
    //   console.log("innnnn");
    //   if (nextProps.AddNotificationTokenData.addnotificationtokenSuccess) {
    //     if (nextProps.AddNotificationTokenData.data[1] === 200) {
    //       console.log(nextProps.AddNotificationTokenData.data[0]);
    //       this.setState({ TokenApi: false, loading: false });

    //       // let langCode = null;
    //       if (nextProps.MobileLogin.LoginSuccess) {
    //         console.log(
    //           "nextProps.MobileLogin.LoginSuccess",
    //           nextProps.MobileLogin.data[0]
    //         );
    //         const data = await nextProps.MobileLogin.data[0];
    //         langCode = data?.user?.language;

    //         console.log("Sign in with Language", langCode);

    //         this.state.forceToChangePassword
    //           ? this.props.navigation.navigate("ResetPassword")
    //           : SignInContext.signIn(
    //               await AsyncStorage.getItem("AccessToken"),
    //               langCode
    //             );
    //       } else
    //         this.state.forceToChangePassword
    //           ? this.props.navigation.navigate("ResetPassword")
    //           : SignInContext.signIn(await AsyncStorage.getItem("AccessToken"));
    //     }
    //   }
    // }

    if (!this.state.LoginCall) {
      console.log(await nextProps.Language, "--------------nextProps.Language");
      // if (nextProps.Language.GetLangSuccess) {
      //   if (nextProps.Language.data[1] == 200) {
      //     // fileter device language in language api
      //     var isRTLLanguage = rtlDetect.isRtlLang(langCode);
      //     AsyncStorage.setItem("SelectedLanguage", langCode);
      //     if (isRTLLanguage && !I18nManager.isRTL) {
      //       I18nManager.forceRTL(true);
      //       RNRestart.Restart();
      //     } else if (!isRTLLanguage && I18nManager.isRTL) {
      //       I18nManager.forceRTL(false);
      //       RNRestart.Restart();
      //     }
      //     // do something else
      //   } else {
      //     console.log("");
      //   }
      // }

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

      if (nextProps.CompanyData.GetCompanySuccess) {
        if (nextProps.CompanyData.data[1] == 200) {
          this.setState({ CompanyAry: await nextProps.CompanyData.data[0] });
          AsyncStorage.setItem(
            "CompanyTypeList",
            JSON.stringify(await nextProps.CompanyData.data[0])
          );
        } else {
          console.log("");
        }
      }
    } else {
      // if (langCode === null) langCode = await DeviceLanguage();
      // AsyncStorage.setItem("SelectedLanguage", langCode);
      if (this.state.Radiovalue == 2) {
        if (nextProps.Login.LoginSuccess) {
          const data = await nextProps?.Login?.data[0];
          if (nextProps.Login.data[1] == 200) {
            this.CallForToken(data.token);
          } else {
            this.setState({ loading: false, LoginCall: false });
            alert(data.message);
          }
          this.setState({ loading: false, LoginCall: false });
        }
      } else if (this.state.Radiovalue == 1) {
        if (nextProps?.UsernameLogin?.LoginSuccess) {
          const data = await nextProps?.UsernameLogin?.data[0];
          if (nextProps.UsernameLogin?.data[1] == 200) {
            this.CallForToken(data.token);
            // await AsyncStorage.setItem("AccessToken", data.token);
            // this.setState({ LoginCall: false, TokenApi: true })
            // this.getFcmToken()
            // SignInContext.signIn(data.token, null);
          } else {
            this.setState({ loading: false, LoginCall: false });
            alert(data?.message);
          }
        }
      } else if (this.state.Radiovalue === 0) {
        if (nextProps.MobileLogin.LoginSuccess) {
          const data = await nextProps?.MobileLogin?.data[0];
          // console.log("datata==>>>", data);
          if (nextProps.MobileLogin.data[1] == 200) {
            // AsyncStorage.setItem("COMPANY_TYPE", JSON.stringify(2));

            this.setState({
              forceToChangePassword:
                data?.forceToChangePassword == "Y" ? true : false,
            });

            // if company type admin restrict user
            if (data?.company?.companyType?.companyTypeId === 3) {
              showFailure({ description: "Admin type will come soon in app" });
              this.setState({ loading: false });
              return;
            }

            await this.CallForToken(data.userToken.token);

            data.roles.map((item) => {
              if (item.code == "CARRIER_OPERATOR") {
                AsyncStorage.setItem("CARRIER_OPERATOR", JSON.stringify(true));
              }

              console.log("item.code: ", item.code);
            });
            this.setState({ TokenApi: false, loading: false });
            langCode = data?.user?.language;
            console.log("Sign in with Language", langCode);
            data.forceToChangePassword == "Y"
              ? this.props.navigation.navigate("ResetPassword")
              : SignInContext.signIn(
                  data.userToken.token,
                  data?.user?.language,
                  data?.parameters?.[0]?.parameterValue,
                  data?.user,
                  data?.company
                );
          } else {
            this.setState({ loading: false, LoginCall: false });
            alert(data.message);
          }
          this.setState({ loading: false, LoginCall: false });
        }
      }
    }
  }

  async setLanguage(langCode) {
    console.log("Setting Language", langCode);
    // await AsyncStorage.setItem("SelectedLanguage", langCode);
    StringsOfLanguages.setLanguage(langCode);

    // var isRTLLanguage = rtlDetect.isRtlLang(langCode);
    // if (isRTLLanguage && !I18nManager.isRTL) {
    //   I18nManager.forceRTL(true);
    //   RNRestart.Restart();
    // } else if (!isRTLLanguage && I18nManager.isRTL) {
    // I18nManager.forceRTL(false);
    // RNRestart.Restart();
    // }
  }

  async CallForToken(token) {
    console.log("token==>>>", token);
    await AsyncStorage.setItem("AccessToken", token);
    this.setState({ LoginCall: false, TokenApi: true });
    // this.getFcmToken();
  }

  LoginPress() {
    if (this.state.Radiovalue == 1) {
      console.log("USERNAME CALLED");
      // Validation
      if (!this.state.Username) {
        alert(StringsOfLanguages.EmptyUsernameAlert);
        return;
      }

      if (!this.state.Password) {
        alert(StringsOfLanguages.EmptyPasswordAlert);
        return;
      }

      if (this.state.CompanyId <= 0) {
        alert(StringsOfLanguages.CompanyTypeAlert);
        return;
      }

      this.setState({ loading: true, LoginCall: true });

      this.onAddDeviceToken();

      this.this.props.UsernameAction({
        username: this.state.Username,
        // companyId: 2, //this.state.CompanyId, here we pass static value for driver
        password: this.state.Password,
      });
    } else if (this.state.Radiovalue == 2) {
      console.log("EMAIl CALLED");
      // Validation
      if (!this.state.Email) {
        alert(StringsOfLanguages.EmptyEmailAlert);
        return;
      }

      if (regEmailAddressValidation.test(this.state.Email) === false) {
        alert(StringsOfLanguages.EmailAlert);
        return;
      }

      if (!this.state.Password) {
        alert(StringsOfLanguages.EmptyPasswordAlert);
        return;
      }

      if (this.state.CompanyId <= 0) {
        alert(StringsOfLanguages.CompanyTypeAlert);
        return;
      }

      this.setState({ loading: true, LoginCall: true });

      this.props.Action({
        email: this.state.Email,
        // companyId: 2, //this.state.CompanyId, here we pass static value for driver
        password: this.state.Password,
      });
    } else if (this.state.Radiovalue == 0) {
      // console.log("MOBILE CALLED","+"+this.state.CountryCode,this.state.ContactNumber,this.state.Password);
      // Validation
      if (!this.state.ContactNumber) {
        alert(StringsOfLanguages.EmptyMobilenumberAlert);
        return;
      }

      if (!this.state.Password) {
        alert(StringsOfLanguages.EmptyPasswordAlert);
        return;
      }

      if (this.state.CompanyId <= 0) {
        alert(StringsOfLanguages.CompanyTypeAlert);
        return;
      }

      this.setState({ loading: true, LoginCall: true });
      console.log(
        "countryCode: + this.state.CountryCode",
        "+" + this.state.CountryCode
      );
      this.props.MobileAction({
        countryCode: this.state.CountryCode,
        mobile: this.state.ContactNumber,
        // companyId: 2, //this.state.CompanyId, here we pass static value for driver
        password: this.state.Password,
      });
    }
  }

  render() {
    var radio_props = [
      { label: StringsOfLanguages.MobileNo, value: 0 },
      { label: StringsOfLanguages.Username, value: 1 },
      { label: StringsOfLanguages.Email, value: 2 },
    ];
    return (
      <SafeAreaView style={[Style.mainView]}>
        <View style={[Style.componentContainerView]}>
          <StatusBar
            animated={false}
            backgroundColor={colors.WhiteSmoke}
            barStyle={"dark-content"}
          />
          <KeyboardAwareScrollView
            showsVerticalScrollIndicator={false}
            // contentContainerStyle={{ flexGrow: 1 }}
          >
            <Header2 Title={StringsOfLanguages.SignIn} BackButton={false} />

            <View style={{ marginTop: width / 30 }}>
              {/* <RadioForm formHorizontal={true} animation={true}>
                {radio_props.map((obj, i) => (
                  <RadioButton labelHorizontal={true} key={i}>
                    <RadioButtonInput
                      obj={obj}
                      index={i}
                      isSelected={this.state.Radiovalue === i}
                      onPress={(val) => this.setState({ Radiovalue: val })}
                      borderWidth={2}
                      buttonInnerColor={colors.Blue}
                      buttonOuterColor={
                        this.state.Radiovalue === i ? colors.Blue : "#cdcdcd"
                      }
                      buttonSize={11}
                      buttonOuterSize={20}
                      buttonStyle={{}}
                      buttonWrapStyle={{}}
                    />
                    <RadioButtonLabel
                      obj={obj}
                      index={i}
                      labelHorizontal={true}
                      onPress={() => console.log("ok")}
                      labelWrapStyle={{ paddingRight: width / 45, }}
                      labelStyle={{ color: "#000" }}
                    />
                  </RadioButton>
                ))}
              </RadioForm> */}
            </View>
            <View
              style={{
                flex: 1,
                marginTop: width / 20,
              }}
            >
              {/* here using common component of text input */}
              {this.state.Radiovalue === 0 ? (
                <TextFieldWithCountryCode2
                  name={StringsOfLanguages.MobileNo}
                  countryCodeValue={this.state.CountryCode}
                  countryCodesArr={this.state.CountryCodesArr || null}
                  value={this.state.ContactNumber}
                  placeholder={StringsOfLanguages.EnterMobileNo}
                  onChange={(text) => this.setState({ ContactNumber: text })}
                  keyboardType="phone-pad"
                  codelcik={(item) =>
                    this.setState({
                      CountryCode: "+" + item.callingCode,
                      Cmodal: false,
                    })
                  }
                  Cmodal={this.state.Cmodal}
                  onClose={() => this.setState({ Cmodal: false })}
                  onOpen={() => this.setState({ Cmodal: true })}
                />
              ) : this.state.Radiovalue === 2 ? (
                <TextField
                  name={this.state.LangStr.Email}
                  placeholder={this.state.LangStr.EmailAddressPlaceholder}
                  onChange={(text) => this.setState({ Email: text })}
                />
              ) : (
                <>
                  <TextField
                    name={this.state.LangStr.Username}
                    placeholder={this.state.LangStr.UsernamePlaceholder}
                    onChange={(text) => this.setState({ Username: text })}
                  />
                </>
              )}

              <View style={{ marginTop: RFValue(15) }}>
                <TextFieldWithIcon
                  value={this.state.Password}
                  name={this.state.LangStr.Password}
                  placeholder={this.state.LangStr.PasswordPlaceholder}
                  secureTextEntry={!this.state.PasswordShowFlag}
                  onChange={(text) => this.setState({ Password: text })}
                  onClickIcon={() =>
                    this.setState({
                      PasswordShowFlag: !this.state.PasswordShowFlag,
                    })
                  }
                  imageFlag={this.state.PasswordShowFlag ? 1 : 0}
                />
              </View>

              <View style={{ alignItems: "flex-end" }}>
                <TouchableOpacity
                  onPress={() =>
                    this.props.navigation.navigate("ForgotPassword")
                  }
                >
                  <Text style={Style.linkSmallFont}>
                    {this.state.LangStr.ForgotPassword}
                  </Text>
                </TouchableOpacity>
              </View>
            </View>

            <View style={[Style.SignInbtnView, { marginTop: RFValue(40) }]}>
              <Button
                loader={false}
                onPress={() => {
                  this.LoginPress();
                }}
                border={false}
                style={{
                  backgroundColor: "#34B267",
                }}
                name={this.state.LangStr.SignIn}
              />

              <View style={Style.signUptxtView}>
                <Text style={Style.signUptxt}>
                  {this.state.LangStr.afterSigninBtnTxt}
                  <Text
                    onPress={() =>
                      this.props.navigation.navigate("ElectCompanyType")
                    }
                    style={[
                      Style.signUptxt,
                      {
                        color: colors.LimeGreen,
                        fontSize: RFValue(14),
                      },
                    ]}
                  >
                    {" "}
                    {this.state.LangStr.SignUP}
                  </Text>
                </Text>
              </View>
            </View>
          </KeyboardAwareScrollView>
        </View>
        <ModalSelector
          visible={this.state.ModalVisible}
          title={StringsOfLanguages.CompanyType}
          data={this.state.CompanyAry}
          SearchOptionExist={false}
          IDPropertyName={"companyTypeId"}
          ValuePropertyName={"description"}
          onPress={(text, id) => {
            this.setState({ Company: text, CompanyId: id });
            this.setState({ ModalVisible: false });
          }}
          closeModal={() => this.setState({ ModalVisible: false })}
        />
        <Loader visible={this.state.loading} />
      </SafeAreaView>
    );
  }
}

const mapStateToProps = (state) => {
  return {
    Login: state.Login,
    CompanyData: state.CompanyData,
    CountryData: state.CountryData,
    Language: state.Language,
    UsernameLogin: state.UsernameLogin,
    MobileLogin: state.MobileLogin,

    AddNotificationTokenData: state.AddNotificationTokenData,
  };
};
export default connect(mapStateToProps, {
  Action,
  GetCompanyAction,
  GetCountryAction,
  LanguageAction,
  UsernameAction,
  MobileAction,
  SaveDeviceTokenAction,
  SetNotificationToken,
})(Login);
