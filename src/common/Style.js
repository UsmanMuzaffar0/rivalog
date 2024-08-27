import { I18nManager, Dimensions, Platform } from "react-native";

import { StyleSheet } from "react-native";
import * as colors from "./colors";
import * as Fonts from "./fonts";
import { RFPercentage, RFValue } from "react-native-responsive-fontsize";
import { color } from "react-native-elements/dist/helpers";
import { Colors } from "react-native/Libraries/NewAppScreen";
export const { width, height } = Dimensions.get("window");

export const Style = StyleSheet.create({
  //#region (Splash Styles)
  SplashScreenView: {
    flex: 1,
    backgroundColor: colors.White,
    alignItems: "center",
    justifyContent: "center",
  },
  SplashScreenTitle: {
    color: colors.Blue,
    fontFamily: Fonts.Bold,
    fontSize: RFValue(40),
  },
  //#endregion

  //#region (Navigation Styles)
  HeaderTitleTxt: {
    fontSize: RFValue(20),
    fontFamily: Fonts.LexendSemiBold,
    fontWeight: "600",
    color: "#000000",
    marginTop: RFValue(5),
  },
  ProfileImage: {
    backgroundColor: "black",
    borderWidth: 1,
    borderColor: "gray",
    right: RFValue(10),
  },

  HeaderImageView: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  HeaderMenuView: {
    backgroundColor: colors.White,
    width: RFValue(40),
    height: RFValue(40),
    borderRadius: RFValue(20),
    justifyContent: "center",
    alignItems: "center",
    left: RFValue(15),
  },
  HeaderMenuImage: {
    width: RFValue(18),
    height: RFValue(18),
    resizeMode: "contain",
  },
  HeaderNotificationImage: {
    width: RFValue(15),
    height: RFValue(15),
    resizeMode: "contain",
  },
  DrawerMenuImage: {
    width: RFValue(15),
    height: RFValue(15),
    resizeMode: "contain",
    // left: RFValue(18),
  },
  DrawerMenuImage2: {
    width: RFValue(15),
    height: RFValue(15),
    resizeMode: "contain",

    // left: RFValue(20),
  },
  IconImg: {
    height: RFPercentage(3),
    width: RFPercentage(3),
    resizeMode: "contain",
  },
  IconImg2: {
    height: RFPercentage(5),
    width: RFPercentage(5),
    resizeMode: "contain",
  },
  FontRegular_12: {
    fontFamily: Fonts.LexendSemiBold,
    fontSize: RFValue(12),
  },
  ProfileImg: {
    backgroundColor: colors.Black,
    borderWidth: 1,
    borderColor: "gray",
  },
  //#endregion

  //#region (Auth Style)
  HeaderLargeFont: {
    color: colors.Blue,
    fontFamily: Fonts.Medium,
    fontSize: RFValue(32),
  },
  HeaderSmallFont: {
    color: colors.Black,
    fontFamily: Fonts.Bold,
    fontSize: RFValue(12),
  },
  linkSmallFont: {
    color: colors.LightGreen,
    fontFamily: Fonts.LexendSemiBold,
    fontSize: RFValue(13),
  },
  signInBtn: {
    paddingVertical: RFPercentage(2),
    alignItems: "center",
    justifyContent: "center",
    borderRadius: RFValue(5),
    backgroundColor: colors.Blue,
  },
  button: {
    paddingVertical: RFPercentage(1),
    alignItems: "center",
    justifyContent: "center",
    borderRadius: RFValue(50),
    backgroundColor: colors.Red,
  },
  button2: {
    paddingVertical: RFPercentage(1),
    alignItems: "center",
    justifyContent: "center",
    borderRadius: RFValue(50),
    backgroundColor: colors.Red,
    marginHorizontal: RFValue(40),
  },
  SignInbtnView: {
    marginTop: RFPercentage(3),
    marginBottom: RFPercentage(0.1),
  },
  signinBtnTxt: {
    fontFamily: Fonts.Medium,
    fontSize: RFValue(14),
    alignSelf: "center",
    justifyContent: "center",
  },
  signUptxtView: {
    marginLeft: RFValue(50),
    marginTop: RFValue(10),
  },
  signUptxt: {
    fontFamily: Fonts.LexendSemiBold,
    color: colors.Black,
    fontSize: RFValue(13),
  },
  ModelViewContainer: {
    backgroundColor: colors.White,
    paddingHorizontal: RFValue(20),
    paddingVertical: RFValue(10),
    // borderRadius: RFValue(20),
    borderTopLeftRadius: RFValue(20),
    borderTopRightRadius: RFValue(20),
  },
  ImageView: {
    backgroundColor: colors.Green,
    width: RFPercentage(7),
    height: RFPercentage(7),
    borderRadius: RFValue(25),
    alignSelf: "center",
    alignItems: "center",
    justifyContent: "center",
  },
  Image: {
    height: RFPercentage(12),
    width: RFPercentage(12),
    resizeMode: "contain",
  },

  /// Modal Screen
  Modal: {
    backgroundColor: colors.TransperantBlack,
    flex: 1,
    justifyContent: "flex-end",
  },
  FontMedium_18: {
    fontFamily: Fonts.Medium,
    fontSize: RFValue(18),
    color: colors.Black,
    textAlign: "center",
  },
  FontMedium_14: {
    fontFamily: Fonts.Regular,
    fontSize: RFValue(14),
    color: colors.Grey,
    textAlign: "center",
  },
  /// Elect Company Type screen
  CompanyTypeIllustratorImg: {
    height: Platform.OS == "ios" ? RFPercentage(35) : RFPercentage(40),
    width: Platform.OS == "ios" ? RFPercentage(35) : RFPercentage(40),
    width: RFPercentage(40),
    alignSelf: "center",
    justifyContent: "center",
    resizeMode: "contain",
  },
  CompanyTypeImg: {
    height: RFPercentage(6),
    width: RFPercentage(6),
    resizeMode: "contain",
  },
  CompanyTypeSelectionView: {
    flex: 1,
    height: RFPercentage(20),
    borderRadius: RFValue(12),
  },
  FontRegular_13: {
    fontFamily: Fonts.LexendRegular,
    color: "black",
    fontSize: RFValue(15),
    marginTop: RFValue(13),
  },

  mainView: {
    flex: 1,
    backgroundColor: colors.WhiteSmoke,
    marginBottom: 0,
    paddingBottom: 0,
  },
  DrawerSubView: {
    flexDirection: "row",
    marginHorizontal: RFValue(8),
    marginTop: RFValue(6),
    width: "95%",
    height: "6%",
    alignItems: "center",
    borderRadius: RFValue(5),
  },
  DrawerText: {
    marginLeft: RFValue(15),
    fontSize: RFValue(14),
    fontFamily: Fonts.LexendSemiBold,
  },

  componentContainerView: {
    flex: 1,
    marginHorizontal: RFValue(15),
    marginBottom: RFValue(20),
  },
  loaderContainer: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    position: "absolute",
    top: 0,
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: "rgba(255, 255, 255, 0.7)",
  },
  ProfileContainerView: {
    flex: 1,
    backgroundColor: "#ffffff",
    paddingHorizontal: RFValue(20),
    marginTop: RFValue(30),
    borderTopLeftRadius: RFValue(40),
    borderTopRightRadius: RFValue(40),
    width: "100%",
    shadowColor: color.Grey,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 2,
    elevation: 3,
  },
  listSearchComponentContainerView: {
    marginHorizontal: RFValue(10),
    marginTop: RFValue(10),
    marginBottom: RFValue(10),
    backgroundColor: colors.White,
    alignContent: "center",
    borderRadius: 8,
  },
  listSearchComponentContainerView2: {
    marginHorizontal: RFValue(10),
    marginBottom: RFValue(5),
    backgroundColor: colors.White,
    alignContent: "center",
    borderRadius: 8,
  },
  listComponentContainerView: {
    flex: 1,
    marginHorizontal: RFValue(10),
  },
  InlineViewContainer: {
    flexDirection: "row",
    alignItems: "center",
  },

  NameEmailView: {
    marginLeft: RFPercentage(2),
    width: "68%",
  },
  NameTxt: {
    fontSize: Platform.OS === "android" ? RFValue(14) : RFValue(13),
    fontFamily: Fonts.LexendSemiBold,
    color: colors.Black,
    textAlign: "left",
  },
  EmailTxt: {
    fontSize: Platform.OS === "ios" ? RFValue(13) : RFValue(14),
    fontFamily: Fonts.LexendRegular,
    color: colors.Black,
  },
  VehicleType: {
    fontSize: Platform.OS === "android" ? RFValue(14) : RFValue(13),
    fontFamily: Fonts.LexendSemiBold,
    color: colors.Black,
  },
  VehicleType2: {
    fontSize: RFValue(12),
    fontFamily: Fonts.Medium,
    color: "#a0a0a0",
  },
  freightCardText: {
    fontSize: RFValue(11),
    fontFamily: Fonts.Regular,
    textAlign: "left",
    color: colors.Grey,
    marginBottom: RFValue(2),
  },
  NoDAta: {
    flex: 1,
    alignSelf: "center",
    fontFamily: Fonts.LexendRegular,
    marginTop: RFValue(100),
    fontSize: RFPercentage(2),
  },

  freightCardSubText: {
    fontFamily: Fonts.Regular,
    color: colors.Black,
    fontSize: RFValue(12),
    textAlign: "left",
    width: "83%",
  },
  divider: {
    height: 1,
    backgroundColor: "#34b26730",
    marginTop: RFValue(10),
  },
  LightDivider: {
    height: 0.8,
    backgroundColor: "#00000010",
    marginTop: RFValue(10),
  },
  FreightCardDivider: {
    height: StyleSheet.hairlineWidth,
    backgroundColor: "#4294F9",
    marginVertical: RFValue(10),
  },
  MenuListItem: {
    flexDirection: "row",
    marginTop: RFValue(20),
  },
  MenuListItemTxt: {
    fontFamily: Fonts.Medium,
    color: colors.Black,
    fontSize: RFValue(14),
    alignSelf: "center",
  },
  MenuFlatListImg: {
    height: RFPercentage(3),
    width: RFPercentage(3),
    resizeMode: "contain",
    marginRight: RFPercentage(2),
    // tintColor: colors.Grey
  },
  MenuFlatListImg2: {
    height: RFPercentage(2),
    width: RFPercentage(2),
    resizeMode: "contain",

    // tintColor: colors.Grey
  },
  iconBackground: {
    backgroundColor: "#ebf7f0",
    height: RFValue(25),
    width: RFValue(25),
    justifyContent: "center",
    alignItems: "center",
    borderRadius: RFValue(12.5),
    marginRight: RFPercentage(2),
  },
  iconStyle: {
    height: RFPercentage(2),
    width: RFPercentage(2),
    resizeMode: "contain",
  },
  CustomMenuListView: {
    margin: RFValue(20),
  },
  CustomMenuBottomListView: {
    flex: 1,
    justifyContent: "flex-end",
  },
  UpdateProfileImageMeasure: {
    width: RFPercentage(14),
    height: RFPercentage(14),
  },
  ProfileImageView: {
    borderRadius: RFPercentage(10),
    alignItems: "center",
    justifyContent: "center",
    overflow: "hidden",
    backgroundColor: colors.Black,
    borderWidth: 2,
    borderColor: colors.Green,
  },
  CameraIconView: {
    width: RFPercentage(3),
    height: RFPercentage(3),
    borderRadius: RFPercentage(10),
    backgroundColor: "#33b267",
    position: "absolute",
    bottom: 0,
    right: 2,
    alignItems: "center",
    justifyContent: "center",
  },
  ///////////////////////////////////
  BottomBtn: {
    paddingVertical: RFPercentage(2),
    alignItems: "center",
    justifyContent: "center",
    borderRadius: RFValue(5),
  },
  BottomBtnTxt: {
    fontFamily: Fonts.Bold,
    color: colors.White,
    fontSize: RFValue(16),
    alignSelf: "center",
  },

  BackIcon: {
    height: RFPercentage(2.5),
    width: RFPercentage(3),
    resizeMode: "contain",
  },

  ListItemView: {
    marginBottom: RFPercentage(2.5),
  },
  ListIconImg: {
    width: RFValue(20),
    height: RFValue(20),
    resizeMode: "contain",
    marginRight: RFValue(16),
  },
  ListText: {
    fontFamily: Fonts.Medium,
    color: colors.Black,
    fontSize: RFValue(14),
    alignSelf: "center",
  },
  CheckListItemView: {
    flex: 1,
    alignSelf: "center",
    marginLeft: 20,
  },
  CheckListItemText: {
    fontFamily: Fonts.Medium,
    color: colors.Black,
    fontSize: RFValue(14),
    alignSelf: "center",
    marginLeft: RFValue(5),
  },
  HeaderProfileView: {
    width: RFValue(40),
    height: RFValue(40),
    backgroundColor: "white",
    // right: RFValue(20),
    borderRadius: RFPercentage(4),
    overflow: "hidden",
    borderColor: colors.LightGrey,
    // borderWidth: 1,
    alignSelf: "center",
    justifyContent: "center",
    alignItems: "center",
  },
  HeaderProfileImg: {
    // resizeMode: "contain",
    width: RFPercentage(7),
    height: RFPercentage(7),
  },
  checkedRadioStyle: {
    // backgroundColor: colors.LightBlue,
    // borderColor: '#fff',
    borderWidth: 1,
  },
  uncheckedRadioStyle: {
    // backgroundColor: colors.White,
    // borderColor: '#C5CAD5',
    borderWidth: 1,
  },

  //#endregion

  //#region (Text + Dropdown field)

  TextMainView: {
    marginBottom: RFPercentage(1),
    // marginRight: RFPercentage(2),
    // marginLeft: RFValue(6),
    // marginTop: RFValue(4),
  },
  TextfieldMainView2: {
    marginBottom: RFPercentage(1),
  },
  TextfieldTitleView: {
    marginBottom: RFValue(1),
    alignItems: "flex-start",
  },
  TextfieldTitleView2: {
    marginBottom: RFValue(4),
    alignItems: "flex-start",
  },
  TextfieldTitle: {
    fontFamily: Fonts.LexendRegular,
    flex: 1,
    fontSize: RFValue(13),
    textAlign: "left",
    marginLeft: RFValue(2),
    marginBottom: RFValue(6),
  },
  TextfieldTitle2: {
    fontFamily: Fonts.LexendRegular,
    fontSize: RFValue(14),
    textAlign: "left",
  },
  InputTextFieldView2: {
    flexDirection: "row",
    paddingHorizontal: RFValue(5),
    paddingVertical: Platform.OS == "ios" ? RFValue(12) : RFValue(5),
    borderRadius: RFValue(10),
    backgroundColor: colors.LimeGreen,
    alignItems: "center",
  },
  InputTextFieldView: {
    flexDirection: "row",
    paddingHorizontal: RFValue(18),
    paddingVertical: Platform.OS == "ios" ? RFValue(14) : RFValue(5),
    borderWidth: 1,
    borderColor: colors.LightBlue,
    borderRadius: RFValue(5),
    alignItems: "center",
  },
  DisplayTextFieldView: {
    flexDirection: "row",
    paddingHorizontal: RFValue(18),
    paddingVertical: RFValue(14),
    borderWidth: 1,
    borderColor: colors.LightBlue,
    borderRadius: RFValue(5),
  },
  InputTextFieldWithIcon: {
    paddingHorizontal: RFValue(18),
    paddingVertical: RFValue(13),
  },
  InputTextFieldWithIcon2: { zIndex: -9999 },
  DropdownFieldView: {
    // flexDirection: 'row',
    // paddingHorizontal: RFValue(18),
    // paddingVertical: RFValue(13),
    backgroundColor: "#ececec",
    borderRadius: RFValue(10),
    flexDirection: "row",
    flex: 1,
  },
  DropdownTextFieldView: {
    flex: 1,
    justifyContent: "center",
    alignItems: "flex-start",
    paddingHorizontal: RFValue(10),
    paddingVertical: RFValue(10),
    backgroundColor: Colors.LightBlue,
  },
  DropdownImageView: {
    // backgroundColor: colors.LightBlue,
    width: RFValue(50),
    height: "100%",
    justifyContent: "center",
    right: 0,
  },
  InputTextField: {
    flex: 1,
    fontSize: RFValue(14),
    fontFamily: Fonts.Medium,
    color: colors.Black,
  },
  InputTextField2: {
    fontSize: RFValue(12),
    fontFamily: Fonts.Medium,
    color: colors.Black,
    //textAlignVertical: "top",
    paddingTop: 5,
    paddingBottom: 0,
    flex: 1,
  },
  countryCodeText: {
    fontSize: RFValue(12),
    fontFamily: Fonts.Medium,
    color: colors.Black,
    alignSelf: "flex-start",
    textAlign: "center",
    alignSelf: "center",
    marginRight: 10,
    paddingBottom: Platform.OS == "ios" ? null : RFValue(5),
  },
  TextFieldPlaceholder: {
    fontSize: RFValue(14),
    fontFamily: Fonts.Medium,
    color: colors.LightGrey,
  },
  TextFieldIcon: {
    height: RFPercentage(2.2),
    width: RFPercentage(2.5),
    marginHorizontal: RFValue(3),
    resizeMode: "contain",
    alignSelf: "center",
    tintColor: colors.blacklight,
  },
  TexFielIcon2: {
    height: RFPercentage(1.5),
    width: RFPercentage(1.5),
    resizeMode: "contain",
    alignSelf: "center",
    tintColor: colors.blacklight,
  },
  DrawerMenuCubeListContainer: {
    flexDirection: "row",
    alignSelf: "center",
  },
  DrawerMenuCubeView: {
    height: RFPercentage(13),
    width: RFPercentage(15),
    borderRadius: 10,
    alignItems: "center",
    justifyContent: "center",
  },
  DrawerMenuCubeView2: {
    height: RFPercentage(13),
    width: RFPercentage(13),
    borderRadius: 10,
    alignItems: "center",
    justifyContent: "center",
  },
  DrawerMenuImg: {
    height: RFPercentage(6),
    width: RFPercentage(6),
    resizeMode: "contain",
  },
  DrawerMenuImg2: {
    height: RFPercentage(3),
    width: RFPercentage(3),
    resizeMode: "contain",
    marginLeft: RFValue(10),
  },
  FontSemibold_12: {
    color: colors.Black,
    fontFamily: Fonts.SemiBold,
    fontSize: RFValue(12),
    marginTop: 10,
    alignSelf: "center",
  },

  DropdownItemView: {
    marginLeft: RFValue(20),
    paddingVertical: RFPercentage(2),
    borderBottomColor: colors.LightGrey,
    borderBottomWidth: 1,
  },
  DropdownItemTxt: {
    fontFamily: Fonts.Regular,
    color: colors.Black,
    fontSize: RFValue(12),
    textAlign: "left",
    width: "83%",
  },
  subViewForRouteName: {
    width: "83%",
    marginLeft: RFPercentage(0.2),
  },
  TrailerListItemContailer: {
    marginTop: RFValue(10),
    marginBottom: RFValue(2),
    borderRadius: RFValue(10),
    marginHorizontal: RFValue(3),
    paddingVertical: RFValue(10),
    backgroundColor: "white",
    shadowColor: color.Grey,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 2,
    elevation: 2,
  },

  TrailerSpecificationItemContainer: {
    backgroundColor: "#EFEFEF",
    marginRight: RFValue(10),
    borderRadius: RFValue(15),
    padding: RFValue(5),
    paddingHorizontal: RFValue(10),
    marginTop: RFValue(10),
  },
  TrailerSpecificationItemContainerMain: {
    flexDirection: "row",
    flexWrap: "wrap",
    width: "100%",
    paddingHorizontal: RFValue(10),
    paddingVertical: RFValue(10),
    borderRadius: RFValue(5),
    backgroundColor: "white",
    marginHorizontal: RFValue(5),
    shadowColor: colors.Grey,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 3,
    elevation: 3,
  },

  FontSemiBold_18: {
    fontFamily: Fonts.LexendRegular,
    fontSize: RFValue(18),
  },

  FontRegular_15: {
    fontFamily: Fonts.LexendRegular,
    fontSize: RFValue(15),
  },

  FontRegular_12: {
    fontSize: RFValue(12),
    fontFamily: Fonts.Medium,
    color: colors.Grey,
    textAlign: "center",
  },

  CloseIconImg: {
    height: RFPercentage(8),
    width: RFPercentage(8),
    resizeMode: "contain",
    alignSelf: "center",
    top: Platform.OS === "ios" ? 10 : 25,
  },

  VehicleIconImg: {
    height: RFPercentage(3.5),
    width: RFPercentage(3.5),
    resizeMode: "contain",
    alignSelf: "center",
  },
  DetailsFieldIconContainer: {
    flexDirection: "row",
    borderWidth: 1,
    borderColor: colors.LightBlue,
    borderRadius: RFValue(5),
  },

  BlurView: {
    position: "absolute",
    top: RFValue(height * -1),
    left: RFValue(width * -1),
    height: RFValue(height * 2),
    width: RFValue(width * 2),
  },

  ActionItemContainer: {
    alignItems: "center",
    marginBottom: RFValue(120),
  },

  ActionCirculItem: {
    height: RFValue(50),
    width: RFValue(50),
    justifyContent: "center",
    alignItems: "center",
    borderRadius: RFValue(25),
  },

  ActionItemTextContainer: {
    paddingTop: RFValue(10),
    height: RFValue(50),
    width: RFValue(150),
    justifyContent: "flex-start",
    transform: [{ scaleX: I18nManager.isRTL ? -1 : 1 }],
  },

  MarginVerticalStyle: {
    flexDirection: "row",
    marginVertical: RFValue(3),
  },

  FlexDirectionRow: {
    flexDirection: "row",
  },

  NoDataTxt: {
    fontFamily: Fonts.Regular,
    fontSize: RFPercentage(2),
    color: colors.Black,
    alignSelf: "center",
    marginTop: height / 3,
  },
  //#endregion

  documentDataImage: {
    width: 50,
    height: 60,
  },
});
