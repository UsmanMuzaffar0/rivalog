import React from "react";
import { StyleSheet, Image } from "react-native";

import IMAGES from "../../common/Image";

const DocumentImageContainer = ({ data }) => {
  const dataType = data.split(".")[1];
  switch (dataType) {
    case "png":
      return (
        <Image
          source={IMAGES.iconImage}
          style={styles.documentDataImage}
          resizeMode={"contain"}
        />
      );
    case "pdf":
      return (
        <Image
          source={IMAGES.pdfIcon}
          style={styles.documentDataImage}
          resizeMode={"contain"}
        />
      );
    case "jpeg":
    case "jpg":
      return (
        <Image
          source={IMAGES.iconImage}
          style={styles.documentDataImage}
          resizeMode={"contain"}
        />
      );
    default:
      return (
        <Image
          source={IMAGES.attachmentIcon}
          style={styles.documentDataImage}
          resizeMode={"contain"}
        />
      );
  }
};

const styles = StyleSheet.create({
  documentDataImage: {
    width: 50,
    height: 60,
  },
});

export default DocumentImageContainer;
