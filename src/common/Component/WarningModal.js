import React from 'react';
import { View, Text, TouchableOpacity, Image, Dimensions, Modal } from 'react-native'
import * as colors from '../../common/colors'
import * as Fonts from '../../common/fonts'
import { RFPercentage, RFValue } from 'react-native-responsive-fontsize';
import { Style } from '../Style'
import StringsOfLanguages from '../../Localization/stringsoflanguages'
const { width, height } = Dimensions.get('window')


const WarningModal = ({ isVisible, onContinue, onCancel }) => {
  return (
    <Modal
      animationType={'none'} transparent={true}
      visible={isVisible}>
      <View style={Style.Modal}>
        <View style={Style.ModelViewContainer}>
          <View style={{ flexDirection: 'row', justifyContent: 'center' }}>
            <Image style={Style.CompanyTypeImg} source={require('../../assets/images/icn_warning.png')} />
          </View>
          <View style={{ marginTop: RFValue(15) }}>
            <Text style={{ color: colors.Black, fontFamily: Fonts.SemiBold, textAlign: 'center' }}>{StringsOfLanguages.AddTransportWarning}</Text>
          </View>
          <View style={{ marginVertical: RFValue(5), flexDirection: 'row' }}>
            <View style={[Style.SignInbtnView, { flex: 1, paddingHorizontal: RFValue(10) }]}>
              <TouchableOpacity
                onPress={() => { onContinue() }}
                activeOpacity={1}

                style={[Style.signInBtn, { backgroundColor: colors.LightGreen }]}>

                <Text style={[Style.signinBtnTxt, { color: colors.White }]}>{StringsOfLanguages.Continue}</Text>
              </TouchableOpacity>
            </View>
            <View style={[Style.SignInbtnView, { flex: 1, paddingHorizontal: RFValue(10) }]}>
              <TouchableOpacity
                onPress={() => { onCancel() }}
                activeOpacity={1}

                style={[Style.signInBtn, { backgroundColor: colors.LightRed }]}>

                <Text style={[Style.signinBtnTxt, { color: colors.White }]}>{StringsOfLanguages.Cancel}</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </View>
    </Modal>
  )
}

export default WarningModal
