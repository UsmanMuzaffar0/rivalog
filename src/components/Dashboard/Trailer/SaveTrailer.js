import React from "react";
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
import {
  GetTrailerDetailsAction,
  AddTrailerAction,
  EditTrailerAction,
  GetTrailerTypeListAction,
  GetTrailerFloorTypeListAction,
  GetTrailerSpecificationListAction,
  UploadTrailerPlatePicAction,
  GetTrailerPlatePictureAction,
} from "../../../Redux/actions";
import NetChecker from "../../../common/Component/Network";
import StringsOfLanguages from "../../../Localization/stringsoflanguages";
import { Style, width } from "../../../common/Style";
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";
import { RFPercentage, RFValue } from "react-native-responsive-fontsize";
import Button from "../../../common/Component/Button";
import {
  TextField,
  TextField2,
  TextFieldWithIcon,
  TextFieldWithIcon2,
} from "../../../common/Component/TextField";
import DropDownField from "../../../common/Component/DropDownField";
import FileUploadField from "../../../common/Component/FileUploadField";
import {
  ModalSelector,
  ModalSelectorWithCheckbox,
} from "../../../common/Component/ModalSelection";
import Loader from "../../../common/Component/Loader";

import DocumentPicker from "react-native-document-picker";
import FileViewer from "react-native-file-viewer";
import Header from "../../../common/Component/Header";
import { connect } from "react-redux";
import AsyncStorage from "@react-native-async-storage/async-storage";

import { FileViewerModel } from "../../../common/Component/FileViewerModel";
import { ImageUploadOption } from "../../../common/Component/ImageUploadOption";
import { launchCamera } from "react-native-image-picker";

class SaveTrailer extends React.Component {
  static contextType = AuthContext;
  constructor(props) {
    super(props);
    this.defaultState = {
      loading: false,
      LangStr: StringsOfLanguages,
      ModalVisible: false,
      ChecklistModalVisible: false,
      TrailerPlateNo: "",
      TrailerTypesAry: [],
      SelectedTrailerTypeID: 0,
      SelectedTrailerTypeName: "",
      TrailerSpecificationsAry: [],
      SelectedTrailerSpecificationIDs: "",
      SelectedTrailerSpecificationNames: "",
      SelectedTrailerSpecificationsList: [],
      FloorTypeAry: [],
      SelectedFloorTypeID: 0,
      SelectedFloorTypeName: "",
      DropdownNumber: 0,
      DropdownModelData: [],
      DropdownModelTitleName: "",
      ContainerObj: { label: StringsOfLanguages.TrailerContainer, value: 1 },
      IsContainerSelected: 0,
      SelectedPlatePictureFileName: "",
      SelectedPlatePictureFileURI: "",
      SelectedPlatePictureFileType: "",
      FileViewerFlag: false,
      IDPropertyName: "",
      ValuePropertyName: "",
      APIAction: 0,
      // Update properties
      Action: 0,
      TrailerObject: 0,
      IsFirstTimeLoad: false,
      IsFileChange: false,
      ForTrailerType: true,
      isDataChanged: false,
      ForFloorType: true,
      ImagePickerDialogVisible: false,
    };

    this.state = { ...this.defaultState };
  }

