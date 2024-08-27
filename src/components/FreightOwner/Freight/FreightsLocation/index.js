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
import {
  GetFreightLocationsAction,
  MobileAction,
} from "../../../../Redux/actions";
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
import MapMarkerView from "../../../../common/Component/MapMarkerView";
import MarkerViewInfo from "./MarkerInfoView";

let pageIndex = 0;
let pageCount = 1000;
export default function FreightLocations(props) {
  const title = props?.route?.params?.title;
  const [loading, setLoading] = useState(false);
  const [infoModalVisible, setInfoModalVisible] = useState(false);
  const [selectedMarker, setSelectedMarker] = useState(null);
  const dispatch = useDispatch();
  const {
    data: markersData,
    loader: markerLoader,
    GetFreightLocationSuccess,
  } = useSelector((state) => state.GetFreightLocations);

  useEffect(() => {
    dispatch(GetFreightLocationsAction(pageIndex, pageCount));
    const intervalId = setInterval(() => {
      dispatch(GetFreightLocationsAction(pageIndex, pageCount));
    }, 60000);
    return () => {
      clearInterval(intervalId);
    };
  }, []);

  // console.log("markersData", markersData);

  const showModal = () => setInfoModalVisible(true);
  const hideModal = () => {
    setSelectedMarker(null);
    setInfoModalVisible(false);
  };

  const handleMarker = (item, i) => {
    console.log(item);
    setSelectedMarker(item);
    showModal();
  };

  return (
    <View style={Style.mainView}>
      <StatusBar
        animated={false}
        backgroundColor={colors.WhiteSmoke}
        barStyle={"dark-content"}
      />
      <HeaderWithNotification
        Title={title}
        BackAction={props.navigation.openDrawer}
        onlyNavButton
      />
      {/* Should Implement action/reducer with "interval" directly into Marker component for performance */}
      {GetFreightLocationSuccess ? (
        <MapMarkerView
          markersList={
            markersData?.[1] === 200
              ? markersData?.[0]?.filter(
                  (item) => item?.latitude !== null && item?.longitude !== null
                )
              : []
          }
          onPressMarker={handleMarker}
        />
      ) : null}

      <MarkerViewInfo
        isVisible={infoModalVisible}
        hideModal={hideModal}
        marker={selectedMarker}
      />
      <Loader visible={markerLoader} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});
