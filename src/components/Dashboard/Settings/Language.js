import React, { useState } from "react";
import {
  SafeAreaView,
  Text,
  View,
  Image,
  TouchableOpacity,
  Dimensions,
  StatusBar,
  FlatList,
  I18nManager,
} from "react-native";
import { AuthContext } from "../../../navigation/AuthContext";
import { RFPercentage, RFValue } from "react-native-responsive-fontsize";
import stringsoflanguages from "../../../Localization/stringsoflanguages";
//import { Style } from '../Style';
import { Style } from "../../../common/Style";

import AsyncStorage from "@react-native-async-storage/async-storage";
import * as colors from "../../../common/colors";
import { connect } from "react-redux";
import { LanguageAction, UpdateLanguageAction } from "../../../Redux/actions";
import NetChecker from "../../../common/Component/Network";
import Loader from "../../../common/Component/Loader";
import rtlDetect from "rtl-detect";
import RNRestart from "react-native-restart";
import Button from "../../../common/Component/Button";

import RadioForm, {
  RadioButton,
  RadioButtonInput,
  RadioButtonLabel,
} from "react-native-simple-radio-button";
import { ScrollView } from "react-native-gesture-handler";
import Header from "../../../common/Component/Header";

const { width, height } = Dimensions.get("window");

class Language extends React.Component {
  static contextType = AuthContext;
  constructor(props) {
    super(props);
    this.state = {
      loading: false,
      LanguageAry: [],
      LangStr: stringsoflanguages,
      selectedLangCode: "",
      RadioLanguageAry: [],
      isUpdateLanguage: false,
    };
  }

  async UNSAFE_componentWillMount() {
    console.log("GotAsyntoken", await AsyncStorage.getItem("AccessToken"));
    const NetworkStatus = NetChecker();
    if ((await NetworkStatus) == false) {
      alert("network issue ");
      return;
    }
    this.setState({
      loading: true,
      selectedLangCode: await AsyncStorage.getItem("SelectedLanguage"),
    });
    this.props.LanguageAction();
  }

  onUpdateLang() {
    this.setState({ isUpdateLanguage: true });
    this.props.UpdateLanguageAction({
      language: this.state.selectedLangCode,
    });
  }

  async UNSAFE_componentWillReceiveProps(nextProps) {
    //login
    // console.log("LAnguageLog", nextProps.UpdateLang.data[0],this.state.isUpdateLanguage)
    if (nextProps.Language.GetLangSuccess) {
      if (nextProps.Language.data[1] == 200) {
        this.setState({ LanguageAry: await nextProps.Language.data[0] });
        var lstLanguageAryRadio = [];
        for (var index = 0; index < this.state.LanguageAry.length; index++) {
          var objCurrent = this.state.LanguageAry[index];
          lstLanguageAryRadio.push({
            label: objCurrent.name,
            value: objCurrent.code,
          });
        }
        this.setState({ RadioLanguageAry: lstLanguageAryRadio });
      } else if (nextProps.Language.data[1] == 401) {
        const SignOutContext = this.context;
        SignOutContext.signOut();
      } else {
        console.log("");
      }

      this.setState({ loading: false });
    }
    if (this.state.isUpdateLanguage) {
      // console.log("LAnguageLog1234", nextProps)
      if (nextProps.UpdateLang.UpdateLanguageStatusSuccess) {
        if (nextProps.UpdateLang.data[1] == 200) {
          console.log("LAnguageLogIn", nextProps.UpdateLang.data);
          await AsyncStorage.setItem(
            "AccessToken",
            nextProps.UpdateLang.data[0].token
          );
          this.setState({ loading: false });
        } else if (nextProps.UpdateLang.data[1] == 401) {
          const SignOutContext = this.context;
          SignOutContext.signOut();
        } else {
          console.log("");
        }
        this.setState({ loading: false });
      }
    }
  }

