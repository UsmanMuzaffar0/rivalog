import React from "react";
import {
  View,
  Text,
  TouchableOpacity,
  Image,
  Dimensions,
  Modal,
  Pressable,
} from "react-native";
import * as colors from "../../common/colors";
import * as Fonts from "../../common/fonts";
import { RFPercentage, RFValue } from "react-native-responsive-fontsize";
import { Style } from "../Style";
import StringsOfLanguages from "../../Localization/stringsoflanguages";
const { width, height } = Dimensions.get("window");

const ListItemMoreOptions = ({
  isVisible,
  OnFetchDetails,
  onUpdate,
  onDelete,
  onClose,
  onSetPrimary,
  OnActiveDeactive,
  activedeactiveStatus,
  showDetailsOption = true,
  showUpdateOption = true,
  showDeleteOption = true,
  showActiveDeactiveOption,
  showPrimaryOption,
  activeOrdeactive,
  carrierOperator,
}) => {
  console.log("ListItemMoreOptions", showUpdateOption, carrierOperator);
  return (
    <Modal animationType={"none"} transparent={true} visible={isVisible}>
      <Pressable onPress={() => onClose()} style={Style.Modal}>
        <View style={Style.ModelViewContainer}>
          <View
            style={{
              alignSelf: "center",
              height: RFValue(5),
              width: "30%",
              backgroundColor: colors.LightGrey,
              borderRadius: RFValue(10),
            }}
          />
          <View
            style={{
              flexDirection: "row",
              marginTop: RFValue(10),
            }}
          >
            <Text
              style={[
                Style.FontSemiBold_18,
                { flex: 1, textAlign: "left", color: colors.Black },
              ]}
            >
              {StringsOfLanguages.More}
            </Text>
            {/* <TouchableOpacity
              onPress={() => onClose()}
              style={{ justifyContent: "center" }}
            >
              <Image
                style={Style.TextFieldIcon}
                source={require("../../assets/images/icn_close.png")}
              />
            </TouchableOpacity> */}
          </View>
          <View style={{ marginVertical: RFValue(10) }}>
            {showActiveDeactiveOption && carrierOperator ? (
              <TouchableOpacity
                style={{ flexDirection: "row", marginVertical: RFValue(10) }}
                onPress={() => OnActiveDeactive()}
              >
                <Image
                  style={[Style.MenuFlatListImg, { alignSelf: "center" }]}
                  source={
                    activedeactiveStatus == "Y"
                      ? require("../../assets/images/icn_deactive.png")
                      : require("../../assets/images/icn_active.png")
                  }
                />
                <Text style={[Style.FontRegular_15, { color: colors.Black }]}>
                  {activeOrdeactive}
                </Text>
              </TouchableOpacity>
            ) : null}
            {showPrimaryOption ? (
              <TouchableOpacity
                style={{ flexDirection: "row", marginVertical: RFValue(5) }}
                onPress={() => onSetPrimary()}
              >
                <View style={Style.iconBackground}>
                  <Image
                    style={{ width: RFValue(12), height: RFValue(12) }}
                    source={require("../../assets/images/GreenStar.png")}
                  />
                </View>

                <Text style={[Style.FontRegular_15, { color: colors.Black }]}>
                  {StringsOfLanguages.Primary}
                </Text>
              </TouchableOpacity>
            ) : null}
            {showDetailsOption ? (
              <TouchableOpacity
                style={{ flexDirection: "row", marginVertical: RFValue(5) }}
                onPress={() => OnFetchDetails()}
              >
                <View style={Style.iconBackground}>
                  <Image
                    style={[Style.iconStyle]}
                    source={require("../../assets/images/icn_Details.png")}
                  />
                </View>
                <Text style={[Style.FontRegular_15, { color: colors.Black }]}>
                  {StringsOfLanguages.Details}
                </Text>
              </TouchableOpacity>
            ) : null}
            {showUpdateOption || carrierOperator ? (
              <TouchableOpacity
                style={{ flexDirection: "row", marginVertical: RFValue(10) }}
                onPress={() => onUpdate()}
              >
                <View style={Style.iconBackground}>
                  <Image
                    style={[Style.iconStyle]}
                    source={require("../../assets/images/icn_Edit_crcl.png")}
                  />
                </View>
                <Text style={[Style.FontRegular_15]}>
                  {StringsOfLanguages.Update}
                </Text>
              </TouchableOpacity>
            ) : null}
            {showUpdateOption || carrierOperator ? (
              <TouchableOpacity
                style={{ flexDirection: "row", marginVertical: RFValue(5) }}
                onPress={() => onDelete()}
              >
                <View style={Style.iconBackground}>
                  <Image
                    style={{ width: 8, height: 8 }}
                    source={require("../../assets/images/icn_Remove.png")}
                  />
                </View>
                <Text style={[Style.FontRegular_15, { color: colors.Black }]}>
                  {StringsOfLanguages.Delete}
                </Text>
              </TouchableOpacity>
            ) : null}
          </View>
        </View>
      </Pressable>
    </Modal>
  );
};

export default ListItemMoreOptions;
