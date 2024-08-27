import {
  StyleSheet,
  Text,
  View,
  SafeAreaView,
  StatusBar,
  Pressable,
  Image,
  FlatList,
  ActivityIndicator,
  TouchableWithoutFeedback,
} from "react-native";
import React, { useCallback, useEffect, useState } from "react";
import { HeaderWithNotification } from "../../../../common/Component/Header";
import { Style } from "../../../../common/Style";
import * as colors from "../../../../common/colors";
import * as Fonts from "../../../../common/fonts";
import { RFPercentage, RFValue } from "react-native-responsive-fontsize";
import SelectDropdown from "react-native-select-dropdown";
import MaterialIcons from "react-native-vector-icons/MaterialIcons";
import moment from "moment";
import Button, { IconButton } from "../../../../common/Component/Button";
import {
  GetFreightStatusAction,
  GetMyFreightAction,
} from "../../../../Redux/actions";
import { useDispatch, useSelector } from "react-redux";
import { GapH, GapV } from "../../../../common/Component/gap";
import stringsoflanguages from "../../../../Localization/stringsoflanguages";
import { ListSearchField } from "../../../../common/Component/ListSearchField";
import { useNavigation } from "@react-navigation/native";
import { TouchableOpacity } from "react-native-gesture-handler";
import { showFailure, showSucces } from "../../../../common/Utils/flashMessage";
import Api from "../../../../common/Api";
import Loader from "../../../../common/Component/Loader";

