import React from "react";
import {
  View,
  SafeAreaView,
  Text,
  TouchableOpacity,
  StatusBar,
  Platform,
  Alert,
  Linking,
  StyleSheet,
} from "react-native";
import { AuthContext } from "../../../navigation/AuthContext";
import * as colors from "../../../common/colors";
import Button from "../../../common/Component/Button";
import {
  GetDriverFilesAction,
  DeleteDriverAction,
} from "../../../Redux/actions";

import StringsOfLanguages from "../../../Localization/stringsoflanguages";
import { Style, width } from "../../../common/Style";
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";
import { RFPercentage, RFValue } from "react-native-responsive-fontsize";
import {
  DetailsField,
  DetailsFieldWithIcon,
} from "../../../common/Component/DetailsField";
import FileUploadField, {
  renderAttachmentItem,
} from "../../../common/Component/FileUploadField";
import Loader from "../../../common/Component/Loader";
import Header from "../../../common/Component/Header";
import { connect } from "react-redux";
import { FileViewerModel } from "../../../common/Component/FileViewerModel";

import DeleteConfirmationModel from "../../../common/Component/DeleteConfirmationModel";

class DriverDetails extends React.Component {
  static contextType = AuthContext;
  constructor(props) {
    super(props);
    this.defaultState = {
      loading: false,
      LangStr: StringsOfLanguages,
      IsContainerSelected: 0,
      Name: "",
      Surname: "",
      ContactNo: "",
      CountryCode: 0,
      DriverLicenceFileName: "",
      DriverLicenceFileURI: "",
      SRCLicenceFileName: "",
      SRCLicenceFileURI: "",
      ViewerFileName: "",
      ViewerFileURI: "",
      FileViewerFlag: false,
      APIAction: 0,
      DriverObject: 0,
      DeleteConfirmationDialog: false,
    };
    this.state = { ...this.defaultState };
  }

  async componentDidMount() {
    this._Reload = this.props.navigation.addListener("focus", async () => {
      this.setState({ ...this.defaultState });
      if (this.props.route.params) {
        const objDriver = JSON.parse(this.props.route.params.DriverObject);
        console.log("objDriver: ", objDriver);
        await this.setState({
          DriverObject: objDriver,
          Name: objDriver.name,
          Surname: objDriver.surname,
          ContactNo: objDriver?.mobile ? objDriver.mobile : "XXXXXXXXXX",
          CountryCode: objDriver.countryCode,
        });
        this.fetchDriverFiles(objDriver.userId);
      }
    });
  }

  async fetchDriverFiles(userId) {
    this.setState({ APIAction: 1, loading: false });
    this.props.GetDriverFilesAction(userId);
  }

  async UNSAFE_componentWillReceiveProps(nextProps) {
    if (this.state.APIAction == 1) {
      if (nextProps.DriverFilesData.GetDriverFilesSuccess) {
        if (nextProps.DriverFilesData.data[1] == 200) {
          this.setState({ APIAction: 0, loading: false });
          var lstUploadedFiles = await nextProps.DriverFilesData.data[0];
          lstUploadedFiles.map((Item) => {
            if (Item.fileType.fileTypeId == 2)
              this.setState({
                DriverLicenceFileName: Item.fileName,
                DriverLicenceFileURI: Item.url,
              });
            else if (Item.fileType.fileTypeId == 5)
              this.setState({
                SRCLicenceFileName: Item.fileName,
                SRCLicenceFileURI: Item.url,
              });
          });
        } else if (nextProps.DriverFilesData.data[1] == 401) {
          const SignOutContext = this.context;
          SignOutContext.signOut();
        } else {
          this.setState({ loading: false, APIAction: 0 });
          console.log("nextProps.DriverFilesData");
        }
      }
    } else if (this.state.APIAction == 2) {
      if (nextProps.DeleteDriver.DeleteDriverSuccess) {
        if (nextProps.DeleteDriver.data[1] == 200) {
          this.setState({ loading: false });
          this.props.navigation.navigate("DriverList", { NeedtoReload: true });
        } else if (nextProps.DeleteDriver.data[1] == 401) {
          const SignOutContext = this.context;
          SignOutContext.signOut();
        } else {
          this.setState({ loading: false, APIAction: 0 });
          alert(nextProps.DeleteDriver.data[0].message);
          console.log("nextProps.DeleteDriver");
        }
      }
    }
  }

  onUpdate() {
    var objSelectedDriver = this.state.DriverObject;
    this.props.navigation.navigate("SaveDriver", {
      Action: 2,
      DriverObject: JSON.stringify(objSelectedDriver),
    });
  }

  onDelete() {
    console.log(JSON.parse(this.props.route.params.DriverObject));
    var intSelectedDriverID = JSON.parse(this.props.route.params.DriverObject);
    this.setState({
      OpenOptionDialog: false,
      DeleteConfirmationDialog: false,
      loading: true,
      APIAction: 2,
    });
    this.props.DeleteDriverAction(intSelectedDriverID.userId);
  }

