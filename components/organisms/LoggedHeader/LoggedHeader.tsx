import React, { useMemo } from "react";
import { View, Text } from "@components/Themed";
import { Image, ImageSourcePropType } from "react-native";
import { styles } from "./LoggedHeader.styles";
import { queryClient } from "@/providers";
import { IFetchDriverData } from "@constants/types/general";
import { queryKeys } from "@constants/Constants";
import { useStore } from "@stores/zustand";

export default function LoggedHeader() {
  // --- Hooks -----------------------------------------------------------------
  const { company: companyData, driver: driverData } = useStore();
  // --- END: Hooks ------------------------------------------------------------

  // --- Local state -----------------------------------------------------------
  // --- END: Local state ------------------------------------------------------

  // --- Refs ------------------------------------------------------------------
  // --- END: Refs -------------------------------------------------------------

  // --- Redux -----------------------------------------------------------------
  // --- END: Redux ------------------------------------------------------------

  // --- Side effects ----------------------------------------------------------
  // --- END: Side effects -----------------------------------------------------

  // --- Data and handlers -----------------------------------------------------
  const source: ImageSourcePropType = useMemo(() => {
    if (companyData?.logo) return { uri: companyData.logo };
    // eslint-disable-next-line @typescript-eslint/no-unsafe-return
    return require("@assets/images/avatar.png");
  }, [companyData]);

  const companyName = useMemo(
    () => companyData?.companyName ?? "...",
    [companyData]
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
        <Text style={styles.statusText}>Online</Text>
      </View>
    </View>
  );
}
