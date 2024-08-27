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
} from "react-native";
import React, { useEffect, useState } from "react";
import { HeaderWithNotification } from "../../../../common/Component/Header";
import { Style } from "../../../../common/Style";
import * as colors from "../../../../common/colors";
import * as Fonts from "../../../../common/fonts";
import { RFPercentage, RFValue } from "react-native-responsive-fontsize";
import { useDispatch, useSelector } from "react-redux";
import {
  GetInvoiceAddressesAction,
  SetPrimaryInvoiceAddress,
} from "../../../../Redux/actions";
import MaterialCommunityIcons from "react-native-vector-icons/MaterialCommunityIcons";
import Feather from "react-native-vector-icons/Feather";
import { GapV } from "../../../../common/Component/gap";
import stringsoflanguages from "../../../../Localization/stringsoflanguages";
import { IconButton } from "../../../../common/Component/Button";

export default function BillingAddresses(props) {
  const { data, loader } = useSelector((state) => state.InvoiceAddresses);
  const SetAsPrimary = useSelector((state) => state.SetPrimaryIvoiceAddress);
  const [searchValue, setSearchValue] = useState("");
  const [addressesDataArr, setAddressesDataArr] = useState([]);
  const [loading, setLoading] = useState(false);
  let pageIndex = 0;
  let pageCount = 20;

  const dispatch = useDispatch();

  // useEffect(() => {
  //   pageIndex = 0;
  //   // if (searchValue) {
  //   setAddressesDataArr([]);
  //   dispatch(GetInvoiceAddressesAction(searchValue, pageIndex, pageCount));
  //   // }
  // }, [searchValue]);

  useEffect(() => {
    pageIndex = 0;
    setAddressesDataArr([]);
    dispatch(GetInvoiceAddressesAction("", pageIndex, pageCount));
  }, [SetAsPrimary.SetPrimaryInvoiceAddrressSuccess]);

  useEffect(() => {
    if (data?.[1] === 200 && data?.[0]) {
      try {
        let temp = data[0] || [];

        if (addressesDataArr)
          setAddressesDataArr([...addressesDataArr, ...temp]);
        else setAddressesDataArr(temp ? [...temp] : []);
      } catch (e) {
        console.error(e);
      }
    }
  }, [data]);

  const loadMore = () => {
    setTimeout(() => {
      if (loader) return;
      pageIndex++;
      dispatch(GetInvoiceAddressesAction(searchValue, pageIndex, pageCount));
    }, 1500);
  };

  const listFooter = () => {
    const dataAvailable = addressesDataArr.length > 1 ? true : false;
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

  const renderFreight = (item) => {
    return (
      <View
        style={[
          styles.container,
          {
            backgroundColor: item.isPrimary != "Y" ? colors.White : "#EBFDF4",
            borderWidth: item.isPrimary != "Y" ? 0 : 1,
            borderColor: "#74C98F",
          },
        ]}
      >
        <View
          style={[
            styles.row,
            {
              borderBottomWidth: 1,
              borderBottomColor: colors.silver,
              paddingBottom: RFValue(8),
              marginBottom: RFValue(8),
            },
          ]}
        >
          <View>
            <Text style={[styles.filterTitle, { fontSize: RFPercentage(2.5) }]}>
              {item?.description}
            </Text>
            <Text
              numberOfLines={1}
              style={[
                styles.filterTitle,
                { fontSize: RFPercentage(1.5), color: "#00000050" },
              ]}
            >
              {item?.addressText}
            </Text>
          </View>
          <View style={styles.row}>
            {item.isPrimary != "Y" && (
              <Pressable
                onPress={() => {
                  dispatch(SetPrimaryInvoiceAddress(item.invoiceAddressId));
                }}
                style={[
                  styles.iconView,
                  {
                    marginRight: 10,
                  },
                ]}
              >
                {SetAsPrimary.loader ? (
                  <ActivityIndicator
                    color={colors.LimeGreen}
                    size={RFValue(13)}
                  />
                ) : (
                  <MaterialCommunityIcons
                    name="check-circle"
                    color={colors.LightGreen}
                    size={RFValue(13)}
                  />
                )}
              </Pressable>
            )}
            <IconButton
              name={"note-edit-outline"}
              color={colors.LimeGreen}
              onPress={() =>
                props.navigation.navigate("AddBillingAddress", { update: item })
              }
            />
          </View>
        </View>

        <View
          style={{
            flexDirection: "row",
          }}
        >
          <View style={{ width: "70%" }}>
            <Text style={[styles.title, { fontSize: RFPercentage(2) }]}>
              {stringsoflanguages?.Country}
            </Text>

            <Text style={[styles.subTitle, { fontSize: RFPercentage(1.8) }]}>
              {item?.country?.name}
            </Text>
            <Text style={[styles.title, { fontSize: RFPercentage(2) }]}>
              {stringsoflanguages?.District}
            </Text>

            <Text style={[styles.subTitle, { fontSize: RFPercentage(1.8) }]}>
              {item?.district}
            </Text>
            <Text style={[styles.title, { fontSize: RFPercentage(2) }]}>
              {stringsoflanguages?.PostCode}
            </Text>

            <Text style={[styles.subTitle, { fontSize: RFPercentage(1.8) }]}>
              {item?.postCode}
            </Text>
          </View>
          <View style={{ width: "30%" }}>
            <Text style={[styles.title, { fontSize: RFPercentage(2) }]}>
              {stringsoflanguages?.City}
            </Text>

            <Text style={[styles.subTitle, { fontSize: RFPercentage(1.8) }]}>
              {item?.city?.name}
            </Text>
            <Text style={[styles.title, { fontSize: RFPercentage(2) }]}>
              {stringsoflanguages?.District}
            </Text>

            <Text style={[styles.subTitle, { fontSize: RFPercentage(1.8) }]}>
              {item?.district}
            </Text>
          </View>
        </View>
      </View>
    );
  };

  const listEmptyComponent = () => {
    console.log("addressesDataArr.length", addressesDataArr.length);
    if (addressesDataArr.length != 0) return null;
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
        <Text style={styles.filterTitle}>
          {stringsoflanguages?.NoBillingAddress}
        </Text>
      </View>
    );
  };

  return (
    <SafeAreaView style={Style.mainView}>
      <StatusBar
        animated={false}
        backgroundColor={colors.WhiteSmoke}
        barStyle={"dark-content"}
      />
      <HeaderWithNotification
        Title={stringsoflanguages?.BillingAddressesTitle}
        BackAction={props.navigation.toggleDrawer}
      />
      <View
        style={{
          flex: 1,
          marginTop: RFValue(10),
          paddingHorizontal: RFValue(20),
        }}
      >
        <View
          style={{
            justifyContent: "flex-end",
            alignItems: "flex-end",
            marginTop: RFValue(5),
            marginBottom: RFValue(15),
          }}
        >
          <Pressable
            onPress={() => props.navigation.navigate("AddBillingAddress")}
            style={styles.addNewBilling}
          >
            <Text style={styles.addNewBillingText}>
              {stringsoflanguages?.AddNewBillingAddress}
            </Text>
          </Pressable>
        </View>

        <FlatList
          data={addressesDataArr || []}
          keyExtractor={(item, index) => index.toString()}
          showsVerticalScrollIndicator={false}
          renderItem={({ item }) => renderFreight(item)}
          onEndReached={loadMore}
          ListFooterComponent={listFooter}
          ListEmptyComponent={listEmptyComponent}
        />
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  filterTitle: {
    fontSize: RFPercentage(1.8),
    fontFamily: Fonts.Medium,
    color: colors.Black,
  },
  title: {
    fontSize: RFPercentage(1.8),
    fontFamily: Fonts.Medium,
    color: colors.Black,
  },
  subTitle: {
    fontSize: RFPercentage(1.8),
    fontFamily: Fonts.Medium,
    color: colors.blacklight,
    marginTop: 2,
    marginBottom: 5,
  },
  addNewBilling: {
    backgroundColor: colors.LimeGreen,
    borderRadius: RFValue(8),
    height: RFValue(35),
    justifyContent: "center",
  },
  addNewBillingText: {
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
    marginBottom: RFValue(12),
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
  footerView: {
    backgroundColor: colors.LimeGreen,
    borderRadius: RFValue(20),
    marginTop: RFValue(20),
    width: "75%",
    alignSelf: "center",
    justifyContent: "center",
    alignItems: "center",
  },
  status: {
    paddingHorizontal: 10,
    paddingVertical: 5,
    fontSize: RFPercentage(1),
    fontFamily: Fonts.Medium,
    color: colors.White,
  },
  iconView: {
    backgroundColor: "#F6F6F6",
    padding: 8,
    borderRadius: 5,
  },
});
