import React from "react";
import { Image, Text, TouchableOpacity, View } from "react-native";

import StringsOfLanguages from "../../Localization/stringsoflanguages";
import * as colors from "../colors";
import { Style } from "../Style";
import DocumentImageContainer from "../Component/DocumentImageContainer";
import IMAGES from "../Image";

export const renderAttachmentItem = (fileName) => (
  <DocumentImageContainer data={fileName} />
);

const FileUploadField = ({
  name,
  onClickIcon,
  value,
  onViewDocument = () => {},
}) => {
  return (
    <View style={Style.TextfieldMainView}>
      <View style={[Style.TextfieldTitleView, { flexDirection: "row" }]}>
        <Text style={Style.TextfieldTitle}>{name}</Text>
      </View>
      <TouchableOpacity
        onPress={() => (!!value ? onViewDocument() : onClickIcon())}
      >
        {!value ? (
          <Image
            source={IMAGES.addDoc}
            style={Style.documentDataImage}
            resizeMode="center"
          />
        ) : (
          renderAttachmentItem(value)
        )}
      </TouchableOpacity>
      {!!value && (
        <View style={{ marginTop: 10, flexDirection: "row" }}>
          <TouchableOpacity onPress={() => onClickIcon()}>
            <Text style={Style.linkSmallFont}>
              {StringsOfLanguages.UpdateImage}
            </Text>
          </TouchableOpacity>
        </View>
      )}
    </View>
  );
};

export default FileUploadField;
