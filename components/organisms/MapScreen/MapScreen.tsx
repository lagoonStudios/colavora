import { View } from "react-native";
import React, { useRef } from "react";
import MapView, { PROVIDER_GOOGLE } from "react-native-maps";

import { mapStyle } from "@/constants/mapStyle";

import { styles } from "./MapScreen.styles";

export default function MapScreen() {
  const mapRef = useRef<MapView | null>(null);
  return (
    <View style={[styles.container]}>
      <MapView
        customMapStyle={mapStyle}
        provider={PROVIDER_GOOGLE}
        style={styles.mapStyle}
        initialRegion={{
          latitude: 41.3995345,
          longitude: 2.1909796,
          latitudeDelta: 0.003,
          longitudeDelta: 0.003,
        }}
        mapType="standard"
        showsMyLocationButton
        showsUserLocation
        ref={mapRef}
      />
    </View>
  );
}
