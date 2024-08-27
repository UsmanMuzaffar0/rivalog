import React, { useState, useRef } from "react";
import {
  View,
  SafeAreaView,
  Text,
  TouchableOpacity,
  StatusBar,
  Platform,
  PermissionsAndroid,
} from "react-native";
import { AuthContext } from "../../../navigation/AuthContext";
import * as colors from "../../../common/colors";
import StringsOfLanguages from "../../../Localization/stringsoflanguages";
import { Style, width } from "../../../common/Style";
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";
import { RFPercentage, RFValue } from "react-native-responsive-fontsize";
import {
  TextField,
  TextField2,
  TextFieldForDatePicker,
  TextFieldWithCountryCode,
  TextFieldWithCountryCode2,
} from "../../../common/Component/TextField";

import FileUploadField from "../../../common/Component/FileUploadField";

import Loader from "../../../common/Component/Loader";
import DocumentPicker from "react-native-document-picker";
import FileViewer from "react-native-file-viewer";

import { Header } from "../../../common/Component/Header";
import { connect } from "react-redux";
import NetChecker from "../../../common/Component/Network";
import {
  AddDriverAction,
  EditDriverAction,
  UploadDriverFileAction,
  GetDriverFilesAction,
} from "../../../Redux/actions";
import { FileViewerModel } from "../../../common/Component/FileViewerModel";
import Button from "../../../common/Component/Button";
import { ImageUploadOption } from "../../../common/Component/ImageUploadOption";
import { launchCamera, launchImageLibrary } from "react-native-image-picker";

const stringRegex = /^[A-Za-z]+$/;
const numberRegex = /^\d+$/;
class SaveDriver extends React.Component {
  static contextType = AuthContext;
  DateFormat = "DD/MM/YYYY";
  constructor(props) {
    super(props);
    this.defaultState = {
      loading: false,
      LangStr: StringsOfLanguages,
      ModalVisible: false,
      Name: "",
      Surname: "",
      ContactNumber: "",
      shouldUploadLicence: false,
      shouldUploadSrc: false,
      srcUploadSuccess: false,
      licenceUploadSuccess: false,
      SelectedDriverLicenceFileName: "",
      SelectedDriverLicenceFileURI: "",
      SelectedDriverLicenceFileType: "",
      SelectedSRCLicenceFileName: "",
      SelectedSRCLicenceFileURI: "",
      SelectedSRCLicenceFileType: "",
      ViewerFileName: "",
      ViewerFileURI: "",
      FileViewerFlag: false,
      DriverObject: 0,
      IsFirstTimeLoad: false,
      IsFileChange: false,
      UserID: 0,
      CountryCode: "",
      Cmodal: false,
      ImagePickerDialogVisible: false,
      FieldNumber: 0,
    };
    this.state = { ...this.defaultState };
  }

  async componentDidMount() {
    this._Reload = this.props.navigation.addListener("focus", async () => {
      this.setState({ ...this.defaultState });
      if (this.props.route.params) {
        this.setState({ Action: this.props.route.params.Action });
        if (this.props.route.params.Action == 2) {
          const objDriver = JSON.parse(this.props.route.params.DriverObject);
          this.setState({
            DriverObject: objDriver,
            UserID: objDriver.userId,
            IsFirstTimeLoad: true,
          });
          this.setState({
            Name: objDriver.name,
            Surname: objDriver.surname,
            ContactNumber: objDriver.mobile,
            CountryCode: objDriver.countryCode,
          });
          await this.fetchDriverFiles(objDriver.userId);
        }
      }
    });
  }

