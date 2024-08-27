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
import { GetSubContractorListAction } from "../../../Redux/actions";
import { useDispatch, useSelector } from "react-redux";
import { GapH, GapV } from "../../../common/Component/gap";
import stringsoflanguages from "../../../Localization/stringsoflanguages";
import { ListSearchField } from "../../../common/Component/ListSearchField";
import { useNavigation } from "@react-navigation/native";

import { showFailure, showSucces } from "../../../common/Utils/flashMessage";
import Api from "../../../common/Api";
import Loader from "../../../common/Component/Loader";

export default function SubConractList(props) {
  const { data, loader } = useSelector((state) => state.GetSubContractList);
  const [searchValue, setSearchValue] = useState("");
  const [loading, setLoading] = useState(false);
  let pageIndex = 0;
  let pageCount = 20;

  const navigation = useNavigation();
  const dispatch = useDispatch();

  useEffect(() => {
    pageIndex = 0;
    // if (searchValue) {

    dispatch(GetSubContractorListAction(searchValue, pageIndex, pageCount));
    // }
  }, [searchValue]);

  const loadMore = () => {
    setTimeout(() => {
      if (loader) return;
      pageIndex++;
      dispatch(GetSubContractorListAction(searchValue, pageIndex, pageCount));
    }, 1500);
  };

  const handleDeleteSubContract = async (item) => {
    setLoading(true);
    try {
      let res = await Api.DeleteSubContract(item?.transporterSubContractId);
      console.log(">>>>>>", res);

      if (res?.[1] === 200) {
        showSucces({
          description: stringsoflanguages.subContractDelSucces,
        });
        pageIndex = 0;

        dispatch(GetSubContractorListAction(searchValue, pageIndex, pageCount));
      } else {
        console.log(res);
        showFailure({
          title: stringsoflanguages.subContractDelFailed,
          description: res?.[1],
        });
      }
    } catch (e) {
      console.error(e);
    }
    setLoading(false);
  };

  const renderSubContractList = useCallback(
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
              {item?.subContractStatus?.description}
            </Text>
          </View>

          <View style={styles.row}>
            <Text style={[styles.filterTitle, { fontSize: RFPercentage(2) }]}>
              {item?.company?.name}
            </Text>
            <IconButton
              name={"delete"}
              color={colors.Red}
              onPress={() => handleDeleteSubContract(item)}
            />
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
        Title={stringsoflanguages.SubContract}
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

        <View
          style={{
            flexDirection: "row",
            justifyContent: "flex-end",
            alignItems: "center",
            marginTop: RFValue(5),
            marginBottom: RFValue(15),
          }}
        >
          <Pressable
            style={styles.applyForSubContract}
            onPress={() => {
              props.navigation.navigate("ApplyForSubContract");
            }}
          >
            <Text style={styles.applyForSubContractText}>
              {stringsoflanguages.ApplyForContract}
            </Text>
          </Pressable>
        </View>
        {data?.[0]?.length > 0 ? (
          <FlatList
            data={data?.[0] || []}
            contentContainerStyle={styles.listContainer}
            // ListEmptyComponent={listEmptyComponent}
            keyExtractor={(item, index) => index.toString()}
            showsVerticalScrollIndicator={false}
            renderItem={renderSubContractList}
            ListFooterComponent={listFooter}
            //   onEndReached={loadMore}
          />
        ) : (
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
              {stringsoflanguages.noSubContract}
            </Text>
          </View>
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
  applyForSubContract: {
    backgroundColor: colors.LimeGreen,
    borderRadius: RFValue(8),
    height: RFValue(35),
    justifyContent: "center",
  },
  applyForSubContractText: {
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
