import { useEffect, useState } from "react";
import { StyleSheet, Text, View } from "react-native";
import MapView, { Region } from "react-native-maps";

import * as Location from "expo-location";

export default function App() {
  const [location, setLocation] = useState<Location.LocationObject | null>(
    null,
  );
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [region, setRegion] = useState<Region | null>(null);

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
  }, [location]);

  return (
    <View style={styles.container}>
      {location ? (
        <MapView
          style={styles.map}
          region={region ?? undefined}
          showsUserLocation={true}
        />
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
});
