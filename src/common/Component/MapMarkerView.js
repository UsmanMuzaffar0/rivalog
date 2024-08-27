import React, { useContext, useEffect, useRef, useState } from "react";
import { Image, Modal, StyleSheet, Text, View } from "react-native";
import MapView, { Marker } from "react-native-maps";
import { SafeAreaView } from "react-native-safe-area-context";
import Geolocation from "react-native-geolocation-service";
import { RFPercentage } from "react-native-responsive-fontsize";
import Animated, { BounceIn, SlideInLeft } from "react-native-reanimated";

import * as colors from "../colors";
import {
  LocationPermission,
  requestForLocation,
} from "../Utils/locationPermission";
import Button from "./Button";
import images from "../../assets/images";

const customMarkers = [
  {
    driver: {
      userId: 422,
      name: "james",
      surname: "foden",
      username: null,
      email: null,
      countryCode: null,
      mobile: "+1223 44 11 23",
      image:
        "https://www.rivalogservice.com/api/file-management/files/6975c76a-2d3e-4305-a885-990ca321bd93",
      language: "en",
      country: "TR",
      secretKey: null,
      startDate: 1673704744000,
      endDate: null,
      password: null,
      initialPassword: null,
      userStatus: null,
    },
    vehicle: {
      vehicleId: 126,
      vehicleType: null,
      year: 2022,
      plate: "34ABC123",
      capacity: null,
      company: {
        companyId: 2,
        parentCompanyId: null,
        name: "IWASOFT",
        web: null,
        phone: null,
        startDate: null,
        endDate: null,
        image: null,
        language: "tr",
        email: null,
        taxNumber: null,
        taxOffice: null,
        companyType: null,
        companyStatus: null,
        country: null,
      },
      make: "Mercedes",
      model: "ABC123",
    },
    trailer: {
      trailerId: 194,
      year: 2022,
      plate: "34DEF234",
      capacity: null,
      make: "TIRSAN",
      model: "DEF234",
      company: {
        companyId: 2,
        parentCompanyId: null,
        name: "IWASOFT",
        web: null,
        phone: null,
        startDate: null,
        endDate: null,
        image: null,
        language: "tr",
        email: null,
        taxNumber: null,
        taxOffice: null,
        companyType: null,
        companyStatus: null,
        country: null,
      },
      floorType: null,
      trailerType: null,
      specificationList: null,
    },
    container: null,
    transporterStatus: {
      transporterStatusId: 2,
      description: "Looking for freight",
      code: "LOOKING_FOR_FREIGHT",
    },
    transportStatus: null,
    transporterCompany: {
      companyId: 2,
      parentCompanyId: null,
      name: "IWASOFT",
      web: null,
      phone: null,
      startDate: null,
      endDate: null,
      image: null,
      language: "tr",
      email: null,
      taxNumber: null,
      taxOffice: null,
      companyType: null,
      companyStatus: null,
      country: null,
    },
    latitude: 40.95279586,
    longitude: 29.10800471,
    lastSubmissionDate: 1682414520000,
  },
];

let latitudeDelta = 9;
let longitudeDelta = 9;

const getIcon = (item) =>
  item?.transporterStatus?.code
    ? item?.transporterStatus?.code === "LOOKING_FOR_FREIGHT"
      ? images?.truckGreen
      : item?.transporterStatus?.code === "NOT_WORKING"
      ? images?.truckYellow
      : images?.truckRed
    : null;

export default function MapMarkerView({ onPressMarker, markersList = [] }) {
  const [region, setRegion] = useState({
    latitudeDelta,
    longitudeDelta,
    latitude: 38.7205,
    longitude: 35.4826,
  });
  const [ready, setReady] = useState(false);
  const mapRef = useRef(null);

  const onRegionChange = (region) => {
    setRegion(region);
  };

  const hanldeOnPressMarker = (m) => {
    try {
      setRegion({
        ...region,
        latitudeDelta: 0.2,
        longitudeDelta: 0.2,
        longitude: m?.longitude,
        latitude: m?.latitude,
      });
      setTimeout(() => {
        if (onPressMarker) onPressMarker(m);
      }, 1000);
    } catch {}
  };

  //   if (!ready) return null;

  return (
    <MapView
      ref={mapRef}
      style={styles.map}
      region={region}
      showsMyLocationButton={true}
      //   showsUserLocation={true}
      //   followsUserLocation={true}
      onRegionChangeComplete={onRegionChange}
    >
      {markersList?.map((m, i) => (
        <Marker
          // icon={getIcon(m)}
          // image={getIcon(m)}
          coordinate={m}
          title={m.title}
          description={m.description}
          key={`marker-${i}`}
          onPress={() => hanldeOnPressMarker(m, i)}
        >
          <Animated.Image
            entering={BounceIn}
            source={getIcon(m)}
            style={styles.marker}
            resizeMode="contain"
          />
        </Marker>
      ))}

      <SafeAreaView style={styles.footer}></SafeAreaView>
    </MapView>
  );
}

const styles = StyleSheet.create({
  map: {
    flex: 1,
  },

  marker: {
    height: 48,
    width: 48,
  },
});
