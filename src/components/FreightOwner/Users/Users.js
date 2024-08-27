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
  Alert,
} from "react-native";
import React, { useEffect, useState } from "react";
import { HeaderWithNotification } from "../../../common/Component/Header";
import { Style } from "../../../common/Style";
import * as colors from "../../../common/colors";
import * as Fonts from "../../../common/fonts";
import { RFPercentage, RFValue } from "react-native-responsive-fontsize";
import { useDispatch, useSelector } from "react-redux";
import {
  DeleteUserListAction,
  GetUsersListAction,
} from "../../../Redux/actions";
import Feather from "react-native-vector-icons/Feather";
import { GapV } from "../../../common/Component/gap";
import stringsoflanguages from "../../../Localization/stringsoflanguages";
import { showFailure, showSucces } from "../../../common/Utils/flashMessage";
import { IconButton } from "../../../common/Component/Button";

export default function User(props) {
  const [userListArr, setUserListArr] = useState([]);
  const { data, loader } = useSelector((state) => state.UsersList);
  const { DeleteUserSuccess } = useSelector((state) => state.DeleteUser);
  let pageIndex = 0;
  let pageCount = 20;

  const dispatch = useDispatch();

  useEffect(() => {
    if (DeleteUserSuccess) {
      dispatch(GetUsersListAction("", pageIndex, pageCount));
      showSucces({ description: "User deleted successfully" });
    }
  }, [DeleteUserSuccess]);

  useEffect(() => {
    dispatch(GetUsersListAction("", pageIndex, pageCount));
  }, []);

  useEffect(() => {
    if (data && data?.[0]) {
      let temp = data[0];
      setUserListArr([...userListArr, ...temp]);
    }
  }, [data]);

  const loadMore = () => {
    setTimeout(() => {
      if (loader) return;
      pageIndex++;
      // console.log("loadingMore", pageIndex);
      dispatch(GetUsersListAction("", pageIndex, pageCount));
    }, 1500);
  };

  const deleteUser = (userId) => {
    Alert.alert(`Alert`, `Are you sure you want to delete this user`, [
      {
        text: `Yes`,
        onPress: () =>
          // if battery optimization is enabled, request to disable it.

          dispatch(DeleteUserListAction(userId)),
        // : OpenOptimizationSettings(),
      },
      {
        text: `${"No"}`,
        onPress: () => {},

        // if battery optimization is enabled, request to disable it.

        // : OpenOptimizationSettings(),
      },
    ]);
  };

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
        <Text style={styles.filterTitle}>{stringsoflanguages?.NoUsers}</Text>
      </View>
    );
  };

  const listFooter = () => {
    const dataAvailable = userListArr.length;
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

  const renderUsers = (item) => {
    return (
      <View style={styles.container}>
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
              {item?.name}
            </Text>
            <Text
              numberOfLines={1}
              style={[
                styles.filterTitle,
                { fontSize: RFPercentage(1.5), color: "#00000050" },
              ]}
            >
              {item?.surname}
            </Text>
          </View>
          <View style={styles.row}>
            <IconButton
              name={"delete"}
              color={colors.Red}
              onPress={() => deleteUser(item.userId)}
            />
          </View>
        </View>

        <Text style={[styles.title, { fontSize: RFPercentage(2) }]}>
          {stringsoflanguages?.Username}
        </Text>

        <Text style={[styles.subTitle, { fontSize: RFPercentage(1.8) }]}>
          {item.usernname}
        </Text>
        <Text style={[styles.title, { fontSize: RFPercentage(2) }]}>
          {stringsoflanguages?.Email}
        </Text>

        <Text style={[styles.subTitle, { fontSize: RFPercentage(1.8) }]}>
          {item?.email}
        </Text>

        <View
          style={{
            flexDirection: "row",
          }}
        >
          <View style={{ width: "70%" }}>
            <Text style={[styles.title, { fontSize: RFPercentage(2) }]}>
              {stringsoflanguages?.CountryCode}
            </Text>

            <Text style={[styles.subTitle, { fontSize: RFPercentage(1.8) }]}>
              {item.countryCode}
            </Text>
            <Text style={[styles.title, { fontSize: RFPercentage(2) }]}>
              {stringsoflanguages?.DefaultPassword}
            </Text>

            <Text style={[styles.subTitle, { fontSize: RFPercentage(1.8) }]}>
              {item.initialPassword}
            </Text>
          </View>
          <View style={{ width: "30%" }}>
            <Text style={[styles.title, { fontSize: RFPercentage(2) }]}>
              {stringsoflanguages?.Telephone}
            </Text>

            <Text style={[styles.subTitle, { fontSize: RFPercentage(1.8) }]}>
              {item.mobile}
            </Text>
          </View>
        </View>
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
        Title={stringsoflanguages?.UsersTitle}
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
            onPress={() => props.navigation.navigate("AddNewUser")}
            style={styles.createNewUser}
          >
            <Text style={styles.createNewUserText}>
              {stringsoflanguages?.CreateNewUser}
            </Text>
          </Pressable>
        </View>

        <FlatList
          data={userListArr || []}
          keyExtractor={(item, index) => index.toString()}
          showsVerticalScrollIndicator={false}
          contentContainerStyle={styles.listContainer}
          renderItem={({ item }) => renderUsers(item)}
          ListFooterComponent={listFooter}
          ListEmptyComponent={listEmptyComponent}
          onEndReached={loadMore}
        />
        <GapV />
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
  listContainer: { flexGrow: 1 },
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
  createNewUser: {
    backgroundColor: colors.LimeGreen,
    borderRadius: RFValue(8),
    height: RFValue(35),
    justifyContent: "center",
  },
  createNewUserText: {
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
  iconView: {
    backgroundColor: "#F6F6F6",
    padding: 8,
    borderRadius: 5,
  },
});
