/* eslint-disable @typescript-eslint/no-unsafe-assignment */
/* eslint-disable @typescript-eslint/no-unsafe-return */
import React, { useMemo } from "react";
import { View, Text } from "@components/Themed";
import { Image, ImageSourcePropType } from "react-native";
import { styles } from "./LoggedHeader.styles";
import { useStore } from "@stores/zustand";
import { useIsConnected } from "react-native-offline";

export default function LoggedHeader() {
  // --- Hooks -----------------------------------------------------------------
  const isConnected = useIsConnected();
  const { company: companyData, user: driverData } = useStore();
  // --- END: Hooks ------------------------------------------------------------

  // --- Data and handlers -----------------------------------------------------
  const source: ImageSourcePropType = useMemo(() => {
    if (companyData?.logo) return { uri: companyData.logo };
    return require("@assets/images/avatar.png");
  }, [companyData]);

  const companyName = useMemo(
    () => companyData?.companyName ?? "...",
    [companyData],
  );
  const contact = useMemo(() => {
    return driverData?.driverName ?? "...";
  }, [driverData]);
  // --- END: Data and handlers ------------------------------------------------
  return (
    <View style={styles.loggedHeaderContainer}>
      <Image source={source} style={styles.image}></Image>
      <View style={styles.infoContainer}>
        <Text style={styles.companyText}>{companyName}</Text>
        <Text style={styles.userText}>{contact}</Text>
        <View
          style={[
            styles.statusContainer,
            { backgroundColor: isConnected ? "green" : "gray" },
          ]}
        >
          <Text style={styles.statusText}>
            {isConnected ? "Online" : "Offline"}
          </Text>
        </View>
      </View>
    </View>
  );
}
