import React, { useState } from "react";
import {
  SafeAreaView,
  Text,
  View,
  Image,
  TouchableOpacity,
  Dimensions,
  StatusBar,
  PermissionsAndroid,
  Modal,
  ScrollView,
  ActivityIndicator,
} from "react-native";
import { RFPercentage, RFValue } from "react-native-responsive-fontsize";
import { connect } from "react-redux";
import {
  GetUserDetailsAction,
  EditUserProfileAction,
  UploadUserProfileAction,
} from "../../../Redux/actions";
import NetChecker from "../../../common/Component/Network";
import stringsoflanguages from "../../../Localization/stringsoflanguages";

import ImagePicker from "react-native-image-crop-picker";
import Button from "../../../common/Component/Button";
import { Style } from "../../../common/Style";
import { MoreStyle } from "./MoreStyle";
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";
import AsyncStorage from "@react-native-async-storage/async-storage";
import * as colors from "../../../common/colors";
import * as Fonts from "../../../common/fonts";
import {
  TextField,
  TextField2,
  TextFieldWithIcon,
} from "../../../common/Component/TextField";
import Loader from "../../../common/Component/Loader";
import { AuthContext } from "../../../navigation/AuthContext";
import { Platform } from "react-native";
import Header from "../../../common/Component/Header";
import { launchCamera, launchImageLibrary } from "react-native-image-picker";
import CustomSidebarMenu from "../../../navigation/CustomSidebarMenu";

const { width, height } = Dimensions.get("window");

class UpdateProfile extends React.Component {
  static contextType = AuthContext;

  constructor(props) {
    super(props);
    this.state = {
      loading: true,
      Name: "",
      Surname: "",
      Email: false,
      LangStr: stringsoflanguages,
      UserData: null,
      APIAction: 1,
      ImagePickerDialog: false,
      UserImageFile: {},
      UserProfileImageURI: {},
      profile: "",
      isUpdate: false,
      isUpdateModal: false,
    };
  }

  async UNSAFE_componentWillMount() {}

  async componentDidMount() {
    const NetworkStatus = NetChecker();

    if ((await NetworkStatus) == false) {
      alert("network issue");
      return;
    }

    this.props.GetUserDetailsAction();

    // Is this neccessary??
    this.focusListener = this.props.navigation.addListener(
      "focus",
      async () => {
        this.setState({ APIAction: 1 });
        this.props.GetUserDetailsAction();
        stringsoflanguages.setLanguage(
          await AsyncStorage.getItem("SelectedLanguage")
        );
        this.setState({ LangStr: stringsoflanguages });
        // console.log("AGIN")
      }
    );
    this._Reload = this.props.navigation.addListener("focus", async () => {
      this.props.GetUserDetailsAction();
      console.log("AGIN");
      stringsoflanguages.setLanguage(
        await AsyncStorage.getItem("SelectedLanguage")
      );
      this.setState({ LangStr: stringsoflanguages });
      // this.latlongset();
    });
  }

  async UNSAFE_componentWillReceiveProps(nextProps) {
    if (this.state.APIAction == 1) {
      if (nextProps.UserData.GetUserDetailsSuccess) {
        const data = await nextProps.UserData.data[0];
        console.log(data, "------data");
        if (nextProps.UserData.data[1] == 200) {
          console.log("inside");
          new CustomSidebarMenu().UpdateUserData(
            await data.name,
            data.email,
            data.image
          );
          this.setState({
            Name: await data.name,
            Surname: data.surname,
            Email: data.email,
            profile: data.image,
            loading: false,
            APIAction: 0,
            isUpdate: false,
          });
        } else if (nextProps.UserData.data[1] == 401) {
          const SignOutContext = this.context;
          SignOutContext.signOut();
        }
      }
    } else if (this.state.APIAction == 2) {
      if (nextProps.EditProfileData.EditProfileSuccess) {
        const data = await nextProps.EditProfileData.data[0];
        console.log("nextpropro", await nextProps.EditProfileData);
        if (nextProps.EditProfileData.data[1] == 200) {
          console.log("inside==>>>", await nextProps.EditProfileData);
          if (Object.keys(this.state.UserImageFile).length == 0) {
            this.setState({ APIAction: 1 });
            this.props.GetUserDetailsAction();
          } else {
            this.UploadProfileImage();
          }
          this.setState({ isUpdateModal: true });
          setTimeout(() => {
            this.setState({ isUpdateModal: false });
          }, 1500);

          return;
        } else if (nextProps.EditProfileData.data[1] == 401) {
          const SignOutContext = this.context;
          SignOutContext.signOut();
        } else alert(data.message);
      } else alert(data.error);
    } else if (this.state.APIAction == 3) {
      if (nextProps.UploadUserProfileData.UploadUserProfileSuccess) {
        const data = await nextProps.UploadUserProfileData.data[0];
        console.log(data, "--------------data");
        if (nextProps.UploadUserProfileData.data[1] == 200) {
          this.setState({ APIAction: 1 });
          this.props.GetUserDetailsAction();
        } else if (nextProps.UploadUserProfileData.data[1] == 401) {
          const SignOutContext = this.context;
          SignOutContext.signOut();
        } else alert(data.message);
      } else alert(data.error);
    }
  }

