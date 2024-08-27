import React, { useContext, useEffect } from "react";
import { View, Image, StyleSheet } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { RFPercentage, RFValue } from "react-native-responsive-fontsize";
import { DrawerItem, DrawerContentScrollView } from "@react-navigation/drawer";
import { connect, useDispatch, useSelector } from "react-redux";
import Ionicons from "react-native-vector-icons/Ionicons";
import AsyncStorage from "@react-native-async-storage/async-storage";

import * as Fonts from "../common/fonts";
import * as colors from "../common/colors";
import { Style } from "../common/Style";
import stringsoflanguages from "../Localization/stringsoflanguages";
import { AuthContext, StatuscodeContext } from "./AuthContext";
import { GetUserDetailsAction } from "../Redux/actions";

import { GapH, GapV } from "../common/Component/gap";
import { TextLarge, TextMed } from "../common/Component/Text";
import images from "../assets/images";

const navigateTo = ({ navigation, name }) => {
  navigation.closeDrawer();
  setTimeout(() => navigation.navigate(name), 800);
};

const DrawerAccountInfo = ({ user }) => {
  if (!user) return null;
  const { data } = user;
  if (!data) return null;

  if (data[1] !== 200) return null;
  const { image, name } = data[0];

  return (
    <View style={style.accountInfo}>
      <Image
        source={{ uri: image }}
        style={style.accountImg}
        resizeMode="cover"
      />
      <GapH small />
      <TextLarge>{name}</TextLarge>
    </View>
  );
};

const DrawerList = ({ state, descriptors, navigation }) => {
  return state.routes.map((route) => {
    const {
      title,
      drawerIcon,
      notVisibleInDrawer,
      drawerItemStyle,
      drawerActiveTintColor,
      drawerActiveBackgroundColor,
    } = descriptors[route.key].options;

    if (notVisibleInDrawer) return null;

    return (
      <DrawerItem
        key={route.key}
        icon={drawerIcon}
        style={drawerItemStyle}
        label={title || route.name}
        activeTintColor={drawerActiveTintColor}
        activeBackgroundColor={drawerActiveBackgroundColor}
        onPress={() => navigateTo({ navigation, name: route.name })}
        focused={
          state.routes.findIndex((e) => e.name === route.name) === state.index
        }
      />
    );
  });
};

function DrawerContent(props) {
  const SignOutContext = useContext(AuthContext);
  const dispatch = useDispatch();
  const { state, descriptors, navigation } = props;
  const user = useSelector((state) => state.UserData);

  useEffect(() => {
    dispatch(GetUserDetailsAction());
    return () => {};
  }, []);

  const Header = () => (
    <View style={style.headerContainer}>
      <Image
        source={images.logo_text}
        style={style.imgLogo}
        resizeMode="contain"
      />
      <DrawerAccountInfo user={user} />
      <GapV large />
      <TextLarge>{`Freight Operator`}</TextLarge>
    </View>
  );

  const DrawerScrollView = () => (
    <DrawerContentScrollView
      contentContainerStyle={style.drawerContentScroll}
      {...props}
    >
      <GapV />

      {/* Screen List */}
      <DrawerList
        state={state}
        descriptors={descriptors}
        navigation={navigation}
      />

      {/* Drawer Signout item */}
      <DrawerItem
        onPress={() => {
          AsyncStorage.removeItem("AccessToken");
          AsyncStorage.removeItem("LocationData");
          SignOutContext.signOut();
        }}
        icon={({ size }) => (
          <Ionicons name="exit-outline" size={size} color={colors.LightGrey} />
        )}
        label="Sign Out"
        // style={drawerItemStyle}
      />
    </DrawerContentScrollView>
  );

  return (
    <SafeAreaView style={style.container}>
      {Header()}
      {DrawerScrollView()}
    </SafeAreaView>
  );
}

export default DrawerContent;

const style = StyleSheet.create({
  container: { flex: 1 },
  headerContainer: { paddingHorizontal: RFPercentage(2) },
  drawerContentScroll: { paddingTop: 0 },
  imgLogo: {
    height: RFPercentage(20),
    width: RFPercentage(20),
    alignSelf: "center",
  },
  accountInfo: {
    flexDirection: "row",
  },
  accountImg: {
    height: RFPercentage(5),
    width: RFPercentage(5),
    borderRadius: RFPercentage(2.5),
    overflow: "hidden",
  },
});

// const  componentDidMount=()=> {
//     async () => {
//         stringsoflanguages.setLanguage(
//           await AsyncStorage.getItem("SelectedLanguage")
//         );
//

// UpdateUserData(username, email, profile) {
//     userName = username;
//     Email = email;
//     ProfileUrl = profile;
//   }