  async UNSAFE_componentWillReceiveProps(nextProps) {
    console.log("this.state.APIAction", this.state.APIAction);
    if (this.state.APIAction == 1) {
      if (nextProps.AddDriverData.AddDriverSuccess) {
        if (nextProps.AddDriverData.data[1] == 200) {
          // this.setState({loading: false})
          var AddDriverData = await nextProps.AddDriverData.data[0];
          console.log(AddDriverData, "1234");
          this.setState({
            DriverObject: AddDriverData,
            UserID: AddDriverData.userId,
          });
          this.UploadDriverLicenceFile();
          this.setState({ APIAction: 0, loading: false });
          this.props.navigation.navigate("DriverList", {
            NeedtoReload: true,
          });
        } else if (nextProps.AddDriverData.data[1] == 401) {
          const SignOutContext = this.context;
          SignOutContext.signOut();
        } else {
          alert((await nextProps.AddDriverData.data[0])?.message);
          this.setState({ loading: false, APIAction: 0 });
          console.log("nextProps.AddDriverData");
        }
      }
    } else if (this.state.APIAction == 2) {
      // only update license and check
      if (nextProps.UploadDriverFileData.UploadDriverFileSuccess) {
        if (nextProps.UploadDriverFileData.data[1] == 200) {
          this.setState({
            licenceUploadSuccess: true,
          });
          if (this.state.shouldUploadSrc) {
            this.setState({ APIAction: 3 });
            await this.UploadSRCLicenceFile();
          } else {
            this.props.navigation.navigate("DriverList", {
              NeedtoReload: true,
            });
          }
        } else if (nextProps.UploadDriverFileData.data[1] == 401) {
          const SignOutContext = this.context;
          SignOutContext.signOut();
        } else {
          alert(
            "Error occured while uploading driver licence file. try upload again."
          );
          this.setState({ loading: false, APIAction: 0, Action: 2 });
          console.log(
            "nextProps.UploadDriverFileData",
            await nextProps.UploadDriverFileData.data[0]
          );
        }
      }
    } else if (this.state.APIAction == 3) {
      // only src
      if (nextProps.UploadDriverFileData.UploadDriverFileSuccess) {
        if (nextProps.UploadDriverFileData.data[1] == 200) {
          this.setState({
            APIAction: 0,
            loading: false,
            srcUploadSuccess: true,
          });
          this.props.navigation.navigate("DriverList", {
            NeedtoReload: true,
          });
        } else if (nextProps.UploadDriverFileData.data[1] == 401) {
          const SignOutContext = this.context;
          SignOutContext.signOut();
        } else {
          alert(
            "Error occured while uploading SRC licence file. try upload again."
          );
          this.setState({ loading: false, APIAction: 0, Action: 2 });
          console.log("nextProps.UploadDriverFileData");
        }
      }
    } else if (this.state.APIAction == 4) {
      this.setState({ APIAction: 0, loading: false });
      if (nextProps.DriverFilesData.GetDriverFilesSuccess) {
        if (nextProps.DriverFilesData.data[1] == 200) {
          this.setState({ APIAction: 0, loading: false });
          var lstUploadedFiles = await nextProps.DriverFilesData.data[0];
          lstUploadedFiles.map((Item) => {
            if (Item.fileType.fileTypeId == 2)
              this.setState({
                SelectedDriverLicenceFileName: Item.fileName,
                SelectedDriverLicenceFileURI: Item.url,
                SelectedDriverLicenceFileType: "base64",
              });
            else if (Item.fileType.fileTypeId == 5)
              this.setState({
                SelectedSRCLicenceFileName: Item.fileName,
                SelectedSRCLicenceFileURI: Item.url,
                SelectedSRCLicenceFileType: "base64",
              });
          });
        } else if (nextProps.DriverFilesData.data[1] == 401) {
          const SignOutContext = this.context;
          SignOutContext.signOut();
        } else {
          this.setState({ loading: false, APIAction: 0 });
          console.log("nextProps.DriverFilesData");
        }
      } else this.setState({ APIAction: 0, loading: false });
    } else if (this.state.APIAction == 5) {
      if (nextProps.EditDriverData.EditDriverSuccess) {
        if (nextProps.EditDriverData.data[1] == 200) {
          if (this.state.IsFileChange) {
            var lstDriverData = await nextProps.EditDriverData.data[0];
            if (this.state.shouldUploadLicence) {
              await this.UploadDriverLicenceFile();
            } else if (this.state.shouldUploadSrc) {
              await this.UploadSRCLicenceFile();
            }
          } else {
            this.setState({ APIAction: 0, loading: false });
            this.props.navigation.navigate("DriverList", {
              NeedtoReload: true,
            });
          }
          return;
        } else if (nextProps.EditDriverData.data[1] == 401) {
          const SignOutContext = this.context;
          SignOutContext.signOut();
        } else {
          this.setState({ APIAction: 0, loading: false });
          console.log("nextProps.EditDriverData");
        }
      }
    }
  }

