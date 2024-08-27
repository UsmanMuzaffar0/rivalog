import React, { useState } from "react";
import {
  View,
  SafeAreaView,
  Text,
  TouchableOpacity,
  Image,
  Dimensions,
  TextInput,
  I18nManager,
  Platform,
  Modal,
} from "react-native";
import StringsOfLanguages from "../../Localization/stringsoflanguages";
import * as Fonts from "../../common/fonts";
import * as colors from "../../common/colors";
import { RFPercentage, RFValue } from "react-native-responsive-fontsize";
import { ScrollView } from "react-native-gesture-handler";
import CheckBox from "@react-native-community/checkbox";
import { Style } from "../Style";
const { width, height } = Dimensions.get("window");

export const ModalSelector = ({
  title,
  visible,
  data,
  onPress,
  closeModal,
  IDPropertyName = "code",
  ValuePropertyName = "name",
  SearchOptionExist,
  searchHandler,
}) => {
  const [searchTxt, setSearchTxt] = useState("");

  const handleOnChangeSearch = (text) => {
    if (!searchHandler) {
      setSearchTxt(text);
      return;
    }

    setSearchTxt(text);
    searchHandler(text);
  };

  const RenderItem = (props) => {
    const { item, index } = props;

    const SerchText = item[ValuePropertyName];
    return (
      searchTxt == ""
        ? SerchText != ""
        : SerchText.toLowerCase().includes(searchTxt.toLowerCase()) != ""
    ) ? (
      <TouchableOpacity
        activeOpacity={1}
        onPress={() => {
          setSearchTxt("");
          onPress(item[ValuePropertyName], item[IDPropertyName]);
        }}
        style={[Style.DropdownItemView]}
      >
        <Text style={Style.DropdownItemTxt}>{item[ValuePropertyName]}</Text>
      </TouchableOpacity>
    ) : null;
  };

  const RenderItemWithSearchHandle = (props) => {
    const { item, index } = props;

    return (
      <TouchableOpacity
        activeOpacity={1}
        onPress={() => {
          setSearchTxt("");
          onPress(item[ValuePropertyName], item[IDPropertyName]);
        }}
        style={[Style.DropdownItemView]}
      >
        <Text style={Style.DropdownItemTxt}>{item[ValuePropertyName]}</Text>
      </TouchableOpacity>
    );
  };
  return (
    <Modal transparent={true} animationType="slide" visible={visible}>
      <SafeAreaView style={{ backgroundColor: "white", flex: 1 }}>
        <View
          style={{
            paddingHorizontal: RFPercentage(2),
            flexDirection: "row",
            width: width,
            paddingVertical: RFPercentage(2.3),
            borderBottomWidth: 0.5,
            borderBottomColor: colors.Grey,
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <TouchableOpacity
            style={{ position: "absolute", left: RFPercentage(2) }}
            onPress={() => closeModal()}
          >
            <Image
              style={{
                height: RFPercentage(2),
                width: RFPercentage(2),
                resizeMode: "contain",
              }}
              source={require("../../assets/images/icn_close.png")}
            />
          </TouchableOpacity>
          <Text
            numberOfLines={1}
            style={{
              fontSize: RFValue(15),
              fontFamily: Fonts.Bold,
              textAlign: "left",
              color: colors.Black,
            }}
          >
            {title}
          </Text>
        </View>

        {SearchOptionExist ? (
          <View
            style={{
              paddingHorizontal: RFPercentage(2),
              marginTop: RFPercentage(3),
            }}
          >
            <View
              style={{
                alignItems: "center",
                alignSelf: "center",
                width: width / 1.1,
                paddingVertical:
                  Platform.OS == "android" ? RFValue(0) : RFValue(10),
                borderColor: colors.Grey,
                borderWidth: 1,
                paddingHorizontal: RFPercentage(1),
                flexDirection: "row",
                justifyContent: "space-between",
                borderRadius: 5,
              }}
            >
              <View
                style={{
                  flexDirection: "row",
                  width: width / 1.4,
                  alignItems: "center",
                }}
              >
                <Image
                  style={{
                    marginRight: RFPercentage(1),
                    height: RFPercentage(2),
                    width: RFPercentage(2),
                    resizeMode: "contain",
                  }}
                  source={require("../../assets/images/icn_search.png")}
                />

                <TextInput
                  textAlign={I18nManager.isRTL ? "right" : "left"}
                  placeholder={
                    searchTxt == "" ? StringsOfLanguages.SerchTxt : searchTxt
                  }
                  placeholderTextColor={
                    searchTxt == "" ? colors.Grey : colors.Black
                  }
                  style={{
                    fontFamily: Fonts.Regular,
                    color: colors.Black,
                    fontSize: RFValue(12),
                    width: width / 1.6,
                    textDecorationLine: "underline",
                    textDecorationColor:
                      searchTxt == "" ? "white" : colors.Black,
                  }}
                  onChangeText={handleOnChangeSearch}
                  value={searchTxt}
                />
              </View>

              {searchTxt != "" ? (
                <TouchableOpacity
                  onPress={() => {
                    setSearchTxt("");
                  }}
                >
                  <Image
                    style={{
                      height: RFPercentage(2),
                      width: RFPercentage(2),
                      resizeMode: "contain",
                    }}
                    source={require("../../assets/images/icn_close.png")}
                  />
                </TouchableOpacity>
              ) : undefined}
            </View>
          </View>
        ) : undefined}

        {data?.length > 0 ? (
          <ScrollView>
            {data.map((data, index) =>
              searchHandler ? (
                <RenderItemWithSearchHandle item={data} index={index} />
              ) : (
                <RenderItem item={data} index={index} />
              )
            )}
          </ScrollView>
        ) : (
          <Text
            style={{
              marginTop: RFPercentage(5),
              alignSelf: "center",
              fontSize: RFValue(14),
              fontFamily: Fonts.Regular,
              color: colors.Black,
            }}
          >
            {StringsOfLanguages.No_data_found}
          </Text>
        )}
      </SafeAreaView>
    </Modal>
  );
};

export const ModalSelectorWithCheckbox = ({
  title,
  visible,
  data,
  onPress,
  closeModal,
  OnSelectionComplete,
  IDPropertyName,
  ValuePropertyName,
  CheckPropertyName,
}) => {
  const RenderItem = (props) => {
    const { item, index } = props;
    return (
      <TouchableOpacity
        onPress={() => {
          onPress(item[ValuePropertyName], item[IDPropertyName], index);
        }}
        activeOpacity={1}
        style={Style.DropdownItemView}
      >
        <View style={{ flexDirection: "row" }}>
          <CheckBox
            onAnimationType="bounce"
            offAnimationType="bounce"
            disabled={false}
            boxType={"square"}
            value={item[CheckPropertyName]}
            onValueChange={() =>
              onPress(item[ValuePropertyName], item[IDPropertyName], index)
            }
            tintColors={{ true: colors.Blue, false: colors.Grey }}
            tintColor={colors.Grey}
            onFillColor={colors.Blue}
            onCheckColor={colors.White}
            style={{
              height: RFValue(18),
              marginLeft: I18nManager.isRTL ? RFValue(-10) : 0,
              marginRight: I18nManager.isRTL ? RFValue(10) : 0,
            }}
          />
          <Text style={Style.DropdownItemTxt}>{item[ValuePropertyName]}</Text>
        </View>
      </TouchableOpacity>
    );
  };

  return (
    <Modal transparent={true} animationType="slide" visible={visible}>
      <SafeAreaView style={{ backgroundColor: "white", flex: 1 }}>
        <View
          style={{
            paddingHorizontal: RFPercentage(2),
            flexDirection: "row",
            width: width,
            paddingVertical: RFPercentage(2.3),
            borderBottomWidth: 0.5,
            borderBottomColor: colors.Grey,
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <TouchableOpacity
            style={{ position: "absolute", left: RFPercentage(2) }}
            onPress={() => closeModal()}
          >
            <Image
              style={{
                height: RFPercentage(2),
                width: RFPercentage(2),
                resizeMode: "contain",
              }}
              source={require("../../assets/images/icn_close.png")}
            />
          </TouchableOpacity>
          <Text
            numberOfLines={1}
            style={{
              fontSize: RFValue(15),
              fontFamily: Fonts.Bold,
              textAlign: "left",
              color: colors.Black,
            }}
          >
            {title}
          </Text>
          <TouchableOpacity
            style={{ position: "absolute", right: RFPercentage(2) }}
            onPress={() => OnSelectionComplete()}
          >
            <Text style={[Style.signinBtnTxt, { color: "green" }]}>
              {StringsOfLanguages.Ok}
            </Text>
          </TouchableOpacity>
        </View>

        {data?.length > 0 ? (
          <ScrollView>
            {data?.map((data, index) => (
              <RenderItem item={data} index={index} />
            ))}
          </ScrollView>
        ) : (
          <Text
            style={{
              marginTop: RFPercentage(5),
              alignSelf: "center",
              fontSize: RFValue(14),
              fontFamily: Fonts.Regular,
              color: colors.Black,
            }}
          >
            {StringsOfLanguages.No_data_found}
          </Text>
        )}
      </SafeAreaView>
    </Modal>
  );
};

// export default ModalSelector
