import LocalizedStrings from "react-native-localization";
import * as stringsoflanguagesEn from "./stringsoflanguagesEn";
import * as stringsoflanguagesTurkish from "./stringsoflanguagesTurkish";
import * as stringsoflanguagesAr from "./stringsoflanguagesAr";
import * as stringsoflanguagesItalian from "./stringsoflanguagesItalian";
import * as stringsoflanguagesGr from "./stringsoflanguagesGr";
import * as stringsoflanguagesRussian from "./stringsoflanguagesRussian";
const LocalizeStr = new LocalizedStrings({
  en: stringsoflanguagesEn.strings,
  ar: stringsoflanguagesAr.strings,
  tr: stringsoflanguagesTurkish.strings,
  it: stringsoflanguagesItalian.strings,
  gr: stringsoflanguagesGr.strings,
  ru: stringsoflanguagesRussian.strings,
});

export default LocalizeStr;
