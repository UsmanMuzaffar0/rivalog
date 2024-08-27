//import liraries
import React, { useState } from "react";
import { View, Text, StyleSheet, TouchableOpacity } from "react-native";
import Modal from "react-native-modal";

import { RFValue } from "react-native-responsive-fontsize";
import WebView from "react-native-webview";

const VideoView = ({ value, videoUrl }) => {
  const [isModalVisible, setModalVisible] = useState(false);
  return (
    <>
      <TouchableOpacity
        onPress={() => setModalVisible(true)}
        style={{
          borderBottomWidth: 0.5,
        }}
      >
        <Text style={{ padding: RFValue(15) }}>{value}</Text>
      </TouchableOpacity>

      <Modal
        visible={isModalVisible}
        transparent={true}
        style={{ margin: 0 }}
        onBackButtonPress={() => setModalVisible(false)}
      >
        <View
          style={{
            backgroundColor: "#f1f1f1",
            width: "80%",
            height: "50%",
            alignSelf: "center",
            borderRadius: RFValue(20),
          }}
        >
          <TouchableOpacity
            style={{
              alignSelf: "flex-end",
              marginHorizontal: RFValue(20),
              marginTop: RFValue(10),
            }}
            onPress={() => setModalVisible(false)}
          >
            <Text>Close</Text>
          </TouchableOpacity>
          <View
            style={{
              width: "90%",
              height: "85%",
              alignSelf: "center",
              marginVertical: RFValue(10),
            }}
          >
            <WebView source={{ uri: videoUrl }} />
          </View>
        </View>
      </Modal>
    </>
  );
};
const styles = StyleSheet.create({});
export default VideoView;
