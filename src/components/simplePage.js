import {
  StyleSheet,
  Text,
  View,
  SafeAreaView,
  StatusBar,
  Pressable,
  Image,
  FlatList,
  Modal,
} from "react-native";
import React, { useEffect, useState } from "react";
import { HeaderWithNotification } from "../../../../common/Component/Header";
import { Style } from "../../../../common/Style";
import * as colors from "../../../../common/colors";
import * as Fonts from "../../../../common/fonts";
import { RFPercentage, RFValue } from "react-native-responsive-fontsize";

import {
  TextField2,
  TextFieldWithIcon2,
} from "../../../../common/Component/TextField";
import Button from "../../../../common/Component/Button";
import { useDispatch, useSelector } from "react-redux";
import { MobileAction } from "../../../../Redux/actions";
import Api from "../../../../common/Api";
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";
import { DividerV, GapV } from "../../../../common/Component/gap";
import {
  TextSmall,
  TextMed,
  TextMuted,
  TextLarge,
} from "../../../../common/Component/Text";
import NetChecker2 from "../../../../common/Component/Network";
import Loader from "../../../../common/Component/Loader";
import { showFailure, showSucces } from "../../../../common/Utils/flashMessage";

export default function SimplePage(props) {
  const title = props?.route?.params?.title;
  const [loading, setLoading] = useState(false);

  const dispatch = useDispatch();

  return (
    <SafeAreaView style={Style.mainView}>
      <StatusBar
        animated={false}
        backgroundColor={colors.WhiteSmoke}
        barStyle={"dark-content"}
      />
      <HeaderWithNotification
        Title={title}
        BackAction={props.navigation.openDrawer}
        back
      />
      <KeyboardAwareScrollView showsVerticalScrollIndicator={false}>
        <View style={styles.container}></View>
      </KeyboardAwareScrollView>
      <Loader visible={loading} />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    marginTop: RFValue(10),
    paddingHorizontal: RFValue(20),
  },
});
