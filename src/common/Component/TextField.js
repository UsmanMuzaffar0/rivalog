import React, { useEffect, useState } from "react";
import {
  Pressable,
  Touchable,
  TouchableOpacity,
  StyleSheet,
  FlatList,
  SafeAreaView,
  TextInput,
  View,
  Text,
  I18nManager,
  Image,
  Modal,
} from "react-native";
import * as colors from "../colors";
import * as Fonts from "../fonts";
import { Style } from "../Style";

import StringsOfLanguages from "../../Localization/stringsoflanguages";
import CountryPicker from "react-native-country-picker-modal";
import { RFPercentage, RFValue } from "react-native-responsive-fontsize";
import * as RNLocalize from "react-native-localize";
import { currentLocale, getCountryCodeAsync } from "../Utils/localize";
import Entypo from "react-native-vector-icons/Entypo";
import NetChecker from "../../common/Component/Network";
import CountryFlag from "react-native-country-flag";
import MaterialIcons from "react-native-vector-icons/MaterialIcons";
import { TextInput as TextInputPaper } from "react-native-paper";
import { HeaderWithRefreshOption } from "./Header";
import { ListSearchField } from "./ListSearchField";
import GetVehicleListAction from "../../Redux/actions";

export const TextField = ({
  name,
  onChange,
  value,
  placeholder = "",
  secureTextEntry = false,
  editable = true,
  keyboardType = "default",
  multiline = false,
  backgroundColor,
}) => {
  return (
    <View style={Style.TextfieldMainView}>
      <View style={Style.TextfieldTitleView}>
        <Text style={Style.TextfieldTitle}>{name}</Text>
      </View>
      <View
        style={[Style.InputTextFieldView, { backgroundColor: backgroundColor }]}
      >
        <TextInput
          textAlign={I18nManager.isRTL ? "right" : "left"}
          style={Style.InputTextField}
          placeholderTextColor={colors.LightGrey}
          secureTextEntry={secureTextEntry}
          autoCapitalize="none"
          onChangeText={(text) => onChange(text)}
          value={value}
          editable={editable}
          placeholder={placeholder}
          keyboardType={keyboardType}
          multiline={multiline}
        ></TextInput>
      </View>
    </View>
  );
};

export const TextField2 = ({
  name,
  onChange,
  value,
  placeholder = "",
  secureTextEntry = false,
  editable = true,
  keyboardType = "default",
  multiline = false,
  backgroundColor = colors.silverLight,
  styles,
  onPress,
  onBlur,
  regex,
  errorMessage,
  ...props
}) => {
  return (
    <View style={[Style.TextfieldMainView2, { styles }]}>
      <View style={[Style.TextfieldTitleView2]}>
        <Text style={Style.TextfieldTitle2}>{name}</Text>
      </View>
      <Pressable
        onPress={onPress}
        style={[
          Style.InputTextFieldView2,
          { backgroundColor: backgroundColor },
          styles,
        ]}
      >
        <TextInput
          textAlign={I18nManager.isRTL ? "right" : "left"}
          style={Style.InputTextField2}
          placeholderTextColor={colors.blacklight}
          secureTextEntry={secureTextEntry}
          autoCapitalize="none"
          onChangeText={(text) => {
            if (regex) {
              if (regex.test(text) || text === "") onChange(text);
              return;
            } else {
              onChange(text);
            }
          }}
          value={value}
          editable={editable}
          placeholder={placeholder}
          keyboardType={keyboardType}
          multiline={multiline}
          numberOfLines={multiline ? 10 : 1}
          onBlur={onBlur}
        />
      </Pressable>
    </View>
  );
};

