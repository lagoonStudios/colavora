import React from "react";
import { Redirect, Stack } from "expo-router";
import useAuth from "@hooks/Auth";

export default function AuthLayout() {
  // --- Hooks -----------------------------------------------------------------
  const { isLoggedIn } = useAuth();
  // --- END: Hooks ------------------------------------------------------------

  if (isLoggedIn === true) {
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
