import React from "react";
import {
  View,
  Text,
  TouchableOpacity,
  Image,
  Dimensions,
  Modal,
  ActivityIndicator,
} from "react-native";
import { RFPercentage, RFValue } from "react-native-responsive-fontsize";
import { Style } from "../Style";
import StringsOfLanguages from "../../Localization/stringsoflanguages";
import * as colors from "../../common/colors";
const { width, height } = Dimensions.get("window");

const ListItemMoreOptions = ({
  isVisible,
  OnFetchDetails,
  onUpdate,
  onDelete,
  onClose,
  onView,
  appliedForTransport,
  data,
}) => {
  return (
    <Modal animationType={"none"} transparent={true} visible={isVisible}>
      <View style={Style.Modal}>
        <View style={Style.ModelViewContainer}>
          {data.loader ? (
            <ActivityIndicator color={colors.LimeGreen} size={"large"} />
          ) : (
            <>
              <View style={{ flexDirection: "row" }}>
                <Text
                  style={[
                    Style.FontSemiBold_18,
                    { flex: 1, textAlign: "left" },
                  ]}
                >
                  {StringsOfLanguages.More}
                </Text>
                <TouchableOpacity
                  onPress={() => onClose()}
                  style={{ justifyContent: "center" }}
                >
                  <Image
                    style={Style.TextFieldIcon}
                    source={require("../../assets/images/icn_close.png")}
                  />
                </TouchableOpacity>
              </View>
              <View style={{ marginVertical: RFValue(10) }}>
                <TouchableOpacity
                  style={{ flexDirection: "row", marginVertical: RFValue(10) }}
                  onPress={() => OnFetchDetails()}
                >
                  <View style={Style.iconBackground}>
                    <Image
                      style={[Style.MenuFlatListImg2]}
                      source={require("../../assets/images/icn_Details.png")}
                    />
                  </View>

                  <Text style={Style.FontRegular_15}>
                    {StringsOfLanguages.Details}
                  </Text>
                </TouchableOpacity>
                {data.data.length == 0 && (
                  <TouchableOpacity
                    style={{
                      flexDirection: "row",
                      marginVertical: RFValue(10),
                    }}
                    onPress={() => onUpdate(1)}
                  >
                    <View style={Style.iconBackground}>
                      <Image
                        style={[Style.MenuFlatListImg2]}
                        source={require("../../assets/images/icn_add.png")}
                      />
                    </View>

                    <Text style={Style.FontRegular_15}>
                      {StringsOfLanguages.CreateApplication}
                    </Text>
                  </TouchableOpacity>
                )}
                {data?.data.length > 0 && (
                  <TouchableOpacity
                    style={{
                      flexDirection: "row",
                      marginVertical: RFValue(10),
                    }}
                    onPress={() => onView()}
                  >
                    <Image
                      style={[Style.MenuFlatListImg, { alignSelf: "center" }]}
                      source={require("../../assets/images/icn_view.png")}
                    />
                    <Text style={Style.FontRegular_15}>
                      {StringsOfLanguages.ViewApplication}
                    </Text>
                  </TouchableOpacity>
                )}
                {data?.data.length > 0 && (
                  <TouchableOpacity
                    style={{
                      flexDirection: "row",
                      marginVertical: RFValue(10),
                    }}
                    onPress={() => onUpdate(2)}
                  >
                    <Image
                      style={[Style.MenuFlatListImg, { alignSelf: "center" }]}
                      source={require("../../assets/images/icn_Edit_crcl.png")}
                    />
                    <Text style={Style.FontRegular_15}>
                      {StringsOfLanguages.UpdateApplication}
                    </Text>
                  </TouchableOpacity>
                )}
                {data.data.length > 0 && (
                  <TouchableOpacity
                    style={{
                      flexDirection: "row",
                      marginVertical: RFValue(10),
                    }}
                    onPress={() => onDelete()}
                  >
                    <Image
                      style={[Style.MenuFlatListImg, { alignSelf: "center" }]}
                      source={require("../../assets/images/icn_Remove.png")}
                    />
                    <Text style={Style.FontRegular_15}>
                      {StringsOfLanguages.RemoveApplication}
                    </Text>
                  </TouchableOpacity>
                )}
              </View>
            </>
          )}
        </View>
      </View>
    </Modal>
  );
};

export default ListItemMoreOptions;
