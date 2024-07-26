import { View } from "react-native";
import React, { useEffect, useRef } from "react";
import MapView, { Marker, PROVIDER_GOOGLE } from "react-native-maps";

import { mapStyle } from "@/constants/mapStyle";

import { styles } from "./MapScreen.styles";

export default function MapScreen({
  latitude,
  longitude,
}: {
  latitude: number;
  longitude: number;
}) {
  //--- Refs -----------------------------------------------------------------
  const mapRef = useRef<MapView | null>(null);
  //--- END: Refs ------------------------------------------------------------
  //--- Side effects ----------------------------------------------------
  useEffect(() => {
    mapRef.current?.animateToRegion(
      {
        latitude: latitude,
        longitude: longitude,
        latitudeDelta: 0.003,
        longitudeDelta: 0.003,
      },
      0,
    );
  }, [latitude, longitude]);
  //--- END: Side effects ------------------------------------------------

  return (
    <View style={[styles.container]}>
      <MapView
        customMapStyle={mapStyle}
        provider={PROVIDER_GOOGLE}
        style={styles.mapStyle}
        initialRegion={{
          latitude: latitude,
          longitude: longitude,
          latitudeDelta: 0.003,
          longitudeDelta: 0.003,
        }}
        mapType="standard"
        showsMyLocationButton
        showsUserLocation
        ref={mapRef}
      >
        <Marker coordinate={{ latitude, longitude }} />
      </MapView>
    </View>
  );
}