export const TextFieldWithCountryCode = ({
  name,
  onChange,
  value,
  codelcik,
  Cmodal,
  placeholder = "",
  secureTextEntry = false,
  editable = true,
  onClose,
  keyboardType = "default",
  countryCodeValue,
  onOpen,
  countryCodesArr,
}) => {
  return (
    <View style={Style.TextfieldMainView}>
      <View style={Style.TextfieldTitleView}>
        <Text style={Style.TextfieldTitle}>{name}</Text>
      </View>
      <View style={Style.InputTextFieldView}>
        <TouchableOpacity
          onPress={() => onOpen()}
          style={Style.countryCodeText}
        >
          <Text style={{ color: colors.Black, fontSize: RFValue(14) }}>
            +
            {countryCodeValue?.toString()?.includes("+")
              ? countryCodeValue.toString().split("+")[1]
              : countryCodeValue}
          </Text>
        </TouchableOpacity>
        <TextInput
          textAlign={I18nManager.isRTL ? "right" : "left"}
          style={Style.InputTextField}
          placeholderTextColor={colors.LightGrey}
          secureTextEntry={secureTextEntry}
          autoCapitalize="none"
          onChangeText={(text) => onChange(text)}
          value={value}
          editable={editable}
          placeholder={placeholder}
          keyboardType={keyboardType}
        ></TextInput>
      </View>

      <Modal transparent={true} visible={Cmodal}>
        <View
          style={{
            height: "100%",
            width: "100%",
            alignItems: "center",
            justifyContent: "center",
            alignSelf: "center",
          }}
        >
          {countryCodesArr ? (
            <CountryPicker
              // todo: add api call and pass countries manually
              // countryCode={"AF"}
              countryCode={async () => {
                return await getCountryCodeAsync();
              }}
              filterProps={{
                placeholder: 'place holder text'
             }}
              countryCodes={countryCodesArr}
              preferredCountries={countryCodesArr}
              withFlag={true}
              visible={Cmodal}
              onSelect={(Country) => {
                console.log(Country);
                codelcik(Country);
              }}
              onClose={() => onClose()}
              withCallingCode={true}
              withCountryNameButton={true}
              withCurrencyButton={true}
              withFlagButton={true}
              withFilter={true}
              withModal={false}
            />
          ) : (
            <CountryPicker
              countryCode={async () => {
                return await getCountryCodeAsync();
              }}
              filterProps={{
                placeholder: 'place holder text'
             }}
              withFlag={true}
              visible={Cmodal}
              onSelect={(Country) => {
                console.log(Country);
                codelcik(Country);
              }}
              onClose={() => onClose()}
              withCallingCode={true}
              withCountryNameButton={true}
              withCurrencyButton={true}
              withFlagButton={true}
              withFilter={true}
              withModal={false}
              excludeCountries={["AQ", "BV", "TF"]}
            />
          )}
        </View>
      </Modal>
    </View>
  );
};

export const TextFieldWithCountryCode2 = ({
  name,
  onChange,
  value,
  codelcik,
  Cmodal,
  placeholder = "",
  secureTextEntry = false,
  editable = true,
  onClose,
  keyboardType = "default",
  countryCodeValue,
  onOpen,
  countryCodesArr,
  styles,
  regex,
  backgroundColor,
  isoCode,
}) => {
  return (
    <View style={[Style.TextfieldMainView2, { styles }]}>
      <View style={Style.TextfieldTitleView2}>
        <Text style={Style.TextfieldTitle2}>{name}</Text>
      </View>
      <View
        style={[
          Style.InputTextFieldView2,
          {
            backgroundColor: colors.silverLight,
            paddingHorizontal: 0,
            paddingVertical: 0,
          },
          styles,
        ]}
      >
        <View
          style={{
            width: RFPercentage(8),
            height: "100%",
            width: "20%",
            backgroundColor: colors.White,
            borderTopLeftRadius: RFValue(10),
            borderBottomLeftRadius: RFValue(10),
            paddingVertical: Platform.OS == "ios" ? RFValue(12) : RFValue(6),
            marginBottom: RFValue(2),
          }}
        >
          <TouchableOpacity
            onPress={() => onOpen()}
            style={[
              Style.countryCodeText,
              {
                paddingBottom: 0,
                flexDirection: "row",
                alignItems: "center",
                marginRight: 0,
              },
            ]}
          >
            <Text
              style={{
                color: colors.Black,
                fontSize: RFValue(14),
              }}
            >
              {countryCodeValue === "" ? null : "+"}
              {countryCodeValue?.toString()?.includes("+")
                ? countryCodeValue.toString().split("+")[1]
                : countryCodeValue}
            </Text>
            {/* <CountryFlag
              isoCode={isoCode ? isoCode : ""}
              size={RFPercentage(1.8)}
            /> */}
            <MaterialIcons
              style={{ marginTop: RFValue(4) }}
              name="keyboard-arrow-down"
              size={RFPercentage(3)}
              color={colors.silver}
            />
          </TouchableOpacity>
        </View>
        <TextInput
          textAlign={I18nManager.isRTL ? "right" : "left"}
          style={[
            Style.InputTextField,
            {
              paddingHorizontal: RFValue(10),
              paddingVertical: Platform.OS == "ios" ? RFValue(8) : RFValue(5),
            },
          ]}
          placeholderTextColor={colors.LightGrey}
          secureTextEntry={secureTextEntry}
          autoCapitalize="none"
          onChangeText={(text) => {
            if (regex) {
              if (regex.test(text) || text === "") onChange(text);
              return;
            } else {
              onChange(text);
            }
          }}
          value={value}
          editable={editable}
          placeholder={placeholder}
          keyboardType={keyboardType}
        ></TextInput>
      </View>

      <Modal transparent={true} visible={Cmodal}>
        <View
          style={{
            height: "100%",
            width: "100%",
            alignItems: "center",
            justifyContent: "center",
            alignSelf: "center",
          }}
        >
          {countryCodesArr ? (
            <CountryPicker
              countryCode={async () => {
                return await getCountryCodeAsync();
              }}
              withFlag={true}
              visible={Cmodal}
              countryCodes={countryCodesArr}
              preferredCountries={countryCodesArr}
              onSelect={(Country) => {
                // console.log(Country);
                codelcik(Country);
                // onChange(Country.cca2);
              }}
              onClose={() => onClose()}
              withCallingCode={true}
              withCountryNameButton={true}
              withCurrencyButton={true}
              withFlagButton={true}
              withFilter={true}
              withModal={false}
              // excludeCountries={["AQ", "BV", "TF"]}
            />
          ) : (
            <CountryPicker
              countryCode={async () => {
                return await getCountryCodeAsync();
              }}
              withFlag={true}
              visible={Cmodal}
              onSelect={(Country) => {
                console.log(Country);
                codelcik(Country);
              }}
              onClose={() => onClose()}
              withCallingCode={true}
              withCountryNameButton={true}
              withCurrencyButton={true}
              withFlagButton={true}
              withFilter={true}
              withModal={false}
              excludeCountries={["AQ", "BV", "TF"]}
            />
          )}
        </View>
      </Modal>
    </View>
  );
};

