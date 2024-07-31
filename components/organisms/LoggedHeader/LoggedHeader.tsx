import React, { useMemo } from "react";
import { View, Text } from "@components/Themed";
import { Image, ImageSourcePropType } from "react-native";
import { styles } from "./LoggedHeader.styles";
import { queryClient } from "@/providers";
import { IFetchCompanyData, IFetchDriverData } from "@constants/types";
import { queryKeys } from "@constants/Constants";

export default function LoggedHeader() {
  // --- Hooks -----------------------------------------------------------------
  const companyData = queryClient.getQueryState<IFetchCompanyData>([
    queryKeys.companyData,
  ]);
  const driverData = queryClient.getQueryState<IFetchDriverData>([
    queryKeys.driverData,
  ]);
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
    if (companyData?.data?.logo) return { uri: companyData.data.logo };
    // eslint-disable-next-line @typescript-eslint/no-unsafe-return
    return require("@assets/images/avatar.png");
  }, [companyData]);

  const companyName = useMemo(
    () => companyData?.data?.companyName ?? "...",
    [companyData],
  );
  const contact = useMemo(
    () => driverData?.data?.driverName ?? "...",
    [driverData],
  );
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
