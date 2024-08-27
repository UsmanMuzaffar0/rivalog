import React from 'react';
import { View, Text, Image, Dimensions } from 'react-native'
import { RFPercentage, RFValue } from 'react-native-responsive-fontsize';
import * as colors from '../colors'
import * as Fonts from '../fonts'
const { height, width } = Dimensions.get("window");

export const ErrorView = ({ title }) => {
    return (
        <View
            style={{
                width: width - 20,
                flexDirection: 'row',
                alignSelf: "center",
                marginTop: RFValue(8),
                marginBottom: RFValue(15),
                backgroundColor: colors.TransparentRed,
                borderRadius: RFPercentage(1)

            }}
        >
            <View style={{ flexDirection: 'row', backgroundColor: colors.LightRed, width: RFPercentage(1.5), borderTopLeftRadius: RFPercentage(1), borderBottomLeftRadius: RFPercentage(1) }}></View>
            <View style={{ paddingVertical: RFPercentage(4), flexDirection: 'row', width: '90%', paddingHorizontal: RFPercentage(2), alignItems: 'center' }}>
                <Image source={require('../../assets/images/icn_error.png')} style={{ height: RFPercentage(5), width: RFPercentage(5), resizeMode: 'contain', marginRight: RFPercentage(2) }} />
                <Text style={{ flex: 1, flexWrap: 'wrap', fontFamily: Fonts.Medium, fontSize: RFValue(14) }}>{title}</Text>
            </View>


        </View>
    )
}

