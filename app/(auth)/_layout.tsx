import React from "react";
import { Redirect, Stack } from "expo-router";
import useAuth from "@hooks/Auth";
import { useSQLite } from "@hooks/SQLite";
import { useLastSync } from "@hooks/lastSync";
import { useSyncDataByPeriod } from "@hooks/SyncLocalData";
import { useDriverFetch } from "@hooks/index";
import { useCompanyFetch } from "@hooks/syncData/company";

export default function AuthLayout() {
  // --- Hooks -----------------------------------------------------------------
  useSQLite();
  useLastSync();  
  useDriverFetch();
  useCompanyFetch();
  useSyncDataByPeriod();
  const { isLoggedIn } = useAuth();
  // --- END: Hooks ------------------------------------------------------------

  if (isLoggedIn === false) {
    return <Redirect href="(no-auth)/Login" />;
  }

  return (
    <Stack screenOptions={{ headerShown: false }}>
      <Stack.Screen name="(tabs)" />
      <Stack.Screen name="OrdersList/index" />
      <Stack.Screen
        name="ShipmentDetails/index"
        options={{ presentation: "modal" }}
      />
    </Stack>
  );
}
