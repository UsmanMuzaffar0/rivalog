import React from 'react';
import { Text, View, TouchableOpacity, Image, Dimensions } from 'react-native';
import * as COLORS from "../colors"
import * as FONTS from "../fonts"
import { RFPercentage, RFValue } from 'react-native-responsive-fontsize';

const width = Dimensions.get("window").width
const height = Dimensions.get("window").height

export const CustomAlert = ({
  image = false,
  titleColor = COLORS.Blue,
  messageColor = COLORS.Black,
  title = '',
  message = "",
  buttonText = '',
  ButtonClick = () => {},
}) => {
  return (
    <View
      style={{
        alignItems: 'center',
        justifyContent: 'center',
        width: width,
        height: height,
        position: 'absolute',
        // bottom:RFPercentage(0.000000001),
        backgroundColor: COLORS.TransperantBlack,
        marginTop: RFPercentage(-15)
      }}
    >
      <View
        style={{
          backgroundColor: COLORS.White,
          width: width - (width * 53) / 375,
          alignSelf: 'center',
          justifyContent: 'center',
          borderRadius: 14,
          paddingVertical: (height * 24) / 812,
        }}
      >
        <View
          style={{
            flexDirection: 'column',
            justifyContent: 'center',
            paddingHorizontal: (width * 12.5) / 375,
          }}
        >
          {title ? (
            <Text
              style={{
                fontSize: RFValue(20, height),
                lineHeight: 30,
                textAlign: 'center',
                fontFamily: FONTS.Bold,
                color: titleColor ? titleColor : COLORS.BlueHaze,
              }}
            >
              {title}
            </Text>
          ) : null}
          
          <Text
            style={{
              marginTop: title
                ? (height * 15) / height
                : (height * 2) / height,
              fontSize: title ? RFValue(16, height) : RFValue(16, height),
              lineHeight: title ? 33 : title ? 16 : 22,
              fontFamily: title ? FONTS.Medium : FONTS.Bold,
              color: messageColor,
              textAlign: 'center',
            }}
          >
            {message}
          </Text>
        </View>
        <View
          style={{
            height: (height * 43.5) / 812,
            flexDirection: 'row',
            justifyContent: 'center',
            marginTop: (height * 18) / 812,
            marginHorizontal: (width * 24) / 375,
          }}
        >
          <TouchableOpacity
            onPress={ButtonClick}
            style={{
              borderRadius: 12,
              borderColor: COLORS.Blue,
              borderWidth: 1,
              backgroundColor: COLORS.Blue,
              width: '75%',
              justifyContent: 'center',
            }}
          >
            <Text
              style={{
                fontSize: RFValue(17, 812),
                lineHeight: 22,
                fontFamily: FONTS.Light,
                fontWeight: '700',
                color: COLORS.White,
                textAlign: 'center',
              }}
            >
              {buttonText}
            </Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
};
