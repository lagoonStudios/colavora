import { useAuth } from "@hooks/Auth";
import { Redirect, Stack } from "expo-router";
import React, { useEffect } from "react";

export default function NoAuthLayout() {
  const { user } = useAuth();
  useEffect(() => {
    console.log("user from no-auth", { user });
  }, [user]);

  if (user != null) {
    return <Redirect href="(auth)/(tabs)" />;
  }
  return (
    <Stack screenOptions={{ headerShown: false }}>
      <Stack.Screen name="Login/index" />
    </Stack>
  );
}
