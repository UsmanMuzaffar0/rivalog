import React, { useState } from 'react';
import {
    View,
    SafeAreaView,
    Text,
    TouchableOpacity,
    Image,
    Dimensions,
    Modal,
} from 'react-native'
import stringsoflanguages from '../../Localization/stringsoflanguages';
import { Style } from '../Style';
const { width, height } = Dimensions.get('window')


export const ImageUploadOption = ({ ImagePickerDialogVisible, onCameraOpen, onchooseImg, onclose }) => {

    return (
        <Modal
            transparent={true}
            animationType='fade'
            visible={ImagePickerDialogVisible}>
            <SafeAreaView style={{ backgroundColor: '#0000008a', flex: 1 }}>
                <TouchableOpacity
                    style={{ height: '100%', width: '100%', flex: 1 }}
                    onPress={() => onclose()}
                />
                <View
                    style={{
                        position: 'absolute',
                        bottom: 0,
                        backgroundColor: 'white',
                        width: '100%',
                        borderTopRightRadius: 15,
                        borderTopLeftRadius: 15,
                    }}>
                    <View
                        style={{
                            borderBottomWidth: 0.5,
                            padding: 15,
                            borderBottomColor: 'lightgrey',
                            flexDirection: 'row',
                            justifyContent: 'center',
                        }}>
                        <Text style={[Style.NameTxt, { textAlign: 'center' }]}>{stringsoflanguages.UploadVia}</Text>
                        <TouchableOpacity
                            onPress={() => onclose()}
                            style={{
                                position: 'absolute',
                                alignSelf: 'center',
                                right: 15,
                            }}>
                            <Image
                                source={require('../../assets/images/icn_close.png')}
                                style={{
                                    height: 15,
                                    width: 15,
                                }}
                            />
                        </TouchableOpacity>
                    </View>

                    <View style={{ padding: 20, paddingBottom: 40 }}>
                        <View
                            style={{
                                alignItems: 'flex-start',
                                paddingVertical: 10,
                            }}>
                            <TouchableOpacity style={{ flexDirection: 'row' }}
                                onPress={() => onCameraOpen()}
                            >
                                <Image
                                    style={[Style.MenuFlatListImg, { tintColor: 'black' }]}
                                    source={require("../../assets/images/icn_camera.png")}
                                />
                                <Text style={Style.MenuListItemTxt}>
                                    {stringsoflanguages.Camera}
                                </Text>
                            </TouchableOpacity>
                        </View>
                        <View
                            style={{
                                alignItems: 'flex-start',
                                paddingVertical: 10,
                            }}>
                            <TouchableOpacity style={{ flexDirection: 'row' }} onPress={() => onchooseImg()}>
                                <Image
                                    style={[Style.MenuFlatListImg, { tintColor: 'black' }]}
                                    source={require("../../assets/images/icn_gallery.png")}
                                />
                                <Text style={Style.MenuListItemTxt}>
                                    {stringsoflanguages.Gallery}
                                </Text>
                            </TouchableOpacity>
                        </View>
                    </View>
                </View>
            </SafeAreaView>
        </Modal>
    )
}


// export default ModalSelector