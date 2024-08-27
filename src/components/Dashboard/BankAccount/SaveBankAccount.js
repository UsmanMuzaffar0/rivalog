import React from "react";
import {
  View,
  SafeAreaView,
  Text,
  TouchableOpacity,
  StatusBar,
} from "react-native";
import { AuthContext } from "../../../navigation/AuthContext";
import * as colors from "../../../common/colors";
import NetChecker from "../../../common/Component/Network";
import StringsOfLanguages from "../../../Localization/stringsoflanguages";
import { Style, width } from "../../../common/Style";
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";
import { RFPercentage, RFValue } from "react-native-responsive-fontsize";
import Header from "../../../common/Component/Header";
import { TextField, TextField2 } from "../../../common/Component/TextField";
import {
  AddBankAccountAction,
  EditBankAccountAction,
} from "../../../Redux/actions";
import { connect } from "react-redux";
import Loader from "../../../common/Component/Loader";
import Button from "../../../common/Component/Button";

class SaveBankAccount extends React.Component {
  static contextType = AuthContext;
  constructor(props) {
    super(props);
    this.defaultState = {
      loading: false,
      LangStr: StringsOfLanguages,
      ModalVisible: false,

      accountHolderName: "",
      iban: "",
      swiftCode: "",
      explanation: "",

      BankAccountObject: 0,
      bankAccountId: 0,
    };
    this.state = { ...this.defaultState };
  }

  async componentDidMount() {
    this._Reload = this.props.navigation.addListener("focus", async () => {
      this.setState({ ...this.defaultState });
      if (this.props.route.params) {
        this.setState({ Action: this.props.route.params.Action });
        if (this.props.route.params.Action == 2) {
          const objBankAccount = JSON.parse(
            this.props.route.params.BankAccountObject
          );
          this.setState({
            BankAccountObject: objBankAccount,
            bankAccountId: objBankAccount.bankAccountId,
            IsFirstTimeLoad: true,
          });
          this.setState({
            accountHolderName: objBankAccount.accountHolder,
            iban: objBankAccount.iban,
            swiftCode: objBankAccount.swiftCode,
            explanation: objBankAccount.explanation,
            bankAccountId: objBankAccount.bankAccountId,
          });
          await this.fetchDriverFiles(objDriver.userId);
        }
      }
    });
  }

  async UNSAFE_componentWillReceiveProps(nextProps) {
    if (this.state.APIAction == 1) {
      if (nextProps.AddBankAccountData.AddBankAccountSuccess) {
        if (nextProps.AddBankAccountData.data[1] == 200) {
          this.setState({ loading: false, APIAction: 0 });
          this.props.navigation.navigate("BankAccountList", {
            NeedtoReload: true,
          });
        } else if (nextProps.AddBankAccountData.data[1] == 401) {
          const SignOutContext = this.context;
          SignOutContext.signOut();
        } else {
          alert((await nextProps.AddBankAccountData.data[0]).message);
          this.setState({ loading: false, APIAction: 0 });
        }
      }
    }
    if (this.state.APIAction == 5) {
      if (nextProps.EditBankAccountData.EditBankAccountSuccess) {
        if (nextProps.EditBankAccountData.data[1] == 200) {
          this.setState({ loading: false, APIAction: 0 });
          this.props.navigation.navigate("BankAccountList", {
            NeedtoReload: true,
          });
        } else if (nextProps.EditBankAccountData.data[1] == 401) {
          const SignOutContext = this.context;
          SignOutContext.signOut();
        } else {
          alert((await nextProps.EditBankAccountData.data[0]).message);
          this.setState({ loading: false, APIAction: 0 });
        }
      }
    }
  }

