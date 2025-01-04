import MaterialIcons from "@expo/vector-icons/MaterialIcons";
import React, { useEffect, useRef, useState } from "react";
import { StyleSheet, Text, View } from "react-native";
import MapView, { Region } from "react-native-maps";

import * as Location from "expo-location";
import useData from "hooks/use-data";

export default function App() {
  const [location, setLocation] = useState<Location.LocationObject | null>(
    null,
  );
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [region, setRegion] = useState<Region | null>(null);

  const mapRef = useRef<MapView>(null); // Referencia al MapView

  const { data } = useData();

  function convertToRegion(location: Location.LocationObject): Region {
    return {
      latitude: location.coords.latitude,
      longitude: location.coords.longitude,
      latitudeDelta: 0.0922,
      longitudeDelta: 0.0421,
    };
  }

  useEffect(() => {
    async function getCurrentLocation() {
      let { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== "granted") {
        setErrorMsg("Permission to access location was denied");
        return;
      }

      let location = await Location.getCurrentPositionAsync({});
      setLocation(location);
    }

    getCurrentLocation();
    if (location) setRegion(convertToRegion(location));
    console.log(data);
  }, [data]);

  useEffect(() => {
    if (location) {
      setRegion(convertToRegion(location));
    }
  }, [location]);

  const handleCenterMap = () => {
    if (mapRef.current && location) {
      const region = convertToRegion(location);
      mapRef.current.animateToRegion(region, 1000); // Centra el mapa con animación
    }
  };

  return (
    <View style={styles.container}>
      {location ? (
        <>
          <MapView
            ref={mapRef}
            style={styles.map}
            region={region ?? undefined}
            showsUserLocation={true}
            followsUserLocation={true}
            showsMyLocationButton={false}
            showsCompass={true}
            provider="google"
          />
          <View style={styles.locationButton}>
            <MaterialIcons
              name="location-searching"
              size={24}
              color="black"
              onPress={handleCenterMap}
            />
          </View>
        </>
      ) : (
        <Text>{errorMsg || "Loading..."}</Text>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    alignItems: "center",
    justifyContent: "center",
  },
  map: {
    width: "100%",
    height: "100%",
  },
  locationButton: {
    position: "absolute",
    bottom: 20,
    right: 20,
    zIndex: 1,
  },
});