  EditProfilePress() {
    if (this.state.Name.length <= 0) {
      this.setState({ loading: false });
      alert(this.state.LangStr.NameAlert);
      return;
    }

    if (this.state.Surname.length <= 0) {
      this.setState({ loading: false });
      alert(this.state.LangStr.SurnameAlert);
      return;
    }

    this.setState({ loading: true, APIAction: 2 });
    console.log({
      name: this.state.Name,
      surname: this.state.Surname,
      username: this.state.Email,
    });

    this.props.EditUserProfileAction({
      name: this.state.Name,
      surname: this.state.Surname,
      // email: this.state.Email,
    });
  }

  UploadProfileImage() {
    this.setState({ loading: true, APIAction: 3 });
    var data = new FormData();
    data.append("file", {
      uri: this.state.UserImageFile.uri,
      name: this.state.UserImageFile.fileName,
      type: this.state.UserImageFile.type,
    });
    this.props.UploadUserProfileAction(data);
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

  async requestExternalWritePermission() {
    if (Platform.OS === "android") {
      try {
        const granted = await PermissionsAndroid.request(
          PermissionsAndroid.PERMISSIONS.WRITE_EXTERNAL_STORAGE,
          {
            title: "External Storage Write Permission",
            message: "App needs write permission",
          }
        );
        // If WRITE_EXTERNAL_STORAGE Permission is granted
        return granted === PermissionsAndroid.RESULTS.GRANTED;
      } catch (err) {
        console.warn(err);
        alert("Write permission err", err);
      }
      return false;
    } else return true;
  }

  async captureImage() {
    this.setState({ ImagePickerDialog: false });
    try {
      let options = {
        // mediaType: "photo",
        // maxWidth: 300,
        // maxHeight: 550,
        // quality: 1,
        // videoQuality: "low",
        // saveToPhotos: true,
        // includeExtra: true,
        mediaType: "photo",
        // includeBase64: true,
        // presentationStyle: "fullScreen",
        maxWidth: 300,
        maxHeight: 550,
        quality: 1.0,
      };
      let isCameraPermitted = await this.requestCameraPermission();
      let isStoragePermitted = await this.requestExternalWritePermission();
      if (isCameraPermitted && isStoragePermitted) {
        // ImagePicker.openCamera({
        //   width: 300,
        //   height: 400,
        //   includeExif: true,
        //   mediaType: "photo",
        // }).then((image) => {
        //   console.log(image, "image\n");

        //   this.setState({
        //     UserImageFile: {
        //       uri: image.path,
        //       fileName: "temp" + Math.random(),
        //       type: image.mime,
        //     },
        //     UserProfileImageURI: { uri: image.path },
        //     isUpdate: true,
        //   });
        // });

        launchCamera(options, (response) => {
          if (response.didCancel) {
            // alert("User cancelled camera picker");
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

          // setFilePath(response);
          this.setState({
            UserImageFile: objResponse,
            UserProfileImageURI: { uri: objResponse.uri },
            isUpdate: true,
          });
        });
      }
    } catch (error) {
      alert(error);
    }
  }

  chooseFile() {
    this.setState({ ImagePickerDialog: false });
    let options = {
      mediaType: "photo",
      maxWidth: 300,
      maxHeight: 550,
      quality: 1,
    };
    launchImageLibrary(options, (response) => {
      console.log("Response = ", response);
      if (response.didCancel) {
        // alert("User cancelled camera picker");
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
      console.log("base64 -> ", objResponse.base64);
      console.log("uri -> ", objResponse.uri);
      console.log("width -> ", objResponse.width);
      console.log("height -> ", objResponse.height);
      console.log("fileSize -> ", objResponse.fileSize);
      console.log("type -> ", objResponse.type);
      console.log("fileName -> ", objResponse.fileName);

      this.setState({
        UserImageFile: objResponse,
        UserProfileImageURI: { uri: objResponse.uri },
        isUpdate: true,
      });
    });
  }

  render() {
    const { isUpdate, isUpdateModal, loading } = this.state;
    return (
      <SafeAreaView style={[Style.mainView]}>
        <StatusBar
          translucent
          backgroundColor={colors.WhiteSmoke}
          barStyle={"dark-content"}
        />
        {/* <Header
          Title={this.state.LangStr.UpdateProfileTitle}
          BackAction={() => this.props.navigation.goBack()}
        /> */}

        <View style={[Style.ProfileContainerView]}>
          <SafeAreaView style={{ flex: 1 }}>
            <ScrollView
              style={{ flex: 1 }}
              bounces={false}
              showsVerticalScrollIndicator={false}
            >
              <KeyboardAwareScrollView
                style={{ flex: 1 }}
                contentContainerStyle={{ flexGrow: 1 }}
                showsVerticalScrollIndicator={false}
              >
                <View
                  style={{ alignItems: "center", marginVertical: RFValue(30) }}
                >
                  <View style={Style.UpdateProfileImageMeasure}>
                    <View style={Style.ProfileImageView}>
                      {Object.keys(this.state.UserImageFile).length == 0 ? (
                        this.state.profile && this.state.profile != "" ? (
                          <Image
                            style={[
                              Style.UpdateProfileImageMeasure,
                              { resizeMode: "cover" },
                            ]}
                            source={{ uri: this.state.profile }}
                          />
                        ) : (
                          <Image
                            style={[
                              Style.UpdateProfileImageMeasure,
                              { resizeMode: "cover" },
                            ]}
                            source={require("../../../assets/images/avatar.png")}
                          />
                        )
                      ) : (
                        <Image
                          style={[
                            Style.UpdateProfileImageMeasure,
                            { resizeMode: "cover" },
                          ]}
                          source={this.state.UserProfileImageURI}
                        />
                      )}
                    </View>
                    <TouchableOpacity
                      style={Style.CameraIconView}
                      onPress={() => this.setState({ ImagePickerDialog: true })}
                    >
                      <Image
                        style={{ width: RFValue(10), height: RFValue(10) }}
                        source={require("../../../assets/images/Pin.png")}
                      />
                    </TouchableOpacity>
                  </View>
                </View>
                <View style={{}}>
                  <View style={{ paddingTop: RFValue(10, height) }}>
                    <TextField2
                      name={this.state.LangStr.Name}
                      value={this.state.Name}
                      placeholder={this.state.LangStr.NamePlaceholder}
                      onChange={(text) =>
                        this.setState({ Name: text, isUpdate: true })
                      }
                    />

                    <TextField2
                      value={this.state.Surname}
                      name={this.state.LangStr.Surname}
                      placeholder={this.state.LangStr.SurnamePlaceholder}
                      onChange={(text) =>
                        this.setState({ Surname: text, isUpdate: true })
                      }
                    />
                    <TextField2
                      backgroundColor={colors.SemiLightGrey}
                      value={this.state.Email}
                      name={this.state.LangStr.Email}
                      placeholder={this.state.LangStr.EmailAddressPlaceholder}
                      onChange={(text) => this.setState({ Email: text })}
                      editable={false}
                    />
                  </View>
                </View>

                <Button
                  loader={false}
                  onPress={() => {
                    this.EditProfilePress();
                  }}
                  border={false}
                  disabled={!isUpdate}
                  style={[
                    {
                      backgroundColor: isUpdate ? "#34B267" : "#BCBCBC",
                      marginTop: RFValue(55),
                    },
                  ]}
                  name={this.state.LangStr.UpdateProfileTitle}
                />
              </KeyboardAwareScrollView>
            </ScrollView>
          </SafeAreaView>
          {loading && (
            <ActivityIndicator
              size="large"
              color={colors.LimeGreen}
              style={{ position: "absolute", top: "50%", left: "50%" }}
            />
          )}
        </View>

        <Modal
          transparent={true}
          animationType="fade"
          visible={this.state.ImagePickerDialog}
        >
          <SafeAreaView style={{ backgroundColor: "#0000008a", flex: 1 }}>
            <TouchableOpacity
              style={{ height: "100%", width: "100%", flex: 1 }}
              onPress={() => this.setState({ ImagePickerDialog: false })}
            />
            <View
              style={{
                position: "absolute",
                bottom: 0,
                backgroundColor: "white",
                width: "100%",
                borderTopRightRadius: 15,
                borderTopLeftRadius: 15,
              }}
            >
              <View
                style={{
                  borderBottomWidth: 0.5,
                  padding: 15,
                  borderBottomColor: "lightgrey",
                  flexDirection: "row",
                  justifyContent: "center",
                }}
              >
                <Text style={[Style.NameTxt, { textAlign: "center" }]}>
                  {stringsoflanguages.UploadVia}
                </Text>
                <TouchableOpacity
                  onPress={() => this.setState({ ImagePickerDialog: false })}
                  style={{
                    position: "absolute",
                    alignSelf: "center",
                    right: 15,
                  }}
                >
                  <Image
                    source={require("../../../assets/images/icn_close.png")}
                    style={{
                      height: 15,
                      width: 15,
                    }}
                  />
                </TouchableOpacity>
              </View>

              <View style={{ padding: 20, paddingBottom: 40 }}>
                <View
                  style={{
                    alignItems: "flex-start",
                    paddingVertical: 10,
                  }}
                >
                  <TouchableOpacity
                    style={{ flexDirection: "row" }}
                    onPress={() => this.captureImage()}
                  >
                    <Image
                      style={[Style.MenuFlatListImg, { tintColor: "black" }]}
                      source={require("../../../assets/images/icn_camera.png")}
                    />
                    <Text style={Style.MenuListItemTxt}>
                      {stringsoflanguages.Camera}
                    </Text>
                  </TouchableOpacity>
                </View>
                <View
                  style={{
                    alignItems: "flex-start",
                    paddingVertical: 10,
                  }}
                >
                  <TouchableOpacity
                    style={{ flexDirection: "row" }}
                    onPress={() => this.chooseFile()}
                  >
                    <Image
                      style={[Style.MenuFlatListImg, { tintColor: "black" }]}
                      source={require("../../../assets/images/icn_gallery.png")}
                    />
                    <Text style={Style.MenuListItemTxt}>
                      {stringsoflanguages.Gallery}
                    </Text>
                  </TouchableOpacity>
                </View>
              </View>
            </View>
          </SafeAreaView>
        </Modal>
        <Modal
          animationType={"fade"}
          transparent={true}
          visible={isUpdateModal}
        >
          <View style={Style.Modal}>
            <View
              style={[Style.ModelViewContainer, { alignContent: "center" }]}
            >
              <View style={Style.ImageView}>
                <Image
                  style={Style.Image}
                  source={require("../../../assets/images/icn_select_check.png")}
                />
              </View>
              <View style={{ marginTop: RFValue(16), alignItems: "center" }}>
                <Text style={Style.FontMedium_18}>
                  {this.state.LangStr.UpdateProfileModal}
                </Text>
                {/* <Text style={[Style.FontMedium_14, { marginVertical: 30 }]}>
                  {this.state.LangStr.PasswordChangedMsg}
                </Text> */}
                {/* <TouchableOpacity
                  onPress={() => {
                    this.setState({ ResetSuccessfully: false });
                    SignOutContext.signOut();
                  }}
                  activeOpacity={1}
                  style={[Style.signInBtn, { paddingHorizontal: 15 }]}
                >
                  <Text style={[Style.signinBtnTxt, { color: colors.White }]}>
                    {this.state.LangStr.BackToSignIn}
                  </Text>
                </TouchableOpacity> */}
              </View>
            </View>
          </View>
        </Modal>
      </SafeAreaView>
    );
  }
}

const mapStateToProps = (state) => {
  return {
    UserData: state.UserData,
    EditProfileData: state.EditProfileData,
    UploadUserProfileData: state.UploadUserProfileData,
  };
};
export default connect(mapStateToProps, {
  GetUserDetailsAction,
  EditUserProfileAction,
  UploadUserProfileAction,
})(UpdateProfile);