export const TextFieldWithIcon = ({
  name,
  onChange,
  onClickIcon,
  value,
  placeholder = "",
  secureTextEntry = false,
  editable = true,
  onBlur = () => {},
  imageFlag,
  styles,
  backgroundColor,
}) => {
  var imagePath =
    imageFlag == 0
      ? require("../../assets/images/icn_hide.png")
      : imageFlag == 1
      ? require("../../assets/images/icn_view.png")
      : imageFlag == 2
      ? require("../../assets/images/icn_arrow_down.png")
      : require("../../assets/images/icn_Calendar.png");

  return (
    <View style={Style.TextfieldMainView2}>
      <View style={Style.TextfieldTitleView2}>
        <Text style={Style.TextfieldTitle2}>{name}</Text>
      </View>
      <View
        style={[
          Style.InputTextFieldView2,
          { backgroundColor: colors.silverLight },
          styles,
        ]}
      >
        <TextInput
          textAlign={I18nManager.isRTL ? "right" : "left"}
          style={[Style.InputTextField2, Style.InputTextFieldWithIcon2]}
          placeholderTextColor={colors.blacklight}
          secureTextEntry={secureTextEntry}
          autoCapitalize="none"
          onChangeText={(text) => onChange(text)}
          value={value}
          editable={editable}
          onBlur={() => onBlur()}
          placeholder={placeholder}
        ></TextInput>
        <TouchableOpacity onPress={() => onClickIcon()}>
          <Image source={imagePath} style={Style.TextFieldIcon} />
        </TouchableOpacity>
      </View>
    </View>
  );
};

