import React, { useEffect } from "react";
import { Redirect, Stack } from "expo-router";
import { useAuth } from "@hooks/Auth";

export default function AuthLayout() {
  const { user } = useAuth();
  useEffect(() => {
    console.log("user from auth", { user });
  }, [user]);

  if (user == null) {
    return <Redirect href="(no-auth)/Login" />;
  }

  return (
    <Stack screenOptions={{ headerShown: false }}>
      <Stack.Screen name="(tabs)" />
      <Stack.Screen name="Home/index" />
      <Stack.Screen name="ManifestsList/index" />
    </Stack>
  );
}
