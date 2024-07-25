import React, { useMemo } from "react";
import { View, Text } from "@components/Themed";
import { Image, ImageSourcePropType } from "react-native";
import { styles } from "./LoggedHeader.styles";
import { queryClient } from "@/providers";
import { IFetchCompanyData } from "@constants/types";

export default function LoggedHeader() {
  // --- Hooks -----------------------------------------------------------------
  const state = queryClient.getQueryState<IFetchCompanyData>([
    "useCompanyData",
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
    if (state?.data?.logo) return { uri: state.data.logo };
    // eslint-disable-next-line @typescript-eslint/no-unsafe-return
    return require("@assets/images/avatar.png");
  }, [state]);

  const companyName = useMemo(() => state?.data?.companyName ?? "...", [state]);
  const contact = useMemo(() => state?.data?.contact ?? "...", [state]);
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