  async fetchDriverFiles(userId) {
    this.setState({ APIAction: 4, loading: false });
    this.props.GetDriverFilesAction(userId);
  }

  async storeDocumentData(uri, type, name, FileUploadFieldNumber) {
    if (FileUploadFieldNumber == 1)
      this.setState({
        SelectedDriverLicenceFileName: name,
        SelectedDriverLicenceFileURI: uri,
        SelectedDriverLicenceFileType: type,
        IsFileChange: true,
        shouldUploadLicence: true,
      });
    else if (FileUploadFieldNumber == 2)
      this.setState({
        SelectedSRCLicenceFileName: name,
        SelectedSRCLicenceFileURI: uri,
        SelectedSRCLicenceFileType: type,
        IsFileChange: true,
        shouldUploadSrc: true,
      });
  }

  async requestCameraPermission() {
    if (Platform.OS === "android") {
      try {
        const granted = await PermissionsAndroid.request(
          PermissionsAndroid.PERMISSIONS.CAMERA,
          {
            title: "Camera Permission",
            message: "App needs camera permission",
          }
        );
        // If CAMERA Permission is granted
        return granted === PermissionsAndroid.RESULTS.GRANTED;
      } catch (err) {
        console.warn(err);
        return false;
      }
    } else return true;
  }

  async selectFile(FileUploadFieldNumber, type) {
    if (type === 2) {
      try {
        let options = {
          mediaType: "photo",
          // saveToPhotos: true,
        };
        let isCameraPermitted = await this.requestCameraPermission();
        console.log(isCameraPermitted, "permission");
        if (isCameraPermitted) {
          launchCamera(options, (response) => {
            console.log(response);
            if (response.didCancel) {
              alert("User cancelled camera picker");
              return;
            } else if (response.errorCode == "camera_unavailable") {
              alert("Camera not available on device");
              return;
            } else if (response.errorCode == "permission") {
              alert("Permission not satisfied");
              return;
            } else if (response.errorCode == "others") {
              alert(response.errorMessage);
              return;
            }
            var objResponse = response.assets[0];
            let uri = objResponse.uri;
            if (Platform.OS === "ios") {
              uri = objResponse.uri.replace("file://", "");
            }
            this.setState({ ImagePickerDialogVisible: false });

            this.storeDocumentData(
              uri,
              objResponse.type,
              objResponse.fileName,
              FileUploadFieldNumber
            );
            // setFilePath(response);
          });
        }
      } catch (err) {
        alert("Unknown Error: " + JSON.stringify(err));
        throw err;
      }
    } else if (type == 1) {
      // Opening Document Picker to select one file
      try {
        var res = await DocumentPicker.pick({
          // Provide which type of file you want user to pick
          type: [DocumentPicker.types.allFiles],
        });
        console.log(res, "resss=>>>>");
        // return
        if (res) {
          res = res[0];
          let uri = res.uri;
          if (Platform.OS === "ios") {
            uri = res.uri.replace("file://", "");
          }
          this.setState({ ImagePickerDialogVisible: false });
          this.storeDocumentData(
            uri,
            res.type,
            res.name,
            FileUploadFieldNumber
          );
        }
      } catch (err) {
        if (DocumentPicker.isCancel(err)) {
        } else {
          alert("Unknown Error: " + JSON.stringify(err));
          throw err;
        }
      }
    }
  }

  openUploaderDocument(FileURI, FileName) {
    if (FileURI.includes("http")) {
      this.setState({
        FileViewerFlag: true,
        ViewerFileName: FileName,
        ViewerFileURI: FileURI,
      });
    } else {
      FileViewer.open(FileURI)
        .then(() => {
          // Do whatever you want
          console.log("Success");
        })
        .catch((_err) => {
          // Do whatever you want
          console.log(_err);
        });
    }
  }

