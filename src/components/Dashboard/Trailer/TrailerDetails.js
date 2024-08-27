import React from "react";
import {
  View,
  SafeAreaView,
  Text,
  TouchableOpacity,
  StatusBar,
  Platform,
  Alert,
  StyleSheet,
} from "react-native";
import { AuthContext } from "../../../navigation/AuthContext";
import * as colors from "../../../common/colors";
import {
  GetTrailerPlatePictureAction,
  DeleteTrailerAction,
} from "../../../Redux/actions";

import StringsOfLanguages from "../../../Localization/stringsoflanguages";
import { Style, width } from "../../../common/Style";
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";
import { RFPercentage, RFValue } from "react-native-responsive-fontsize";
import { DetailsField } from "../../../common/Component/DetailsField";
import FileUploadField, {
  renderAttachmentItem,
} from "../../../common/Component/FileUploadField";
import Loader from "../../../common/Component/Loader";
import Header from "../../../common/Component/Header";
import { connect } from "react-redux";
import { FileViewerModel } from "../../../common/Component/FileViewerModel";
import Button from "../../../common/Component/Button";

class TrailerDetails extends React.Component {
  static contextType = AuthContext;
  constructor(props) {
    super(props);
    this.defaultState = {
      loading: false,
      LangStr: StringsOfLanguages,
      IsContainerSelected: 0,

      PlatePictureFileName: "",
      PlatePictureFileURI: "",
      FileViewerFlag: false,

      // Update properties
      APIAction: 0,
      TrailerObject: 0,

      TrailerPlateNo: "",
      TrailerTypeName: "",
      TrailerSpecificationList: "",
      FloorTypeName: "",
    };
    this.state = { ...this.defaultState };
  }

  async componentDidMount() {
    console.log(
      this.props.route.params,
      "--------------this.props.route.params"
    );
    this._Reload = this.props.navigation.addListener("focus", async () => {
      this.setState({ ...this.defaultState });
      if (this.props.route.params) {
        const objTrailer = JSON.parse(this.props.route.params.TrailerObject);

        if (objTrailer.trailerType.trailerTypeId == 1)
          objTrailer.specificationList = [
            { specificationId: 1, description: "Trailer Container" },
            { specificationId: 3, description: "Removable Roof" },
            { specificationId: 2, description: "Removable Poles" },
          ];
        else if (objTrailer.trailerType.trailerTypeId == 2)
          objTrailer.specificationList = [
            { specificationId: 1, description: "Trailer Container" },
          ];
        else
          objTrailer.specificationList = [
            { specificationId: 2, description: "Removable Poles" },
            { specificationId: 3, description: "Removable Roof" },
          ];

        await this.setState({
          TrailerObject: objTrailer,
          TrailerPlateNo: objTrailer.plate,
          TrailerTypeName: objTrailer.trailerType.description,
          FloorTypeName: objTrailer.floorType.description,
          TrailerSpecificationList: objTrailer.specificationList,
        });

        this.fetchTrailerPlatePicture(objTrailer.trailerId);
      }
    });
  }

  async fetchTrailerPlatePicture(trailerId) {
    this.setState({ APIAction: 1, loading: true });
    this.props.GetTrailerPlatePictureAction(trailerId);
  }

  async UNSAFE_componentWillReceiveProps(nextProps) {
    if (this.state.APIAction == 1) {
      if (nextProps.TrailerPlatePic.GetTrailerPlatePictureSuccess) {
        if (nextProps.TrailerPlatePic.data[1] == 200) {
          const objTrailerPlatePic = await nextProps.TrailerPlatePic.data[0];
          console.log(objTrailerPlatePic, "-------------");
          if (objTrailerPlatePic.length > 0) {
            this.setState({
              PlatePictureFileName: objTrailerPlatePic[0].fileName,
              PlatePictureFileURI: objTrailerPlatePic[0].url,
            });
          }
          this.setState({ loading: false });
        } else if (nextProps.TrailerPlatePic.data[1] == 401) {
          const SignOutContext = this.context;
          SignOutContext.signOut();
        } else {
          console.log("nextProps.TrailerPlatePic");
          alert("error");
          this.setState({ APIAction: 0, loading: false });
        }
      }
    } else if (this.state.APIAction == 2) {
      if (nextProps.DeleteTrailer.DeleteTrailerSuccess) {
        if (nextProps.DeleteTrailer.data[1] == 200) {
          this.setState({ loading: false });
          this.props.navigation.navigate("TrailerList", { NeedtoReload: true });
        } else if (nextProps.DeleteTrailer.data[1] == 401) {
          const SignOutContext = this.context;
          SignOutContext.signOut();
        } else {
          this.setState({ loading: false, APIAction: 0 });
          alert((await nextProps.DeleteTrailer.data[0]).message);
          console.log("nextProps.DeleteTrailer");
        }
      }
    }
  }