  async fetchTrailerPlatePicture(trailerId) {
    this.setState({ APIAction: 4, loading: false });
    this.props.GetTrailerPlatePictureAction(trailerId);
  }
  getTrailerType() {
    this.props.GetTrailerTypeListAction("", 0, 1000);
  }
  getFloorType() {
    this.props.GetTrailerFloorTypeListAction("", 0, 1000);
  }
  async componentDidMount() {
    this._Reload = this.props.navigation.addListener("focus", async () => {
      this.setState({ ...this.defaultState });
      const routeParams = this.props.route.params;
      if (routeParams && routeParams.Action === 2) {
        console.log("FlagPass", routeParams.Action === 2);
        const objTrailer = JSON.parse(routeParams.TrailerObject);
        this.setState({
          Action: routeParams.Action,
          TrailerObject: objTrailer,
          IsFirstTimeLoad: true,
          TrailerPlateNo: objTrailer.plate,
          SelectedTrailerTypeID: objTrailer.trailerType.trailerTypeId,
          SelectedTrailerTypeName: objTrailer.trailerType.description,
          SelectedFloorTypeID: objTrailer.floorType.floorTypeId,
          SelectedFloorTypeName: objTrailer.floorType.description,
        });

        await this.onSelectTrailerType(
          objTrailer.trailerType.trailerTypeId,
          objTrailer.trailerType.description
        );

        // const selectedTrailerSpecificationsIDs =
        //   objTrailer.specificationList.map((item) => item.specificationId);

        // await this.props.GetTrailerSpecificationListAction(
        //   objTrailer.trailerType.trailerTypeId,
        //   "",
        //   0,
        //   20
        // );

        // const trailerSpecificationsAry =
        //   this.state.TrailerSpecificationsAry.map((item) => ({
        //     ...item,
        //     IsChecked: selectedTrailerSpecificationsIDs.includes(
        //       item.specificationId
        //     ),
        //   }));

        const specResponse = await this.props.GetTrailerFloorTypeListAction(
          objTrailer.trailerType.trailerTypeId,
          "",
          0,
          20
        );

        if (specResponse.GetTrailerSpecificationListSuccess) {
          const specifications = specResponse.data[0];
          const trailerSpecificationsAry = specResponse.map((spec) => ({
            ...spec,
            IsChecked: false,
          }));
        }

        this.setState({
          TrailerSpecificationsAry: trailerSpecificationsAry,
          SelectedTrailerSpecificationsList: objTrailer.specificationList,
          SelectedTrailerSpecificationIDs:
            selectedTrailerSpecificationsIDs.join(","),
          SelectedTrailerSpecificationNames: objTrailer.specificationList
            .map((item) => item.description)
            .join(", "),
        });

        this.fetchTrailerPlatePicture(objTrailer.trailerId);
      }

      this.getTrailerType();
      this.getFloorType();
    });

    this.getTrailerType();
    this.getFloorType();
  }

