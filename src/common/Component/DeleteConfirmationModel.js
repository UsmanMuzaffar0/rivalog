import React from "react";
import {
  View,
  Text,
  TouchableOpacity,
  Image,
  Dimensions,
  Modal,
} from "react-native";
import * as colors from "../../common/colors";
import * as Fonts from "../../common/fonts";
import { RFPercentage, RFValue } from "react-native-responsive-fontsize";
import { Style } from "../Style";
import StringsOfLanguages from "../../Localization/stringsoflanguages";
const { width, height } = Dimensions.get("window");

const DeleteConfirmationModel = ({ isVisible, onDelete, onCancel }) => {
  return (
    <Modal animationType={"none"} transparent={true} visible={isVisible}>
      <View style={Style.Modal}>
        <View style={Style.ModelViewContainer}>
          <TouchableOpacity
            onPress={() => {
              onCancel();
            }}
            activeOpacity={1}
            style={{
              flexDirection: "row",
              justifyContent: "center",
              marginTop: RFValue(-30),
            }}
          >
            <Image
              style={Style.CompanyTypeImg}
              source={require("../../assets/images/icn_delete_2.png")}
            />
          </TouchableOpacity>
          <View style={{ marginTop: RFValue(15) }}>
            <Text style={[Style.FontSemiBold_18, { textAlign: "center" }]}>
              {StringsOfLanguages.DeleteAlertTitle}
            </Text>
            <Text style={Style.FontRegular_12}>
              {StringsOfLanguages.DeleteAlertMessage}
            </Text>
            <Text style={Style.FontRegular_12}>
              {StringsOfLanguages.DeleteAlertNote}
            </Text>
          </View>
          <View style={{ marginVertical: RFValue(5), flexDirection: "row" }}>
            <View
              style={[
                Style.SignInbtnView,
                { flex: 1, paddingHorizontal: RFValue(10) },
              ]}
            >
              <TouchableOpacity
                onPress={() => {
                  onCancel();
                }}
                activeOpacity={1}
                style={[
                  Style.button,
                  {
                    backgroundColor: "transparent",
                    borderWidth: 1,
                    borderColor: colors.Green,
                  },
                ]}
              >
                <Text
                  style={[
                    Style.signinBtnTxt,
                    { color: colors.Black, fontFamily: Fonts.LexendSemiBold },
                  ]}
                >
                  {StringsOfLanguages.Cancel}
                </Text>
              </TouchableOpacity>
            </View>
            <View style={[Style.SignInbtnView, { flex: 1 }]}>
              <TouchableOpacity
                onPress={() => {
                  onDelete();
                }}
                activeOpacity={1}
                style={[Style.button, { backgroundColor: "#fe0102" }]}
              >
                <Text
                  style={[
                    Style.signinBtnTxt,
                    { color: colors.White, fontFamily: Fonts.LexendSemiBold },
                  ]}
                >
                  {StringsOfLanguages.Delete}
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </View>
    </Modal>
  );
};

export default DeleteConfirmationModel;
