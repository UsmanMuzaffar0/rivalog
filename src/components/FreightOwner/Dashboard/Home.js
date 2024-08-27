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
import React, { useEffect } from "react";
import { HeaderWithNotification } from "../../../common/Component/Header";
import { Style } from "../../../common/Style";
import * as colors from "../../../common/colors";
import * as Fonts from "../../../common/fonts";
import { RFPercentage, RFValue } from "react-native-responsive-fontsize";
import { useDispatch, useSelector } from "react-redux";
import { GetHomePageAction } from "../../../Redux/actions";
import IMAGES from "../../../common/Image";
import stringsoflanguages from "../../../Localization/stringsoflanguages";
import { StackActions, useNavigation } from "@react-navigation/native";

export default function Home(props) {
  const { data, loader } = useSelector((state) => state.HomePage);
  const navigation = useNavigation();

  const dispatch = useDispatch();

  useEffect(() => {
    const unsubscribe = navigation.addListener("focus", () => {
      dispatch(GetHomePageAction());
    });
    return unsubscribe;
  }, []);

  const renderFreight = (item) => {
    return (
      <Pressable
        onPress={
          () =>
            navigation.dispatch({
              ...StackActions.push("FreightNav", {
                screen: "MyFreightStack",
                params: {
                  screen: "MyFrieghtUpload",
                  params: {
                    filterName: item.description,
                    filterId: item.freightStatusId,
                  },
                },
              }),
            })

          // navigation.navigate("MyFreightStack", {
          // filterName: item.description,
          // filterId: item.freightStatusId,
          // })
          // navigation.reset({
          //   index: 0,
          //   routes: [
          //     {
          //       name: "MyFrieghtUpload",
          //       params: {
          //         filterName: item.description,
          //         filterId: item.freightStatusId,
          //       },
          //     },
          //   ],
          // })
        }
        style={styles.container}
      >
        <View style={styles.textContainer}>
          <Text style={styles.title}>{item.description}</Text>
          <Text style={styles.subTitle}>{item.count}</Text>
        </View>
        <View style={styles.iconCotainer}>
          <Image
            source={
              item.freightStatusId == 1
                ? IMAGES.iconHomeReview
                : item.freightStatusId == 2
                ? IMAGES.iconHomeCancelled
                : item.freightStatusId == 3
                ? IMAGES.iconHomeRejected
                : item.freightStatusId == 5
                ? IMAGES.iconHomeApproved
                : item.freightStatusId == 7
                ? IMAGES.iconHomeAssignedToTransporter
                : item.freightStatusId == 8
                ? IMAGES.iconHomeOnMoving
                : item.freightStatusId == 9
                ? IMAGES.iconHomeDelivered
                : item.freightStatusId == 10
                ? IMAGES.iconHomeDraft
                : null
            }
            style={{ height: RFValue(70), width: RFValue(70) }}
            resizeMode="contain"
          />
        </View>
      </Pressable>
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
        BackAction={props.navigation.toggleDrawer}
        Title={stringsoflanguages?.Home}
      />
      <View
        style={{
          flex: 1,
          paddingHorizontal: RFValue(20),
        }}
      >
        {loader ? (
          <View
            style={{ flex: 1, justifyContent: "center", alignItems: "center" }}
          >
            <ActivityIndicator size={"large"} color={colors.LimeGreen} />
          </View>
        ) : (
          <FlatList
            columnWrapperStyle={{ justifyContent: "space-between" }}
            numColumns={2}
            data={data && data[0]}
            keyExtractor={(item, index) => index.toString()}
            showsVerticalScrollIndicator={false}
            renderItem={({ item }) => renderFreight(item)}
          />
        )}
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  title: {
    fontSize: RFPercentage(1.8),
    fontFamily: Fonts.Regular,
    color: colors.Black,
    fontWeight: "400",
  },
  subTitle: {
    fontSize: RFPercentage(4),
    fontFamily: Fonts.Medium,
    color: colors.Black,
  },

  container: {
    backgroundColor: colors.White,
    borderRadius: RFValue(8),
    width: "46%",
    marginVertical: RFValue(10),
    height: RFPercentage(20),
    padding: RFValue(7),
  },
  row: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginVertical: 2,
  },
  textContainer: {
    height: RFValue(70),
  },
  iconCotainer: {
    flex: 1,
    alignItems: "flex-end",
    justifyContent: "flex-end",
  },
});
