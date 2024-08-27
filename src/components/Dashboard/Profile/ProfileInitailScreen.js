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
import Api from "../../../../src/common/Api";
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
import { useNavigation } from "@react-navigation/native";
import { launchCamera, launchImageLibrary } from "react-native-image-picker";
import CustomSidebarMenu from "../../../navigation/CustomSidebarMenu";
import DeleteConfirmationModel from "../../../common/Component/DeleteConfirmationModel";

const { width, height } = Dimensions.get("window");

class ProfileInitailScreen extends React.Component {
  static contextType = AuthContext;

  constructor(props) {
    super(props);
    this.state = {
      loading: true,
      Name: "",
      Surname: "",
      Email: false,
      LangStr: stringsoflanguages,
      OpenOptionDialog: false,
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
            UserData: data,
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

  onhandleDeleteAccount = async () => {
    this.setState({ OpenOptionDialog: true });
  };
  onDeleteAccountConfirmed = async () => {
    const SignOutContext = this.context;
    try {
      // Call the delete account API here
      const response = await Api.DeleteAccount();
      console.log(">>>>delete", response);
      if (response[1] === 200) {
        AsyncStorage.removeItem("AccessToken");
        AsyncStorage.removeItem("LocationData");
        SignOutContext.signOut();
      }
    } catch (error) {
      console.error("An error occurred while deleting account:", error.message);
    }
  };

  onCancelDelete = () => {
    this.setState({ OpenOptionDialog: false });
  };

  render() {
    const { loading } = this.state;
    return (
      <SafeAreaView style={[Style.mainView]}>
        <StatusBar
          translucent
          backgroundColor={colors.WhiteSmoke}
          barStyle={"dark-content"}
        />

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
                  style={{
                    alignItems: "center",
                    marginVertical: RFValue(30),
                  }}
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
                      onPress={() => this.props.navigation.navigate("Profile")}
                    >
                      <Image
                        style={{ width: RFValue(10), height: RFValue(10) }}
                        source={require("../../../assets/images/Pin.png")}
                      />
                    </TouchableOpacity>
                  </View>
                </View>

                <View style={{ marginTop: RFValue(30) }}>
                  <View
                    style={{
                      flexDirection: "row",
                      width: "38%",
                      justifyContent: "space-between",
                      marginHorizontal: RFValue(2),
                      marginVertical: RFValue(10),
                    }}
                  >
                    <Text
                      style={{
                        color: "#000000",
                        fontWeight: "300",
                        fontFamily: Fonts.LexendSemiBold,
                        fontSize: RFValue(14),
                      }}
                    >
                      {this.state.LangStr.Name + ":"}
                    </Text>
                    <Text style={{ color: "#767676" }}>{this.state.Name}</Text>
                  </View>
                  <View
                    style={{
                      borderBottomWidth: 1,
                      width: "100%",
                      borderBottomColor: "#ebf7f0",
                    }}
                  />
                  <View
                    style={{
                      flexDirection: "row",
                      marginVertical: RFValue(15),
                      width: "38%",
                      marginHorizontal: RFValue(2),
                      justifyContent: "space-between",
                    }}
                  >
                    <Text
                      style={{
                        color: "#000000",
                        fontWeight: "300",
                        fontFamily: Fonts.LexendSemiBold,
                        fontSize: RFValue(14),
                      }}
                    >
                      {this.state.LangStr.Surname + ":"}
                    </Text>
                    <Text style={{ color: "#767676" }}>
                      {this.state.Surname}
                    </Text>
                  </View>
                  <View
                    style={{
                      borderBottomWidth: 1,
                      width: "100%",
                      borderBottomColor: "#ebf7f0",
                    }}
                  />
                  <View
                    style={{
                      flexDirection: "row",
                      marginVertical: RFValue(14),
                      marginHorizontal: RFValue(2),
                      width: "63%",
                      justifyContent: "space-between",
                    }}
                  >
                    <Text
                      style={{
                        color: "#000000",
                        fontWeight: "300",
                        fontFamily: Fonts.LexendSemiBold,
                        fontSize: RFValue(14),
                      }}
                    >
                      {this.state.LangStr.Email + ":    "}
                    </Text>
                    <Text style={{ color: "#767676", fontWeight: "400" }}>
                      {this.state.Email}
                    </Text>
                  </View>
                  <View
                    style={{
                      borderBottomWidth: 1,
                      width: "100%",
                      borderBottomColor: "#ebf7f0",
                    }}
                  />
                </View>

                <View>
                  <Button
                    loader={false}
                    onPress={() => {
                      this.props.navigation.navigate("Profile");
                    }}
                    border={false}
                    // disabled={!isUpdate}
                    style={[
                      {
                        backgroundColor: "#34B267",
                        marginTop: RFValue(120),
                      },
                    ]}
                    name={this.state.LangStr.UpdateProfileTitle}
                  />
                  <TouchableOpacity
                    onPress={this.onhandleDeleteAccount}
                    style={{
                      alignItems: "center",
                      marginTop: RFValue(10),
                    }}
                  >
                    <Text
                      style={{
                        color: "red",
                      }}
                    >
                      {stringsoflanguages.deleteAccount}
                    </Text>
                  </TouchableOpacity>
                </View>
              </KeyboardAwareScrollView>
            </ScrollView>
            {loading && (
              <ActivityIndicator
                size="large"
                color={colors.LimeGreen}
                style={{ position: "absolute", top: "50%", left: "50%" }}
              />
            )}
            {this.state.OpenOptionDialog ? (
              <DeleteConfirmationModel
                isVisible={this.state.OpenOptionDialog}
                onDelete={this.onDeleteAccountConfirmed}
                onCancel={this.onCancelDelete}
              />
            ) : null}
          </SafeAreaView>
        </View>
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
})(ProfileInitailScreen);