  async UNSAFE_componentWillReceiveProps(nextProps) {
    if (this.state.ForTrailerType) {
      if (nextProps.TrailerTypeList.GetTrailerTypeListSuccess) {
        console.log(nextProps.TrailerTypeList.data[1]);

        if (nextProps.TrailerTypeList.data[1] == 200) {
          console.log(nextProps.TrailerTypeList.data[0], "/////////");
          this.setState({
            TrailerTypesAry: nextProps.TrailerTypeList.data[0],
            ForTrailerType: false,
          });
        } else if (nextProps.TrailerTypeList.data[1] == 401) {
          const SignOutContext = this.context;
          SignOutContext.signOut();
        }
      }
    }
    if (this.state.ForFloorType) {
      if (nextProps.TrailerFloorTypeList.GetTrailerFloorTypeListSuccess) {
        if (nextProps.TrailerFloorTypeList.data[1] == 200) {
          console.log(nextProps.TrailerFloorTypeList.data[0]);
          this.setState({
            ForFloorType: false,
            FloorTypeAry: nextProps.TrailerFloorTypeList.data[0],
          });
        } else if (nextProps.TrailerFloorTypeList.data[1] == 401) {
          const SignOutContext = this.context;
          SignOutContext.signOut();
        }
      }
    }

    if (this.state.APIAction == 1) {
      if (
        nextProps.TrailerSpecificationList.GetTrailerSpecificationListSuccess
      ) {
        if (nextProps.TrailerSpecificationList.data[1] == 200) {
          this.setState({ loading: false });
          var lstTrailerSpecifications = await nextProps
            .TrailerSpecificationList.data[0];
          lstTrailerSpecifications.map((Item) => {
            // Item.BWs = Math.pow(2, Item.specificationId)
            Item.IsChecked = false;
          });
          this.setState({
            APIAction: 0,
            TrailerSpecificationsAry: lstTrailerSpecifications,
          });
          if (this.state.Action == 2 && this.state.IsFirstTimeLoad) {
            //
            const objTrailer = this.state.TrailerObject;
            if (
              objTrailer.specificationList &&
              objTrailer.specificationList.length > 0
            ) {
              let selectedTrailerSpecificationsNames = "";
              let selectedTrailerSpecificationsIDs = "";
              var SelectedTrailerSpecificationsList_temp = [];
              objTrailer.specificationList.map((Item) => {
                const objSelectedType = lstTrailerSpecifications.filter(
                  (data) => data.specificationId == Item.specificationId
                )[0];

                objSelectedType.IsChecked = true;
                // SelectedTrailerSpecificationsList_temp.push({"specificationId": Item.specificationId, "BWs": Item.BWs})
                SelectedTrailerSpecificationsList_temp.push({
                  specificationId: Item.specificationId,
                });
                selectedTrailerSpecificationsIDs += Item.specificationId + ",";
                selectedTrailerSpecificationsNames += Item.description + ",";
              });
              if (selectedTrailerSpecificationsNames.length > 0) {
                selectedTrailerSpecificationsNames =
                  selectedTrailerSpecificationsNames.slice(0, -1);
                selectedTrailerSpecificationsIDs =
                  selectedTrailerSpecificationsIDs.slice(0, -1);
              }
              this.setState({
                SelectedTrailerSpecificationIDs:
                  selectedTrailerSpecificationsIDs,
                SelectedTrailerSpecificationNames:
                  selectedTrailerSpecificationsNames,
                IsFirstTimeLoad: false,
                SelectedTrailerSpecificationsList:
                  SelectedTrailerSpecificationsList_temp,
              });
              this.fetchTrailerPlatePicture(objTrailer.trailerId);
            }
          }
        } else if (nextProps.TrailerSpecificationList.data[1] == 401) {
          const SignOutContext = this.context;
          SignOutContext.signOut();
        } else {
          console.log("nextProps.TrailerSpecificationList");
        }
      }
    } else if (this.state.APIAction == 2) {
      if (nextProps.AddTrailerData.AddTrailerSuccess) {
        if (nextProps.AddTrailerData.data[1] == 200) {
          var objTrailer = await nextProps.AddTrailerData.data[0];
          console.log(objTrailer, "1211111");
          this.setState({ TrailerObject: objTrailer });
          if (this.state.SelectedPlatePictureFileName != "") {
            this.UploadtrailerPlatePic(objTrailer.trailerId);
          } else {
            this.setState({ APIAction: 0, loading: false });
            this.props.navigation.navigate("TrailerList", {
              NeedtoReload: true,
            });
          }
        } else if (nextProps.AddTrailerData.data[1] == 401) {
          const SignOutContext = this.context;
          SignOutContext.signOut();
        } else {
          this.setState({ APIAction: 0, loading: false });
          console.log("nextProps.AddTrailerData");
        }
      }
    } else if (this.state.APIAction == 3) {
      if (nextProps.UploadTrailerPlatePicData.UploadTrailerPlatePicSuccess) {
        if (nextProps.UploadTrailerPlatePicData.data[1] == 200) {
          console.log(
            await nextProps.UploadTrailerPlatePicData.data[0],
            "-------nextProps.UploadTrailerPlatePicData.data[0]"
          );
          this.setState({ APIAction: 0, loading: false });
          this.props.navigation.goBack();
          // this.props.navigation.navigate("TrailerList", { NeedtoReload: true });

          // this.props.navigation.reset({
          //     index: 0,
          //     routes: [{name: 'TrailerList'}],
          //   });
        } else if (nextProps.UploadTrailerPlatePicData.data[1] == 401) {
          const SignOutContext = this.context;
          SignOutContext.signOut();
        } else {
          alert(
            "Error occured while uploading trailer plate picture file. try upload again."
          );
          console.log("nextProps.UploadTrailerPlatePicData");
          this.setState({ APIAction: 0, loading: false, Action: 2 });
          console.log(await nextProps.UploadTrailerPlatePicData.data[0]);
        }
      }
    } else if (this.state.APIAction == 4) {
      if (nextProps.TrailerPlatePic.GetTrailerPlatePictureSuccess) {
        if (nextProps.TrailerPlatePic.data[1] == 200) {
          const objTrailerPlatePic = await nextProps.TrailerPlatePic.data[0];
          this.setState({
            SelectedPlatePictureFileName: objTrailerPlatePic[0].fileName,
            SelectedPlatePictureFileURI: objTrailerPlatePic[0].url,
          });
        } else if (nextProps.TrailerPlatePic.data[1] == 401) {
          const SignOutContext = this.context;
          SignOutContext.signOut();
        } else {
          console.log("nextProps.TrailerPlatePic");
          this.setState({ APIAction: 0, loading: false });
        }
      }
    } else if (this.state.APIAction == 5) {
      if (nextProps.EditTrailerData.EditTrailerSuccess) {
        if (nextProps.EditTrailerData.data[1] == 200) {
          if (this.state.IsFileChange) {
            var lstTrailerData = await nextProps.EditTrailerData.data[0];
            this.UploadtrailerPlatePic(lstTrailerData.trailerId);
          } else {
            this.setState({ APIAction: 0, loading: false });
            this.props.navigation.navigate("TrailerList", {
              NeedtoReload: true,
            });
          }
          return;
        } else if (nextProps.EditTrailerData.data[1] == 401) {
          const SignOutContext = this.context;
          SignOutContext.signOut();
        } else {
          this.setState({ APIAction: 0, loading: false });
          console.log("nextProps.EditTrailerData");
        }
      }
    }
  }

