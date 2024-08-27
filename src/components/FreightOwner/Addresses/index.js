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
import React, { useCallback, useEffect, useState } from "react";
import { HeaderWithNotification } from "../../../common/Component/Header";
import { Style } from "../../../common/Style";
import * as colors from "../../../common/colors";
import * as Fonts from "../../../common/fonts";
import { RFPercentage, RFValue } from "react-native-responsive-fontsize";
import { useDispatch, useSelector } from "react-redux";
import {
  GetAddressList,
  GetInvoiceAddressesAction,
  SetPrimaryInvoiceAddress,
} from "../../../Redux/actions";
import MaterialCommunityIcons from "react-native-vector-icons/MaterialCommunityIcons";
import Feather from "react-native-vector-icons/Feather";
import { GapH, GapV } from "../../../common/Component/gap";
import stringsoflanguages from "../../../Localization/stringsoflanguages";
import { IconButton } from "../../../common/Component/Button";
import Loader from "../../../common/Component/Loader";
import Api from "../../../common/Api";
import { showFailure, showSucces } from "../../../common/Utils/flashMessage";
import AddNewAddressForm from "./addAddressForm";
import { ListSearchField } from "../../../common/Component/ListSearchField";

export default function Addresses(props) {
  const title = props?.route?.params?.title;
  const { data, loader } = useSelector((state) => state.GetAddressData);
  const [searchValue, setSearchValue] = useState("");
  const [addressesDataArr, setAddressesDataArr] = useState([]);
  const [loading, setLoading] = useState(false);
  const [addressFormVisible, setAddressFormVisible] = useState(false);
  const [editItem, setEditItem] = useState(null);
  let pageIndex = 0;
  let pageCount = 20;

  const dispatch = useDispatch();

  useEffect(() => {
    pageIndex = 0;
    // if (searchValue) {
    setAddressesDataArr([]);
    dispatch(GetAddressList(searchValue, pageIndex, pageCount));
    // }
  }, [searchValue]);

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

  const hideAddressForm = () => {
    setAddressFormVisible(false);
  };

  const showAddressForm = () => {
    setAddressFormVisible(true);
  };

  const onAddNewAddress = () => {
    setAddressesDataArr([]);
  };

  const loadMore = () => {
    setTimeout(() => {
      if (loader) return;
      pageIndex++;
      dispatch(GetAddressList(searchValue, pageIndex, pageCount));
    }, 1500);
  };

  const handleDeleteAddress = async (item) => {
    setLoading(true);
    try {
      let res = await Api.AddressDelete(item?.addressId);

      if (res?.[1] === 200) {
        showSucces({
          description: "Address Deleted Succussfuly",
        });
        pageIndex = 0;
        setAddressesDataArr([]);
        dispatch(GetAddressList(searchValue, pageIndex, pageCount));
      } else {
        console.log(res);
        showFailure({
          title: "Address Delete Failed",
          description: res?.[1],
        });
      }
    } catch (e) {
      console.error(e);
    }
    setLoading(false);
  };

  const handleEditPress = async (item) => {
    setLoading(true);
    try {
      let res = await Api.GetAddressById(item?.addressId);
      if (res?.[1] === 200) {
        console.log("GetAddressById", JSON.stringify(res?.[0], null, 2));
        setEditItem(res?.[0]);
        showAddressForm();
      } else
        showFailure({
          title: "Get Address for Edit Address",
          description: res?.[1],
        });
    } catch (e) {
      console.error(e);
    }
    setLoading(false);
  };

  const removeEditAddress = () => {
    setEditItem(null);
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

  const renderFreight = useCallback((item) => {
    return (
      <View
        style={[
          styles.container,
          {
            backgroundColor: colors.White,
            borderWidth: 0,
            borderColor: "#74C98F",
          },
        ]}
      >
        <View style={styles.rowRev}>
          <IconButton
            name={"delete"}
            color={colors.Red}
            onPress={() => handleDeleteAddress(item)}
          />
          <GapH />
          <IconButton
            name={"note-edit-outline"}
            color={colors.LimeGreen}
            onPress={() => handleEditPress(item)}
          />
        </View>
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
  }, []);

  const listEmptyComponent = () => {
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
        Title={title}
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
          <Pressable onPress={showAddressForm} style={styles.addNewBilling}>
            {/* todo */}
            <Text style={styles.addNewBillingText}>{`Add New Address`}</Text>
          </Pressable>
        </View>

        <GapV />
        <ListSearchField
          searchText={searchValue}
          onChangeSearchText={setSearchValue}
          onClearSearchText={() => {
            setSearchValue("");
          }}
        />
        <GapV />

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
      <AddNewAddressForm
        isVisible={addressFormVisible}
        showModal={showAddressForm}
        hideModal={hideAddressForm}
        onSuccess={onAddNewAddress}
        address={editItem}
        removeEditAddress={removeEditAddress}
      />
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
  rowRev: {
    flexDirection: "row-reverse",
  },
  row: {
    flexDirection: "row",
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
