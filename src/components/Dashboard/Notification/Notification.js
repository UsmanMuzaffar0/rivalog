import React from "react";
import {
  SafeAreaView,
  View,
  Text,
  ActivityIndicator,
  Image,
  TouchableOpacity,
  TouchableWithoutFeedback,
  ScrollView,
  BackHandler,
} from "react-native";
import Modal from "react-native-modal";
import Swipeable from "react-native-swipeable";
import { height, Style, width } from "../../../common/Style";
import {
  GetNotificationList,
  SetNotificationStateAsReadAction,
} from "../../../Redux/actions";
import { connect } from "react-redux";
import { Header } from "../../../common/Component/Header";
import * as colors from "../../../common/colors";
import * as Fonts from "../../../common/fonts";
import StringsOfLanguages from "../../../Localization/stringsoflanguages";
import { RFPercentage, RFValue } from "react-native-responsive-fontsize";
import moment from "moment";
import { AuthContext } from "../../../navigation/AuthContext";
import PushNotificationIOS from "@react-native-community/push-notification-ios";
import {
  DetailsField,
  DetailsField2,
  DetailsField3,
} from "../../../common/Component/DetailsField";

class Notification extends React.Component {
  static contextType = AuthContext;

  constructor(props) {
    super(props);
    this.state = {
      loading: true,
      LangStr: StringsOfLanguages,
      notificationList: [],
      nodata: false,
      leftActionActivated: false,
      toggle: false,
      visiblemodal: false,
      title: null,
      message: null,
      date: null,
    };
  }

  componentDidMount() {
    this.props.GetNotificationList();
    // PushNotificationIOS.setApplicationIconBadgeNumber(0);
  }

  UNSAFE_componentWillReceiveProps(nextProps) {
    if (nextProps.NotificationList.GetNotificationSuccess) {
      if (nextProps.NotificationList.data[1] === 200) {
        console.log(nextProps.NotificationList.data[0], "dataaa");
        if (nextProps.NotificationList.data[0].length == 0) {
          this.setState({ loading: false, nodata: true });
        }
        this.setState({
          notificationList: nextProps.NotificationList.data[0],
          loading: false,
        });
      } else if (nextProps.NotificationList.data[1] == 401) {
        const SignOutContext = this.context;
        SignOutContext.signOut();
      }
    }
    if (
      nextProps.SetNotificationStateAsRead.SetNotificationStateAsReadSuccess
    ) {
      console.log("Hiren-->>>", nextProps.SetNotificationStateAsRead);
      if (nextProps.SetNotificationStateAsRead.data[1] === 200) {
        console.log(
          "dataaa of read notifcation",
          nextProps.SetNotificationStateAsRead.data[0]
        );
      } else if (nextProps.SetNotificationStateAsRead.data[1] == 401) {
        this.props.navigation.navigate("Dashboard");
      }
    }
  }

  readmessage(id) {
    this.state.notificationList?.map((item) => {
      if (item.notificationId == id) {
        item.readDate = new Date();
        this.props.SetNotificationStateAsReadAction(item.notificationId);
      }
    });
  }