  renderItem = (obj, i) => {
    var isChecked = this.state.selectedLangCode == obj.value;
    return (
      <View
        style={{
          padding: RFPercentage(2),
          paddingTop: RFPercentage(2.5),
          backgroundColor: "white",
          marginVertical: RFValue(5),
          borderRadius: RFValue(5),
          shadowColor: colors.Grey,
          shadowOffset: { width: 0, height: 2 },
          shadowOpacity: 0.2,
          shadowRadius: 3,
          elevation: 3,
          borderWidth: isChecked ? 1 : 0,
          borderColor: colors.LimeGreen,
        }}
      >
        <RadioButton
          labelHorizontal={true}
          // key={item.id}
          animation={false}
          style={{ alignItems: "center" }}
        >
          <RadioButtonInput
            obj={obj}
            index={i + 1}
            isSelected={isChecked}
            onPress={(value) => {
              console.log(">>>", value);
              this.setState({ selectedLangCode: value });
            }}
            buttonInnerColor={isChecked ? colors.LimeGreen : "transparent"}
            buttonSize={12}
            buttonOuterSize={18}
            buttonStyle={{
              borderWidth: 1,
              borderColor: isChecked ? colors.LimeGreen : colors.Grey,
            }}
          />
          <RadioButtonLabel
            obj={obj}
            index={i + 1}
            onPress={(value) => {
              this.setState({ selectedLangCode: value });
            }}
            labelHorizontal={true}
            labelStyle={Style.CheckListItemText}
          />
        </RadioButton>
      </View>
    );
  };

  ChangeFlow() {
    alert(rtlDetect.isRtlLang("ar"));

    alert(I18nManager.isRTL);
    if (!I18nManager.isRTL) {
      alert("to RTL");
      I18nManager.forceRTL(true);
    } else {
      alert("to LTR");
      I18nManager.forceRTL(false);
    }

    RNRestart.Restart();
  }

  onChangeLanguage() {
    this.onUpdateLang();
    this.setState({ loading: true });
    AsyncStorage.setItem("SelectedLanguage", this.state.selectedLangCode);
    stringsoflanguages.setLanguage(this.state.selectedLangCode);
    var isRTLLanguage = rtlDetect.isRtlLang(this.state.selectedLangCode);
    if (isRTLLanguage && !I18nManager.isRTL) {
      I18nManager.forceRTL(true);
      RNRestart.Restart();
    } else if (!isRTLLanguage && I18nManager.isRTL) {
      I18nManager.forceRTL(false);
      RNRestart.Restart();
    } else
      setTimeout(() => {
        this.setState({ loading: false });
        this.props.navigation.goBack();
      }, 2000);
    console.log("LOgstate", this.state.isUpdateLanguage);
  }

  onChangeToArabicLanguage() {
    var selectedLangCode = "ar";
    AsyncStorage.setItem("SelectedLanguage", selectedLangCode);
    stringsoflanguages.setLanguage("ar");
    var isRTLLanguage = rtlDetect.isRtlLang(selectedLangCode);
    if (isRTLLanguage && !I18nManager.isRTL) {
      I18nManager.forceRTL(true);
      RNRestart.Restart();
    } else if (!isRTLLanguage && I18nManager.isRTL) {
      I18nManager.forceRTL(false);
      RNRestart.Restart();
    } else this.props.navigation.goBack();
  }

  checkIsSelected(i) {
    return true;
  }

  render() {
    return (
      <SafeAreaView style={{ backgroundColor: colors.WhiteSmoke, flex: 1 }}>
        <StatusBar
          translucent
          backgroundColor={colors.WhiteSmoke}
          barStyle={"dark-content"}
        />
        <Header
          Title={this.state.LangStr.Language}
          BackAction={() => this.props.navigation.goBack()}
        />
        <ScrollView
          style={[
            Style.componentContainerView,
            { marginHorizontal: RFValue(0), width: "90%", alignSelf: "center" },
          ]}
          contentContainerStyle={{ flexGrow: 1 }}
        >
          <View style={{ flex: 1 }}>
            <RadioForm formHorizontal={false} animation={true}>
              {this.state.RadioLanguageAry.map((obj, i) =>
                this.renderItem(obj, i)
              )}
            </RadioForm>
          </View>

          <Button
            style={{
              backgroundColor:
                this.state.selectedLangCode != ""
                  ? colors.LimeGreen
                  : colors.silver,
            }}
            loader={false}
            disabled={this.state.selectedLangCode == "" ? true : false}
            border={false}
            name={stringsoflanguages.Change_Language}
            onPress={() => {
              this.onChangeLanguage();
            }}
          />

          {/* <TouchableOpacity
            onPress={() => {
              this.onChangeToArabicLanguage();
            }}
            activeOpacity={1}
            style={[
              Style.BottomBtn,
              { backgroundColor: colors.Blue, marginTop: 10 },
            ]}
          >
            <Text style={[Style.BottomBtnTxt]}>Change to Arabic</Text>
          </TouchableOpacity> */}
        </ScrollView>

        <Loader visible={this.state.loading} />
      </SafeAreaView>
    );
  }
}

const mapStateToProps = (state) => {
  return {
    Language: state.Language,
    UpdateLang: state.UpdateLang,
  };
};

export default connect(mapStateToProps, {
  LanguageAction,
  UpdateLanguageAction,
})(Language);
