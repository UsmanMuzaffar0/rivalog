import Geocoder from "react-native-geocoding";

export const initGeocoding = (apiKey, lang) => {
  if (lang) return Geocoder.init(apiKey, { language: lang });

  Geocoder.init(apiKey);
  // result_type: "street_address|locality|postal_code|country",
};

// Search by geo-location (reverse geo-code)
export const reverseGeocode = async (region = { latitude, longitude }) => {
  try {
    const res = await Geocoder.from(region);
    return {
      results: res.results,
      extractedAddressData: extractAddressComponents(res.results),
    };
  } catch (e) {
    console.warn(e);
  }
};

const extractAddressComponents = (item) => {
  let addressData = {
    country: item?.find((item) => item.types.includes("country"))
      ?.address_components[0]?.short_name,
    district: item?.find((item) =>
      item.types.includes("administrative_area_level_1")
    )?.address_components[0]?.long_name,
    postCode: item?.find((item) => item.types.includes("postal_code"))
      ?.address_components[0]?.long_name,
    neighborhood: item?.find((item) => item.types.includes("neighborhood"))
      ?.address_components[0]?.long_name,
    city: item?.find((item) =>
      item.types.includes("administrative_area_level_2")
    )?.address_components[0]?.long_name,
    addressText: item?.address || item?.[0]?.formatted_address,
    streetNo: item?.find((item) => item.types.includes("street_address"))
      ?.address_components[0]?.long_name,
    street: item?.find((item) => item.types.includes("street_address"))
      ?.address_components[1]?.long_name,
  };

  return addressData;
  // console.log(JSON.stringify(addressData, null, 2));
};

// // Works as well :
// // ------------

// // location object
// Geocoder.from({
//   latitude: 41.89,
//   longitude: 12.49,
// });

// // latlng object
// Geocoder.from({
//   lat: 41.89,
//   lng: 12.49,
// });

// // array
// Geocoder.from([41.89, 12.49]);

// // Search by address
// Geocoder.from("Colosseum")
//   .then((json) => {
//     var location = json.results[0].geometry.location;
//     console.log(location);
//   })
//   .catch((error) => console.warn(error));

// // Search by address, with a biased geo-bounds
// Geocoder.from("Pyramid", {
//   southwest: { lat: 36.05, lng: -115.25 },
//   northeast: { lat: 36.16, lng: -115.1 },
// })
//   .then((json) => {
//     var location = json.results[0].geometry.location;
//     console.log(location);
//   })
//   .catch((error) => console.warn(error));