  onUpdate() {
    var objSelectedTrailer = this.state.TrailerObject;
    console.log("OBJSelectedTrailer>>>>>>>", objSelectedTrailer);
    this.props.navigation.navigate("SaveTrailer", {
      Action: 2,
      TrailerObject: JSON.stringify(objSelectedTrailer),
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
            var intSelectedTrailerID = this.state.TrailerObject.trailerId;
            this.props.DeleteTrailerAction(intSelectedTrailerID);
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
                <DetailsField
                  name={StringsOfLanguages.TrailerType}
                  value={this.state.TrailerTypeName}
                  icon={require("../../../assets/images/DashboardCarrier/icn_trailer.png")}
                />
                <DetailsField
                  name={StringsOfLanguages.TrailerPlateNo}
                  value={this.state.TrailerPlateNo}
                  icon={require("../../../assets/images/icn_license_plate.png")}
                />
                <DetailsField
                  name={StringsOfLanguages.FloorType}
                  value={this.state.FloorTypeName}
                  icon={require("../../../assets/images/details_floortype.png")}
                />
                <View style={Style.TextMainView}>
                  <View style={Style.TextfieldTitleView}>
                    <Text style={Style.TextfieldTitle}>
                      {StringsOfLanguages.TrailerSpecifications}
                    </Text>
                  </View>
                  <View style={[{ paddingTop: RFValue(8), paddingBottom: 0 }]}>
                    {this.state.TrailerSpecificationList ? (
                      <View style={Style.TrailerSpecificationItemContainerMain}>
                        {this.state.TrailerSpecificationList.map(
                          (specificationData, index) => (
                            <View
                              style={[
                                Style.TrailerSpecificationItemContainer,
                                { marginBottom: RFValue(8) },
                              ]}
                            >
                              <Text
                                style={[Style.EmailTxt, { color: "#666666" }]}
                              >
                                {specificationData.description}
                              </Text>
                            </View>
                          )
                        )}
                      </View>
                    ) : null}
                  </View>
                </View>

                {this.state.PlatePictureFileURI != "" ? (
                  <View style={Style.TextfieldMainView}>
                    <View
                      style={[
                        Style.TextfieldTitleView,
                        { flexDirection: "row" },
                      ]}
                    >
                      <Text style={Style.TextfieldTitle}>
                        {StringsOfLanguages.PlatePicture}
                      </Text>
                    </View>
                    <TouchableOpacity
                      onPress={() => this.setState({ FileViewerFlag: true })}
                    >
                      {renderAttachmentItem(this.state.PlatePictureFileName)}
                    </TouchableOpacity>
                  </View>
                ) : null}
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

        <FileViewerModel
          fileName={this.state.PlatePictureFileName}
          url={this.state.PlatePictureFileURI}
          isVisible={this.state.FileViewerFlag}
          onclose={() => this.setState({ FileViewerFlag: false })}
        />
        <Loader visible={this.state.loading} />
      </SafeAreaView>
    );
  }
}

const mapStateToProps = (state) => {
  return {
    DeleteTrailer: state.DeleteTrailer,
    TrailerPlatePic: state.TrailerPlatePic,
  };
};
export default connect(mapStateToProps, {
  GetTrailerPlatePictureAction,
  DeleteTrailerAction,
})(TrailerDetails);