  async AddNewBankAccount() {
    if (this.state.Action == 2) {
      //   const objDriver = this.state.BankAccountObject;
      //   if (
      //     objDriver.name == this.state.Name &&
      //     objDriver.surname == this.state.Surname &&
      //     objDriver.mobile == this.state.ContactNumber
      //   ) {
      //     if (this.state.IsFileChange) {
      //       this.UploadDriverLicenceFile();
      //     } else {
      //       this.setState({ APIAction: 0, loading: false });
      //       this.props.navigation.navigate("DriverList", { NeedtoReload: true });
      //     }
      //     return;
      //   }
    }

    if (!this.state.accountHolderName) {
      alert(StringsOfLanguages.NameAlert);
      return;
    }

    if (!this.state.iban) {
      alert(StringsOfLanguages.SurnameAlert);
      return;
    }

    const NetworkStatus = NetChecker();
    if ((await NetworkStatus) == false) {
      alert("network issue ");
      return;
    }

    if (this.state.Action == 2) {
      this.setState({ APIAction: 5, loading: true });
      this.props.EditBankAccountAction({
        bankAccountId: this.state.bankAccountId,
        swiftCode: this.state.swiftCode,
        accountHolder: this.state.accountHolderName,
        iban: this.state.iban,
      });
    } else {
      this.setState({ APIAction: 1, loading: true });
      this.props.AddBankAccountAction({
        swiftCode: this.state.swiftCode,
        accountHolder: this.state.accountHolderName,
        iban: this.state.iban,
      });
    }
  }

  render() {
    return (
      <SafeAreaView style={Style.mainView}>
        <StatusBar
          animated={false}
          backgroundColor={colors.WhiteSmoke}
          barStyle={"dark-content"}
        />
        <Header
          Title={
            this.state.Action == 2
              ? "Update Bank Account"
              : "Create Bank Account"
          }
          BackAction={() => this.props.navigation.goBack()}
        />
        <View style={Style.componentContainerView}>
          <KeyboardAwareScrollView
            showsVerticalScrollIndicator={false}
            contentContainerStyle={{ flexGrow: 1 }}
          >
            <View style={{ flex: 1, paddingTop: RFValue(10) }}>
              <TextField2
                name={this.state.LangStr.HolderName}
                value={this.state.accountHolderName}
                placeholder={this.state.LangStr.E_holdername}
                onChange={(text) => this.setState({ accountHolderName: text })}
              />

              <TextField2
                name={this.state.LangStr.AccountNo}
                value={this.state.iban}
                placeholder={this.state.LangStr.E_acnumber}
                onChange={(text) => this.setState({ iban: text })}
              />

              <TextField2
                name={this.state.LangStr.swift_code}
                value={this.state.swiftCode}
                placeholder={this.state.LangStr.E_swiftcode}
                onChange={(text) => this.setState({ swiftCode: text })}
              />
            </View>

            <View style={Style.SignInbtnView}>
              {/* <TouchableOpacity
                onPress={() => {
                  this.AddNewBankAccount();
                }}
                activeOpacity={1}
                disabled={
                  this.state.accountHolderName != "" && this.state.iban != ""
                    ? false
                    : true
                }
                style={[
                  Style.signInBtn,
                  {
                    backgroundColor:
                      this.state.accountHolderName != "" &&
                      this.state.iban != ""
                        ? colors.Blue
                        : colors.LightBlue,
                  },
                ]}
              >
                <Text style={[Style.signinBtnTxt, { color: colors.White }]}>
                  {this.state.Action == 2
                    ? this.state.LangStr.Update
                    : this.state.LangStr.Add}
                </Text>
              </TouchableOpacity> */}
            </View>
            <Button
              loader={false}
              onPress={() => {
                this.AddNewBankAccount();
              }}
              border={false}
              style={{
                backgroundColor:
                  this.state.accountHolderName != "" &&
                  this.state.swiftCode &&
                  this.state.iban != ""
                    ? "#34B267"
                    : "#BCBCBC",
              }}
              disabled={
                this.state.accountHolderName != "" &&
                this.state.swiftCode &&
                this.state.iban != ""
                  ? false
                  : true
              }
              name={
                this.state.Action == 2
                  ? this.state.LangStr.Update
                  : this.state.LangStr.Save
              }
            />
          </KeyboardAwareScrollView>
        </View>
        <Loader visible={this.state.loading} />
      </SafeAreaView>
    );
  }
}

const mapStateToProps = (state) => {
  return {
    AddBankAccountData: state.AddBankAccountData,
    EditBankAccountData: state.EditBankAccountData,
  };
};
export default connect(mapStateToProps, {
  AddBankAccountAction,
  EditBankAccountAction,
})(SaveBankAccount);