  callNumber() {
    let phoneNumber = this.state.ContactNo;
    if (Platform.OS == "ios") {
      phoneNumber = `telprompt:${phoneNumber}`;
    } else {
      phoneNumber = `tel:${phoneNumber}`;
    }
    Linking.canOpenURL(phoneNumber)
      .then((supported) => {
        if (!supported) {
          Alert.alert("Phone number is not available");
        } else {
          return Linking.openURL(phoneNumber);
        }
      })
      .catch((err) => console.log(err));
  }

  render() {
    return (
      <SafeAreaView style={[Style.mainView]}>
        <StatusBar
          animated={false}
          backgroundColor={colors.WhiteSmoke}
          barStyle={"dark-content"}
        />
        <Header
          Title={StringsOfLanguages.Details}
          BackAction={() => this.props.navigation.goBack()}
        />
        <View style={Style.componentContainerView}>
          <KeyboardAwareScrollView
            showsVerticalScrollIndicator={false}
            contentContainerStyle={{ flexGrow: 1 }}
          >
            <View style={{ flex: 1 }}>
              <View style={{ marginTop: RFValue(10) }}>
                <DetailsField
                  name={StringsOfLanguages.Name}
                  value={this.state.Name}
                  icon={require("../../../assets/images/DrivarIcon2.png")}
                />
                <DetailsField
                  name={StringsOfLanguages.Surname}
                  value={this.state.Surname}
                  icon={require("../../../assets/images/DrivarIcon2.png")}
                />

                <DetailsField
                  name={StringsOfLanguages.MobileNo}
                  value={
                    (this.state.CountryCode ? this.state.CountryCode : "") +
                    " " +
                    this.state.ContactNo
                  }
                  icon={require("../../../assets/images/call.png")}
                />

                {this.state.DriverLicenceFileName != "" ? (
                  <View style={[Style.TextfieldMainView]}>
                    <View style={[Style.TextfieldTitleView]}>
                      <Text style={Style.TextfieldTitle}>
                        {StringsOfLanguages.DriverLicence}
                      </Text>
                      <TouchableOpacity
                        onPress={() =>
                          this.setState({
                            FileViewerFlag: true,
                            ViewerFileURI: this.state.DriverLicenceFileURI,
                          })
                        }
                      >
                        {console.log(
                          this.state.DriverLicenceFileName,
                          "162444444"
                        )}
                        {renderAttachmentItem(this.state.DriverLicenceFileName)}
                        <Text
                          style={{
                            color: "#34B267",
                            fontSize: RFValue(14),
                            fontWeight: "400",
                            marginBottom: RFValue(10),
                          }}
                        >
                          {StringsOfLanguages.Preview}
                        </Text>
                      </TouchableOpacity>
                    </View>
                  </View>
                ) : null}

                {this.state.SRCLicenceFileName != "" ? (
                  <View style={Style.TextfieldMainView}>
                    <View style={[Style.TextfieldTitleView]}>
                      <Text style={Style.TextfieldTitle}>
                        {StringsOfLanguages.SRCLicence}
                      </Text>
                      <TouchableOpacity
                        onPress={() =>
                          this.setState({
                            FileViewerFlag: true,
                            ViewerFileURI: this.state.SRCLicenceFileURI,
                          })
                        }
                      >
                        {renderAttachmentItem(this.state.SRCLicenceFileName)}
                        <Text
                          style={{
                            color: "#34B267",
                            fontSize: RFValue(14),
                            fontWeight: "400",
                            marginBottom: RFValue(10),
                          }}
                        >
                          {StringsOfLanguages.Preview}
                        </Text>
                      </TouchableOpacity>
                    </View>
                  </View>
                ) : null}
              </View>
            </View>
            <View>
              <View style={[{ flex: 1, paddingHorizontal: RFValue(10) }]}>
                <Button
                  loader={false}
                  onPress={() => {
                    this.onUpdate();
                  }}
                  border={false}
                  name={this.state.LangStr.Update}
                />
              </View>
              <View style={[{ flex: 1, paddingHorizontal: RFValue(10) }]}>
                <Button
                  loader={false}
                  onPress={() => {
                    this.props.navigation.goBack();
                  }}
                  border={true}
                  name={this.state.LangStr.Cancel}
                />
              </View>
            </View>
          </KeyboardAwareScrollView>
        </View>
        <DeleteConfirmationModel
          isVisible={this.state.DeleteConfirmationDialog}
          onDelete={() => this.onDelete()}
          onCancel={() => this.setState({ DeleteConfirmationDialog: false })}
        />
        <FileViewerModel
          fileName={this.state.ViewerFileName}
          url={this.state.ViewerFileURI}
          isVisible={this.state.FileViewerFlag}
          onclose={() =>
            this.setState({
              FileViewerFlag: false,
              ViewerFileName: "",
              ViewerFileURI: "",
            })
          }
        />
        <Loader visible={this.state.loading} />
      </SafeAreaView>
    );
  }
}

const mapStateToProps = (state) => {
  return {
    DeleteDriver: state.DeleteDriver,
    DriverFilesData: state.DriverFilesData,
  };
};
export default connect(mapStateToProps, {
  GetDriverFilesAction,
  DeleteDriverAction,
})(DriverDetails);
