import React from "react";
import {
  PermissionsAndroid,
  Platform,
  SafeAreaView,
  StatusBar,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { AuthContext } from "../../../navigation/AuthContext";
import DocumentPicker from "react-native-document-picker";
import FileViewer from "react-native-file-viewer";
import { launchCamera } from "react-native-image-picker";
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";
import { RFValue } from "react-native-responsive-fontsize";
import { connect } from "react-redux";
import * as colors from "../../../common/colors";
import DropDownField from "../../../common/Component/DropDownField";
import FileUploadField from "../../../common/Component/FileUploadField";
import { FileViewerModel } from "../../../common/Component/FileViewerModel";
import Header from "../../../common/Component/Header";
import { ImageUploadOption } from "../../../common/Component/ImageUploadOption";
import Loader from "../../../common/Component/Loader";
import { ModalSelector } from "../../../common/Component/ModalSelection";
import Button from "../../../common/Component/Button";
import NetChecker from "../../../common/Component/Network";
import {
  TextField,
  TextField2,
  TextFieldWithIcon2,
} from "../../../common/Component/TextField";
import { Style } from "../../../common/Style";
import StringsOfLanguages from "../../../Localization/stringsoflanguages";
import {
  AddVehicleAction,
  EditVehicleAction,
  GetVehicleFilesAction,
  GetVehicleTypeListAction,
  UploadVehicleFileAction,
} from "../../../Redux/actions";
class SaveVehicle extends React.Component {
  static contextType = AuthContext;
  constructor(props) {
    super(props);
    this.defaultState = {
      loading: false,
      LangStr: StringsOfLanguages,
      ModalVisible: false,

      VehicleTypeAry: [],
      SelectedVehicleTypeID: 0,
      SelectedVehicleTypeName: "",

      PlateNo: "",
      Model: "",

      SelectedTIRCarnetFileName: "",
      SelectedTIRCarnetFileURI: "",
      SelectedTIRCarnetFileType: "",

      SelectedPlatePicFileName: "",
      SelectedPlatePicFileURI: "",
      SelectedPlatePicFileType: "",

      SelectedVehicleLicenceFileName: "",
      SelectedVehicleLicenceFileURI: "",
      SelectedVehicleLicenceFileType: "",

      ViewerFileName: "",
      ViewerFileURI: "",

      FileViewerFlag: false,

      DropdownNumber: 0,
      DropdownModelData: [],
      DropdownModelTitleName: "",
      IDPropertyName: "",
      ValuePropertyName: "",

      FileUploadFieldNumber: 0,

      APIAction: 0,
      Action: 0,
      ForVehicleType: true,

      // Update
      VehicleObject: 0,
      IsFirstTimeLoad: false,
      IsFileChange: false,
      shouldUploadTIR: false,
      shouldUploadPlate: false,
      shouldUploadLicence: false,
      VehicleID: 0,
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
          const objVehicle = JSON.parse(this.props.route.params.VehicleObject);
          this.setState({
            VehicleObject: objVehicle,
            VehicleID: objVehicle.vehicleId,
            IsFirstTimeLoad: true,
          });
          this.setState({ PlateNo: objVehicle.plate });
          this.setState({ Model: objVehicle.model });
          if (objVehicle.vehicleType) {
            this.setState({
              SelectedVehicleTypeID: objVehicle.vehicleType.vehicleTypeId,
              SelectedVehicleTypeName: objVehicle.vehicleType.description,
            });
            await this.fetchVehicleFiles(objVehicle.vehicleId);
          }
        }
      }
    });
    this.getVehicleTypes();
  }

  getVehicleTypes() {
    this.props.GetVehicleTypeListAction("", 0, 1000);
  }

  async UNSAFE_componentWillReceiveProps(nextProps) {
    if (this.state.ForVehicleType) {
      if (nextProps.VehicleTypeList.GetVehicleTypeListSuccess) {
        if (nextProps.VehicleTypeList.data[1] === 200) {
          console.log(nextProps.VehicleTypeList.data[0], "000000-----");
          this.setState({
            VehicleTypeAry: nextProps.VehicleTypeList.data[0],
            ForVehicleType: false,
          });
        } else if (nextProps.VehicleTypeList.data[1] == 401) {
          const SignOutContext = this.context;
          SignOutContext.signOut();
        }
      }
    }

    if (this.state.APIAction == 1) {
      if (nextProps.AddVehicleData.AddVehicleSuccess) {
        if (nextProps.AddVehicleData.data[1] == 200) {
          var AddVehicleData = await nextProps.AddVehicleData.data[0];
          this.setState({
            VehicleObject: AddVehicleData,
            VehicleID: AddVehicleData.vehicleId,
          });
          if (
            this.state.SelectedTIRCarnetFileName != "" &&
            this.state.SelectedPlatePicFileName != "" &&
            this.state.SelectedVehicleLicenceFileName != ""
          ) {
            this.UploadTIRCarnetFile();
          } else {
            this.setState({ APIAction: 0, loading: false });
            this.props.navigation.navigate("VehicleList", {
              NeedtoReload: true,
            });
          }
        } else if (nextProps.AddVehicleData.data[1] == 401) {
          const SignOutContext = this.context;
          SignOutContext.signOut();
        } else {
          this.setState({ loading: false, APIAction: 0 });
          console.log("nextProps.AddVehicleData");
        }
      }
    }
    // 2 = TIR Carnet, 3 = Plate Pic, 4 = Vehicle Licence
    else if (this.state.APIAction == 2) {
      console.log("nextProps 2: ", JSON.stringify(nextProps));
      if (nextProps.UploadVehicleFileData.UploadVehicleFileSuccess) {
        if (nextProps.UploadVehicleFileData.data[1] == 200) {
          if (this.state.shouldUploadPlate) {
            this.setState({ APIAction: 3 });
            this.UploadPlatePicFile();
          } else if (this.state.shouldUploadLicence) {
            this.setState({ APIAction: 4 });
            this.UploadVehicleLicenceFile();
          } else {
            this.props.navigation.navigate("VehicleList", {
              NeedtoReload: true,
            });
          }
        } else if (nextProps.UploadVehicleFileData.data[1] == 401) {
          const SignOutContext = this.context;
          SignOutContext.signOut();
        } else {
          alert(
            "Error occured while uploading TIR carnet file. try upload again."
          );
          this.setState({ loading: false, APIAction: 0, Action: 2 });
          console.log("nextProps.UploadVehicleFileData");
        }
      }
    } else if (this.state.APIAction == 3) {
      console.log("nextProps 3: ", nextProps);

      if (nextProps.UploadVehicleFileData.UploadVehicleFileSuccess) {
        if (nextProps.UploadVehicleFileData.data[1] == 200) {
          if (this.state.shouldUploadLicence) {
            this.setState({ APIAction: 4 });
            this.UploadVehicleLicenceFile();
          } else {
            this.props.navigation.navigate("VehicleList", {
              NeedtoReload: true,
            });
          }
        } else if (nextProps.UploadVehicleFileData.data[1] == 401) {
          const SignOutContext = this.context;
          SignOutContext.signOut();
        } else {
          alert(
            "Error occured while uploading vehicle plate file. try upload again."
          );
          this.setState({ loading: false, APIAction: 0, Action: 2 });
          console.log("nextProps.UploadVehicleFileData");
        }
      }
    } else if (this.state.APIAction == 4) {
      console.log("nextProps 4: ", nextProps);

      if (nextProps.UploadVehicleFileData.UploadVehicleFileSuccess) {
        if (nextProps.UploadVehicleFileData.data[1] == 200) {
          this.setState({ APIAction: 0, loading: false });
          if (this.state.Action == 3) this.props.navigation.goBack();
          else
            this.props.navigation.navigate("VehicleList", {
              NeedtoReload: true,
            });
        } else if (nextProps.UploadVehicleFileData.data[1] == 401) {
          const SignOutContext = this.context;
          SignOutContext.signOut();
        } else {
          alert(
            "Error occured while uploading vehicle licence file. try upload again."
          );
          this.setState({ loading: false, APIAction: 0, Action: 2 });
          console.log("nextProps.UploadVehicleFileData");
        }
      }
    } else if (this.state.APIAction == 5) {
      if (nextProps.VehicleFilesData.GetVehicleFilesSuccess) {
        if (nextProps.VehicleFilesData.data[1] == 200) {
          this.setState({ APIAction: 0, loading: false });
          var lstUploadedFiles = await nextProps.VehicleFilesData.data[0];
          lstUploadedFiles.map((Item) => {
            if (Item.fileType.fileTypeId == 1)
              this.setState({
                SelectedPlatePicFileName: Item.fileName,
                SelectedPlatePicFileURI: Item.url,
                SelectedPlatePicFileType: "base64",
              });
            else if (Item.fileType.fileTypeId == 3)
              this.setState({
                SelectedTIRCarnetFileName: Item.fileName,
                SelectedTIRCarnetFileURI: Item.url,
                SelectedPlatePicFileType: "base64",
              });
            else if (Item.fileType.fileTypeId == 4)
              this.setState({
                SelectedVehicleLicenceFileName: Item.fileName,
                SelectedVehicleLicenceFileURI: Item.url,
                SelectedPlatePicFileType: "base64",
              });
          });
        } else if (nextProps.VehicleFilesData.data[1] == 401) {
          const SignOutContext = this.context;
          SignOutContext.signOut();
        } else {
          this.setState({ loading: false, APIAction: 0 });
          console.log("nextProps.UploadVehicleFileData");
        }
      }
    } else if (this.state.APIAction == 6) {
      if (nextProps.EditVehicleData.EditVehicleSuccess) {
        if (nextProps.EditVehicleData.data[1] == 200) {
          if (this.state.IsFileChange) {
            var lstVehicleData = await nextProps.EditVehicleData.data[0];
            this.UploadTIRCarnetFile();
          } else {
            this.setState({ APIAction: 0, loading: false });
            this.props.navigation.navigate("VehicleList", {
              NeedtoReload: true,
            });
          }
          return;
        } else if (nextProps.EditVehicleData.data[1] == 401) {
          const SignOutContext = this.context;
          SignOutContext.signOut();
        } else {
          this.setState({ APIAction: 0, loading: false });
          console.log("nextProps.EditVehicleData");
        }
      }
    }
  }

  async fetchVehicleFiles(vehicleId) {
    this.setState({ APIAction: 5, loading: false });
    this.props.GetVehicleFilesAction(vehicleId);
  }

  async UploadTIRCarnetFile() {
    const NetworkStatus = NetChecker();
    if ((await NetworkStatus) == false) {
      this.setState({ APIAction: 0, loading: false });
      alert("network issue ");
      return;
    }

    this.setState({ APIAction: 2, loading: true });
    var data = new FormData();
    data.append("file", {
      uri: this.state.SelectedTIRCarnetFileURI,
      name: this.state.SelectedTIRCarnetFileName,
      type: this.state.SelectedTIRCarnetFileType,
    });
    console.log(this.state.VehicleID);

    this.props.UploadVehicleFileAction(this.state.VehicleID, "tircarnet", data);
  }

  async UploadPlatePicFile() {
    const NetworkStatus = NetChecker();
    if ((await NetworkStatus) == false) {
      this.setState({ APIAction: 0, loading: false });
      alert("network issue ");
      return;
    }

    this.setState({ APIAction: 3, loading: true });
    var data = new FormData();
    console.log(
      {
        uri: this.state.SelectedPlatePicFileURI,
        name: this.state.SelectedPlatePicFileName,
        type: this.state.SelectedPlatePicFileType,
      },
      "========++++++++++"
    );
    data.append("file", {
      uri: this.state.SelectedPlatePicFileURI,
      name: this.state.SelectedPlatePicFileName,
      type: this.state.SelectedPlatePicFileType,
    });
    console.log(data, "-----------------data");
    this.props.UploadVehicleFileAction(this.state.VehicleID, "plate", data);
  }

  async UploadVehicleLicenceFile() {
    const NetworkStatus = NetChecker();
    if ((await NetworkStatus) == false) {
      this.setState({ APIAction: 0, loading: false });
      alert("network issue ");
      return;
    }

    this.setState({ APIAction: 4, loading: true });
    var data = new FormData();
    data.append("file", {
      uri: this.state.SelectedVehicleLicenceFileURI,
      name: this.state.SelectedVehicleLicenceFileName,
      type: this.state.SelectedVehicleLicenceFileType,
    });
    console.log(data, "-----------------data");
    this.props.UploadVehicleFileAction(this.state.VehicleID, "licence", data);
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
      let options = {
        mediaType: "photo",
        // saveToPhotos: true,
      };
      let isCameraPermitted = await this.requestCameraPermission();
      console.log(isCameraPermitted);
      if (isCameraPermitted) {
        launchCamera(options, (response) => {
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
    } else if (type === 1) {
      var res = await DocumentPicker.pick({
        // Provide which type of file you want user to pick
        type: [DocumentPicker.types.allFiles],
      });

      res = res[0];
      let uri = res.uri;
      if (Platform.OS === "ios") {
        uri = res.uri.replace("file://", "");
      }
      this.setState({ ImagePickerDialogVisible: false });

      this.storeDocumentData(uri, res.type, res.name, FileUploadFieldNumber);
    }
  }

  storeDocumentData(uri, type, name, FileUploadFieldNumber) {
    if (FileUploadFieldNumber == 1)
      // TIR
      this.setState({
        SelectedTIRCarnetFileName: name,
        SelectedTIRCarnetFileURI: uri,
        SelectedTIRCarnetFileType: type,
        IsFileChange: true,
        shouldUploadTIR: true,
      });
    else if (FileUploadFieldNumber == 2)
      // Plate
      this.setState({
        SelectedPlatePicFileName: name,
        SelectedPlatePicFileURI: uri,
        SelectedPlatePicFileType: type,
        IsFileChange: true,
        shouldUploadPlate: true,
      });
    else if (FileUploadFieldNumber == 3)
      //Vehcile
      this.setState({
        SelectedVehicleLicenceFileName: name,
        SelectedVehicleLicenceFileURI: uri,
        SelectedVehicleLicenceFileType: type,
        IsFileChange: true,
        shouldUploadLicence: true,
      });
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

  async AddNewVehicle() {
    if (this.state.Action == 2) {
      const objTrailer = this.state.VehicleObject;
      if (
        objTrailer.vehicleType.vehicleTypeId ==
          this.state.SelectedVehicleTypeID &&
        objTrailer.plate == this.state.PlateNo &&
        objTrailer.model == this.state.Model
      ) {
        if (this.state.IsFileChange) {
          if (this.state.shouldUploadTIR) {
            this.UploadTIRCarnetFile();
          } else if (this.state.shouldUploadPlate) {
            this.UploadPlatePicFile();
          } else if (this.state.shouldUploadLicence) {
            this.UploadVehicleLicenceFile();
          }
        } else {
          this.setState({ APIAction: 0, loading: false });
          this.props.navigation.navigate("VehicleList", { NeedtoReload: true });
        }
        return;
      }
    }

    if (this.state.SelectedVehicleTypeID <= 0) {
      alert(StringsOfLanguages.SelectVehicleTypeAlert);
      return;
    }

    if (!this.state.PlateNo) {
      alert(StringsOfLanguages.EmptyPlateNoAlert);
      return;
    }

    if (!this.state.Model) {
      alert(StringsOfLanguages.EmptyModelAlert);
      return;
    }

    // if (!this.state.SelectedTIRCarnetFileName) {
    //   alert(StringsOfLanguages.SelectTIRCarnetAlert);
    //   return;
    // }

    // if (!this.state.SelectedPlatePicFileName) {
    //   alert(StringsOfLanguages.SelectPlatePictureAlert);
    //   return;
    // }

    // if (!this.state.SelectedVehicleLicenceFileName) {
    //   alert(StringsOfLanguages.SelectVehicleLicenceAlert);
    //   return;
    // }

    const NetworkStatus = NetChecker();
    if ((await NetworkStatus) == false) {
      alert("network issue ");
      return;
    }

    if (this.state.Action == 2) {
      this.setState({ APIAction: 6, loading: true });
      this.props.EditVehicleAction({
        vehicleId: this.state.VehicleID,
        year: 0,
        plate: this.state.PlateNo,
        capacity: 0,
        make: "",
        model: this.state.Model,
        vehicleType: {
          vehicleTypeId: this.state.SelectedVehicleTypeID,
        },
      });
    } else {
      this.setState({ APIAction: 1, loading: true });
      this.props.AddVehicleAction({
        year: 0,
        plate: this.state.PlateNo,
        capacity: 0,
        make: "",
        model: this.state.Model,
        vehicleType: {
          vehicleTypeId: this.state.SelectedVehicleTypeID,
        },
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
              ? this.state.LangStr.UpdateVehicleTitle
              : this.state.LangStr.NewVehicleTitle
          }
          BackAction={() => this.props.navigation.goBack()}
        />
        <View style={Style.componentContainerView}>
          <KeyboardAwareScrollView
            showsVerticalScrollIndicator={false}
            contentContainerStyle={{ flexGrow: 1 }}
          >
            <View style={{ flex: 1, paddingTop: RFValue(10) }}>
              <TextFieldWithIcon2
                name={StringsOfLanguages.VehicleType}
                placeholder={StringsOfLanguages.SelectVehicleType}
                value={this.state.SelectedVehicleTypeName}
                editable={false}
                onPress={() =>
                  this.setState({
                    ModalVisible: true,
                    DropdownNumber: 1,
                    DropdownModelData: this.state.VehicleTypeAry,
                    DropdownModelTitleName: this.state.LangStr.VehicleType,
                    IDPropertyName: "vehicleTypeId",
                    ValuePropertyName: "description",
                  })
                }
                backgroundColor={colors.silverLight}
                styles={{ justifyContent: "space-between", zIndex: 1 }}
                onClick={() =>
                  this.setState({
                    ModalVisible: false,
                  })
                }
                cModal={this.state.ModalVisible}
                modalData={this.state.VehicleTypeAry || []}
                showValue={["description"]}
                setCity={(e) => {
                  this.setState({
                    SelectedVehicleTypeID: e.vehicleTypeId,
                    SelectedVehicleTypeName: e.description,
                  });
                  this.setState({ ModalVisible: false });
                }}
              />

              <TextField2
                name={StringsOfLanguages.PlateNo}
                value={this.state.PlateNo}
                placeholder={StringsOfLanguages.EnterPlateNo}
                backgroundColor={colors.silverLight}
                onChange={(text) => this.setState({ PlateNo: text })}
              />
              <TextField2
                name={StringsOfLanguages.Model}
                value={this.state.Model}
                placeholder={StringsOfLanguages.EnterModel}
                onChange={(text) => this.setState({ Model: text })}
              />

              <FileUploadField
                name={StringsOfLanguages.TIRCarnet}
                placeholder={StringsOfLanguages.SelectTIRCarnet}
                value={this.state.SelectedTIRCarnetFileName}
                onClickIcon={() => {
                  this.setState({
                    ImagePickerDialogVisible: true,
                    FieldNumber: 1,
                  });

                  //  this.selectFile(1, 1)
                }}
                editable={false}
                onViewDocument={() =>
                  this.openUploaderDocument(
                    this.state.SelectedTIRCarnetFileURI,
                    this.state.SelectedTIRCarnetFileName
                  )
                }
              />
              <FileUploadField
                name={StringsOfLanguages.PlatePicture}
                placeholder={StringsOfLanguages.SelectPlatePic}
                value={this.state.SelectedPlatePicFileName}
                onClickIcon={() => {
                  this.setState({
                    ImagePickerDialogVisible: true,
                    FieldNumber: 2,
                  });
                  // return
                  // this.selectFile(2)
                }}
                editable={false}
                onViewDocument={() =>
                  this.openUploaderDocument(
                    this.state.SelectedPlatePicFileURI,
                    this.state.SelectedPlatePicFileName
                  )
                }
              />
              <FileUploadField
                name={StringsOfLanguages.VehicleLicencePicture}
                placeholder={StringsOfLanguages.SelectVehicleLicencePic}
                value={this.state.SelectedVehicleLicenceFileName}
                onClickIcon={() => {
                  this.setState({
                    ImagePickerDialogVisible: true,
                    FieldNumber: 3,
                  });

                  // this.selectFile(3)
                }}
                editable={false}
                onViewDocument={() =>
                  this.openUploaderDocument(
                    this.state.SelectedVehicleLicenceFileURI,
                    this.state.SelectedVehicleLicenceFileName
                  )
                }
              />
            </View>
            <Button
              loader={false}
              disabled={
                this.state.SelectedVehicleTypeID > 0 &&
                this.state.PlateNo != "" &&
                this.state.Model != ""
                  ? // this.state.SelectedTIRCarnetFileName != "" &&
                    // this.state.SelectedPlatePicFileName != "" &&
                    // this.state.SelectedVehicleLicenceFileName != ""
                    false
                  : true
              }
              style={{
                backgroundColor:
                  this.state.SelectedVehicleTypeID > 0 &&
                  this.state.PlateNo != "" &&
                  this.state.Model != ""
                    ? // this.state.SelectedTIRCarnetFileName != "" &&
                      // this.state.SelectedPlatePicFileName != "" &&
                      // this.state.SelectedVehicleLicenceFileName != ""
                      colors.LimeGreen
                    : colors.silver,
              }}
              // onPress={handleSubmit}
              border={false}
              name={StringsOfLanguages?.Update}
              onPress={() => {
                this.AddNewVehicle();
              }}
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
        <Loader visible={this.state.loading} />
        {/* {this.state.ModalVisible ? (
          <ModalSelector
            visible={this.state.ModalVisible}
            title={this.state.DropdownModelTitleName}
            data={this.state.DropdownModelData}
            SearchOptionExist={false}
            IDPropertyName={this.state.IDPropertyName}
            ValuePropertyName={this.state.ValuePropertyName}
            onPress={(text, id) => {
              if (this.state.DropdownNumber == 1)
                this.setState({
                  SelectedVehicleTypeID: id,
                  SelectedVehicleTypeName: text,
                });
              this.setState({ ModalVisible: false });
            }}
            closeModal={() => this.setState({ ModalVisible: false })}
          />
        ) : null} */}

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
      </SafeAreaView>
    );
  }
}

const mapStateToProps = (state) => {
  return {
    AddVehicleData: state.AddVehicleData,
    EditVehicleData: state.EditVehicleData,
    UploadVehicleFileData: state.UploadVehicleFileData,
    VehicleFilesData: state.VehicleFilesData,
    VehicleTypeList: state.VehicleTypeList,
  };
};
export default connect(mapStateToProps, {
  GetVehicleTypeListAction,
  AddVehicleAction,
  EditVehicleAction,
  UploadVehicleFileAction,
  GetVehicleFilesAction,
})(SaveVehicle);
