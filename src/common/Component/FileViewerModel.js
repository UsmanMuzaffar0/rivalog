import React from 'react';
import { View, 
    SafeAreaView, 
    Modal,
    Dimensions,
    TouchableOpacity,
    Image
} from 'react-native'
import * as colors from '../../common/colors'

import { RFPercentage, RFValue } from 'react-native-responsive-fontsize';
import { WebView } from 'react-native-webview';
const { width, height } = Dimensions.get('window')

export const FileViewerModel = ({fileName, url, isVisible, onclose}) => {
    return(
        <Modal
        transparent={true}
        animationType='slide'
        visible={isVisible}>
            <SafeAreaView style={{ backgroundColor: 'white', flex: 1 }}>
                <View style={{flexDirection: 'row' ,padding: RFPercentage(1), borderBottomColor: colors.Grey, borderBottomWidth: 0.5}}>
                    <View style={{flex: 1}} />
                    <TouchableOpacity onPress={() => onclose()}>
                        <Image style={{ height: RFPercentage(3), width: RFPercentage(3), resizeMode: 'contain' }} source={require('../../assets/images/icn_close.png')} />
                    </TouchableOpacity>
                </View>
            {
                fileName != '' && fileName.includes(".pdf") ?
                (
                    <WebView
                        source={{uri: 'http://docs.google.com/gview?embedded=true&url=' + url}}
                        startInLoadingState={true}
                    />
                ) :
                (
                    <WebView 
                        source={{uri: url}}
                        startInLoadingState={true}
                    />
                )
            }
            </SafeAreaView>
        </Modal>
    )
} 