import {
  ActivityIndicator,
  SafeAreaView,
  StatusBar,
  StyleSheet,
  Text,
  View,
  FlatList,
  Image,
  TouchableOpacity,
  TouchableWithoutFeedback,
  Alert,
} from "react-native";
import React, { useEffect, useCallback, useState } from "react";
import Header from "../../common/Component/Header";
import * as colors from "../../common/colors";
import { useDispatch, useSelector } from "react-redux";
import { GetFreightInContainerAction } from "../../Redux/actions";
import { GapH, GapV } from "../../common/Component/gap";
import { RFValue, RFPercentage } from "react-native-responsive-fontsize";
import moment from "moment";
import * as Fonts from "../../common/fonts";
import { IconButton } from "../../common/Component/Button";
import Api from "../../common/Api";
import { showSucces } from "../../common/Utils/flashMessage";

export default function FreightInContianer(props) {
  const { containerId } = props.route.params;
  const { data, loader } = useSelector((state) => state.GetFreightInContainer);
  const [update, setUpdate] = useState(false);

  const dispatch = useDispatch();
  useEffect(() => {
    dispatch(GetFreightInContainerAction(containerId));
    return () => {};
  }, [update]);

  const frieghtUpload = async (id) => {
    const response = await Api.UpdateFreightLoaded(id);
    if (response[1] === 200) {
      showSucces({ description: "Frieght status updated" });
      setUpdate(!update);
      console.log("id", response);
    }
  };

  const frieghtDelivered = async (id, status) => {
    if (status === "DELIVERED") {
      Alert.alert(
        "Already Delivered",
        "Are you sure, it is already delivered?",
        [
          {
            text: "Cancel",
            onPress: () => console.log("Cancel Pressed"),
            style: "cancel",
          },
          {
            text: "OK",
            onPress: async () => {
              const response = await Api.UpdateFreightDelivered(id);
              if (response[1] === 200) {
                setUpdate(!update);
              }
            },
          },
        ]
      );
    } else {
      const response = await Api.UpdateFreightDelivered(id);
      if (response[1] === 200) {
        showSucces({ description: "Frieght status updated" });
        setUpdate(!update);
      }
    }
  };
  RenderItem2 = (data, index) => {
    return (
      <View>
        <TouchableWithoutFeedback
        // onPress={() => this.setState({ Modal: true })}
        >
          <View
            style={{
              height: RFValue(230),
              borderRadius: 10,
              backgroundColor: colors.White,
              borderWidth: 1,
              borderColor: "#34b26770",
              paddingHorizontal: "5%",
              alignSelf: "center",
              marginTop: RFValue(15),
            }}
          >
            <View
              style={{
                flexDirection: "row",
                justifyContent: "space-between",
                alignItems: "center",
                height: RFValue(85),
                borderBottomWidth: 1,
                borderBottomColor: "#34b26720",
              }}
            >
              <View
                style={{
                  position: "absolute",
                  right: 0,
                  backgroundColor: colors.LimeGreen,
                  borderRadius: RFValue(5),
                  top: RFValue(-10),
                  flexDirection: "row",
                }}
              >
                <Text style={styles.status}>
                  {data?.item?.freightStatus?.description}
                </Text>
              </View>

              <View>
                <Text
                  style={{
                    fontSize: RFValue(15),
                    color: colors.Black,
                  }}
                >
                  {data?.item?.company?.name}
                </Text>
                <View
                  style={{
                    borderRadius: 20,
                    backgroundColor: colors.LimeGreen,
                    padding: 5,
                    paddingHorizontal: 10,
                    alignSelf: "flex-start",
                    marginTop: 5,
                  }}
                >
                  <Text
                    style={{
                      fontSize: RFValue(12),
                      color: colors.White,
                    }}
                  >
                    {data?.item?.cost} {data?.item?.valueCurrency?.currencyCode}
                  </Text>
                </View>
              </View>
            </View>
            <View
              style={{
                height: RFValue(75),
                width: "100%",
                justifyContent: "space-between",
                alignItems: "center",
                flexDirection: "row",
                marginTop: RFValue(5),
              }}
            >
              <View style={{ width: "50%" }}>
                <View
                  style={{
                    alignItems: "center",
                    flexDirection: "row",
                    marginBottom: RFValue(5),
                  }}
                >
                  <Image
                    resizeMode="contain"
                    style={{
                      marginRight: RFValue(4),
                      height: RFValue(14),
                      width: RFValue(14),
                    }}
                    source={require("../../assets/images/DashboardCarrier/icn_arrow_freight.png")}
                  />
                  {data?.item?.fromAddress ? (
                    <Text
                      style={{
                        color: "#000",
                        marginLeft: 5,
                        fontSize: RFValue(13),
                      }}
                      numberOfLines={1}
                    >
                      {data?.item?.fromAddress?.city?.name},
                      {data?.item?.fromAddress?.country?.name}
                    </Text>
                  ) : (
                    <Text
                      style={{
                        color: colors.Grey,
                        marginLeft: 5,
                        fontSize: RFValue(13),
                      }}
                    >
                      {this.state.LangStr.From_Location}
                    </Text>
                  )}
                </View>
                <View
                  style={{
                    alignItems: "center",
                    flexDirection: "row",
                    marginTop: RFValue(4),
                  }}
                >
                  <Image
                    resizeMode="contain"
                    style={{
                      marginRight: RFValue(4),
                      height: RFValue(14),
                      width: RFValue(14),
                    }}
                    source={require("../../assets/images/DashboardCarrier/icn_calender_freight.png")}
                  />
                  {data?.item?.plannedDepartureDate ? (
                    <Text
                      style={{
                        marginLeft: 5,
                        color: "#000",
                        fontSize: RFValue(13),
                      }}
                    >
                      {moment(data?.item?.plannedDepartureDate).format(
                        "MM/ DD/ YYYY"
                      )}
                    </Text>
                  ) : (
                    <Text
                      style={{
                        marginLeft: 5,
                        color: colors.Grey,
                        fontSize: RFValue(13),
                      }}
                      numberOfLines={1}
                    >
                      {this.state.LangStr.Departure_Date}
                    </Text>
                  )}
                </View>
                <View
                  style={{
                    alignItems: "center",
                    flexDirection: "row",
                    marginTop: RFValue(8),
                  }}
                >
                  <Image
                    resizeMode="contain"
                    style={{
                      marginRight: RFValue(4),
                      height: RFValue(14),
                      width: RFValue(14),
                    }}
                    source={require("../../assets/images/icon_Time.png")}
                  />
                  {data?.item?.plannedDepartureDate ? (
                    <Text
                      style={{
                        marginLeft: 5,
                        color: "#000",
                        fontSize: RFValue(13),
                      }}
                    >
                      {moment(data?.item?.plannedDepartureDate).format(
                        "HH:mm:ss"
                      )}
                    </Text>
                  ) : (
                    <Text
                      style={{
                        marginLeft: 5,
                        color: colors.Grey,
                        fontSize: RFValue(13),
                      }}
                      numberOfLines={1}
                    >
                      {this.state.LangStr.Departure_Date}
                    </Text>
                  )}
                </View>
              </View>

              <View style={{ width: "50%" }}>
                <View
                  style={{
                    alignItems: "center",
                    flexDirection: "row",
                    marginBottom: RFValue(5),
                  }}
                >
                  <Image
                    resizeMode="contain"
                    style={{
                      marginRight: RFValue(4),
                      height: RFValue(14),
                      width: RFValue(14),
                    }}
                    source={require("../../assets/images/DashboardCarrier/icn_location_freight.png")}
                  />
                  {data?.item?.toAddress ? (
                    <Text
                      style={{
                        color: "#000",
                        marginLeft: 5,
                        fontSize: RFValue(13),
                      }}
                      numberOfLines={1}
                    >
                      {data?.item?.toAddress?.city?.name}
                      {data?.item?.toAddress?.country?.name}
                    </Text>
                  ) : (
                    <Text
                      style={{
                        color: colors.Grey,
                        marginLeft: 5,
                        fontSize: RFValue(13),
                      }}
                      numberOfLines={1}
                    >
                      {this.state.LangStr.To_Location}
                    </Text>
                  )}
                </View>

                <View
                  style={{
                    alignItems: "center",
                    flexDirection: "row",
                    marginTop: RFValue(4),
                  }}
                >
                  <Image
                    resizeMode="contain"
                    style={{
                      marginRight: RFValue(4),
                      height: RFValue(14),
                      width: RFValue(14),
                    }}
                    source={require("../../assets/images/DashboardCarrier/icn_calender_freight.png")}
                  />
                  {data?.item?.plannedArrivalDate ? (
                    <Text
                      style={{
                        marginLeft: 5,
                        color: "#000",
                        fontSize: RFValue(13),
                      }}
                    >
                      {moment(data?.item?.plannedArrivalDate).format(
                        "MM/ DD/ YYYY"
                      )}
                    </Text>
                  ) : (
                    <Text
                      style={{
                        marginLeft: 5,
                        color: colors.Grey,
                        fontSize: RFValue(13),
                      }}
                    >
                      {this.state.LangStr.Arrival_Date}
                    </Text>
                  )}
                </View>
                <View
                  style={{
                    alignItems: "center",
                    flexDirection: "row",
                    marginTop: RFValue(8),
                  }}
                >
                  <Image
                    resizeMode="contain"
                    style={{
                      marginRight: RFValue(4),
                      height: RFValue(14),
                      width: RFValue(14),
                    }}
                    source={require("../../assets/images/icon_Time.png")}
                  />
                  {data?.item?.plannedArrivalDate ? (
                    <Text
                      style={{
                        marginLeft: 5,
                        color: "#000",
                        fontSize: RFValue(13),
                      }}
                    >
                      {moment(data?.item?.plannedArrivalDate).format(
                        "HH:mm:ss"
                      )}
                    </Text>
                  ) : (
                    <Text
                      style={{
                        marginLeft: 5,
                        color: colors.Grey,
                        fontSize: RFValue(13),
                      }}
                    >
                      {this.state.LangStr.Arrival_Date}
                    </Text>
                  )}
                </View>
              </View>
            </View>

            <View
              style={{
                flexDirection: "row",
                marginHorizontal: RFValue(60),
                marginTop: RFValue(20),
                width: "90%",
              }}
            >
              <TouchableOpacity
                onPress={() => frieghtUpload(data?.item?.freightId)}
              >
                <View
                  style={{
                    borderRadius: 20,
                    backgroundColor: colors.Blue,
                    padding: 5,
                    paddingHorizontal: 15,
                    alignSelf: "flex-start",
                  }}
                >
                  <Text style={styles.buttonText}>Load</Text>
                </View>
              </TouchableOpacity>
              <TouchableOpacity
                onPress={() =>
                  frieghtDelivered(
                    data?.item?.freightId,
                    data?.item?.freightStatus?.code
                  )
                }
              >
                <View
                  style={{
                    borderRadius: 20,
                    backgroundColor: colors.LimeGreen,
                    padding: 5,
                    paddingHorizontal: 15,
                    marginLeft: RFValue(30),
                  }}
                >
                  <Text style={styles.buttonText}>Deliver</Text>
                </View>
              </TouchableOpacity>
            </View>
          </View>
        </TouchableWithoutFeedback>
      </View>
    );
  };

  return (
    <SafeAreaView style={styles.mainView}>
      <StatusBar
        animated={false}
        backgroundColor={colors.WhiteSmoke}
        barStyle={"dark-content"}
      />
      <Header
        Title={"Frieght Containers"}
        BackAction={() => props.navigation.goBack()}
      />
      {loader ? (
        <View
          style={{
            flex: 1,
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          <ActivityIndicator size={"large"} color={colors.LimeGreen} />
        </View>
      ) : (
        <View style={{ paddingHorizontal: RFValue(20), flex: 1 }}>
          <FlatList
            data={data[0] || []}
            contentContainerStyle={styles.listContainer}
            // ListEmptyComponent={listEmptyComponent}
            keyExtractor={(item, index) => index.toString()}
            showsVerticalScrollIndicator={false}
            renderItem={RenderItem2}

            // onEndReached={loadMore}
          />
        </View>
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  mainView: {
    flex: 1,
    backgroundColor: colors.WhiteSmoke,
    marginBottom: 0,
    paddingBottom: 0,
  },
  listContainer: { flexGrow: 1 },
  container: {
    backgroundColor: colors.White,
    borderRadius: RFValue(8),
    padding: RFValue(15),
    marginTop: RFValue(8),
    marginBottom: RFValue(20),
  },
  row: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginVertical: 2,
  },
  row2: {
    flexDirection: "row",
    alignItems: "center",
    marginVertical: 4,
  },
  status: {
    paddingHorizontal: 10,
    paddingVertical: 5,
    fontSize: RFPercentage(1),
    fontFamily: Fonts.Medium,
    color: colors.White,
  },
  filterTitle: {
    fontSize: RFPercentage(1.8),
    fontFamily: Fonts.Medium,
    color: colors.Black,
  },
  buttonText: {
    fontSize: RFPercentage(1.6),
    fontFamily: Fonts.Medium,
    color: colors.White,
  },
  buttonContainer: {
    backgroundColor: colors.Blue,
    maxWidth: 120,
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 5,
    paddingVertical: 5,
    marginTop: 15,
  },
});
