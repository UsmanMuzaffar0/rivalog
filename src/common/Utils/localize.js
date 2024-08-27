import * as RNLocalize from "react-native-localize";

export const currentLocale = RNLocalize.getCountry();
export const countryCodes = RNLocalize.getLocales().map(
  (loc) => loc.countryCode
);

export const getCountryCodeAsync = async () => {
  let countryCode = currentLocale;
  try {
    await fetch("https://api.country.is").then((res) =>
      res.json().then((result) => (countryCode = result?.country))
    );
  } catch (e) {
    console.error(e);
  }

  return countryCode;
};
