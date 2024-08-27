import {  NativeModules, Platform } from 'react-native'
let DeviceLanguageCode
const DeviceLanguage = async () => {
    if (Platform.OS == 'ios') {
        DeviceLanguageCode =  await NativeModules.SettingsManager.settings.AppleLocale ||
            NativeModules.SettingsManager.settings.AppleLanguages[0]
    }
    else {
        DeviceLanguageCode = await NativeModules.I18nManager.localeIdentifier
    }
    return DeviceLanguageCode.split('_')[0]
}

export default DeviceLanguage