export default function MyFrieghtUpload({ route }) {
  const [status, setStatus] = useState(null);
  const [freightDataArr, setFreightDataArr] = useState([]);
  const freightStatus = useSelector((state) => state.FreightStatus);
  const { data, loader } = useSelector((state) => state.MyFreight);
  const [freightStatusCustom, setFreightStatusCustom] = useState([]);
  const [searchValue, setSearchValue] = useState("");
  const [loading, setLoading] = useState(false);
  let freightStatusArray = [];
  let pageIndex = 0;
  let pageCount = 20;
  let filterName = route?.params?.filterName || "";
  let filterId = route?.params?.filterId || "";
  const navigation = useNavigation();
  const dispatch = useDispatch();

  useEffect(() => {
    // calling api on status change  and clearing data
    setFreightDataArr([]);
    pageIndex = 0;
    if (status) {
      setSearchValue("");
      setFreightDataArr([]);
      dispatch(
        GetMyFreightAction("", pageIndex, pageCount, status?.freightStatusId)
      );
    }
  }, [status]);

  useEffect(() => {
    if (filterId && filterName)
      setStatus({ description: filterName, freightStatusId: filterId });
    dispatch(GetFreightStatusAction("", 0, 20));
    // const unsubscribe = navigation.addListener("focus", () => {
    // });
    // return unsubscribe;
  }, []);

  useEffect(() => {
    if (!freightStatus.loader) {
      freightStatus?.data?.[0]?.forEach((d) => {
        freightStatusArray.push(d);
      });
      setFreightStatusCustom(freightStatusArray);
    }
  }, [freightStatus?.loader]);

  useEffect(() => {
    pageIndex = 0;
    // if (searchValue) {
    setFreightDataArr([]);
    dispatch(
      GetMyFreightAction(
        searchValue,
        pageIndex,
        pageCount,
        status?.freightStatusId || filterId // filter id for first time (if came from dashboard)
      )
    );
    // }
  }, [searchValue]);

  useEffect(() => {
    if (data?.[1] === 200 && data?.[0]) {
      try {
        let temp = data[0] || [];

        if (freightDataArr) setFreightDataArr([...freightDataArr, ...temp]);
        else setFreightDataArr(temp ? [...temp] : []);
      } catch (e) {
        console.error(e);
      }
    }
  }, [data]);

  const loadMore = () => {
    setTimeout(() => {
      if (loader) return;
      pageIndex++;
      dispatch(
        GetMyFreightAction(
          searchValue,
          pageIndex,
          pageCount,
          status?.freightStatusId
        )
      );
    }, 1500);
  };

  const handleFreightEditPress = async (item) => {
    try {
      let res = await Api.GetFreight(item?.freightId);

      if (res?.[1] === 200) {
        setTimeout(() => {
          navigation.navigate("EditFreight", {
            freight: JSON.stringify(res?.[0]),
          });
        });
      } else
        showFailure({
          title: stringsoflanguages.GetFreightEditFailed,
          description: res?.[1],
        });
    } catch (e) {
      console.error(e);
    }
  };

  const handleFreightViewPress = async (item) => {
    try {
      let res = await Api.GetFreight(item?.freightId);

      if (res?.[1] === 200) {
        setTimeout(() => {
          navigation.navigate("ViewFreight", {
            freight: JSON.stringify(res?.[0]),
          });
        });
      } else {
        console.log(res);
        showFailure({
          title: stringsoflanguages.GetFreightViewFailed,
          description: res?.[1],
        });
      }
    } catch (e) {
      console.error(e);
    }
  };

  const handleDeleteFreight = async (item) => {
    setLoading(true);
    try {
      let res = await Api.FreightDelete(item?.freightId);

      if (res?.[1] === 200) {
        showSucces({
          description: stringsoflanguages.FreightDeletedSuccess,
        });
        pageIndex = 0;
        setFreightDataArr([]);
        dispatch(
          GetMyFreightAction(
            searchValue,
            pageIndex,
            pageCount,
            status?.freightStatusId || filterId // filter id for first time (if came from dashboard)
          )
        );
      } else {
        console.log(res);
        showFailure({
          title: stringsoflanguages.FreightDeletedFailed,
          description: res?.[1],
        });
      }
    } catch (e) {
      console.error(e);
    }
    setLoading(false);
  };

  const handleSendForApproval = async (item) => {
    setLoading(true);
    try {
      let res = await Api.FreightSendForApproval(item?.freightId);

      if (res?.[1] === 200) {
        showSucces({
          description: stringsoflanguages.FreightSendApproval,
        });
        pageIndex = 0;
        setFreightDataArr([]);
        dispatch(
          GetMyFreightAction(
            searchValue,
            pageIndex,
            pageCount,
            status?.freightStatusId || filterId // filter id for first time (if came from dashboard)
          )
        );
      } else {
        console.log(res);
        showFailure({
          title: stringsoflanguages.FrieghtSendApprovalFailed,
          description: res?.[1],
        });
      }
    } catch (e) {
      console.error(e);
    }
    setLoading(false);
  };

  const renderFreight = useCallback(
    ({ item, index }) => {
      return (
        <View style={styles.container}>
          <View
            style={{
              position: "absolute",
              right: 0,
              backgroundColor: colors.LimeGreen,
              borderRadius: RFValue(5),
              top: RFValue(-8),
              flexDirection: "row",
            }}
          >
            <Text style={styles.status}>
              {item?.freightStatus?.description}
            </Text>
          </View>

          <View style={styles.itemButton}>
            <IconButton
              name={"eye-outline"}
              color={colors.LimeGreen}
              onPress={() => handleFreightViewPress(item)}
            />
            {status?.freightStatusId === 10 || status?.freightStatusId === 3 ? ( // draft || rejected
              <>
                <GapH />
                <IconButton
                  name={"note-edit-outline"}
                  color={colors.LimeGreen}
                  onPress={() => handleFreightEditPress(item)}
                />
                <GapH />
                <IconButton
                  name={"check-circle"}
                  color={colors.LimeGreen}
                  onPress={() => handleSendForApproval(item)}
                />
                {status?.freightStatusId !== 3 ? (
                  <>
                    <GapH />
                    <IconButton
                      name={"delete"}
                      color={colors.Red}
                      onPress={() => handleDeleteFreight(item)}
                    />
                  </>
                ) : null}
              </>
            ) : null}
          </View>

          <View style={styles.row}>
            <Text style={[styles.filterTitle, { fontSize: RFPercentage(2) }]}>
              {item?.company?.name}
            </Text>
            <Text style={[styles.filterTitle, { fontSize: RFPercentage(2) }]}>
              {item?.cost} {item?.valueCurrency?.currencyCode}
            </Text>
          </View>
          <View style={styles.row}>
            <Text style={[styles.filterTitle, { fontSize: RFPercentage(2) }]}>
              {item?.description}
            </Text>
          </View>
          <View
            style={{
              width: "100%",
              height: RFValue(25),
              // backgroundColor: "green",
              flexDirection: "row",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <Image
              resizeMode="contain"
              style={{
                height: RFValue(12),
                width: RFValue(12),
              }}
              source={require("../../../../assets/images/icon_Arrow.png")}
            />
            <Image
              resizeMode="contain"
              style={{
                width: "90%",
                marginTop: 5,
                marginLeft: 5,
                marginRight: 5,
              }}
              source={require("../../../../assets/images/icon_Line.png")}
            />
            <Image
              resizeMode="contain"
              style={{
                height: RFValue(12),
                width: RFValue(12),
              }}
              source={require("../../../../assets/images/icon_Location.png")}
            />
          </View>
          <View
            style={{
              flexDirection: "row",
              alignItems: "center",
            }}
          >
            <View style={{ width: "60%" }}>
              <Text
                numberOfLines={1}
                style={[styles.filterTitle, { fontSize: RFPercentage(1.8) }]}
              >
                {item?.fromAddress?.city?.name},
                {item?.fromAddress?.country?.name}
              </Text>
              <View style={styles.row2}>
                <Image
                  resizeMode="contain"
                  style={{
                    height: RFValue(14),
                    width: RFValue(14),
                    marginRight: 10,
                  }}
                  source={require("../../../../assets/images/icon_Calender.png")}
                />
                <Text
                  style={[styles.filterTitle, { fontSize: RFPercentage(1.8) }]}
                >
                  {moment(item?.plannedDepartureDate).format("MM/ DD/ YYYY")}
                </Text>
              </View>
              <View style={styles.row2}>
                <Image
                  resizeMode="contain"
                  style={{
                    height: RFValue(14),
                    width: RFValue(14),
                    marginRight: 10,
                  }}
                  source={require("../../../../assets/images/icon_Time.png")}
                />
                <Text
                  style={[styles.filterTitle, { fontSize: RFPercentage(1.8) }]}
                >
                  {moment(item.plannedDepartureDate).format("HH:mm:ss")}
                </Text>
              </View>
            </View>
            <View style={{ width: "40%" }}>
              <Text
                numberOfLines={1}
                style={[styles.filterTitle, { fontSize: RFPercentage(1.8) }]}
              >
                {item?.toAddress?.city?.name}, {item?.toAddress?.country?.name}
              </Text>
              <View style={styles.row2}>
                <Image
                  resizeMode="contain"
                  style={{
                    height: RFValue(14),
                    width: RFValue(14),
                    marginRight: 10,
                  }}
                  source={require("../../../../assets/images/icon_Calender.png")}
                />
                <Text
                  style={[styles.filterTitle, { fontSize: RFPercentage(1.8) }]}
                >
                  {moment(item?.plannedArrivalDate).format("MM/ DD/ YYYY")}
                </Text>
              </View>
              <View style={styles.row2}>
                <Image
                  resizeMode="contain"
                  style={{
                    height: RFValue(14),
                    width: RFValue(14),
                    marginRight: 10,
                  }}
                  source={require("../../../../assets/images/icon_Time.png")}
                />
                <Text
                  style={[styles.filterTitle, { fontSize: RFPercentage(1.8) }]}
                >
                  {moment(item?.plannedArrivalDate).format("HH:mm:ss")}
                </Text>
              </View>
            </View>
          </View>
        </View>
      );
    },
    [freightDataArr]
  );

  const listEmptyComponent = () => {
    if (loader)
      return (
        <View
          style={{
            flex: 1,
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          <ActivityIndicator size={"large"} color={colors.LimeGreen} />
        </View>
      );
    return (
      <View
        style={{
          height: RFValue(500),
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        <Text style={styles.filterTitle}>{stringsoflanguages?.NoFreights}</Text>
      </View>
    );
  };

  const listFooter = () => {
    const dataAvailable = freightDataArr.length > 1 ? true : false;
    return loader && dataAvailable ? (
      <View
        style={{
          flex: 1,
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        <ActivityIndicator size={"large"} color={colors.LimeGreen} />
      </View>
    ) : null;
  };

  return (
    <SafeAreaView style={Style.mainView}>
      <StatusBar
        animated={false}
        backgroundColor={colors.WhiteSmoke}
        barStyle={"dark-content"}
      />
      <HeaderWithNotification
        BackAction={navigation.toggleDrawer}
        Title={stringsoflanguages?.MyFreightTitle}
      />
      <View
        style={{
          flex: 1,

          marginTop: RFValue(5),
          paddingHorizontal: RFValue(20),
        }}
      >
        <ListSearchField
          searchText={searchValue}
          onChangeSearchText={setSearchValue}
          onClearSearchText={() => {
            setSearchValue("");
          }}
        />

        <GapV />

        <Text style={styles.filterTitle}>
          {stringsoflanguages?.FilterByStatus}
        </Text>
        <View
          style={{
            flexDirection: "row",
            justifyContent: "space-between",
            alignItems: "center",
            marginTop: RFValue(5),
            marginBottom: RFValue(15),
          }}
        >
          <SelectDropdown
            data={freightStatusCustom}
            defaultButtonText={filterName ?? ""}
            defaultValue={status}
            renderDropdownIcon={() => (
              <MaterialIcons
                name="keyboard-arrow-down"
                size={RFValue(20)}
                color={colors.LimeGreen}
              />
            )}
            buttonStyle={{
              borderRadius: RFValue(8),
              backgroundColor: "#C6C6C640",
              width: "45%",
              height: RFValue(35),
            }}
            buttonTextStyle={{
              fontSize: RFValue(12),
              fontFamily: Fonts.Medium,
              color: colors.Black,
              position: "absolute",
              right: 1,
              width: "80%",
              textAlign: "left",
            }}
            onSelect={(selectedItem, index) => {
              // console.log(selectedItem, index);
              setStatus(selectedItem);
            }}
            buttonTextAfterSelection={(selectedItem, index) => {
              // text represented after item is selected
              // if data array is an array of objects then return selectedItem.property to render after item is selectedd
              return selectedItem?.description;
            }}
            rowTextForSelection={(item, index) => {
              // text represented for each item in dropdown
              // if data array is an array of objects then return item.property to represent item in dropdown
              return item.description;
            }}
          />

          <Pressable
            style={styles.createNewLoad}
            onPress={() => {
              navigation.navigate("CreateFreightStack");
            }}
          >
            <Text style={styles.createNewLoadText}>
              {stringsoflanguages?.CreateNewLoad}
            </Text>
          </Pressable>
        </View>

        <FlatList
          data={freightDataArr || []}
          contentContainerStyle={styles.listContainer}
          // ListEmptyComponent={listEmptyComponent}
          keyExtractor={(item, index) => index.toString()}
          showsVerticalScrollIndicator={false}
          renderItem={renderFreight}
          ListFooterComponent={listFooter}
          onEndReached={loadMore}
        />
        <GapV />
      </View>
      <Loader visible={loading} />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  filterTitle: {
    fontSize: RFPercentage(1.8),
    fontFamily: Fonts.Medium,
    color: colors.Black,
  },
  createNewLoad: {
    backgroundColor: colors.LimeGreen,
    borderRadius: RFValue(8),
    height: RFValue(35),
    justifyContent: "center",
  },
  createNewLoadText: {
    paddingHorizontal: RFValue(10),
    fontSize: RFValue(12),
    fontFamily: Fonts.Medium,
    color: colors.White,
  },
  container: {
    backgroundColor: colors.White,
    borderRadius: RFValue(8),
    padding: RFValue(15),
    marginTop: RFValue(8),
    marginBottom: RFValue(20),
  },
  listContainer: { flexGrow: 1 },
  listFooter: {},
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
  itemButton: {
    flexDirection: "row-reverse",
  },
});

// const dataFilter = (dataArr) => {
//   if (!dataArr) return;
//   return dataArr?.filter((e) =>
//     status == "" && route?.params?.filterName
//       ? route?.params?.filterName == e?.freightStatus?.description
//       : status !== ""
//       ? e?.freightStatus?.description == status
//       : e
//   );
// };