  async AddNewDriver() {
    if (this.state.Action == 2) {
      const objDriver = this.state.DriverObject;
      if (
        objDriver.name == this.state.Name &&
        objDriver.surname == this.state.Surname &&
        objDriver.mobile == this.state.ContactNumber
      ) {
        if (this.state.IsFileChange) {
          if (this.state.shouldUploadLicence) {
            await this.UploadDriverLicenceFile();
          } else if (this.state.shouldUploadSrc) {
            await this.UploadSRCLicenceFile();
          }
          if (this.state.shouldUploadLicence && this.state.shouldUploadSrc) {
            // this.setState({ APIAction: 6 });
          }
        } else {
          this.setState({ APIAction: 0, loading: false });
          this.props.navigation.navigate("DriverList", { NeedtoReload: true });
        }
        return;
      }
    }

    if (!this.state.Name) {
      alert(StringsOfLanguages.NameAlert);
      return;
    }

    if (!this.state.Surname) {
      alert(StringsOfLanguages.SurnameAlert);
      return;
    }

    if (!this.state.ContactNumber) {
      alert(StringsOfLanguages.EmptyMobileNoAlert);
      return;
    }

    if (!this.state.CountryCode) {
      alert(StringsOfLanguages.EmptyCountryCodeAlert);
      return;
    }

    const reg = /^[0-9\b]+$/;
    if (!reg.test(this.state.ContactNumber)) {
      alert(StringsOfLanguages.invalidMobileNoAlert);
      return;
    }

    // if (!this.state.SelectedDriverLicenceFileName) {
    //   alert(StringsOfLanguages.SelectDriverLicenceAlert);
    //   return;
    // }

    // if (!this.state.SelectedSRCLicenceFileName) {
    //   alert(StringsOfLanguages.SelectSRCLicenceAlert);
    //   return;
    // }

    const NetworkStatus = await NetChecker();
    if (NetworkStatus == false) {
      alert("network issue ");
      return;
    }

    if (this.state.Action == 2) {
      console.log("UPATING DRIVER");
      this.setState({ APIAction: 5, loading: true });
      this.props.EditDriverAction({
        userId: this.state.UserID,
        name: this.state.Name,
        surname: this.state.Surname,
        mobile: parseInt(this.state.ContactNumber),
        countryCode: parseInt(this.state.CountryCode),
      });
    } else {
      this.setState({ APIAction: 1, loading: true });
      this.props.AddDriverAction({
        name: this.state.Name,
        surname: this.state.Surname,
        mobile: parseInt(this.state.ContactNumber),
        countryCode: parseInt(this.state.CountryCode),
      });
    }
  }

  async UploadDriverLicenceFile() {
    const NetworkStatus = await NetChecker();
    if (NetworkStatus == false) {
      this.setState({ APIAction: 0, loading: false });
      alert("network issue ");
      return;
    }

    if (!this.state.shouldUploadLicence) return;
    this.setState({ APIAction: 2, loading: true });
    var data = new FormData();
    data.append("file", {
      uri: this.state.SelectedDriverLicenceFileURI,
      name: this.state.SelectedDriverLicenceFileName,
      type: this.state.SelectedDriverLicenceFileType,
    });

    this.props.UploadDriverFileAction(this.state.UserID, "licence", data);
  }