export const TextFieldWithIcon2 = ({
  name,
  onChange,
  onClick,
  value,
  placeholder = "",
  secureTextEntry = false,
  editable = true,
  onBlur = () => {},
  cModal,
  onPress,
  styles = { justifyContent: "space-between", zIndex: 1 },
  backgroundColor,
  setCountry,
  setCity,
  cityData,
  modalData,
  showValue,
  setModalValue,
  iconName,
  renderItems,
  onSearch,
  countryCodesArr,
  rightIcon,
}) => {
  const [search, setSearch] = useState("");
  const [vehicleList, setVehicleList] = useState([]);
  useEffect(() => {
    if (onSearch) onSearch(search);
  }, [search]);

  const renderItem = ({ item }) => (
    <View style={{ borderBottomWidth: 1, borderBottomColor: "#B9B9B950" }}>
      <Text
        numberOfLines={1}
        onPress={() => {
          onClick();
          try {
            if (setCity) setCity(item);
          } catch {}
          try {
            if (setModalValue) setModalValue(item);
          } catch {}
        }}
        style={{
          paddingVertical: 15,
          fontSize: RFPercentage(2),
          fontFamily: Fonts.LexendSemiBold,
          color: colors.Black,
        }}
      >
        {item?.name ||
          showValue?.map((t, i) => (i >= 1 ? " - " : "") + item?.[t])}
      </Text>
    </View>
  );

  const filteredData =
    cityData ||
    modalData?.filter((item) =>
      JSON.stringify(item).toLowerCase().includes(search.toLowerCase())
    );

  const keyExtractor = (item, index) => {
    return `${name} ${index}`;
  };

  return (
    <View style={Style.TextfieldMainView2}>
      <View style={Style.TextfieldTitleView2}>
        <Text style={Style.TextfieldTitle2}>{name}</Text>
      </View>
      <Pressable
        onPress={onPress}
        style={[
          Style.InputTextFieldView2,
          { backgroundColor: backgroundColor },
          styles,
        ]}
      >
        <TextInput
          textAlign={I18nManager.isRTL ? "right" : "left"}
          style={[Style.InputTextField2, Style.InputTextFieldWithIcon2]}
          placeholderTextColor={colors.blacklight}
          secureTextEntry={secureTextEntry}
          autoCapitalize="none"
          onChangeText={(text) => onChange(text)}
          value={value}
          editable={editable}
          onBlur={() => onBlur()}
          placeholder={placeholder}
          selection={{ start: 0 }}
        ></TextInput>
        <MaterialIcons
          name={iconName ?? "keyboard-arrow-down"}
          size={RFValue(20)}
          color={colors.silver}
        />
      </Pressable>
      <Modal
        transparent={cityData || modalData ? false : true}
        visible={cModal}
      >
        <View
          style={{
            height: "100%",
            backgroundColor: colors.WhiteSmoke,
            flex: 1,
            padding: 10,
            width: "100%",
          }}
        >
          {cityData || modalData ? (
            <SafeAreaView>
              <HeaderWithRefreshOption
                Title={name}
                BackAction={onClick}
                onRefresh={() => {}}
              />

              {/* <View style={Style.listSearchComponentContainerView}>
                <ListSearchField
                  searchText={"Enter Text"}
                  onChangeSearchText={(text) => SearchAction(text)}
                  onClearSearchText={() => SearchAction("")}
                  //navigation={this.props.navigation}
                />
              </View> */}

              <FlatList
                showsVerticalScrollIndicator={false}
                data={filteredData}
                contentContainerStyle={{
                  paddingBottom: RFValue(100),
                }}
                renderItem={renderItems ? renderItems : renderItem}
                keyExtractor={keyExtractor}
                // PERF Optimization
                initialNumToRender={8}
                maxToRenderPerBatch={3}
                ListEmptyComponent={() => (
                  <View
                    style={{
                      justifyContent: "center",
                      alignItems: "center",
                      flex: 1,
                    }}
                  >
                    <Text style={{ textAlign: "center" }}>No Data</Text>
                  </View>
                )}
                // progressViewOffset={20}
              />
            </SafeAreaView>
          ) : (
            <CountryPicker
              countryCode={async () => {
                return await getCountryCodeAsync();
              }}
              withFlag={true}
              visible={cModal}
              countryCodes={countryCodesArr}
              preferredCountries={countryCodesArr}
              onSelect={(Country) => {
                console.log(Country);
                setCountry(Country);
                // codelcik(Country);
              }}
              onClose={onClick}
              withCallingCode={true}
              withCountryNameButton={true}
              withCurrencyButton={true}
              withFlagButton={true}
              withFilter={true}
              withModal={false}
              // excludeCountries={["AQ", "BV", "TF"]}
            />
          )}
        </View>
      </Modal>
    </View>
  );
};