  render() {
    return (
      <SafeAreaView style={[Style.mainView]}>
        <Header
          Title={this.state.LangStr.Notification}
          BackAction={() => this.props.navigation.goBack()}
        />
        <ScrollView showsVerticalScrollIndicator={false}>
          {!this.state.nodata ? (
            this.state.notificationList.map((data, index) => {
              console.log("Testingg>>>>", this.state.notificationList);
              let diff = moment(new Date()).diff(
                moment(data.createDate),
                "days"
              );
              let hours = moment(new Date()).diff(
                moment(data.createDate),
                "hours"
              );
              let minute = moment(new Date()).diff(
                moment(data.createDate),
                "minute"
              );
              let totalDiff =
                diff > 0
                  ? "on " + data.createDate
                  : hours > 0
                  ? "before " + (hours > 1 ? `${hours} hour` : `${hours} hours`)
                  : "before " + minute > 0
                  ? minute + " minute"
                  : "now";
              const { leftActionActivated, toggle } = this.state;
              return (
                <Swipeable
                  rightActionActivationDistance={100}
                  rightContent={
                    <View
                      style={{
                        paddingHorizontal: RFPercentage(2),
                        paddingVertical: RFPercentage(1.8),
                        marginVertical: RFPercentage(1),
                      }}
                    >
                      {leftActionActivated ? (
                        <Image
                          style={{
                            height: RFValue(30),
                            width: RFValue(30),
                            alignItems: "center",
                            justifyContent: "center",
                          }}
                          source={require("../../../assets/images/Read-meaasage.png")}
                        />
                      ) : (
                        <Image
                          style={{
                            height: RFValue(30),
                            width: RFValue(30),
                            alignItems: "center",
                            justifyContent: "center",
                          }}
                          source={require("../../../assets/images/unreadmsg.png")}
                        />
                      )}
                    </View>
                  }
                  onRightActionActivate={() =>
                    this.setState({ leftActionActivated: true })
                  }
                  onRightActionDeactivate={() =>
                    this.setState({ leftActionActivated: false })
                  }
                  onRightActionComplete={() => {
                    this.setState({ toggle: !toggle }),
                      this.readmessage(data.notificationId);
                  }}
                >
                  <TouchableOpacity
                    activeOpacity={1}
                    onPress={() => {
                      this.setState({
                        visiblemodal: true,
                        title: data.title,
                        message: data.body,
                        date: data.readDate,
                      }),
                        this.readmessage(data.notificationId);
                    }}
                    style={{ width: "93%", marginHorizontal: RFValue(10) }}
                  >
                    <DetailsField3
                      name={data.title}
                      value={data.body}
                      Dot={data?.readDate === null ? true : false}
                      date={
                        "On  " + moment(data.createDate).format("DD MMMM YYYY")
                      }
                      icon={require("../../../assets/images/GreenBell.png")}
                    />
                  </TouchableOpacity>

                  <Modal
                    visible={this.state.visiblemodal}
                    transparent={true}
                    style={{ margin: 0 }}
                    backdropOpacity={true}
                    onBackButtonPress={() =>
                      this.setState({ visiblemodal: false })
                    }
                  >
                    <View
                      style={{
                        flex: 1,
                        backgroundColor: "rgba(0, 0, 0, 0.7)",
                      }}
                    >
                      <View
                        style={{
                          alignSelf: "center",
                          marginTop: width / 2,
                          marginHorizontal: RFValue(10),
                          backgroundColor: colors.White,
                          paddingTop: RFPercentage(2),
                          borderRadius: RFPercentage(2),
                          paddingVertical: RFValue(20),
                          paddingHorizontal: RFValue(10),
                        }}
                      >
                        <View
                          style={{
                            flexDirection: "row",
                            alignItems: "center",
                            justifyContent: "space-between",
                            marginHorizontal: RFValue(10),
                            marginTop: RFValue(10),
                            marginBottom: RFValue(20),
                          }}
                        >
                          <Text
                            style={{
                              fontSize: RFValue(15),
                              fontWeight: "bold",
                              fontFamily: Fonts.LexendRegular,
                            }}
                          >
                            {this.state.title}
                          </Text>
                          <TouchableOpacity
                            activeOpacity={1}
                            onPress={() => {
                              this.setState({
                                visiblemodal: false,
                              });
                            }}
                          >
                            <Image
                              style={{
                                height: RFValue(14),
                                width: RFValue(14),
                              }}
                              source={require("../../../assets/images/CrossIcon.png")}
                            />
                          </TouchableOpacity>
                        </View>
                        <View
                          style={{
                            borderBottomWidth: 0.2,
                            borderBottomColor: "#34B267",
                            width: RFValue(280),
                            alignSelf: "center",
                          }}
                        />

                        <Text
                          style={{
                            color: colors.Black,
                            fontSize: RFValue(14),
                            marginTop: RFPercentage(2),
                            paddingHorizontal: RFValue(5),
                          }}
                        >
                          {this.state.message}
                        </Text>
                        <Text
                          style={{
                            color: colors.Black,
                            fontSize: RFValue(10),
                            marginTop: RFPercentage(2),
                            paddingHorizontal: RFValue(5),
                            alignSelf: "flex-end",
                          }}
                        >
                          {this.state.date
                            ? "On " +
                              moment(this.state.date).format("DD MMMM YYYY")
                            : ""}
                        </Text>
                      </View>
                    </View>
                  </Modal>
                </Swipeable>
              );
            })
          ) : (
            <Text
              style={{
                fontFamily: Fonts.Regular,
                fontSize: RFPercentage(2),
                color: colors.Black,
                alignSelf: "center",
                marginTop: height / 3,
              }}
            >
              {this.state.LangStr.No_data_found}
            </Text>
          )}
        </ScrollView>
        {this.state.loading ? (
          <ActivityIndicator
            size={"large"}
            style={{ position: "absolute", top: height / 2, left: width / 2.1 }}
            color={colors.LimeGreen}
          />
        ) : undefined}
      </SafeAreaView>
    );
  }
}

const mapStateToProps = (state) => {
  return {
    NotificationList: state.NotificationList,
    SetNotificationStateAsRead: state.NotificationState,
  };
};
export default connect(mapStateToProps, {
  GetNotificationList,
  SetNotificationStateAsReadAction,
})(Notification);
