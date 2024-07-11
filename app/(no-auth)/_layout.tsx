import useAuth from "@hooks/Auth";
import { Redirect, Stack } from "expo-router";
import React from "react";

export default function NoAuthLayout() {
  const { isLoggedIn } = useAuth();

  if (isLoggedIn === true) {
    return <Redirect href="(auth)" />;
  }
  return (
    <Stack screenOptions={{ headerShown: false }}>
      <Stack.Screen name="Login/index" />
    </Stack>
  );
}