  async UploadtrailerPlatePic(trailerId) {
    console.log("going to upload trailer pic");
    const NetworkStatus = NetChecker();
    if ((await NetworkStatus) == false) {
      this.setState({ APIAction: 0, loading: false });
      alert("network issue ");
      return;
    }

    this.setState({ APIAction: 3, loading: true });
    var data = new FormData();
    data.append("file", {
      uri: this.state.SelectedPlatePictureFileURI,
      name: this.state.SelectedPlatePictureFileName,
      type: this.state.SelectedPlatePictureFileType,
    });
    console.log(data, "-----------------data");
    this.props.UploadTrailerPlatePicAction(trailerId, data);
  }

  fetchSelectedTrailerSpecifications() {
    var SelectedTrailerSpecificationsList_temp = [];
    this.setState({ ChecklistModalVisible: false });
    let selectedTrailerSpecificationsName = "";
    let selectedTrailerSpecificationsID = "";
    this.state.TrailerSpecificationsAry.map((Item) => {
      if (Item.IsChecked == true) {
        selectedTrailerSpecificationsName +=
          Item[this.state.ValuePropertyName] + ",";
        selectedTrailerSpecificationsID +=
          Item[this.state.IDPropertyName] + ",";
        // SelectedTrailerSpecificationsList_temp.push({"specificationId": Item[this.state.IDPropertyName], "BWs": Item.BWs})
        SelectedTrailerSpecificationsList_temp.push({
          specificationId: Item[this.state.IDPropertyName],
        });
      }
    });

    if (selectedTrailerSpecificationsName.length > 0) {
      selectedTrailerSpecificationsName =
        selectedTrailerSpecificationsName.slice(0, -1);
      selectedTrailerSpecificationsID = selectedTrailerSpecificationsID.slice(
        0,
        -1
      );
    }
    this.setState({
      SelectedTrailerSpecificationNames: selectedTrailerSpecificationsName,
      SelectedTrailerSpecificationIDs: selectedTrailerSpecificationsID,
      SelectedTrailerSpecificationsList: SelectedTrailerSpecificationsList_temp,
    });
  }

