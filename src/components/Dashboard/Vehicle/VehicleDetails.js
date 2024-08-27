import React from "react";
import {
  Alert,
  SafeAreaView,
  StatusBar,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";
import { RFPercentage, RFValue } from "react-native-responsive-fontsize";
import { connect } from "react-redux";
import { AuthContext } from "../../../navigation/AuthContext";
import * as colors from "../../../common/colors";
import { DetailsField } from "../../../common/Component/DetailsField";
import { renderAttachmentItem } from "../../../common/Component/FileUploadField";
import { FileViewerModel } from "../../../common/Component/FileViewerModel";
import Header from "../../../common/Component/Header";
import Loader from "../../../common/Component/Loader";
import { Style } from "../../../common/Style";
import Button from "../../../common/Component/Button";
import StringsOfLanguages from "../../../Localization/stringsoflanguages";
import {
  DeleteVehicleAction,
  GetVehicleFilesAction,
} from "../../../Redux/actions";

class VehicleDetails extends React.Component {
  static contextType = AuthContext;
  constructor(props) {
    super(props);
    this.defaultState = {
      loading: false,
      LangStr: StringsOfLanguages,
      IsContainerSelected: 0,
      VehicleTypeName: "",
      VehiclePlateNo: "",
      VehicleModel: "",
      TIRCarnetFileName: "",
      TIRCarnetFileURI: "",
      PlatePicFileName: "",
      PlatePicFileURI: "",
      VehicleLicenceFileName: "",
      VehicleLicenceFileURI: "",
      ViewerFileName: "",
      ViewerFileURI: "",
      FileViewerFlag: false,
      APIAction: 0,
      VehicleObject: 0,
    };
    this.state = { ...this.defaultState };
  }

  async componentDidMount() {
    this._Reload = this.props.navigation.addListener("focus", async () => {
      this.setState({ ...this.defaultState });
      console.log(this.props.route.params, "--------this.props.route.params");
      if (this.props.route.params) {
        console.log(
          JSON.parse(this.props.route.params.VehicleObject),
          "--------------"
        );
        const objVehicle = JSON.parse(this.props.route.params.VehicleObject);
        await this.setState({
          VehicleObject: objVehicle,
          VehicleTypeName: objVehicle.vehicleType.description,
          VehiclePlateNo: objVehicle.plate,
          VehicleModel: objVehicle.model,
        });
        this.fetchVehicleFiles(objVehicle.vehicleId);
      }
    });
  }

  async fetchVehicleFiles(vehicleId) {
    this.setState({ APIAction: 1, loading: false });
    this.props.GetVehicleFilesAction(vehicleId);
  }

  async UNSAFE_componentWillReceiveProps(nextProps) {
    if (this.state.APIAction == 1) {
      if (nextProps.VehicleFilesData.GetVehicleFilesSuccess) {
        if (nextProps.VehicleFilesData.data[1] == 200) {
          this.setState({ APIAction: 0, loading: false });
          var lstUploadedFiles = await nextProps.VehicleFilesData.data[0];
          console.log("ddsfdsff:", lstUploadedFiles);
          lstUploadedFiles.map((Item) => {
            if (Item.fileType.fileTypeId == 1)
              this.setState({
                PlatePicFileName: Item.fileName,
                PlatePicFileURI: Item.url,
              });
            else if (Item.fileType.fileTypeId == 3)
              this.setState({
                TIRCarnetFileName: Item.fileName,
                TIRCarnetFileURI: Item.url,
              });
            else if (Item.fileType.fileTypeId == 4)
              this.setState({
                VehicleLicenceFileName: Item.fileName,
                VehicleLicenceFileURI: Item.url,
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
    } else if (this.state.APIAction == 2) {
      if (nextProps.DeleteVehicle.DeleteVehicleSuccess) {
        if (nextProps.DeleteVehicle.data[1] == 200) {
          this.setState({ loading: false });
          this.props.navigation.navigate("VehicleList", { NeedtoReload: true });
        } else if (nextProps.DeleteVehicle.data[1] == 401) {
          const SignOutContext = this.context;
          SignOutContext.signOut();
        } else {
          this.setState({ loading: false, APIAction: 0 });
          alert((await nextProps.DeleteTrailer.data[0]).message);
          console.log("nextProps.DeleteVehicle");
        }
      }
    }
  }

  onUpdate() {
    var objSelectedVehicle = this.state.VehicleObject;
    this.props.navigation.navigate("SaveVehicle", {
      Action: 2,
      VehicleObject: JSON.stringify(objSelectedVehicle),
    });
  }

  onDelete() {
    return Alert.alert(
      StringsOfLanguages.DeleteAlertTitle,
      StringsOfLanguages.DeleteAlertMessage,
      [
        // The "Yes" button
        {
          text: "Yes",
          onPress: () => {
            this.setState({ APIAction: 2, loading: true });
            var intSelectedVehicleID = this.state.VehicleObject.vehicleId;
            this.props.DeleteVehicleAction(intSelectedVehicleID);
          },
        },
        // The "No" button
        // Does nothing but dismiss the dialog when tapped
        {
          text: "No",
        },
      ]
    );
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
                {console.log(
                  ">>>>>",
                  this.state.VehicleObject?.vehicleType?.vehicleTypeId
                )}
                <DetailsField
                  icon={
                    this.state.VehicleObject?.vehicleType?.vehicleTypeId == 1
                      ? require("../../../assets/images/icn_vehicle_van.png")
                      : this.state.VehicleObject?.vehicleType?.vehicleTypeId ==
                        2
                      ? require("../../../assets/images/icn_vehicle_truck.png")
                      : require("../../../assets/images/truck21.png")
                  }
                  name={StringsOfLanguages.VehicleType}
                  value={this.state.VehicleTypeName}
                />
                <DetailsField
                  icon={require("../../../assets/images/icn_license_plate.png")}
                  name={StringsOfLanguages.PlateNo}
                  value={this.state.VehiclePlateNo}
                />
                <DetailsField
                  icon={require("../../../assets/images/icn_vehicle_truck.png")}
                  name={StringsOfLanguages.Model}
                  value={this.state.VehicleModel}
                />

                <View
                  style={{
                    flexDirection: "row",
                  }}
                >
                  {this.state.TIRCarnetFileName != "" ? (
                    <View style={Style.TextfieldMainView}>
                      <View style={Style.TextfieldTitleView}>
                        <Text style={Style.TextfieldTitle} numberOfLines={2}>
                          {StringsOfLanguages.TIRCarnet}
                        </Text>
                      </View>
                      <TouchableOpacity
                        onPress={() =>
                          this.setState({
                            FileViewerFlag: true,
                            ViewerFileURI: this.state.TIRCarnetFileURI,
                          })
                        }
                      >
                        {renderAttachmentItem(this.state.TIRCarnetFileName)}
                      </TouchableOpacity>
                    </View>
                  ) : null}
                  {this.state.PlatePicFileName != "" ? (
                    <View style={Style.TextfieldMainView}>
                      <View style={[Style.TextfieldTitleView, {}]}>
                        <Text style={Style.TextfieldTitle}>
                          {StringsOfLanguages.PlatePicture}
                        </Text>
                      </View>
                      <TouchableOpacity
                        onPress={() =>
                          this.setState({
                            FileViewerFlag: true,
                            ViewerFileURI: this.state.PlatePicFileURI,
                          })
                        }
                      >
                        {renderAttachmentItem(this.state.PlatePicFileName)}
                      </TouchableOpacity>
                    </View>
                  ) : null}
                  {this.state.VehicleLicenceFileName != "" ? (
                    <View style={Style.TextfieldMainView}>
                      <View style={Style.TextfieldTitleView}>
                        <Text style={[Style.TextfieldTitle]} numberOfLines={2}>
                          {StringsOfLanguages.VehicleLicencePicture}
                        </Text>
                      </View>
                      <TouchableOpacity
                        onPress={() =>
                          this.setState({
                            FileViewerFlag: true,
                            ViewerFileURI: this.state.VehicleLicenceFileURI,
                          })
                        }
                      >
                        {renderAttachmentItem(
                          this.state.VehicleLicenceFileName
                        )}
                      </TouchableOpacity>
                    </View>
                  ) : null}
                </View>
              </View>
            </View>
            <View>
              <View style={[Style.SignInbtnView, { flex: 1 }]}>
                <Button
                  loader={false}
                  onPress={() => {
                    this.onUpdate();
                  }}
                  border={false}
                  name={this.state.LangStr.Update}
                />
              </View>
              {/* <View
                style={[
                  Style.SignInbtnView,
                  {
                    flex: 1,

                    marginTop: 5,
                  },
                ]}
              >
                <Button
                  loader={false}
                  onPress={() => {
                    this.onDelete();
                  }}
                  border={true}
                  name={this.state.LangStr.Delete}
                />
              </View> */}
            </View>
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
      </SafeAreaView>
    );
  }
}

const mapStateToProps = (state) => {
  return {
    DeleteVehicle: state.DeleteVehicle,
    VehicleFilesData: state.VehicleFilesData,
  };
};
export default connect(mapStateToProps, {
  GetVehicleFilesAction,
  DeleteVehicleAction,
})(VehicleDetails);
