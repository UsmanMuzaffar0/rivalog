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
import { Header2 } from "../../../common/Component/Header";
import { Style } from "../../../common/Style";
import * as colors from "../../../common/colors";
import * as Fonts from "../../../common/fonts";
import { RFPercentage, RFValue } from "react-native-responsive-fontsize";

import Button, { IconButton } from "../../../common/Component/Button";
import {
  GetMainContractorListAction,
  GetSubContractorListAction,
} from "../../../Redux/actions";
import { useDispatch, useSelector } from "react-redux";
import { GapH, GapV } from "../../../common/Component/gap";
import stringsoflanguages from "../../../Localization/stringsoflanguages";
import { ListSearchField } from "../../../common/Component/ListSearchField";
import { useNavigation } from "@react-navigation/native";

import { showFailure, showSucces } from "../../../common/Utils/flashMessage";
import Api from "../../../common/Api";
import Loader from "../../../common/Component/Loader";

export default function ApplyForSubContract({ route }) {
  const { data, loader } = useSelector(
    (state) => state.GetMainContractCompanyList
  );
  const [searchValue, setSearchValue] = useState("");
  const [loading, setLoading] = useState(false);
  let pageIndex = 0;
  let pageCount = 20;

  const navigation = useNavigation();
  const dispatch = useDispatch();

  useEffect(() => {
    pageIndex = 0;
    // if (searchValue) {

    dispatch(GetMainContractorListAction(searchValue, pageIndex, pageCount));
    // }
  }, [searchValue]);

  const loadMore = () => {
    setTimeout(() => {
      if (loader) return;
      pageIndex++;
      dispatch(GetMainContractorListAction(searchValue, pageIndex, pageCount));
    }, 1500);
  };

  const handleApplySubContract = async (item) => {
    setLoading(true);
    var companyApply = {
      companyId: item?.companyId,
    };
    try {
      let res = await Api.CreateSubContract(companyApply);
      console.log(">>>>>>", res);

      if (res?.[1] === 200) {
        showSucces({
          description: stringsoflanguages.applyForSubContractSuccess,
        });
        pageIndex = 0;
        dispatch(GetSubContractorListAction(searchValue, pageIndex, pageCount));
        navigation.navigate("SubContractList");
      } else {
        console.log(res);
        showFailure({
          title: stringsoflanguages.applyForSubContractFailed,
          description: res?.[1],
        });
      }
    } catch (e) {
      console.error(e);
    }
    setLoading(false);
  };

  const renderMainContract = useCallback(
    ({ item, index }) => {
      return (
        <View style={styles.container}>
          <Pressable
            onPress={() => handleApplySubContract(item)}
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
              {stringsoflanguages.applyForSubContract}
            </Text>
          </Pressable>

          <View>
            <Text style={[styles.filterTitle, {}]}>
              {stringsoflanguages.Name}
            </Text>
            <Text style={[styles.filterTitle, { fontFamily: Fonts.Regular }]}>
              {item?.name}
            </Text>
          </View>
          <View style={[styles.row, { marginVertical: 10 }]}>
            {item?.phone && (
              <View>
                <Text style={[styles.filterTitle, {}]}>
                  {stringsoflanguages.PhoneNo}
                </Text>
                <Text
                  style={[styles.filterTitle, { fontFamily: Fonts.Regular }]}
                >
                  {item?.phone}
                </Text>
              </View>
            )}
            {item?.web && (
              <View>
                <Text style={[styles.filterTitle, {}]}>
                  {stringsoflanguages.Website}
                </Text>
                <Text
                  style={[styles.filterTitle, { fontFamily: Fonts.Regular }]}
                >
                  {item?.web}
                </Text>
              </View>
            )}
          </View>
        </View>
      );
    },
    [data?.[0]]
  );

  const listFooter = () => {
    const dataAvailable = data?.[0]?.length > 1 ? true : false;
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
    <SafeAreaView style={[Style.mainView, { marginTop: RFValue(20) }]}>
      <StatusBar
        animated={false}
        backgroundColor={colors.WhiteSmoke}
        barStyle={"dark-content"}
      />

      <Header2
        Title={stringsoflanguages.applySubContract}
        BackButton={true}
        BackAction={() => {
          navigation.goBack();
        }}
      />

      <View
        style={{
          flex: 1,
          paddingHorizontal: RFValue(10),
        }}
      >
        <View style={Style.listSearchComponentContainerView2}>
          <ListSearchField
            searchText={searchValue}
            onChangeSearchText={setSearchValue}
            onClearSearchText={() => {
              setSearchValue("");
            }}
          />
        </View>

        <GapV />
        <GapV />
        <GapV />

        {data?.[0]?.length == 0 ? (
          <View
            style={{
              flex: 1,
              justifyContent: "center",
              alignItems: "center",
            }}
          >
            <Text
              style={{
                fontFamily: Fonts.Regular,
                fontSize: RFPercentage(2),
                color: colors.Black,
                alignSelf: "center",
              }}
            >
              No Company Available
            </Text>
          </View>
        ) : (
          <FlatList
            data={data?.[0] || []}
            contentContainerStyle={styles.listContainer}
            // ListEmptyComponent={listEmptyComponent}
            keyExtractor={(item, index) => index.toString()}
            showsVerticalScrollIndicator={false}
            renderItem={renderMainContract}
            // ListFooterComponent={listFooter}
            //   onEndReached={loadMore}
          />
        )}

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
    marginHorizontal: RFValue(10),
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

    fontSize: RFPercentage(1.3),
    fontFamily: Fonts.Medium,
    color: colors.White,
  },
  itemButton: {
    flexDirection: "row-reverse",
  },
});