  openUploaderDocument() {
    if (this.state.SelectedPlatePictureFileURI.includes("http"))
      this.setState({ FileViewerFlag: true });
    else {
      FileViewer.open(this.state.SelectedPlatePictureFileURI)
        .then(() => {
          // Do whatever you want
          console.log("Success");
        })
        .catch((_err) => {
          // Do whatever you want
          alert(_err);
          console.log(_err);
        });
    }
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

  async selectFile(type) {
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

          this.storeDocumentData(uri, objResponse.type, objResponse.fileName);
        });
      }
    } else if (type == 1) {
      // Opening Document Picker to select one file
      try {
        var res = await DocumentPicker.pick({
          // Provide which type of file you want user to pick
          type: [DocumentPicker.types.allFiles],
        });
        if (res) {
          res = res[0];
          let uri = res.uri;
          if (Platform.OS === "ios") {
            // Remove 'file://' from file path for FileViewer
            uri = res.uri.replace("file://", "");
          }

          this.setState({ ImagePickerDialogVisible: false });

          this.storeDocumentData(uri, res.type, res.name);
        }
      } catch (err) {
        if (!DocumentPicker.isCancel(err)) {
          alert("Unknown Error: " + JSON.stringify(err));
          throw err;
        }
      }
    }
  }

  storeDocumentData(uri, type, name) {
    this.setState({
      SelectedPlatePictureFileName: name,
      SelectedPlatePictureFileURI: uri,
      SelectedPlatePictureFileType: type,
      IsFileChange: true,
    });
  }

  async AddNewTrailer() {
    if (this.state.Action == 2) {
      const objTrailer = this.state.TrailerObject;
      console.log(
        "objTrailerFloortypeLenght>>>>>>",
        objTrailer.specificationList.length
      );

      if (
        objTrailer.plate == this.state.TrailerPlateNo &&
        objTrailer.trailerType.trailerTypeId ==
          this.state.SelectedTrailerTypeID &&
        objTrailer.floorType.floorTypeId == this.state.SelectedFloorTypeID &&
        objTrailer.specificationList.length ==
          this.state.SelectedTrailerSpecificationsList.length
      ) {
        var AlreadySelectedSpecificationsBWs = 0;
        objTrailer.specificationList.map((Item) => {
          AlreadySelectedSpecificationsBWs += Math.pow(2, Item.specificationId);
        });
        var SelectedSpecificationsBWs = 0;
        this.state.SelectedTrailerSpecificationsList.map((Item) => {
          SelectedSpecificationsBWs += Math.pow(2, Item.specificationId);
        });
        // console.log(
        //   AlreadySelectedSpecificationsBWs,
        //   SelectedSpecificationsBWs
        // );
        if (AlreadySelectedSpecificationsBWs == SelectedSpecificationsBWs) {
          this.UploadtrailerPlatePic(objTrailer.trailerId);
          return;
        }
      }
    }

    console.log("going to save trailer");
    if (!this.state.TrailerPlateNo) {
      alert(StringsOfLanguages.EmptyTrailerPlateNoAlert);
      return;
    }

    if (this.state.SelectedTrailerTypeID <= 0) {
      alert(StringsOfLanguages.SelectTrailerTypeAlert);
      return;
    }

    if (!this.state.SelectedTrailerSpecificationIDs) {
      alert(StringsOfLanguages.SelectTrailerSpecificationAlert);
      return;
    }

    if (this.state.SelectedFloorTypeID <= 0) {
      alert(StringsOfLanguages.SelectFloorTypeAlert);
      return;
    }

    // if (!this.state.SelectedPlatePictureFileName) {
    //   alert(StringsOfLanguages.SelectPlatePictureAlert);
    //   return;
    // }

    const NetworkStatus = NetChecker();
    if ((await NetworkStatus) == false) {
      alert("network issue ");
      return;
    }

    if (this.state.Action == 2) {
      this.setState({ APIAction: 5, loading: true });
      // alert(this.state.TrailerObject.trailerId)
      this.props.EditTrailerAction({
        trailerId: this.state.TrailerObject.trailerId,
        year: 0,
        plate: this.state.TrailerPlateNo,
        capacity: 0,
        make: "",
        model: "",
        trailerType: {
          trailerTypeId: this.state.SelectedTrailerTypeID,
        },
        specificationList: this.state.SelectedTrailerSpecificationsList,
        floorType: {
          floorTypeId: this.state.SelectedFloorTypeID,
        },
      });
    } else {
      this.setState({ APIAction: 2, loading: true });
      this.props.AddTrailerAction({
        year: 0,
        plate: this.state.TrailerPlateNo,
        capacity: 0,
        make: "",
        model: "",
        trailerType: {
          trailerTypeId: this.state.SelectedTrailerTypeID,
        },
        specificationList: this.state.SelectedTrailerSpecificationsList,
        floorType: {
          floorTypeId: this.state.SelectedFloorTypeID,
        },
      });
    }
  }

  onSelectTrailerSpecification(text, id, index) {
    var TrailerSpecificationsAry = this.state.TrailerSpecificationsAry;
    TrailerSpecificationsAry[index]["IsChecked"] =
      !TrailerSpecificationsAry[index]["IsChecked"];
    this.setState({
      TrailerSpecificationsAry: TrailerSpecificationsAry,
      SelectedTrailerSpecificationID: id,
      SelectedTrailerSpecificationName: text,
      ModalVisible: false,
    });
  }

  onSelectTrailerType(id, text) {
    this.setState({
      loading: true,
      SelectedTrailerTypeID: id,
      SelectedTrailerTypeName: text,
      APIAction: 1,
    });
    if (this.state.SelectedTrailerTypeID != id)
      this.setState({
        SelectedTrailerSpecificationNames: "",
        SelectedTrailerSpecificationIDs: "",
      });
    this.props.GetTrailerSpecificationListAction(id, "", 0, 20);
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
              ? this.state.LangStr.UpdateTrailerTitle
              : this.state.LangStr.AddTrailerTitle
          }
          BackAction={() => this.props.navigation.goBack()}
        />
        <View style={Style.componentContainerView}>
          <KeyboardAwareScrollView
            showsVerticalScrollIndicator={false}
            contentContainerStyle={{ flexGrow: 1 }}
          >
            <View style={{ flex: 1 }}>
              <View style={{ marginTop: RFValue(10) }}>
                <TextField2
                  name={StringsOfLanguages.TrailerPlateNo}
                  value={
                    this.state.TrailerPlateNo
                    // this.state.TrailerPlateNo.length > 42
                    //   ? this.state.TrailerPlateNo.substring(0, 42) + "..."
                    //   : this.state.TrailerPlateNo
                  }
                  placeholder={StringsOfLanguages.EnterPlateNo}
                  onChange={(text) =>
                    this.setState({ TrailerPlateNo: text, isDataChanged: true })
                  }
                />
                <TextFieldWithIcon2
                  name={StringsOfLanguages.TrailerType}
                  placeholder={StringsOfLanguages.SelectTrailerType}
                  value={this.state.SelectedTrailerTypeName}
                  onPress={() =>
                    this.setState({
                      ModalVisible: true,
                      DropdownNumber: 1,
                      DropdownModelData: this.state?.TrailerTypesAry,
                      DropdownModelTitleName: this.state.LangStr.TrailerType,
                      IDPropertyName: "trailerTypeId",
                      ValuePropertyName: "description",
                      isDataChanged: true,
                    })
                  }
                  editable={false}
                  backgroundColor={colors.silverLight}
                  styles={{ justifyContent: "space-between", zIndex: 1 }}
                  cModal={false}
                  modalData={this.state?.DropdownModelData || []}
                  showValue={["description"]}
                />
              </View>
              {this.state.SelectedTrailerTypeID > 0 ? (
                <View>
                  <TextFieldWithIcon2
                    name={StringsOfLanguages.TrailerSpecifications}
                    placeholder={StringsOfLanguages.SelectTrailerSpecifications}
                    value={this.state.SelectedTrailerSpecificationNames}
                    onPress={() =>
                      this.setState({
                        ChecklistModalVisible: true,
                        DropdownNumber: 2,
                        DropdownModelData: this.state.TrailerSpecificationsAry,
                        DropdownModelTitleName:
                          this.state.LangStr.TrailerSpecifications,
                        IDPropertyName: "specificationId",
                        ValuePropertyName: "description",
                        isDataChanged: true,
                      })
                    }
                    editable={false}
                    backgroundColor={colors.silverLight}
                    styles={{ justifyContent: "space-between", zIndex: 1 }}
                    cModal={false}
                    // modalData={this.state?.DropdownModelData || []}
                    showValue={["description"]}
                  />
                </View>
              ) : null}

              <TextFieldWithIcon2
                name={StringsOfLanguages.FloorType}
                placeholder={StringsOfLanguages.SelectFloorType}
                value={this.state.SelectedFloorTypeName}
                onPress={() =>
                  this.setState({
                    ModalVisible: true,
                    DropdownNumber: 3,
                    DropdownModelData: this.state.FloorTypeAry,
                    DropdownModelTitleName: this.state.LangStr.FloorType,
                    IDPropertyName: "floorTypeId",
                    ValuePropertyName: "description",
                    isDataChanged: true,
                  })
                }
                editable={false}
                backgroundColor={colors.silverLight}
                styles={{ justifyContent: "space-between", zIndex: 1 }}
                cModal={false}
                showValue={["description"]}
              />

              <FileUploadField
                name={StringsOfLanguages.PlatePicture}
                placeholder={StringsOfLanguages.SelectPlatePicture}
                value={this.state.SelectedPlatePictureFileName}
                onClickIcon={() => {
                  this.setState({
                    ImagePickerDialogVisible: true,
                    isDataChanged: true,
                  });
                }}
                editable={false}
                onViewDocument={() => this.openUploaderDocument()}
              />
              {/* <FileUploadField name={StringsOfLanguages.TrailerPicture} placeholder={StringsOfLanguages.SelectTrailerPicture} value={this.state.SelectedTrailerPictureFileName} onClickIcon={() => this.selectFile(2)} editable={false} onViewDocument={() => this.openUploaderDocument(2)}/> */}
            </View>
            {/* <TextFieldWithIcon name={this.state.LangStr.PlatePicture} placeholder={this.state.LangStr.SelectPlatePicture} secureTextEntry={false} onChange={(text) => this.setState({ Password: text })} onClickIcon={() => this.setState({IsPasswordShow: !this.state.IsPasswordShow})}/> */}
            <Button
              loader={false}
              disabled={!this.state.isDataChanged}
              style={{
                backgroundColor: this.state.isDataChanged
                  ? "#34B267"
                  : "#BCBCBC",
              }}
              border={false}
              name={
                this.state.Action == 2
                  ? this.state.LangStr.Update
                  : this.state.LangStr.Save
              }
              onPress={() => {
                if (this.state.isDataChanged) {
                  this.AddNewTrailer();
                }
              }}
            />
          </KeyboardAwareScrollView>
        </View>

        <FileViewerModel
          fileName={this.state.SelectedPlatePictureFileName}
          url={this.state.SelectedPlatePictureFileURI}
          isVisible={this.state.FileViewerFlag}
          onclose={() => this.setState({ FileViewerFlag: false })}
        />
        <Loader visible={this.state.loading} />
        {this.state.ModalVisible ? (
          <ModalSelector
            visible={this.state.ModalVisible}
            title={this.state.DropdownModelTitleName}
            data={this.state.DropdownModelData}
            SearchOptionExist={false}
            IDPropertyName={this.state.IDPropertyName}
            ValuePropertyName={this.state.ValuePropertyName}
            onPress={(text, id) => {
              if (this.state.DropdownNumber == 1) {
                this.onSelectTrailerType(id, text);
              } else if (this.state.DropdownNumber == 2)
                this.setState({
                  SelectedTrailerSpecificationID: id,
                  SelectedTrailerSpecificationName: text,
                });
              else if (this.state.DropdownNumber == 3)
                this.setState({
                  SelectedFloorTypeID: id,
                  SelectedFloorTypeName: text,
                });
              this.setState({ ModalVisible: false });
            }}
            closeModal={() => this.setState({ ModalVisible: false })}
          />
        ) : this.state.ChecklistModalVisible ? (
          <ModalSelectorWithCheckbox
            visible={this.state.ChecklistModalVisible}
            title={this.state.DropdownModelTitleName}
            data={this.state.TrailerSpecificationsAry}
            IDPropertyName={this.state.IDPropertyName}
            ValuePropertyName={this.state.ValuePropertyName}
            CheckPropertyName={"IsChecked"}
            onPress={(text, id, index) => {
              this.onSelectTrailerSpecification(text, id, index);
            }}
            OnSelectionComplete={() =>
              this.fetchSelectedTrailerSpecifications()
            }
            closeModal={() => this.fetchSelectedTrailerSpecifications()}
          />
        ) : null}

        <ImageUploadOption
          ImagePickerDialogVisible={this.state.ImagePickerDialogVisible}
          onclose={() => this.setState({ ImagePickerDialogVisible: false })}
          onchooseImg={() => {
            this.selectFile(1);
          }}
          onCameraOpen={() => {
            this.selectFile(2);
          }} //if camera then pass second argument 2
        />
      </SafeAreaView>
    );
  }
}

const mapStateToProps = (state) => {
  return {
    TrailerData: state.TrailerData,
    AddTrailerData: state.AddTrailerData,
    EditTrailerData: state.EditTrailerData,
    TrailerTypeList: state.TrailerTypeList,
    TrailerFloorTypeList: state.TrailerFloorTypeList,
    TrailerSpecificationList: state.TrailerSpecificationList,
    UploadTrailerPlatePicData: state.UploadTrailerPlatePicData,
    TrailerPlatePic: state.TrailerPlatePic,
  };
};
export default connect(mapStateToProps, {
  GetTrailerDetailsAction,
  AddTrailerAction,
  EditTrailerAction,
  GetTrailerTypeListAction,
  GetTrailerFloorTypeListAction,
  GetTrailerSpecificationListAction,
  UploadTrailerPlatePicAction,
  GetTrailerPlatePictureAction,
})(SaveTrailer);