  async UploadSRCLicenceFile() {
    const NetworkStatus = NetChecker();
    if ((await NetworkStatus) == false) {
      this.setState({ APIAction: 0, loading: false });
      alert("network issue ");
      return;
    }
    if (!this.state.shouldUploadSrc) return;

    this.setState({ APIAction: 3, loading: true });
    var data = new FormData();
    data.append("file", {
      uri: this.state.SelectedSRCLicenceFileURI,
      name: this.state.SelectedSRCLicenceFileName,
      type: this.state.SelectedSRCLicenceFileType,
    });
    this.props.UploadDriverFileAction(this.state.UserID, "src", data);
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
              ? this.state.LangStr.UpdateDriverTitle
              : this.state.LangStr.NewDriverTitle
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
                name={StringsOfLanguages.Name}
                value={this.state.Name}
                placeholder={StringsOfLanguages.NamePlaceholder}
                onChange={(text) => this.setState({ Name: text })}
                regex={stringRegex}
              />

              <TextField2
                name={StringsOfLanguages.Surname}
                value={this.state.Surname}
                placeholder={StringsOfLanguages.SurnamePlaceholder}
                onChange={(text) => this.setState({ Surname: text })}
                regex={stringRegex}
              />

              <TextFieldWithCountryCode2
                name={StringsOfLanguages.MobileNo}
                countryCodeValue={this.state.CountryCode}
                value={this.state.ContactNumber}
                placeholder={StringsOfLanguages.EnterMobileNo}
                onChange={(text) => this.setState({ ContactNumber: text })}
                regex={numberRegex}
                keyboardType="phone-pad"
                codelcik={(item) =>
                  this.setState({
                    CountryCode: item.callingCode,
                    Cmodal: false,
                  })
                }
                Cmodal={this.state.Cmodal}
                onClose={() => this.setState({ Cmodal: false })}
                onOpen={() => this.setState({ Cmodal: true })}
              />

              <FileUploadField
                name={StringsOfLanguages.DriverLicence}
                placeholder={StringsOfLanguages.SelectDriverLicence}
                value={this.state.SelectedDriverLicenceFileName}
                onClickIcon={
                  () =>
                    this.setState({
                      ImagePickerDialogVisible: true,
                      FieldNumber: 1,
                    })
                  // this.selectFile(1)
                }
                editable={false}
                onViewDocument={() =>
                  this.openUploaderDocument(
                    this.state.SelectedDriverLicenceFileURI,
                    this.state.SelectedDriverLicenceFileName
                  )
                }
              />
              <FileUploadField
                name={StringsOfLanguages.SRCLicence}
                placeholder={StringsOfLanguages.SelectSRCLicence}
                value={this.state.SelectedSRCLicenceFileName}
                onClickIcon={
                  () =>
                    this.setState({
                      ImagePickerDialogVisible: true,
                      FieldNumber: 2,
                    })

                  // this.selectFile(2)
                }
                editable={false}
                onViewDocument={() =>
                  this.openUploaderDocument(
                    this.state.SelectedSRCLicenceFileURI,
                    this.state.SelectedSRCLicenceFileName
                  )
                }
              />
            </View>

            <Button
              loader={false}
              onPress={() => {
                this.AddNewDriver();
              }}
              border={false}
              style={{
                backgroundColor:
                  this.state.Name != "" &&
                  this.state.Surname != "" &&
                  this.state.CountryCode != "" &&
                  this.state.ContactNumber != ""
                    ? "#34B267"
                    : "#BCBCBC",
              }}
              disabled={
                this.state.Name != "" &&
                this.state.Surname != "" &&
                this.state.CountryCode != "" &&
                this.state.ContactNumber != ""
                  ? // this.state.SelectedPlatePictureFileName != ""
                    false
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

        <ImageUploadOption
          ImagePickerDialogVisible={this.state.ImagePickerDialogVisible}
          onclose={() => this.setState({ ImagePickerDialogVisible: false })}
          onchooseImg={() => {
            this.selectFile(this.state.FieldNumber, 1);
          }}
          onCameraOpen={() => {
            this.selectFile(this.state.FieldNumber, 2);
          }} //if camera then pass second argument 2
        />
        <Loader visible={this.state.loading} />
      </SafeAreaView>
    );
  }
}

const mapStateToProps = (state) => {
  return {
    AddDriverData: state.AddDriverData,
    EditDriverData: state.EditDriverData,
    UploadDriverFileData: state.UploadDriverFileData,
    DriverFilesData: state.DriverFilesData,
  };
};
export default connect(mapStateToProps, {
  AddDriverAction,
  EditDriverAction,
  UploadDriverFileAction,
  GetDriverFilesAction,
})(SaveDriver);
