//import liraries
import React, { Component } from "react";
import { View, Text, StyleSheet } from "react-native";
import { RFValue } from "react-native-responsive-fontsize";
import { SafeAreaView } from "react-native-safe-area-context";
import { Header2 } from "../../../common/Component/Header";
import VideoView from "../../../common/Component/VideoView";

// create a component
const Help = ({ navigation }) => {
  return (
    <SafeAreaView style={{ marginHorizontal: RFValue(20) }}>
      <View style={styles.container}>
        <Header2
          Title={""}
          BackButton={true}
          BackAction={() => {
            navigation.goBack();
          }}
        />

        <Text style={styles.text}>How to Videos</Text>
      </View>
      <VideoView
        value={"How to use Rivalog"}
        videoUrl={"https://www.youtube.com/embed/erPHIIshw7Y"}
      />
      <VideoView
        value={"How to view Freight posts"}
        videoUrl={"https://www.youtube.com/watch?v=Lh2Z4tULaLc"}
      />
      <VideoView
        value={"How to create transpoter"}
        videoUrl={"https://www.youtube.com/watch?v=dkpNv39MeEc"}
      />
      <VideoView
        value={"How to apply transport"}
        videoUrl={"https://www.youtube.com/watch?v=4pvRdBs9MiI"}
      />
      <VideoView
        value={"How to trace transporters on map"}
        videoUrl={"https://www.youtube.com/watch?v=2qbooEiekes"}
      />
    </SafeAreaView>
  );
};

// define your styles
const styles = StyleSheet.create({
  container: {
    backgroundColor: "#f1f1f1",
    marginTop: RFValue(10),
    paddingBottom: RFValue(10),
    borderTopRightRadius: RFValue(10),
    borderTopLeftRadius: RFValue(10),
  },
  text: {
    fontWeight: "bold",
    textAlign: "center",
    fontSize: RFValue(14),
  },
});

//make this component available to the app
export default Help;
