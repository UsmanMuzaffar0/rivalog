import { DefaultTheme } from "react-native-paper";
import { RFValue } from "react-native-responsive-fontsize";

export const White = "#FFFFFF";
export const Grey = "#9E9E9E";
export const BlueHaze = "#CBCFE1";
export const Black = "#202020";
export const Blue = "#2F80ED";
export const LightBlue = "#E7F3FF"; //# D5E6FB
export const primaryGreen = "#34B267";
export const GreenAccent = "#EBFDF4";
export const Red = "#FF0000";
export const WhiteSmoke = "#f4f4f4";

export const paperLightTheme = {
  ...DefaultTheme,
  dark: false,
  roundness: RFValue(5),
  mode: "exact",
  colors: {
    ...DefaultTheme.colors,
    primary: primaryGreen,
    accent: GreenAccent,
    background: WhiteSmoke,
    surface: White,
    error: Red,
    text: Black,
    onSurface: Black,
    disabled: Grey,
    placeholder: Grey,
  },
  // fonts: configureFonts(),
  animation: {
    scale: 2.0,
  },
};
