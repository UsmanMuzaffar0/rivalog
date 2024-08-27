import React, { useEffect, useRef, useState } from "react";
import { Image, Modal, StyleSheet, Text, View } from "react-native";
import MapView from "react-native-maps";
import { SafeAreaView } from "react-native-safe-area-context";
import * as colors from "../colors";
import {
  LocationPermission,
  requestForLocation,
} from "../Utils/locationPermission";

import Button from "./Button";
import images from "../../assets/images";
import Geolocation from "react-native-geolocation-service";
import { reverseGeocode } from "../Utils/geocoding";
import { RFPercentage } from "react-native-responsive-fontsize";
import { isEmpty } from "../Utils/object";
import { GooglePlacesAutocomplete } from "react-native-google-places-autocomplete";

const latitudeDelta = 0.025;
const longitudeDelta = 0.025;

const MAP_API_KEY = "AIzaSyAjEDkAJ_-a7I9USDCHMDJjJMrvp9CFSI4";

export default function LocationPicker({
  isVisible,
  hideModal,
  handlePick,
  selectedRegion = null,
  setSelectedRegion,
}) {
  const [region, setRegion] = useState({
    latitudeDelta,
    longitudeDelta,
    latitude: 38.7205,
    longitude: 35.4826,
  });
  const [geoAddress, setGeoAddress] = useState("");
  const [ready, setReady] = useState(false);
  const [hasPermission, setHasPermission] = useState(false);
  const mapRef = useRef(null);

  useEffect(() => {
    if (selectedRegion?.latitude && selectedRegion?.longitude) {
      setRegion({
        ...region,
        ...selectedRegion,
      });
    }
  }, [selectedRegion]);

  const onRegionChange = (region) => {
    setRegion(region);
  };

  useEffect(() => {
    const effect = async () => {
      const results = await reverseGeocode(region);
      if (results) setGeoAddress(results);
    };
    if (isVisible) effect();
  }, [region]);

  useEffect(() => {
    if (isVisible) {
      (async () => {
        // if (await requestForLocation({ inUseOnly: true })) {
        //   setHasPermission(true);
        //   // getCurrentLocation();
        // }

        setReady(true);
      })();
    }
  }, [isVisible]);

  // const getCurrentLocation = () => {
  //   if (hasPermission)
  //     Geolocation.getCurrentPosition(
  //       (position) => {
  //         console.log("position", position);
  //         setRegion({ ...position?.coords, latitudeDelta, longitudeDelta });
  //       },
  //       (error) => {
  //         // See error code charts below.
  //         console.warn(error.code, error.message);
  //       },
  //       { enableHighAccuracy: true, timeout: 15000, maximumAge: 10000 }
  //     );
  // };

  const handlePickLocation = () => {
    if (geoAddress && geoAddress?.extractedAddressData && region)
      handlePick({
        geoAddress,
        region,
        extractedAddressData: geoAddress?.extractedAddressData,
      });
  };

  if (!ready) return null;

  return (
    <Modal animationType={"none"} transparent={true} visible={isVisible}>
      <View style={styles.modalcontainer}>
        {selectedRegion ? (
          <MapView
            style={styles.map}
            region={region}
            showsMyLocationButton={true}
            ref={mapRef}
            onRegionChangeComplete={onRegionChange}
          />
        ) : (
          <MapView
            style={styles.map}
            initialRegion={region}
            showsMyLocationButton={true}
            ref={mapRef}
            onRegionChangeComplete={onRegionChange}
          />
        )}
        <View style={styles.markerFixed}>
          <Image style={styles.marker} source={images.marker} />
        </View>
        <SafeAreaView style={styles.header}>
          <GooglePlacesAutocomplete
            placeholder="Search"
            onPress={async (data, details = null) => {
              // 'details' is provided when fetchDetails = true
              await fetch(
                `https://maps.googleapis.com/maps/api/place/details/json?key=${MAP_API_KEY}&place_id=${data?.place_id}`
              )
                .then((response) => response.json())
                .then(({ result }) => {
                  setRegion({
                    ...region,
                    latitude: result.geometry.location.lat,
                    longitude: result.geometry.location.lng,
                  });
                  setSelectedRegion({
                    latitudeDelta,
                    longitudeDelta,
                    latitude: result.geometry.location.lat,
                    longitude: result.geometry.location.lng,
                  });
                });
            }}
            query={{
              key: MAP_API_KEY,
              language: "en",
            }}
          />
        </SafeAreaView>
        <SafeAreaView style={styles.footer}>
          <Button
            border={false}
            name={"Pick Location"}
            onPress={handlePickLocation}
          />
          <Text style={styles.region}>
            {JSON.stringify(
              geoAddress?.results?.[0]?.formatted_address,
              null,
              2
            )}
          </Text>
        </SafeAreaView>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  map: {
    flex: 1,
  },
  markerFixed: {
    left: "50%",
    marginLeft: -24,
    marginTop: -48,
    position: "absolute",
    top: "50%",
  },
  marker: {
    height: 48,
    width: 48,
  },
  header: {
    top: 20,
    position: "absolute",
    width: "90%",
    left: "5%",
  },
  footer: {
    backgroundColor: "rgba(0, 0, 0, 0.5)",
    bottom: 0,
    position: "absolute",
    width: "100%",
  },
  region: {
    color: "#fff",
    lineHeight: 20,
    margin: 20,
    textAlign: "center",
    maxHeight: RFPercentage(20),
  },

  modalcontainer: {
    flex: 1,
    // paddingHorizontal: RFValue(10),
    // paddingTop: RFValue(70),
    // paddingBottom: RFValue(10),
    backgroundColor: colors.TransperantBlack,
  },
});