// For carrier part theme
export const TextFieldWithIconCarrier = ({
  name,
  onChange,
  onClick,
  value,
  placeholder = "",
  secureTextEntry = false,
  editable = false,
  onBlur = () => {},
  cModal,
  onPress,
  styles = { justifyContent: "space-between", zIndex: 1 },
  backgroundColor,
  setCountry,
  setCity,
  cityData,
  modalData,
  showValue,
  setModalValue,
  iconName,

  onSearch,
  countryCodesArr,
  imageFlag = 2,
}) => {
  var imagePath =
    imageFlag == 0
      ? require("../../assets/images/icn_hide.png")
      : imageFlag == 1
      ? require("../../assets/images/icn_view.png")
      : imageFlag == 2
      ? require("../../assets/images/icn_arrow_down.png")
      : require("../../assets/images/icn_Calendar.png");

  const [search, setSearch] = useState("");
  useEffect(() => {
    if (onSearch) onSearch(search);
  }, [search]);

  const renderItem = ({ item }) => (
    <View style={{ borderBottomWidth: 1, borderBottomColor: "#B9B9B950" }}>
      <Text
        numberOfLines={1}
        onPress={() => {
          onClick();
          try {
            if (setCity) setCity(item);
          } catch {}
          try {
            if (setModalValue) setModalValue(item);
          } catch {}
        }}
        style={{
          paddingVertical: 15,
          fontSize: RFPercentage(2),
          fontFamily: Fonts.Regular,
          color: colors.Black,
        }}
      >
        {item?.name ||
          showValue?.map((t, i) => (i >= 1 ? " - " : "") + item?.[t])}
      </Text>
    </View>
  );

  const filteredData =
    cityData ||
    modalData?.filter((item) =>
      JSON.stringify(item).toLowerCase().includes(search.toLowerCase())
    );

  const keyExtractor = (item, index) => {
    return `${name} ${index}`;
  };
  return (
    <View style={Style.TextfieldMainView}>
      <View style={Style.TextfieldTitleView}>
        <Text style={Style.TextfieldTitle}>{name}</Text>
      </View>
      <View style={Style.DropdownFieldView}>
        <TextInput
          textAlign={I18nManager.isRTL ? "right" : "left"}
          style={[Style.InputTextField, Style.InputTextFieldWithIcon]}
          placeholderTextColor={colors.LightGrey}
          secureTextEntry={secureTextEntry}
          autoCapitalize="none"
          onChangeText={(text) => onChange(text)}
          value={value}
          editable={editable}
          onBlur={() => onBlur()}
          placeholder={placeholder}
        ></TextInput>
        <TouchableOpacity style={Style.DropdownImageView} onPress={onPress}>
          <Image source={imagePath} style={Style.TextFieldIcon} />
        </TouchableOpacity>
      </View>

      <Modal
        transparent={cityData || modalData ? false : true}
        visible={cModal}
      >
        <View
          style={{
            height: "100%",
            width: "100%",
            alignItems: "center",
            justifyContent: "center",
            alignSelf: "center",
          }}
        >
          {cityData || modalData ? (
            <SafeAreaView
              style={{
                flex: 1,
                backgroundColor: "#fff",
                padding: 10,
              }}
            >
              <View
                style={{
                  flexDirection: "row",
                  justifyContent: "space-between",
                  alignItems: "center",
                }}
              >
                <Entypo onPress={onClick} name="cross" size={RFPercentage(3)} />
                <TextInput
                  style={{
                    height: 40,
                    borderColor: "#ccc",
                    paddingHorizontal: 10,
                    width: "90%",
                    fontFamily: Fonts.Medium,
                  }}
                  onChangeText={(text) => setSearch(text)}
                  value={search}
                  placeholder={placeholder}
                />
              </View>
              <FlatList
                data={filteredData}
                renderItem={renderItem}
                keyExtractor={keyExtractor}
                // PERF Optimization
                initialNumToRender={8}
                maxToRenderPerBatch={3}
                // progressViewOffset={20}
              /> 
            </SafeAreaView>
          ) : (
            <CountryPicker
              countryCode={async () => {
                return await getCountryCodeAsync();
              }}
              withFlag={true}
              visible={cModal}
              countryCodes={countryCodesArr}
              preferredCountries={countryCodesArr}
              onSelect={(Country) => {
                console.log(Country);
                setCountry(Country);
                // codelcik(Country);
              }}
              onClose={onClick}
              withCallingCode={true}
              withCountryNameButton={true}
              withCurrencyButton={true}
              withFlagButton={true}
              withFilter={true}
              withModal={false}
              // excludeCountries={["AQ", "BV", "TF"]}
            />
          )}
        </View>
      </Modal>
    </View>
  );
};

export const TextFieldForDatePicker = ({
  name,
  onClick,
  value,
  placeholder = "",
}) => {
  return (
    <View style={Style.TextfieldMainView}>
      <View style={Style.TextfieldTitleView}>
        <Text style={Style.TextfieldTitle}>{name}</Text>
      </View>
      <TouchableOpacity
        style={Style.DropdownFieldView}
        onPress={() => onClick()}
      >
        <TextInput
          textAlign={I18nManager.isRTL ? "right" : "left"}
          style={[Style.InputTextField, Style.InputTextFieldWithIcon]}
          placeholderTextColor={colors.LightGrey}
          autoCapitalize="none"
          value={value}
          editable={false}
          placeholder={placeholder}
        ></TextInput>
        <View style={Style.DropdownImageView}>
          <Image
            source={require("../../assets/images/icn_Calendar.png")}
            style={Style.TextFieldIcon}
          />
        </View>
      </TouchableOpacity>
    </View>
  );
};
